import axios from 'axios'
import { BigNumber } from 'ethers'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'


const HOST = process.env.NODE_ENV === 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080'

export const getMarketOffers = (marketAddress, blockchain) => async({queryKey}) => {
  const [_, listingId] = queryKey
  if(listingId && marketAddress && blockchain) {
    const sdk = new ThirdwebSDK(blockchain);
    const contract = await sdk.getContract(marketAddress, "marketplace");
    const marketOffers = await contract.getOffers(listingId);
    return marketOffers;
  }
  return null
}
export const getAllNFTs =
  (blockchain) =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey

    const sdk = new ThirdwebSDK(blockchain);
    const nftCollection = await sdk.getContract(collectionid, "nft-collection")
    const res = await nftCollection.getAll()

    //remove burnt NFTs
    const filtered = res.filter((nft) => nft.owner != "0x0000000000000000000000000000000000000000")
    return filtered;
  }
  
export const getLatestNfts = (qty) => async ({queryKey}) => {
  const [_, selectedBlockchain] = queryKey;
  const result = await axios.get(`${HOST}/api/getLatestNfts/${selectedBlockchain}`,
  {
    params: { quantity: qty }
  })

  return result.data

}

//Listing data from single blockchain
export const getActiveListings = 
  () =>
  async ({queryKey}) => {
    const [_, selectedBlockchain] = queryKey;
    const result = await axios.get(`${HOST}/api/getAllListings/${selectedBlockchain}`)

    return result.data
  }

  //All Listing data from all Blockchain
export const getFullListings = () =>  async() => {
  const blockchains = ["mumbai", "binance-testnet", "avalanche-fuji", "goerli"]
  const unresolved = blockchains.map(async (chain) => await axios.get(`${HOST}/api/getAllListings/${chain}`)) 

  const resolved = await Promise.all(unresolved);

  //strip out unnecessary info and unify into single array
  //take out null data
  const filterNull = resolved.filter(result => result.data != null);
  let fullArray = [];

  filterNull.map(chaindata => {
    chaindata.data.map(nft => fullArray.push(nft));
  });
  return fullArray;
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
      const sdk = new ThirdwebSDK(rpcUrl);
      const marketplace = await sdk.getContract(marketplaceId, "marketplace");
      const res = await marketplace.getAllListings();
      console.log(res);
      return res
    } catch (error) {}
  }

export const getTotalsforAdmin = (whichnet) => async () => {
  let testnet = (whichnet == "testnet") ? "true" : "false";
  const result = await axios.get(`${HOST}/api/getAllListingsCount?testnet=${testnet}`);
  return result?.data;

}
