import { BigNumber } from 'ethers';
import { MongoClient, ServerApiVersion } from 'mongodb';

const sslValidation = process.env.NODE_ENV == 'production' ? true : false;

const uri = `mongodb+srv://${process.env.NEXT_PUBLIC_MANGO_USERNAME}:${process.env.NEXT_PUBLIC_MANGO_PASSWORD}${process.env.NEXT_PUBLIC_MANGO_ATLAS_URI}&sslValidate=${sslValidation}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let conn;
let mangodb;
try {
  conn = await client.connect();
  mangodb = conn.db('nftdb');
} catch(e) {
  console.error(e);
}

//this is for extensive search page
export const getListedNfts = async(filters, chain, limit, categoryCollections) => {
  try{
    const { minPrice, maxPrice, direct, auction, category, image, video, audio, name} = filters;
    const lim = parseInt(limit);
  
    const listedNFTs = await mangodb.collection(`activelistings-${chain}`);
    let query = {};
    let result;
  
    //querybuilder
    if(categoryCollections != 'all'){
      query = {...query, assetContractAddress: {$in: categoryCollections}}
    }
  
    if(name) { 
      query = { ...query, 'asset.name': {'$regex' : name, '$options' : 'i'} };
    }
  
      result = await listedNFTs.find( query ).limit(lim).toArray();
  
    
    return result;

  }catch(error){ return null;}

}

export const findListedNFTs = async(name) => {
  try{
    const unresolvedCollections = [
      await mangodb.collection('activelistings-goerli'),
      await mangodb.collection('activelistings-mainnet'),
      await mangodb.collection('activelistings-binance-testnet'),
      await mangodb.collection('activelistings-binance'),
      await mangodb.collection('activelistings-mumbai'),
      await mangodb.collection('activelistings-polygon'),
      await mangodb.collection('activelistings-avalanche'),
    ];
    
    const allCollections = await Promise.all(unresolvedCollections);
  
    const query = { 'asset.name': {'$regex' : name, '$options' : 'i'} }
  
    const unresolvedResult = allCollections.map(async coll => { const newres = await coll.find( query ).toArray();  return newres; });
    const resolved = await Promise.all(unresolvedResult);
    return resolved.flat();

  }catch(error){ return null;}
}

export const getMarketData = async(contractAddress, tokenId, chain) => {
  try{
    const collection = await mangodb.collection(`activelistings-${chain}`);
    const bigTokenId = BigNumber.from(tokenId)
    const query = {'tokenId.hex': bigTokenId._hex, assetContractAddress : String(contractAddress).toLowerCase()};
    // const options = { sort : { assetContractAddress:1 }, projection : { assetContractAddress: 1}}
    const result = await collection.find( query ).toArray();
    return result;

  }catch(error){ return null;}
}

export const saveMarketData = async(document, chain) => {
  try{
    // const newDocument = JSON.parse(document);
    const collection = await mangodb.collection(`activelistings-${chain}`);
    const result = await collection.insertOne(document);
    return result;

  }catch(error){ return null;}
}

export const saveMultipleMarketData = async(documents, chain) => {
  try{
    // const documents = JSON.parse(documentObjects);
    const collection = await mangodb.collection(`activelistings-${chain}`);
    const result = await collection.insertMany(documents);
    return result;
  }catch(error){ return null;}

}

export const deleteMarketData = async(contractAddress, tokenId, chain) => {
  try{
    const collection = await mangodb.collection(`activelistings-${chain}`);
    const bigTokenId = BigNumber.from(tokenId);
    const query = {'tokenId.hex': bigTokenId._hex, assetContractAddress : contractAddress};
    const result = await collection.deleteOne( query );
    return result;
  }catch(error){ return null;}
}

export const latestMarketData = async(chain, lim) => {
  try{
    const collection = await mangodb.collection(`activelistings-${chain}`);
    const query = {};
    const result = await collection.find().limit(parseInt(lim)).sort({ listedTime: -1}).toArray();
    return result;
  }catch(error){
    console.log(error)
    return null
  }
}


export default mangodb;