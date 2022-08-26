import { config } from '../lib/sanityClient'

export const getUser = async (address) => {
  const query = `*[_type == "users" && walletAddress == "${address}"] {
      bannerImage, biography, fbhHandle, followers, following, igHandle, profileImage, twitterHandle, userName, walletAddress, _createdAt
    }`
  const res = await config.fetch(query)
  return res[0]
}

export const getUserContinuously =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "users" && walletAddress == "${address}"] {
      bannerImage, biography, fbHandle, followers, following, igHandle, profileImage, twitterHandle, userName, walletAddress, _createdAt
    }`
    const res = await config.fetch(query)
    return res[0]
  }

export const getReportActivities = (itemid) => async({queryKey}) => {
  const[_, collectionAddress] = queryKey
  const query = `*[_type == "notifications" && contractAddress == "${collectionAddress}" && itemid == "${itemid}"] {_createdAt, eventTitle, description} | order(_createdAt desc)`
  const res = await config.fetch(query)
  return res
}

export const getNotifications =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "notifications" && to->walletAddress == "${address}"] {..., from->} | order(_createdAt desc)`
    const res = await config.fetch(query)
    return res
  }

export const getNFTCollectionsByCategory =
  () =>
  async ({ queryKey }) => {
    const [_, categoryName] = queryKey
    const query = `*[_type == "nftCollection" && category == "${categoryName}"] {
        name, 
        category, 
        contractAddress,
        profileImage,
        bannerImage,
        description,
        chainId,
        floorPrice,
        volumeTraded,
        "creator": createdBy->userName,
        "creatorAddress" : createdBy->walletAddress,
        "allOwners" : owners[]->
    }`
    const res = await config.fetch(query)
    return res
  }

export const getMyCollections =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftCollection" && createdBy->walletAddress == "${address}" ] {
        profileImage,
        bannerImage,
        volumeTraded,
        createdBy,
        chainId,
        contractAddress,
        "creator": createdBy->userName,
        "creatorAddress" : createdBy->walletAddress,
        name, floorPrice
      }`
    const res = await config.fetch(query)
    return res
  }

export const getTopTradedNFTCollections = () => async () => {
  const query = `*[_type == "nftCollection"][0...12] | order(volumeTraded desc) {
        name, 
        category, 
        contractAddress,
        profileImage,
        bannerImage,
        description,
        chainId,
        floorPrice,
        volumeTraded,
        "creator": createdBy->userName,
        "creatorAddress" : createdBy->walletAddress,
        "allOwners" : owners[]->
    }`
  const res = await config.fetch(query)
  return res
}

export const getNFTCollection =
  () =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey
    const query = `*[_type == "nftCollection" && contractAddress == "${collectionid}" ] {
        profileImage,
        bannerImage,
        volumeTraded,
        createdBy,
        chainId,
        contractAddress,
        "creator": createdBy->walletAddress,
        name, floorPrice,
        "allOwners": owners[]->,
        description,
        showUnlisted,
        external_link,
        category,
      }`
    const res = await config.fetch(query)
    return res
  }
export const getActivities =
  (tokenid) =>
  async ({ queryKey }) => {
    const [_, collectionAddress] = queryKey
    const query = `*[_type == "activities" && contractAddress == "${collectionAddress}" && tokenid == "${tokenid}"] {...} | order(dateTime(_createdAt) desc)`
    const res = await config.fetch(query)
    return res
  }
export const getMintedNFTs =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftItem" && createdBy->walletAddress == "${address}"]{...}`
    const res = await config.fetch(query)
    return res
  }
export const getCollectedNFTs =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftItem" && ownedBy->walletAddress == "${address}"]{...}`
    const res = await config.fetch(query)
    return res
  }
export const getFavouriteNFTs =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*["${address}" in likedBy[]._ref]`
    const res = await config.fetch(query)
    return res
  }
export const getAllOwners =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftItem" && ownedBy != null && contractAddress=="${address}"]{ownedBy}`
    const res = await config.fetch(query)
    return res
  }
