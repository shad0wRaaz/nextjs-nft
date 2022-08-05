import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../lib/sanityClient'

export const getNftsFromAllCollections =
  (signer) =>
  async ({ queryKey }) => {
    const [_, address] = queryKey

    const query = `*[_type == "nftCollection"] { contractAddress }`
    const collections = await config.fetch(query)

    if (!signer) return

    const sdk = new ThirdwebSDK(signer)

    const col = sdk.getNFTCollection(
      '0x2391285598FD07cA75Bded082F7f9Aee4417DCE9'
    )

    const nftss = await col.getAll()
    // console.log(nftss)
    return nftss
  }

export const getAllNFTs =
  (rpcUrl) =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey

    const sdk = new ThirdwebSDK(rpcUrl)
    const nftCollection = sdk.getNFTCollection(collectionid)
    const res = await nftCollection.getAll()
    return res
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
      // console.log(res)
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
