import { config } from '../lib/sanityClient'
import axios from 'axios'

const HOST = process.env.NODE_ENV == "production" ? 'https://nuvanft.io:8080' :'http://localhost:8080'

export const getUser = async (address) => {
  const query = `*[_type == "users" && walletAddress == "${address}"] {
      bannerImage, volumeTraded, biography, fbhHandle, followers, following, igHandle, profileImage, twitterHandle, userName, walletAddress, _createdAt
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
  const query = `*[_type == "notifications" && item._ref == "${itemid}"] {_createdAt, eventTitle, description, from->} | order(_createdAt desc)`
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
        _id,
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
        _id,
        profileImage,
        bannerImage,
        volumeTraded,
        createdBy,
        chainId,
        contractAddress,
        "creator": createdBy->userName,
        "creatorAddress" : createdBy->walletAddress,
        name, 
        floorPrice,
      }`
    const res = await config.fetch(query)
    return res
  }

export const getTopTradedNFTCollections = () => async () => {
  const collections = await axios.get(`${HOST}/api/topTradedCollections`)
    return JSON.parse(collections.data)
}

export const getNFTCollection =
  () =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey
    const query = `*[_type == "nftCollection" && _id == "${collectionid}" ] {
        _id,
        profileImage,
        bannerImage,
        volumeTraded,
        createdBy,
        chainId,
        contractAddress,
        "creator": createdBy->,
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
    // const [_, collectionAddress] = queryKey
    // const query = `*[_type == "activities" && contractAddress == "${collectionAddress}" && tokenid == "${tokenid}"] {...} | order(dateTime(_createdAt) desc)`
    const query = `*[_type == "activities" && nftItem._ref == "${tokenid}"] {...} | order(dateTime(_createdAt) desc)`
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
    const query = `*[_type == "nftItem" && ownedBy->walletAddress == "${address}" && createdBy->walletAddress != "${address}"]{...}`
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
export const getCoinPrices = () => async () => {
  const query = `*[_type == "settings"]{ethprice, maticprice, _updatedAt}`
  const res = config.fetch(query)
  return res
}