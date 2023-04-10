import axios from 'axios';
import { config } from '../lib/sanityClient'
const settingDocId = "3cae3666-6292-4f72-b8b7-fba643c068bf";

const HOST = process.env.NODE_ENV == "production" ? 'https://nuvanft.io:8080' : 'http://localhost:8080';

export const saveFollower = async ({ creator, admirer }) => {
  // return await config
  //   .patch(creator)
  //   .append('followers', [{ _ref: admirer }])
  //   .commit({ autoGenerateArrayKeys: true })
  return await config
    .patch(creator)
    .insert('before', 'followers[0]', [{ _ref: admirer }])
    .commit({ autoGenerateArrayKeys: true })
}

export const removeFollower = async ({ creator, admirer }) => {
  const followToRemove = [`followers[_ref == "${admirer}"]`]
  return await config.patch(creator).unset(followToRemove).commit()
}

export const changeNotificationReadStatus = async (notificationId) => {
  const res = config.patch(notificationId).set({ status: true }).commit()
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
  return await config.createIfNotExists(doc)
}
export const changeShowUnlisted = async ({ collectionid, showUnlisted }) => {
  return await config
    .patch(collectionid)
    .set({ showUnlisted: !showUnlisted })
    .commit()
}
export const addVolumeTraded = async ({
  id,
  volume,
}) => {
  return await config
    .patch(id)
    .inc({ volumeTraded: volume })
    .commit();
}
export const addBlockedNft = async ({id}) => {
  await config
        .patch(settingDocId)
        .setIfMissing({ blockednfts: [] })
        .insert('before', 'blockednfts[0]', [{ _ref: id }])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => { return true; })
        .catch(() => { return false; })
}
export const removeBlockedNft = async({id}) => {
  const nfttoremove = [`blockednfts[_ref == "${id}"]`];
  await config
        .patch(settingDocId)
        .unset(nfttoremove)
        .commit()
        .then(() => { return true; })
        .catch(() => { return false; })
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
                .commit();
    return true;
  }catch(err){
    return false;
  }
}
