import axios from 'axios';
import jwt from "jsonwebtoken";
import { config } from '../lib/sanityClient'
const settingDocId = "3cae3666-6292-4f72-b8b7-fba643c068bf";

const HOST = process.env.NODE_ENV == "production" ? 'https://nuvanft.io:8080' : 'http://localhost:8080';
const FAUCETHOST = process.env.NODE_ENV == "production" ? 'https://faucet.metanuva.com:8080' : 'http://localhost:8889';

export const updatePayableLevel = async ({walletAddress, level}) => {
  await config
        .patch(walletAddress)
        .set({ payablelevel: level })
        .commit();
}

export const updateCollectionReferral = async (collectionid, level1, level2, level3, level4, level5, payablelevel) => {
await config
      .patch(collectionid)
      .set({
        referralrate_one: Number(level1),
        referralrate_two: Number(level2),
        referralrate_three: Number(level3),
        referralrate_four: Number(level4),
        referralrate_five: Number(level5),
        payablelevel: Number(payablelevel),
      })
      .commit();
}
export const activateReferral = async(address) => {
  return await config
                .patch(address)
                .set({ refactivation: true})
                .commit();
}

export const isReferralActivated = async(address) => {
  const query = `*[_type == "users" && walletAddress == "${address}"]{refactivation, walletAddress}`;
  const result = await config.fetch(query);
  if(result){
    return result[0];
  }
  return null;
}

export const saveAlias = async(username, address) => {
//see if the sponsor has already got this username as direct referrals, only save if not present already

  try{
    // const document = await config.getDocument(address);
    // const isPresent = document.directs.findIndex(referrals => referrals._ref.toLowerCase() == address.toLowerCase());

    // if(isPresent >= 0){
    //   //already present in sponsor's direct referrals, so no need to do anything
    //   return
    // }

    //save if it is not present
      await config
            .patch(address)
            .set({ 
              userName: username, 
            })
            .commit()
            .catch(err => console.log(err));

      //add this user in sponsor's direct referrals
      // await config
      //         .patch(sponsor)
      //         .setIfMissing({ directs: [] })
      //         .insert('after', 'directs[-1]', [{ _type: 'reference', _ref: address }])
      //         .commit({ autoGenerateArrayKeys: true });
  }catch(error){
  console.error(error)
  }

}

