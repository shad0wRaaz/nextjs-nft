import axios from 'axios'
import { BigNumber } from 'ethers'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'

const chainnum = {
  "80001": "mumbai",
  "137": "polygon",
  "97": "binance-testnet",
  "56": "binance",
  "43113": "avalanche-fuji",
  "43114": "avalanche",
  "5": "goerli",
  "1": "mainnet"
}

const HOST = process.env.NODE_ENV === 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080'

export const getContractData = async (collectionData) => {
  if(!collectionData) return null
  const sdk = new ThirdwebSDK("binance");

  const contract = await sdk.getContract(collectionData[0].contractAddress);
  return (await contract.metadata.get())
}

export const getMarketOffers = (marketAddress, blockchain) => async({queryKey}) => {
  const [_, listingId] = queryKey
  if(listingId && marketAddress && blockchain) {
    const sdk = new ThirdwebSDK(blockchain);
    const contract = await sdk.getContract(marketAddress, "marketplace");
    const marketOffers = await contract.getOffers(listingId);
    return marketOffers;
  }
  return null;
}
export const INFURA_getAllNFTs = (chainId) => 
async ({ queryKey }) => {
  const [_, collectionAddress] = queryKey;

  const { data } = await axios.get(`${HOST}/api/infura/getCollection/${chainId}/${collectionAddress}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
  });
  return data;
}
export const INFURA_getAllOwners = (chainId) => 
async ({ queryKey }) => {
  const [_, collectionAddress, cursor] = queryKey;

  const { data } = await axios.get(`${HOST}/api/infura/getCollectionOwners/${chainId}/${collectionAddress}`,
  {
    params: {
      cursor
    }
  },
    {
      headers: {
        'Content-Type': 'application/json'
      }
  });
  return data;
}

export const INFURA_getMyCollections = (chainId, address) => async({ queryKey }) => {
  // const [_, address ] = queryKey;
  const { data } = await axios.get(`${HOST}/api/infura/sdk/getCollectionByWalletAddress/${chainId}/${address}`);
  return data;
}

export const INFURA_getMyAllNFTs = (chainId) => async ({ queryKey }) => {
  const [_, address, cursor] = queryKey;

  const {data} = await axios.get(`${HOST}/api/infura/getNFT/${chainId}/${address}`,
  {
    params: {
      cursor
    }
  },
    {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  //sort out data according to name aphabetically
  let unsortedAssets = [...data.assets];
  unsortedAssets = unsortedAssets.filter(asset => Boolean(asset.metadata));
  // console.log(unsortedData)
  const sortedAssets = unsortedAssets.sort(function(a,b){
    var nameA = a.metadata.name;
    var nameB = b.metadata.name;
    if (nameA < nameB) {
      return -1; // Sort a before b
    }
    if (nameA > nameB) {
      return 1; // Sort b before a
    }
    
    return 0; // Names are equal, maintain original order
  });

  const sortedData = {...data, assets: sortedAssets};
  return sortedData;
}

export const INFURA_getNFTTransfers = () => async({queryKey}) => {
  const [_, chainId, contractAddress, tokenId] = queryKey;
  const {data} = await axios.get(`${HOST}/api/infura/getTransferData/${chainId}/${contractAddress}/${tokenId}`);
  return (data? data.transfers: null);
}
export const INFURA_getCollectionMetaData = (chainId) => async({queryKey}) => {
  const [_, contractAddress] = queryKey;
  const {data} = await axios.get(`${HOST}/api/infura/getCollectionMetadata/${chainId}/${contractAddress}`);
  return (data);
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

// export const getCollectionData = async (chainId, contractAddress) => {
//   const sdk = new ThirdwebSDK(chainnum[chainId]);
//   const contract = await sdk.getContract(contractAddress, "nft-collection");
//   const metadata = await contract.metadata.get();
//   console.log('metadata', metadata);
//   return metadata;
// }


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
  const {data} = await axios.get(`${HOST}/api/listing/getAll`);
  return data;
  // const blockchains = ["mumbai", "binance-testnet", "avalanche-fuji", "goerli", "binance", "mainnet", "polygon", "avalanche"]
  // const unresolved = blockchains.map(async(chain) => await axios.get(`${HOST}/api/getAllListings/${chain}`)) 

  // const resolved = await Promise.all(unresolved);
  // console.log(resolved)
  //strip out unnecessary info and unify into single array
  //take out null data
  // const filterNull = resolved.filter(result => result.data == null);
  // let fullArray = [];
  
  // console.log('filter', filterNull)
  // filterNull.map(chaindata => {
  //   chaindata.data.map(nft => fullArray.push(nft));
  // });
  // return fullArray;
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
