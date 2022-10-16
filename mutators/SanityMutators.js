import { config } from '../lib/sanityClient'

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
console.log(followers)
  let link = ''
  let event = ''

  if (type == 'TYPE_ONE') {
    //this is create NFT Collection
    link = `/collections/${itemID}`
    event = 'Uploaded an NFT Collection'
  }
  else if(type == 'TYPE_TWO'){}
  else if(type == 'TYPE_THREE'){}
  else if(type == 'TYPE_FOUR'){}
  else if(type == 'TYPE_FIVE'){}
  else if(type == 'TYPE_SIX'){
    //this is Report NFT 
    link = `/nfts/${itemID}`
    event = 'Your NFT was reported...'
  }
  else if(type == 'TYPE_SEVEN'){
    //this is Report Collection
    link = `collections/${itemID}`
    event = 'Your Collection was reported as...'
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
    console.log('0 Followers. Notification not sent.')
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
    nftItem: { _ref: itemid, _type: 'reference' },
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
    .commit()
}
