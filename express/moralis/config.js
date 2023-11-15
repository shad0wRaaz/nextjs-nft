import Moralis from "moralis";

const chainCode = {
    "ethereum" : "0x1",
    "goerli" : "0x5",
    "binance" : "0x38",
    "binance-testnet" : "0x61",
    "polygon" : "0x89",
    "mumbai" : "0x13881",
    "avalanche" : "0xa86a",
    "arbitrum" : "0xa4b1",
}

await Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_KEY
});

export const getNFTMetadata = async(chain, address, tokenId) => {
    try{
        const response = await Moralis.EvmApi.nft.getNFTMetadata({
            "chain": chainCode[chain],
            "format": "decimal",
            "normalizeMetadata": true,
            "mediaItems": false,
            address,
            tokenId
          });
        return response.raw;
    }catch(error){
        console.log(error);
        return null
    }
}

export const getNFTOwner = async(chain, address, tokenId) => {
    try{
        const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
            chain: chainCode[chain],
            "format": "decimal",
            address,
            tokenId,
          });
        return response.raw;
    }catch(error){
        console.log(error);
        return null
    }
}

export const getNFTsByCollection = async (chain, address, cursor) => {
    try{
        const response = await Moralis.EvmApi.nft.getContractNFTs({
            chain: chainCode[chain],
            address,
            cursor,
        })
        return response.toJSON()
    }catch(error){
        console.log(error)
        return null;
    }
}

export const getNFTContractMetadata = async(chain, address) =>{
    try{
        const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
            chain: chainCode[chain],
            address
        });
        
        return response.raw
    }catch(error){
        console.log(error)
        return null;
    }
}

export const getNFTsByWallet = async (chain, address, cursor) => {
    try{
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            chain: chainCode[chain],
            format: "decimal",
            address,
            mediaItems: false,
            cursor,
        });
        let rawNFTs = response.raw?.result;
        const parsedNFTs = rawNFTs?.map(nft => {
            const obj = { ...nft, metadata: JSON.parse(nft.metadata)}
            return obj
        })

        return parsedNFTs
        
    } catch(error) {
        console.log(error)
        return null;
    }
    
}

export const getNFTCollectionsByWallet = async (chain, address) => {
    try{
        const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
            chain: chainCode[chain]
            , address
        });
        return response.raw
        
    } catch(error) {
        console.log(error)
        return null;
    }

}

export const getNFTTransfersByTokenID = async(chain, address, tokenId) => {
    try{
        const response = await Moralis.EvmApi.nft.getNFTTransfers({
            chain: chainCode[chain],
            format: "decimal",
            address,
            tokenId,
          });
        console.log(response.raw)
        return response.raw
        
    } catch(error) {
        console.log(error)
        return null;
    }
}
