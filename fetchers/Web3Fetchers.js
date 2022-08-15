import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../lib/sanityClient'

export const getAllNFTs =
  (rpcUrl) =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey

    const sdk = new ThirdwebSDK(rpcUrl)
    const nftCollection = sdk.getNFTCollection(collectionid)
    const res = await nftCollection.getAll()

    //remove burnt NFTs
    const filtered = res.filter((nft) => nft.owner != "0x0000000000000000000000000000000000000000")
    return filtered
  }

export const getActiveListings =
  (rpcUrl) =>
  async ({ queryKey }) => {
    const [_, marketplaceId] = queryKey
    
    try {
      if (!marketplaceId) return
      const sdk = new ThirdwebSDK(rpcUrl)
      const marketplace = sdk.getMarketplace(marketplaceId)
      const res = await marketplace.getAllListings()
      return res
    } catch (error) {}
  }

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