export const sendAirdrop = async(airdrops) => {
  const token =  process.env.NEXT_PUBLIC_ENCODED_TOKEN_KEY;

    const tx = await axios.post(
      `${FAUCETHOST}/api/nft/sendairdrop`,
      {
        receivers: airdrops,
        secretKey: process.env.NEXT_PUBLIC_FAUCET_SECRET_KEY
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    ).catch(err => {console.log(err)});

    return tx;
}


export const saveAirdropData = async(transactions, chainId, contractAddress, tokenShare, phase) => {
 
  const airdrop_OBJ_Array = transactions?.map(tx => {
    const obj = {
      chainId: Number(chainId),
      transactionHash: tx.transactionHash,
      walletAddress: tx.to,
      createdTime: new Date(),
      contractAddress,
      amount: tokenShare,
      phase,
    }
    return obj;
  })

  
  const unresolved = airdrop_OBJ_Array.map(async user => {
    const query = `*[_type == "users" && lower(_id) == "${user.walletAddress}"]`;
    const result = await config.fetch(query);
    return result[0];
  })

  const resolved = await Promise.all(unresolved);


  //create airdrop object to save in databas
  const documentArray = resolved.map(user => {
    //update Airdrop data
    let obj = '';
    let airdropData = '';

    if(!user.airdrops){
      airdropData = airdrop_OBJ_Array.filter(data => String(data.walletAddress).toLowerCase() == String(user.walletAddress).toLowerCase());
      obj = { _id: user._id, airdrops: [airdropData[0]]}
    }else{
      const existingAirdrop = JSON.parse(user.airdrops);
      const newData = airdrop_OBJ_Array.filter(data => String(data.walletAddress).toLowerCase() == String(user.walletAddress).toLowerCase());
      obj = {
        _id: user._id, 
        airdrops: [
          ...existingAirdrop, 
          {
            ...newData[0],
          }
        ]
      }
    }
    return obj;
  });


  //patch all documentArray document
  documentArray.map(async doc => {
    await config
          .patch(doc._id)
          .set({ airdrops: JSON.stringify(doc.airdrops)})
          .commit()
          .catch(err => console.log(err))
  });

  //in the end update Airdrop in server redis
  const updateAirdropServer = await axios.get(`${HOST}/api/updateAirdrops`);


}

export const sendReferralCommission = async (receivers, address, chainId, connectedChainName, collectionName) => {
  //first remove all referrers whose referral activation is not done yet; no need to send any tokens
  try{
    const unresolved = receivers.map(async r => await isReferralActivated(r.receiver));
    const resolved = await Promise.all(unresolved);

    let eligibleReceivers = resolved.filter(receivers => receivers.refactivation == true);
    eligibleReceivers = eligibleReceivers.map(r => r.walletAddress);
      
    const finalReferrals = receivers.filter(v => eligibleReceivers.indexOf(v.receiver) !== -1 );

    const token =  process.env.NEXT_PUBLIC_ENCODED_TOKEN_KEY;

    const tx = await axios.post(
      `${FAUCETHOST}/api/nft/sendreferralcommissions`,
      {
        receivers: finalReferrals,
        secretKey: process.env.NEXT_PUBLIC_FAUCET_SECRET_KEY,
        chain: connectedChainName,
        collectionName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    ).catch(err => {console.log(err)})

    if(!tx || !Boolean(tx.data.length)) return;
    
    saveReferralCommissions(tx?.data, finalReferrals, chainId, address)
    return;
    //saving all transaction in database;
    Promise.all(
      tx.data.map(
        async (transaction, index) => 
          {
            const doc = {
              _type: 'referrals',
              _id: transaction.transactionHash,
              txid: transaction.transactionHash,
              referee: { _type: 'reference', _ref: address},
              to: { _type: 'reference', _ref: finalReferrals[index].receiver},
              amount: finalReferrals[index].token,
          }
          await config.createIfNotExists(doc);
    }));
    //send notification to all receivers as well
      const notificationReceivers = finalReferrals.map(f => 
        {
          const r = { _type: 'reference', _ref: f.receiver };
          return r;
        });
      const notificationObj = {
        address, 
        type: "TYPE_NINE", 
        followers: notificationReceivers,
        description: 'You have received referral bonus.',
        eventTitle: 'Referral Bonus',
      }
      sendNotificationFrom({...notificationObj});

  }catch(err){
    console.error(err);
  }
}

const saveReferralCommissions = async (bonuses, finalReferrals, chainId, source) =>{
  if(!bonuses || !finalReferrals) return
  const allBonuses = bonuses?.map(tx => {
    const sentTime = new Date();
    const doc = 
    {
      transactionHash: tx.transactionHash,
      chainId,
      sentTime,
      source,
      recipient: finalReferrals[finalReferrals.findIndex(refs => String(refs.receiver).toLowerCase() == String(tx.to).toLowerCase())].receiver,
      amount: finalReferrals[finalReferrals.findIndex(refs => String(refs.receiver).toLowerCase() == String(tx.to).toLowerCase())].token,
    }
    return doc;
  });


  const unresolved = allBonuses.map(async user => {
    const query = `*[_type == "users" && _id == "${user.recipient}"]`;
    const result = await config.fetch(query);
    return result[0];
  });

  const resolved = await Promise.all(unresolved);

  const bonusArray = resolved.map(user => {
    let obj = '';
    let bonusData = '';
    if(!user.referralbonus){
      bonusData = allBonuses.filter(data => data.recipient == user._id)
      obj = { _id: user._id, referralbonus: bonusData }
    }else{
      const existingbonuses = JSON.parse(user.referralbonus);
      const newData = allBonuses.filter(data => data.recipient == user._id);
      obj = {
        _id: user._id,
        referralbonus: [
          ...existingbonuses,
          {
            ...newData[0]
          }
        ]
      }

    }
    return obj;
  })

  //patch all those users

  bonusArray.map(async doc => {
    await config
          .patch(doc._id)
          .set({ referralbonus: JSON.stringify(doc.referralbonus) })
          .commit()
          .catch(err => console.log(err));
  })
}

//send nuva tokens as referral bonus; not used now
// export const sendToken = async(referee, recipient) => {
//   //check if the recipient is qualified or not;
//   try{
//     const isActivated = await isReferralActivated(recipient);
//     if(isActivated.length > 0 && isActivated.refactivation == true){

//       const token =  process.env.NEXT_PUBLIC_ENCODED_TOKEN_KEY;

//       const tx = await axios
//             .post(`${FAUCETHOST}/api/nft/sendTokens`, 
//             {
//               address: recipient,
//               secretKey: process.env.NEXT_PUBLIC_FAUCET_SECRET_KEY
//             }, 
//             {
//               headers: 
//               {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//               }
//             }).catch(err => console.log(err));

//         //save transaction in db
//         const doc = {
//           txid: tx.data.transactionHash,
//           to: {_ref: recipient, _type: 'reference'},
//           referee: {_ref: referee, _type: 'reference'},
//           amount: 20,
//           _type: 'referrals'
//         }

//         await config.create(doc);
//         // token sent boolean set to true, so that it wont send again and again.
//         await config.patch(referee)
//                     .set({ tokensent: true })
//                     .commit()
//                     .catch(err => console.log(err));
//     }
//   }catch(error){
    
//   }
// }

export const saveSubscriber = async(newemail) => {
  const docID = '09f0e4f9-76ca-4ca0-b168-ed1a97cf6958'; //This is id of that document that contains all emails

  const doc = await config.getDocument(docID); 
  const emails = JSON.parse(doc.email);
  if(emails.find(emailaddress => emailaddress.e.toLowerCase() == newemail.toLowerCase())){
    return 'duplicate';
  }
  else{
    const newdoc = [
      ...emails,
      {
        e: newemail,
      }
    ];
    //patch the new doc
    return await config.patch(docID).set({ email: JSON.stringify(newdoc) }).commit().catch(err => {console.log(err); return 'error'})
  }
}

export const saveFollower = async ({ creator, admirer }) => {
  // return await config
  //   .patch(creator)
  //   .append('followers', [{ _ref: admirer }])
  //   .commit({ autoGenerateArrayKeys: true })
  return await config
    .patch(creator)
    .insert('before', 'followers[0]', [{ _ref: admirer }])
    .commit({ autoGenerateArrayKeys: true }).catch(err => console.log(err));
}

export const removeFollower = async ({ creator, admirer }) => {
  const followToRemove = [`followers[_ref == "${admirer}"]`]
  return await config.patch(creator).unset(followToRemove).commit().catch(err => console.log(err));
}

export const changeNotificationReadStatus = async (notificationId) => {
  const res = config.patch(notificationId).set({ status: true }).commit().catch(err => console.log(err));
  return res
}

export const deleteNotifications = async (address) => {
  await config.delete({
    query: '*[_type == "notifications" && to->walletAddress == $address]',
    params: { address: address },
  })
}

export const sendNotificationFrom = async ({
  address,
  type,
  itemID,
  followers,
  eventTitle,
  description,
}) => {
// console.log(followers)
  let link = ''
  let event = ''

  if (type == 'TYPE_ONE') {
    //this is create NFT Collection
    link = `/collections/${itemID}`;
    event = 'Uploaded an NFT Collection';
  }
  else if(type == 'TYPE_TWO'){
    //this is create NFT Item or Minted

  }
  else if(type == 'TYPE_THREE'){
    //this is NFT Bought
    link = `/nfts/${itemID}`;
    event = 'Your NFT was sold'
  }
  else if(type == 'TYPE_FOUR'){
    //this is NFT Listed
  }
  else if(type == 'TYPE_FIVE'){
    //this is NFT Delist
  }
  else if(type == 'TYPE_SIX'){
    //this is Report NFT 
    link = `/nfts/${itemID}`
    event = 'Your NFT was reported...'
  }
  else if(type == 'TYPE_SEVEN'){
    //this is Report Collection
    link = `collections/${itemID}`
    event = 'Your Collection was reported as...'
  }else if(type == 'TYPE_EIGHT'){
    //this is burn NFT
  }
  else if(type == 'TYPE_NINE'){
    //this is referral
    event = 'Referral bonus received.'
  }

  if(followers != null){
    const to = [...followers]
    to?.map(async (follower) => {
      const doc = {
        _type: 'notifications',
        item: { 
          _ref: itemID, 
          _type: 'reference'
        },
        from: {
          _type: 'reference',
          _ref: address,
        },
        to: {
          _type: 'reference',
          _ref: follower._ref,
        },
        event,
        type,
        eventTitle: eventTitle ? eventTitle : '',
        description: description ? description: ''
      }
      await config.create(doc)
    })
  } else{
    console.log('0 Followers. Notification is not sent.')
  }
  
}

export const changeNFTOwner = async ({ address }) => {}

export const saveTransaction = async ({
  transaction,
  id,
  eventName,
  price,
  chainid,
  itemid,
}) => {
  const receipt = transaction.receipt
  const doc = {
    _type: 'activities',
    _id: receipt.transactionHash,
    transactionHash: receipt.transactionHash,
    from: receipt.from,
    to: receipt.to,
    nftItems: [{ _ref: itemid, _type: 'reference', _key: itemid }],
    tokenid: id,
    event: eventName,
    price: price,
    chainId: chainid,
    dateStamp: new Date(),
  }
  return await config.createIfNotExists(doc);
}
export const changeShowUnlisted = async ({ collectionid, showUnlisted }) => {
  return await config
    .patch(collectionid)
    .set({ showUnlisted: !showUnlisted })
    .commit()
    .catch(err => console.log(err));
}

export const updateBoughtNFTs = async({
  walletAddress,
  chainId,
  contractAddress,
  tokenId,
  payablelevel,
  type,
}) => {
  const currentUserData = await config.getDocument(walletAddress);
  const currentPayInfo = Boolean(currentUserData?.boughtnfts) ? currentUserData?.boughtnfts : null;
  
  if(type === 'buy'){
    if(!currentPayInfo){
      const newData = JSON.stringify([
        {
          chainId, contractAddress, tokenId, payablelevel
        }
      ]);
      await config.patch(walletAddress)
                  .setIfMissing({ boughtnfts: ''})
                  .set({ boughtnfts : newData })
                  .commit()
                  .catch(err => { console.log(err)});
      return
    }else{
      const existingData = JSON.parse(currentPayInfo);
      //check if there is duplicate data
      const isAlreadyPresent = existingData.findIndex(nft => nft.tokenId == tokenId && nft.contractAddress == contractAddress && nft.payablelevel == payablelevel && nft.chainId == chainId);

      if(isAlreadyPresent < 0) {
        const updatedData = [
          ...existingData, 
          {
            chainId, contractAddress, tokenId, payablelevel
          }];
        await config.patch(walletAddress)
                    .set({ boughtnfts: JSON.stringify(updatedData)})
                    .commit()
                    .catch(err => { console.log(err)});
      }
    }

  }else if(type == 'sell'){
    if(!currentPayInfo){ return } 
    const boughtNFTs = JSON.parse(currentPayInfo);
    const updatedList = boughtNFTs.filter(nft => !(nft.chainId == chainId && nft.contractAddress == contractAddress && nft.tokenId == tokenId));

    const dataToSave = updatedList.length == 0 ? '' : JSON.stringify(updatedList);

    await config.patch(walletAddress)
                .set({ boughtnfts: dataToSave })
                .commit()
                .catch(err => { console.log(err)});
  }
}
export const addVolumeTraded = async ({
  id,
  volume,
}) => {
  //need to use case insensitive id for patching as infura data gives lowercase addresses

  const caseinsensitive_query = `*[lower(_id) == "${id}"]`;
  const params = { _id: id}
  const documents = await config.fetch(caseinsensitive_query, params);

  if(documents.length > 0){
    const caseSensitiveId = documents[0]?._id;
    return await config
      .patch(caseSensitiveId)
      .setIfMissing({ volumeTraded : 0 })
      .inc({ volumeTraded: parseFloat(volume) })
      .commit()
      .catch(err => console.log(err));
  }
}
export const addBlockedNft = async ({id}) => {
  //check if already present or not, add nft only if not present
  const doc = await config.getDocument(settingDocId);
  const existingRefs = doc.blockednfts || [];
  if(!existingRefs.some(ref => ref._ref === id)){
    await config
          .patch(settingDocId)
          .setIfMissing({ blockednfts: [] })
          .insert('before', 'blockednfts[0]', [{ _ref: id }])
          .commit({ autoGenerateArrayKeys: true })
          .then(() => { return true; })
          .catch(() => { return false; })
  }
}
export const removeBlockedNft = async({id}) => {
  const nfttoremove = [`blockednfts[_ref == "${id}"]`];
  await config
        .patch(settingDocId)
        .unset(nfttoremove)
        .commit()
        .then(() => { return true; })
        .catch(() => { return false; });
  
  //update blocked lists in server
  await axios.get(`${HOST}/api/updateblockeditems`);

}
export const addCategory = async({categoryname, image}) => {
  if(image){
    let profileLink = '';
    const pfd = new FormData();
    pfd.append("imagefile", image);
    profileLink = await axios.post(
      `${HOST}/api/saveweb3image`,
      pfd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );

      const categoryDoc = {
        _type: 'category',
        name: categoryname,
        totalCollection: 0,
        profileImage: profileLink?.data,
      }
      
      await config.create(categoryDoc).then(() => { return true}).catch(() => { return false;});

    }
}
export const addBlockedCollection = async ({id}) => {
  await config
        .patch(settingDocId)
        .setIfMissing({ blockedcollections: [] })
        .insert('before', 'blockedcollections[0]', [{ _ref: id }])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => { return true; })
        .catch(() => { return false; })
}
export const removeBlockedCollection = async({id}) => {
  const collectiontoremove = [`blockedcollections[_ref == "${id}"]`];
  await config
        .patch(settingDocId)
        .unset(collectiontoremove)
        .commit()
        .then(() => { return true; })
        .catch(() => { return false; })
}
export const removeCategory = async ({categoryname}) => {
  //check if there are any collection under this category.. should not delete any category if there are any collection.
  const query = `*[_type == "category" && name == "${categoryname}"]{totalCollection}`;
  const collectionnumber = await config.fetch(query);

  if(collectionnumber[0]?.totalCollection != 0) {
    throw new Error("Only empty Categories can be deleted");
  }
  //if the category has 0 collection in it, delete is safe
  await config.delete({ query: '*[_type == "category" && name == $categoryname]', params: { categoryname: categoryname}})
              .then(() => {return true})
              .catch(()=> {return false});
}
export const saveEmailVerificationCode = async(id, randomCode) => {
  try{
    await config
                .patch(id)
                .set({verificationcode: randomCode})
                .commit()
                .catch(err => console.log(err));
    return true;
  }catch(err){
    return false;
  }
}
export const importMyCollection = async(collectionData, address, collectionId) => {
  //check if the collection exist already
  const query = `*[_type == "nftCollection" && chainId == "${collectionData.chainId}" && contractAddress == "${collectionData.contractAddress}"]`;
  const collectionExist = await config.fetch(query);

  if(collectionExist?.length > 0){
    return 'already exists'
  }else{
    const collectionDoc = {
      _type: 'nftCollection',
      _id: collectionId,
      name: collectionData.name,
      contractAddress: collectionData.contractAddress,
      description: collectionData.description,
      chainId: collectionData.chainId,
      createdBy: {
        _type: 'reference',
        _ref: address,
      },
      volumeTraded: 0,
      floorPrice: 0,
      referralrate_one: 0,
      referralrate_two: 0,
      referralrate_three: 0,
      referralrate_four: 0,
      referralrate_five: 0,
      payablelevel: 0,
    }
  
    const newCollection = await config
          .createIfNotExists(collectionDoc)
          .catch(err => {
            console.log(err)
            });
    return newCollection;
  }
}