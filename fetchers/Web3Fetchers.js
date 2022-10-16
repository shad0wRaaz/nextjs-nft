import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import axios from 'axios'
import { BigNumber } from 'ethers'

const HOST = process.env.NODE_ENV === 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080'

export const getMarketOffers = (marketModule) => async({queryKey}) => {
  const [_, listingId] = queryKey

  const marketEvents = await marketModule.events.getEvents('NewOffer')
  const selectedEvents = marketEvents.filter((e) => BigNumber.from(e.data.listingId).toString() == listingId)
  return selectedEvents
}
export const getAllNFTs =
  (rpcUrl) =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey
    // console.log(rpcUrl)
    const sdk = new ThirdwebSDK(rpcUrl)
    const nftCollection = sdk.getNFTCollection(collectionid)
    const res = await nftCollection.getAll()

    //remove burnt NFTs
    const filtered = res.filter((nft) => nft.owner != "0x0000000000000000000000000000000000000000")
    return filtered
  }
  
export const getActiveListings = 
  (rpcUrl) =>
  async ({queryKey}) => {
    const [_, marketplaceId] = queryKey
    const result = await axios.get(`${HOST}/api/getAllListings`)

    return result.data
  }

export const updateListings = 
  (rpcUrl) => 
  async() => {
    // console.log(queryKey)
    // const [_, marketplaceId] = queryKey
    // const result = await axios.get(`${HOST}/api/updateListings`)

    // return result
    console.log(rpcUrl)
    return 'something'    
  }

// export const getActiveListings =
//   (rpcUrl) =>
//   async ({ queryKey }) => {
//     const [_, marketplaceId] = queryKey
    
//     try {
//       if (!marketplaceId) return
//       const sdk = new ThirdwebSDK(rpcUrl)
//       const marketplace = sdk.getMarketplace(marketplaceId)
//       const res = await marketplace.getAllListings()
//       return res
//     } catch (error) {}
//   }

export const getAuctionItems =
  (rpcUrl) =>
  async ({ queryKey }) => {
    const [_, marketplaceId] = queryKey
    try {
      if (!marketplaceId) return
      const sdk = new ThirdwebSDK(rpcUrl)
      const marketplace = sdk.getMarketplace(marketplaceId)
      const res = await marketplace.getAllListings()
      console.log(res)
      return res
    } catch (error) {}
  }
