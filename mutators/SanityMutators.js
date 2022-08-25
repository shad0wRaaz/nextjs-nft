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
  contractAddress,
  type,
  followers,
  eventTitle,
  description,
  itemID
}) => {

  let link = ''
  let event = ''

  if (type == 'TYPE_ONE') {
    //this is create NFT Collection
    link = `/collections/${contractAddress}`
    event = 'Uploaded an NFT Collection'
  }
  else if(type == 'TYPE_TWO'){}
  else if(type == 'TYPE_THREE'){}
  else if(type == 'TYPE_FOUR'){}
  else if(type == 'TYPE_FIVE'){}
  else if(type == 'TYPE_SIX'){
    //this is Report NFT 
    link = `/nfts/${itemID}?c=${contractAddress}`
    event = 'Your NFT was reported...'
  }
  else if(type == 'TYPE_SEVEN'){
    //this is Report Collection
    link = `collections/${contractAddress}`
    event = 'Your Collection was reported as...'
  }
  
  const to = [...followers]
  to.map(async (follower) => {
    const doc = {
      _type: 'notifications',
      link,
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
      contractAddress,
      itemid: itemID.toString(),
      eventTitle: eventTitle ? eventTitle : '',
      description: description ? description: ''
    }
    await config.create(doc)
  })
  
}

export const changeNFTOwner = async ({ address }) => {}
export const saveTransaction = async ({
  transaction,
  collectionAddress,
  id,
  eventName,
  price,
  chainid,
}) => {
  const receipt = transaction.receipt
  const doc = {
    _type: 'activities',
    _id: receipt.transactionHash,
    transactionHash: receipt.transactionHash,
    from: receipt.from,
    to: receipt.to,
    contractAddress: collectionAddress,
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
  address,
  volume,
}) => {
  return await config
    .patch(address)
    .inc({ volumeTraded: volume })
    .commit()
}
