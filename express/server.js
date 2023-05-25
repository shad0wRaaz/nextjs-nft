import path from 'path'
import cors from 'cors'
import axios from 'axios'
import Redis from 'ioredis'
import dotenv from 'dotenv'
import multer from 'multer'
import cron from 'node-cron'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bodyParser from 'body-parser'
import { SMTPClient } from 'emailjs'
import sanityClient from '@sanity/client'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { emailBody } from './emails/templates.js'
import { ThirdwebStorage } from '@thirdweb-dev/storage'

import { S3Client, PutObjectCommand, GetObjectCommand, ConditionFilterSensitiveLog } from '@aws-sdk/client-s3'

const app = express()
app.use(cors({origin: ['http://localhost:3000', 'https://nuvanft.io', 'https://metanuva.com', 'https://ipfs.thirdwebcdn.com']}))
// app.use(cors({origin: "*"}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

var globalActiveListings = [];

// parse application/json
app.use(bodyParser.json()); 

dotenv.config();
//chain ENUMS

const INFURA_AUTH = Buffer.from(process.env.NEXT_PUBLIC_INFURA_API_KEY + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,).toString('base64');

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
const chainEnum = {
  "mumbai" : 80001,
  "polygon": 137,
  "mainnet": 1,
  "goerli": 5,
  "binance-testnet": 97,
  "binance": 56,
  "avalanche-fuji": 43113,
  "avalanche": 43114
}

const marketplace = {
  'mainnet': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
  'polygon': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
  'avalanche': process.env.NEXT_PUBLIC_AVALANCE_MARKETPLACE,
  'binance': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
  'goerli': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
  'mumbai': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
  'avalanche-fuji': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
  'binance-testnet': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
  'arbitrum-goerli': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,

}

const redis = new Redis({
  host: process.env.NEXT_PUBLIC_REDIS_URL,
  port: process.env.NEXT_PUBLIC_REDIS_PORT
})

const web3storage = new ThirdwebStorage();


const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
})

const config = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-03-25',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

const client = new SMTPClient({
  user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
  password: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: process.env.NEXT_PUBLIC_SMTP_PORT,
  ssl: process.env.NEXT_PUBLIC_SMTP_SSL,
  tls: true,
  timeout: process.env.NEXT_PUBLIC_SMTP_TIMEOUT,
});

const getCoinPricefromCMC = () => {
  let response = null;
  new Promise(async (resolve, reject) => {
    try {
      response = await axios.get(process.env.NEXT_PUBLIC_CMC_HOST_URL, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY,
        },
        params: {
          symbol: "ETH,MATIC,BNB,AVAX",
        }
      });
    } catch(ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data;
      resolve(json);

      const avaxprice = json.data.AVAX[0].quote.USD.price;
      const ethprice = json.data.ETH[0].quote.USD.price;
      const maticprice = json.data.MATIC[0].quote.USD.price;
      const bnbprice = json.data.BNB[0].quote.USD.price;

      const coins = {
              maticprice: parseFloat(maticprice).toFixed(4), 
              ethprice: parseFloat(ethprice).toFixed(4), 
              avaxprice: parseFloat(avaxprice).toFixed(4),
              bnbprice: parseFloat(bnbprice).toFixed(4)
            };
            redis.set('coins', JSON.stringify(coins));
            
            var date = new Date()
            console.log(`Coins Price updated on ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

    }
  });
}

// app.get("/api/updateCoinPrices", async(req,res) => {
//   console.log('i am called')
//   let response = null;
//   new Promise(async (resolve, reject) => {
//     try {
//       response = await axios.get(process.env.NEXT_PUBLIC_CMC_HOST_URL, {
//         headers: {
//           'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY,
//         },
//         params: {
//           symbol: "ETH,MATIC,BNB,AVAX",
//         }
//       });
//     } catch(ex) {
//       response = null;
//       // error
//       console.log(ex);
//       reject(ex);
//     }
//     if (response) {
//       // success
//       const json = response.data;

//       resolve(json);

//       const avaxprice = json.data.AVAX[0].quote.USD.price;
//       const ethprice = json.data.ETH[0].quote.USD.price;
//       const maticprice = json.data.MATIC[0].quote.USD.price;
//       const bnbprice = json.data.BNB[0].quote.USD.price;

//       const coins = {
//               maticprice: parseFloat(maticprice).toFixed(4), 
//               ethprice: parseFloat(ethprice).toFixed(4), 
//               avaxprice: parseFloat(avaxprice).toFixed(4),
//               bnbprice: parseFloat(bnbprice).toFixed(4)
//             };
//             redis.set('coins', JSON.stringify(coins));
            
//             var date = new Date()
//             console.log(`Coins Price updated on ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
//       res.send(json);
//     }
//   });
// })

cron.schedule('*/8 * * * *', async() => {
  getCoinPricefromCMC();
  // const options = {
  //   method: 'GET',
  //   url: process.env.NEXT_PUBLIC_COINAPI_URL,
  //   params: { 
  //     referenceCurrencyUuid: 'yhjMzLPhuIDl',
  //     timePeriod: '24h',
  //     'tiers[0]': '1',
  //     orderBy: 'marketCap',
  //     orderDirection: 'desc',
  //     limit: '50',
  //     offset: '0'
  //    },
  //   headers: {
  //     'X-RapidAPI-Host': process.env.NEXT_PUBLIC_COINAPI_HOST,
  //     'X-RapidAPI-Key': process.env.NEXT_PUBLIC_COINAPI_KEY,
  //   },
  // }
  // try{
  //   await axios.request(options).then(async (response) => {
  //     const matic = response.data.data.coins?.filter(item => item.symbol == "MATIC");
  //     const eth = response.data.data.coins?.filter(item => item.symbol == "ETH");
  //     const avax = response.data.data.coins?.filter(item => item.symbol == "AVAX");
  //     const bnb = response.data.data.coins?.filter(item => item.symbol == "BNB");

  //     //save in redis
  //     const coins = {
  //       maticprice: parseFloat(matic[0].price).toFixed(4), 
  //       ethprice: parseFloat(eth[0].price).toFixed(4), 
  //       avaxprice: parseFloat(avax[0].price).toFixed(4),
  //       bnbprice: parseFloat(bnb[0].price).toFixed(4)
  //     };
  //     redis.set('coins', JSON.stringify(coins));
      
  //     var date = new Date()
  //     console.log(`Coins Price updated on ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
  //     //save all prices in database
  //     // await config.patch(process.env.NEXT_PUBLIC_SETTING_DOCUMENT_ID)
  //     // .set({
  //     //   maticprice : Number(parseFloat(matic[0].price).toFixed(4)),
  //     //   ethprice : Number(parseFloat(eth[0].price).toFixed(4)),
  //     //   avaxprice : Number(parseFloat(avax[0].price).toFixed(4)),
  //     //   bnbprice : Number(parseFloat(bnb[0].price).toFixed(4)),
  //     // })
  //     // .commit()
  //     // .then(() => { 
  //     // })
  //   })
    
  //   console.count('Price Update Count');
  // }catch(err){
  //   console.error(err)
  // }
});

const storage = multer.memoryStorage()
const upload = multer({ storage: storage }) //for profile pic and banner pic saving in AWS

const nftStorage = multer.diskStorage({
  destination: function (req, file, cb,) {
    cb(null, '../public/assets/nfts/')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
});

const nftUpload = multer({ storage: nftStorage});

//nft transfer data
app.get('/api/infura/getTransferData/:chainId/:contractAddress/:tokenId', async(req, res) =>{
  const {chainId, contractAddress, tokenId} = req.params;
  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${contractAddress}/tokens/${tokenId}/transfers`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${INFURA_AUTH}`,
      }

  });
  
  return res.send(data);
  
  }catch(error){
    console.log(":rocket: ~ file: index.js:17 ~ error:", error)
  }
})

//market data
app.get('/api/infura/getMarketData/:chainId/:contractAddress', async(req, res) =>{
  const {chainId, contractAddress} = req.params;
  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${contractAddress}/tradePrice`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${INFURA_AUTH}`,
      }

  })
  // console.log(":rocket: ~ file: index.js:20 ~ result:", data)
  // console.log(data)
  
  return res.send(data);
  
  }catch(error){
    console.log(":rocket: ~ file: index.js:17 ~ error:", error)
  }
})

//get NFT Owner Data
app.get('/api/infura/getNFTOwnerData/:chainId/:tokenAddress/:tokenid', async(req, res) =>{
  const {chainId, tokenAddress, tokenid} = req.params;
  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${tokenAddress}/${tokenid}/owners`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${INFURA_AUTH}`,
      }
  })
  
  return res.send(data);
  
  }catch(error){
    console.log(":rocket: ~ file: index.js:17 ~ error:", error)
  }
});

//get NFT Metadata
app.get('/api/infura/getNFTMetadata/:chainId/:tokenAddress/:tokenid', async(req, res) =>{
  const {chainId, tokenAddress, tokenid} = req.params;
  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${tokenAddress}/tokens/${tokenid}`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${INFURA_AUTH}`,
      }
  })
  // console.log(":rocket: ~ file: index.js:20 ~ result:", data)
  // console.log(data)
  
  return res.send(data);
  
  }catch(error){
    console.log(":rocket: ~ file: index.js:17 ~ error:", error)
  }
});

//get all owners of a collection
//this gives nft metadata in string format and gives current owner and minter as well
app.get('/api/infura/getCollectionOwners/:chainId/:address', async(req, res) =>{
  const {chainId, address} = req.params;
  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${address}/owners`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${INFURA_AUTH}`,
      }
  })
  // console.log(":rocket: ~ file: index.js:20 ~ result:", data)
  // console.log(data)
  
  return res.send(data);
  
  }catch(error){
    console.log(":rocket: ~ file: index.js:17 ~ error:", error)
  }
})

//get all NFTs based on collection address
// app.get('/api/infura/getCollection/:chainId/:address', async(req, res) =>{
//   const {chainId, address} = req.params;
//   try{
//     const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${address}/tokens`, {
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${INFURA_AUTH}`,
//       }
//   })
//   // console.log(":rocket: ~ file: index.js:20 ~ result:", data)
//   return res.send(data);
  
//   }catch(error){
//     console.log(":rocket: ~ file: index.js:17 ~ error:", error)
//   }
// })

//get all token transfers
// app.get('/api/infura/getNFTtransfers/:chainId/:tokenAddress/:tokenId', async(req, res) => {
//   const {chainId, tokenAddress, tokenId} = req.params;
//   try{
//     const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/nfts/${tokenAddress}/tokens/${tokenId}/transfers`, {
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${INFURA_AUTH}`,
//       }
//   })
//   // console.log(":rocket: ~ file: index.js:20 ~ result:", data)
//   return res.send(data);
  
//   }catch(error){
//     console.log(":rocket: ~ file: index.js:17 ~ error:", error)
//   }
// });


//get all NFTs based on wallet address
app.get('/api/infura/getNFT/:chainId/:address', async(req, res) => {
  const {chainId, address} = req.params;
  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_INFURA_API_ENDPOINT}/networks/${chainId}/accounts/${address}/assets/nfts`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${INFURA_AUTH}`,
      }
  })
  // console.log(":rocket: ~ file: index.js:20 ~ result:", data)
  return res.send(data?.assets);
  
  }catch(error){
    console.log(":rocket: ~ file: index.js:17 ~ error:", error)
  }
});

//This will return Sanity Database data of an NFT
app.get('/api/infura/getCollectionSanityData/:chain/:contractAddress/', async(req, res) => {  
  const {chain, contractAddress} = req.params;

  const query = `*[_type == "nftCollection" && contractAddress == "${contractAddress}"] {...}`;
  const sanityData = await config.fetch(query);
  if(sanityData.length > 0){
    return res.status(200).json(sanityData[0]);
  }
  else {
    return res.status(200).json({"message": "Collection data not found"});
  }
});

app.get('/api/getcoinsprice', async(req, res) => {
  const data = await redis.get("coins");
  return res.send(data)
});

app.get('/api/getfeaturednfts', async(req, res) => {
  try{
      let featuredNfts = await redis.get("featurednfts");

    if(featuredNfts) {
      return res.status(200).send(featuredNfts);
    }else {
      const query = `*[_type == "nftItem" && featured == true] {_id, id, name, featuredon, likedBy, collection->{chainId, contractAddress}} | order(featuredon desc) [0..4]`;
      const featurednfts = await config.fetch(query);

      const unresolved = featurednfts?.map(async (item) => {
        if(item?.collection){
          const sdk = new ThirdwebSDK(chainnum[item?.collection?.chainId]);
          const contract = await sdk.getContract(item?.collection?.contractAddress);
          const nft = await contract.erc721.get(item?.id);

          // const getownerquery = `*[_type == "users" && _id == "${nft.owner}"] {userName, web3imageprofile}`;
          // const ownerdata = await config.fetch(getownerquery);

          // const obj = { ...item, nft, owner: ownerdata[0] };
          const obj = { ...item, nft };
          return obj;
        }
      })
      const resolvedPath = await Promise.all(unresolved);
    
      //filtering out null and undefined objects
      const filterResolved = resolvedPath.filter(Boolean);

      //save in redis if not present already
      redis.set("featurednfts", JSON.stringify(filterResolved), 'ex', 30000);

    
      return (res.status(200).json(filterResolved))
    }
  }catch(err){
return res.status(200).send(null)
  }

});

app.post('/api/saveweb3image', upload.single('imagefile'), async (req, res) => {
  console.log(req.headers)
  const file = req.file.buffer;
  try{
    const fileURI = await web3storage.upload(file);
  
    if(fileURI){
      return res.status(200).send(fileURI);
    }
    return res.status(200).json({ 'message': 'Error in saving image in Web3'});
  }catch(err){
    console.log(err);
    return res.status(200).json({ 'message': 'Error in saving image in Web3'});
  }
});

app.get('/api/updateListings/:blockchain', async (req, res) => {
  //only refresh required chain.
  const blockchain = req.params.blockchain;

  if(!(blockchain in marketplace)){
    return res.status(200).json({'message': 'Unknown blockhain'});
  }

  //get data from blockchain
  const sdk = new ThirdwebSDK(blockchain);
  const marketContract = await sdk.getContract(marketplace[blockchain], "marketplace");
  const listedItems = await marketContract.getActiveListings(); 

  redis.set("activelistings-" + blockchain, JSON.stringify(listedItems));
  globalActiveListings = listedItems;
  return res.status(200).json(listedItems);
});

app.get('/api/getAllListings/:blockchain', async (req, res) => {
  const blockchain = req.params.blockchain;

  let cache = await redis.get("activelistings-" + blockchain);
  globalActiveListings = JSON.parse(cache);
  //get blocked nfts and collections
  const rawdata = JSON.parse(await redis.get("blockeditems"));
  let filterednfts = globalActiveListings;

  if(rawdata){
    const blockednfts = rawdata[0]?.blockednfts;
    const blockedcollections = rawdata[0]?.blockedcollections;
  
    //remove blocked nfts.
    if(blockednfts != null){
      filterednfts = globalActiveListings?.filter( obj => !blockednfts.some( obj2 => obj?.asset?.properties?.tokenid === obj2._id ));
    }
  }
  return res.status(200).json(filterednfts)
});

app.get('/api/updateNFTCollectiosnByCategory/:category', async(req,res) => {
  const category = req.params.category;
  const query = `*[_type == "nftCollection" && category == "${category}"] {
    _id,
    name, 
    category, 
    contractAddress,
    web3imageprofile,
    web3imagebanner,
    description,
    chainId,
    floorPrice,
    volumeTraded,
    "creator": createdBy->userName,
    "creatorAddress" : createdBy->walletAddress,
    "allOwners" : owners[]->,
  }`;
  const result = await config.fetch(query);
  redis.set("collection-by-category-" + category, JSON.stringify(result));
  return res.status(200).json(result);
});

app.get('/api/getNFTCollectionsByCategory/:category', async(req,res) => {
  const category = req.params.category;
  const getCategories = await redis.get("collection-by-category-" + category);

  if(getCategories == null){
    const query = `*[_type == "nftCollection" && category == "${category}"] {
      _id,
      name, 
      category, 
      contractAddress,
      web3imageprofile,
      web3imagebanner,
      description,
      chainId,
      floorPrice,
      volumeTraded,
      "creator": createdBy->userName,
      "creatorAddress" : createdBy->walletAddress,
      "allOwners" : owners[]->,
    }`;
    const result = await config.fetch(query);
    redis.set("collection-by-category-" + category, JSON.stringify(result));
    return res.status(200).json(result);
  }else {
    return res.status(200).json(JSON.parse(getCategories));
  }

});

app.get('/api/getAllListingsCount', async (req, res) => {
  const testnet = req.query.testnet;
  const cacheETH = testnet == "true" ? await redis.get("activelistings-goerli"): await redis.get("activelistings-mainnet");
  const cacheMATIC = testnet == "true" ? await redis.get("activelistings-mumbai"): await redis.get("activelistings-polygon");
  const cacheAVAX = testnet == "true" ? await redis.get("activelistings-avalanche-fuji"): await redis.get("activelistings-avalanche");
  const cacheBNB = testnet == "true" ? await redis.get("activelistings-binance-testnet"): await redis.get("activelistings-binance");


  const ETH = JSON.parse(cacheETH).length;
  const MAT = JSON.parse(cacheMATIC).length;
  const AVA = JSON.parse(cacheAVAX).length;
  const BIN = JSON.parse(cacheBNB).length;

  const totalNFTs = ETH + MAT + AVA + BIN; 
  return res.status(200).json({totalNFTs, ETH, MAT, AVA, BIN});

});

app.get('/api/getLatestNfts/:blockchain', async (req, res) => {

  const blockchain = req.params.blockchain;
  const nftQuantity = req.query.quantity;
  const cache = await redis.get("activelistings-" + blockchain);

  const allArr = JSON.parse(cache);


  var selectedChainCurrency = '';

  if(blockchain != undefined){
    if (blockchain == 'mumbai' || blockchain == "polygon") { selectedChainCurrency = 'MATIC'; } 
    else if (blockchain == 'goerli' || blockchain == "mainnet") { selectedChainCurrency = 'ETH'; } 
    else if (blockchain == 'binance-testnet') { selectedChainCurrency = 'tBNB'; } 
    else if (blockchain == "binance") { selectedChainCurrency = 'BNB'; } 
    else if (blockchain == 'avalanche-fuji' || blockchain == "avalanche") { selectedChainCurrency = 'AVAX'; } 

    const thisChainNfts = allArr?.filter((item) => item.buyoutCurrencyValuePerToken.symbol == selectedChainCurrency);
    //get blocked nfts and collections
    const rawdata = JSON.parse(await redis.get("blockeditems"));
    let blockednfts = [], blockedcollections = [];
    if(rawdata != null){
       blockednfts = rawdata[0]?.blockednfts;
       blockedcollections = rawdata[0]?.blockedcollections;
    }

    //remove blocked nfts.
    let filterednfts = thisChainNfts;
    if(blockednfts.length != 0){
      filterednfts = thisChainNfts?.filter( obj => !blockednfts.some( obj2 => obj?.asset?.properties?.tokenid === obj2._id ));
    }

    const latestNfts = filterednfts?.slice(-nftQuantity); 

    return res.status(200).json(latestNfts?.reverse())
  }
  
  return res.status(200).json(allArr.reverse())
})

app.get('/api/popularaudionfts/:blockchain', async(req, res) => {
  const {blockchain} = req.params;
  let popular = await redis.get("popularaudionfts");

  if(popular == null){
    let audioItems = await redis.get("activelistings-" + blockchain);
    if(audioItems == null) {
      return res.status(200).json(JSON.stringify({ topItems: [], otherItems: []}));
    }

    audioItems = JSON.parse(audioItems);
    audioItems = audioItems.filter(item => item.asset.properties?.itemtype == "audio" && item.asset.properties?.tokenid != null);

    const tempList = audioItems.map(async (item) => {
      var obj = { ...item };
      const query = `*[_type == "nftItem" && _id == "${item.asset?.properties.tokenid}"] {"likers":count(likedBy)}`;
      const result = await config.fetch(query);

      if(result[0].likers){
          obj['likedBy'] = result[0].likers;
      }else {
          obj['likedBy'] = 0;
      }
      return obj;
    });

    const updatedList = await Promise.all(tempList);

    //sort out the array based on number of likers
    const sortedList = updatedList.sort((a,b) => { return (b.likedBy - a.likedBy)});
    let topItems, otherItems = [];
    if(audioItems.length < 2) {
        topItems = sortedList;
    }
    else {
      topItems = sortedList.slice(0,2);
      otherItems = sortedList.slice(2, 5);
    }
    popular = JSON.stringify({ topItems, otherItems });
    redis.set("popularaudionfts", popular, 'ex', 86400);
  }

  return res.status(200).json(popular)
});

app.get('/api/popularvideonfts/:blockchain', async(req, res) => {
  const {blockchain} = req.params;
  let popular = await redis.get("popularvideonfts");

  if(popular == null){
    let videoItems = await redis.get("activelistings-" + blockchain);
    if(videoItems == null) {
      return res.status(200).json(JSON.stringify({ topItems: [] }));
    }

    videoItems = JSON.parse(videoItems);
    videoItems = videoItems.filter(item => item.asset.properties?.itemtype == "video" && item.asset.properties?.tokenid != null);

    const tempList = videoItems.map(async (item) => {
      var obj = { ...item };
      const query = `*[_type == "nftItem" && _id == "${item.asset?.properties.tokenid}"] {"likers":count(likedBy)}`;
      const result = await config.fetch(query);

      if(result[0].likers){
          obj['likedBy'] = result[0].likers;
      }else {
          obj['likedBy'] = 0;
      }
      return obj;
    });

    const updatedList = await Promise.all(tempList);

    //sort out the array based on number of likers
    const topItems = updatedList.sort((a,b) => { return (b.likedBy - a.likedBy)});
    
    popular = JSON.stringify({ topItems });
    redis.set("popularvideonfts", popular, 'ex', 86400);
  }

  return res.status(200).json(popular)
});

app.get('/api/latestCollection', async (req, res) => {
  var latestcollections
  if(await redis.get("latestcollections") != null) {
    latestcollections = await redis.get("latestcollections")
    return res.status(200).json(latestcollections)
  }else {
    const query = `*[_type == "nftCollection"] | order(_createdAt desc) {
      "id": _id,
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
  latestcollections = await config.fetch(query)
  redis.set("latestcollections", JSON.stringify(latestcollections))
  return res.status(200).json(JSON.stringify(latestcollections))
  }
});

app.get('/api/getAllNfts', async(req, res) => {
  let allNftData = await redis.get("allnfts");
  if(allNftData == null){
    allNftData = updateAllNFTData();
  }
  return res.status(200).json(allNftData);
});

app.get('/api/updateallcollections', async(req, res) => {
  updateAllNFTData();
  return res.status(200).send({message: "success"});
})

const updateAllNFTData = async() => {
  const query = `*[_type == "nftItem"] { name, _id, id, createdBy, chainId, "contractAddress": collection->contractAddress, "item": "nft"}`;
    let allnftdata = await config.fetch(query);
    allnftdata = JSON.stringify(allnftdata);
    redis.set("allnfts", allnftdata);
    return allnftdata;
}

const updateCollectionData = async () => {
  const query = `*[_type == "nftCollection"] { name, _id, contractAddress, createdBy, chainId, "item": "collection"}`;
    let collectionData = await config.fetch(query);
    collectionData = JSON.stringify(collectionData);
    redis.set("allcollections", collectionData);
    return collectionData;
}

app.get('/api/getallcollections', async(req,res) => {
  let collectionData = await redis.get("allcollections");
  if(collectionData == null){
    collectionData = updateCollectionData();
  }
  return res.status(200).json(collectionData);
});

app.get('/api/updateallcollections', async(req, res) => {
  updateCollectionData();
  return res.status(200).send({message: "success"});
})

app.get('/api/topTradedCollections/:blockchain', async( req, res) => {
  const blockchain = req.params.blockchain;
  if(blockchain){
    var topCollections;
    const chainid = chainEnum[blockchain];

    redis.del("toptradedcollections"+blockchain)
    topCollections = await redis.get("toptradedcollections-"+blockchain);
  
    if(topCollections != null) {
      return res.status(200).json(topCollections)    
    }
    else{
      const query = `*[_type == "nftCollection" &&  chainId == "${chainid}"] | order(volumeTraded desc) {
          "id": _id,
          name, 
          category, 
          contractAddress,
          web3imageprofile,
          web3imagebanner,
          description,
          _createdAt,
          chainId,
          floorPrice,
          volumeTraded,
          "creator": createdBy->userName,
          "verified": createdBy->verified,
          "creatorAddress" : createdBy->walletAddress,
          "allOwners" : owners[]->
      }`;
    topCollections = await config.fetch(query)
    redis.set("toptradedcollections-" + blockchain, JSON.stringify(topCollections), 'ex', 600)
    return res.status(200).json(JSON.stringify(topCollections))
    }
  }
  return res.status(200).json({ "message": "Blockchain not found"})
});

app.post('/api/savenft', async(req, res) => {
  const nftId = req.body.id
  const nftData = req.body.nftData

  if(await redis.get(nftId) == null) {
    redis.set(nftId, JSON.stringify(nftData))
    return res.status(200).json(nftData)
  } else {
    return res.status(200).json("Duplicate id. NFT data not saved.")
  }
});

//this is not working
app.get('/api/nft/marketdata/:chain/:marketplace/:contractAddress/', async (req, res) => {
  const {chain, marketplace, contractAddress} = req.params;
  const sdk = new ThirdwebSDK(chain,
    {
      readonlySettings: {
        rpcUrl: `https://evocative-alien-meadow.bsc-testnet.discover.quiknode.pro/79af2b8cd7807ebf486078b97d9513506f578770/`, // Use this RPC URL for read operations
        chainId: 56, // On this chain ID
      },
    });
  const marketContract = await sdk.getContract(marketplace, "marketplace");

  const listingdata = await marketContract.getActiveListings({
    tokenContract: contractAddress,
    });
  
  return res.send(listingdata);
});

//this will return Listing Data of a NFT
app.get('/api/nft/marketListing/:chain/:contractAddress/:tokenId', async (req, res) => {
  const { chain, contractAddress, tokenId } = req.params;

  const tokenListings = await redis.get("activelistings-" + chain);

  if(tokenListings){
    const tokenData = JSON.parse(tokenListings).filter(item => String(item.assetContractAddress).toLowerCase() == String(contractAddress).toLowerCase() && item.asset.id == tokenId.toString());
    if(tokenData.length > 0){
      return res.status(200).json(tokenData);
    }
  }
  return res.status(200).json({"message": "NFT data not found"})
});

//this is old endpoint, based on v4 token id, not useful for external nfts
app.get('/api/nft/listing/:id', async (req, res) => {
  let found = false;
  //this will return Listing Data of a NFT
  const nftId = req.params.id
  let result = []

  //search in each chain individually
  await redis.get("activelistings-binance-testnet").then((res) => {
    // console.log(res)
    result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
    if(result?.length > 0) { found = true;}
  })
  if(!found){
    await redis.get("activelistings-binance").then((res) => {
      // console.log(res)
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  
  if(!found){
    await redis.get("activelistings-mumbai").then((res) =>{
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-polygon").then((res) =>{
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-goerli").then((res) =>{
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-mainnet").then((res) =>{
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-avalanche-fuji").then((res) =>{
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-avalanche").then((res) =>{
      result = JSON.parse(res)?.filter(item => item.asset.properties.tokenid == nftId)
      if(result?.length > 0) { found = true;}
    })
  }
  
  // if(!found){
  //   await redis.get("activelistings-arbitrum-goerli").then((res) =>{
  //     result = JSON.parse(res).filter(item => item.asset.properties.tokenid == nftId)
  //     if(result.length > 0) { found = true;}
  //   })
  // }
  if(found){
    return res.status(200).json(result[0])
  }else {
    return res.status(200).json({"message": "NFT data not found"})
  }
});

app.get('/api/nft/:id', async(req, res) => {  
  //This will return Sanity Database data of an NFT
  const tokenid = req.params.id

  const query = `*[_type == "nftItem" && _id == "${tokenid}"] {
    views, filepath, likedBy, likes, _id, chainId, listingid, id, name,
    ownedBy->,
    createdBy->,
    collection->
  }`;
  const sanityData = await config.fetch(query);
  if(sanityData.length > 0){
    return res.status(200).json(sanityData[0]);
  }
  else {
    return res.status(200).json({"message": "NFT data not found"});
  }
});

const updateblockeditems = async() => {
  const query = `*[_type == "settings"]{ _id, blockednfts[]->{name, _id}, blockedcollections[]->{ name, _id }}`;
  const result =  await config.fetch(query);
  if(result.length > 0){
    await redis.set("blockeditems", JSON.stringify(result), 'ex', 86400); //update every day
  }
}
app.get('/api/updateblockeditems', async(req, res) => {
  await redis.del("blockeditems");
  await updateblockeditems();

})
app.get('/api/blockeditems', async(req, res) => {
  const blockeditems = await redis.get("blockeditems");
  if(blockeditems == null){
    updateblockeditems();
    const blockeditems1 = await redis.get("blockeditems");
    return res.status(200).json(blockeditems1);
  }
  return res.status(200).json(blockeditems);
  

  
});

app.get('/api/nft/contract/:chainid/:id/:nftid', async(req, res) => {
  //This gives Collection Contract Data of a NFT
  const collectionContractAddress = req.params.id;
  const chainid = req.params.chainid;
  const chainname = chainnum[chainid]
  const nftid = req.params.nftid;

  if(chainid != undefined){
    const sdk = new ThirdwebSDK(chainname);

    const contract = await sdk.getContract(collectionContractAddress, "nft-collection");
    const nft = await contract.get(nftid);
  
    if(nft.metadata.owner != '0x0000000000000000000000000000000000000000') {
      return res.status(200).json(nft);
    }
    else {
      return res.status(200).json({messsage: 'Could not get NFT metadata'});
    }
  }
  else {
    return res.status(200).json({messsage: 'Blockchain could not be found'});
  }
});

app.post('/api/sendconfirmationemail', async (req, res) => {
// console.log(req.body);
 const { email, randomCode, id } = req.body;
 const subject = "Email Confirmation";
 const emailBody = `<a href="http://localhost:3000/emailconfirm?e=${id}&c=${randomCode}">Verify Email</a>`;

 try {
  const message = await client.sendAsync({
    text: emailBody,
    attachment: [{ data: emailBody, alternative: true }],
    from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
    to: email,
    subject,
  })
} catch (err) {
  return res.status(400).send(JSON.stringify({ message: err.message }));
}
return res.status(200).send(JSON.stringify({ message: 'success' }))

});

app.post('/api/getintouch', async(req, res) => {
  const { name, email, message } = req.body;
  const subject = "Message from Meta Nuva Landing Page";
  const emailBody = `
    <html><body>
    Dear Admin,<br/>
    You have received an email from 'Get In Touch' form from Meta Nuva Landing Page. <br/><br/>
    The details are:<br/><br/>
    Name: ${name}<br/><br/>
    Email: ${email}<br/><br/>
    Message: ${message}<br/><br/><br/><br/>
    Thank you.<br/>
    Meta Nuva`;

    try {
      const message = await client.sendAsync({
        text: emailBody,
        attachment: [{ data: emailBody, alternative: true }],
        from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
        to: email,
        subject,
      })
    } catch (err) {
      return res.status(400).send(JSON.stringify({ message: err.message }));
    }
    return res.status(200).send(JSON.stringify({ message: 'success' }));

});

app.post('/api/sendemail', async (req, res) => {
  const {email} = req.body
  try {
    const message = await client.sendAsync({
      text: emailBody,
      attachment: [{ data: emailBody, alternative: true }],
      from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      to: email,
      subject: 'Meta Nuva Onboarding',
    })
  } catch (err) {
      return res.status(400).send(JSON.stringify({ message: err.message }));
  }
  return res.status(200).send(JSON.stringify({ message: 'success' }));
});

app.post('/api/Oldsendemail', async (req, res) => {
  //get registration link
  const query = `*[_type == "settings"] {registrationlink}`
  const result = await config.fetch(query);
  const {email} = req.body
  const emailBody = `<html><body>
        <table style="margin:0 auto; text-align:center; background: rgb(12, 85, 219); padding: 3rem; border-radius: 30px; color:rgb(255,255,255); font-size: 16px; font-family:Arial, Helvetica, sans-serif">
        <tr>
            <td>
                <img src="https://metanuva.com/App_Themes/assets/images/banner/logo.png" alt="Meta Nuva Logo"/>
            </td>
        </tr>
        <tr>
            <td>
                <p style="line-height: 28px; font-size: 24px;">Welcome to Meta Nuva, your number-one source for all things innovation.</p>
                <p style="line-height: 28px;">Thank you for helping us to protect the interests of our community.  We hope this demonstrates our commitment to you.  Please find below your registration link. </p>
                <p style="line-height: 28px;"><a style="color: #ffffff;" href="${result[0].registrationlink}">${result[0].registrationlink}</a></p>
                <p style="line-height: 28px;">We look forward to welcoming you to our Neta Nuva community and assisting you with your onboarding.  If you have any further questions, please do let us know.</p>
                <p style="line-height: 28px; margin-top: 5em;">Be sure to join the Meta Nuva Community social media channels to access our full range of resources or drop an email to <a href="mailto:enquiry@metanuva.com" style="color: rgb(255,255,255);">enquiry@metanuva.com</a></p>
                <p style="line-height: 28px; font-size: 12px; font-style: italic">This email and any attachments to it may be confidential and are intended solely for the use of the individual to whom it is addressed. Any views or opinions expressed are solely those of the author and do not necessarily represent those of Meta Nuva. Please disregard this email if you have received it by mistake or were not expecting it.</p>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://t.me/metanuva" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Telegram</a> |
                <a href="https://twitter.com/nuvacommunity" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Twitter</a> |
                <a href="https://www.instagram.com/nuva.community/" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Instagram</a> |
                <a href="https://www.facebook.com/METANUVA" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Facebook</a> |
                <a href="https://www.linkedin.com/company/metanuva" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Linked In</a> |
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Youtube</a>
            </td>
        </tr>
        <tr>
            <td><p style="font-size: 12px;">Copyright @ 2023 Meta Nuva.</p>
            </td>
        </tr>
      </table>
    </body></html>`;

  try {
    const message = await client.sendAsync({
      text: emailBody,
      attachment: [{ data: emailBody, alternative: true }],
      from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      to: email,
      subject: 'Registration Link',
    })
  } catch (err) {
    res.status(400).send(JSON.stringify({ message: err.message }))
    return
  }
  res.status(200).send(JSON.stringify({ message: 'success' }))
});

app.post("/api/captchaverify", async (req, res) => {

  ////Destructuring response token and input field value from request body
  const { token, inputVal } = req.body;

  try {
    // Sending secret key and response token to Google Recaptcha API for authentication.
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`
    ).catch(err => {});

    // Check response status and send back to the client-side
    if (response.data.success) {
      return res.send("Human");
    } else {
      return res.send("Robot");
    }
  } catch (error) {
    // Handle any errors that occur during the reCAPTCHA verification process
    console.error(error);
    return res.status(500).send("Error verifying reCAPTCHA");
   }
});

app.get("/api/getcategories", async(req, res) => {
  let categories = await redis.get('categories');
  if(categories != null){
    return res.status(200).json(categories)
  }
  const query = `*[_type == "category"] | order(totalCollection desc) { name, profileImage, bannerImage, totalCollection }`;
  const result = await config.fetch(query);

  if(result.length > 0){
    await redis.set("categories", JSON.stringify(result)); //update every day
    return res.status(200).json(result);
  }
  else {
    return res.status(200).json({"message": "Error getting categories"});
  }
});

app.get("/api/hasthiswalletnft", async(req, res) => {
  const {walletaddress} = req.query;
  let isNFT = false, isCollection = false;
  const collections = await redis.get("collections");
  if(!collections){
    return null;
  }

  //find collection deployed by the walletaddress
  const rawdata = JSON.parse(collections);
  const filtered = rawdata?.filter(col => col.createdBy._ref == walletaddress);
  if(filtered.length > 0){
    isCollection = true;
  }
  
  //find nft in all of the filtered collections
  const unresolved = filtered?.map(async collection => {
    const sdk = new ThirdwebSDK(chainnum[collection?.chainId]);
    const contract = await sdk.getContract(collection?.contractAddress);
    const balance = await contract.erc721.balanceOf(walletaddress);
    return balance //this returns no.of nfts in hex form
  });

  const resolved = await Promise.allSettled(unresolved); //resolve all Promise
  const resultConverted = resolved.map(item => Number(item.value.toString())); //converting all no.of nfts from the collection by the walletaddress from hex to string, easier to read
  //check number of nfts > 1;
  const nftnumber = resultConverted.filter(item => item > 0);
  if(nftnumber.length > 0){
    isNFT = true
  }

  return res.status(200).send(isNFT && isCollection)
});

const updateUsers = async () => {
  const query = `*[_type == "users"]{walletAddress, web3imageprofile, userName, referrer, directs, refactivation, payablelevel}`;
  let users = await config.fetch(query);
  users = JSON.stringify(users);
  redis.set("users", users);
  return users;
}

app.get('/api/updateusers', async(req, res) => {
  updateUsers();
});

app.get("/api/getusers", async(req, res) => {
  let users = await redis.get("users");
  if(!users){
    const allusers = await updateUsers();
    return res.status(200).send(JSON.stringify(allusers));
  }else{
    return res.status(200).send(JSON.stringify(users));
  }
});

app.get("api/checkserver", async(req,res) => {
  res.send(true)
});

app.get('/api/nft/getroyaltybytoken/:chain/:contractAddress/:tokenId', async(req, res) => {
  const { chain, contractAddress, tokenId } = req.params;

  const sdk = ThirdwebSDK.fromPrivateKey(chain);
  const contract = await sdk.getContract(contractAddress);
  const royalty = await contract.royalties.getTokenRoyaltyInfo(tokenId);
  
  res.send(royalty);

})

app.post('/api/nft/setroyaltybytoken/', async(req, res) => {
  const { contractAddress, walletAddress, tokenId } = req.body;
  const allowedContracts = ['0x52f3a6EEC5491294eAe17B8a5f096e9568FdBed7', '0x52f3a6EEC5491294eAe17B8a5f096e9568FdBed5', '0xb63cf439Dfa97d540AD0A8D29fE60Ae23bC123ca'];

  if(allowedContracts.includes(contractAddress)){
    const sdk = ThirdwebSDK.fromPrivateKey(process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY, "mumbai"); // <-- change chain to binance, and change the allowed Contracts to the one from binance chain
    const contract = await sdk.getContract(contractAddress);
    const royalty = await contract.royalties.getTokenRoyaltyInfo(tokenId);

    if(royalty.fee_recipient == '0x9cB0b5Ba3873b4E4860A8469d66998059Af79eA6'){
      try{
        const tx = await contract.royalties.setTokenRoyaltyInfo(
          tokenId, 
          {
            seller_fee_basis_points: 250,
            fee_recipient: walletAddress,
          });
    
        return res.send(tx);
      }catch(err){
        //send notification to admin, royalty cannot be set
        const emailBody = `Royalty could not be set for token with following details<br/>
        Collection: ${contractAddress}<br/>
        Token Id: ${tokenId}<br/>
        Wallet Address: ${walletAddress}.<br/>
        This needs to be added manually.`;

        const message = await client.sendAsync({
          text: emailBody,
          attachment: [{ data: emailBody, alternative: true }],
          from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
          to: 'to-arun@live.com',
          subject: 'Royalty Setting could not be saved',
        })
        return res.send(null)
      }
    }
  }
  return res.send(null);
})


app.listen(8080, () => console.log('listening on 8080'));






// app.post('/api/saveimage', upload.single('imagefile'), async (req, res) => {
//   let files = []
//   files.push(req.file.buffer);
//   const cid =  await web3Client.put(files);

//   res.status(200).send(cid);
// })

// app.get('/api/getweb3image', async(req, res) => {
//   const fileURI = req.query.uri;
// //  console.log(fileURI)
//   const result = await web3storage.download(fileURI);
//   const data = await result.text();
//   // const base = Buffer.from(data, 'binary').toString('base64');
//   console.log(data)
//   res.status(200).json(data);
// })

// app.post('/api/saveImageToWeb3', async (req, res) => {
//   const file = req.body.image
//   const path = req.body.path
//   console.log(path)
  
  
//   const fileWithPath = await getFilesFromPath(path)
//   const cid = await web3Client.put(fileWithPath)
//   console.log(cid)
//   return res.status(200).json(cid)    

//   // const ext = file.name.split('.').pop()
//   // const fileName = `${uuidv4()}.${ext}`
//   // const newFile = new File([file], fileName, {type: file.type})
//   // const cid = await web3Client.put([newFile, {
//   //   name: fileName
//   // }])

//   // const imageURI = `https://${cid}.ipfs.dweb.link/${fileName}`
//   const imageURI = `https://w3s.link/ipfs/cid/${fileName}`
//   return res.status(200).send({ imageURI })
// })

// app.get('/api/getImageFromWeb3', async(req, res) => {
//   const cid = req.query.cid
//   const returnFile = await web3Client.get(cid)
//   // console.log(returnFile)
//   return res.status(200).send(`https://w3s.link/ipfs/${cid}`)

//   const result = await web3Client.get(cid)
//   if(!result) {
//     return res.status(200).json('Not Found')
//   }else {
//     console.log(result)
//     // const files = await res.files()
//     // for(const file of files){
//     //   console.log(file.cid, file.path, file.size)
//     // }
//     return res.status(200).send({ result })
//   }
// })

// app.get('/api/getS3Image', async (req, res) => {
//   const params = {
//     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//     Key: req.query.filename,
//   }
//   const command = new GetObjectCommand(params)
//   const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

//   res.send({ url }).status(200)
// })

// app.post('/api/saveS3Image', upload.single('profile'), async (req, res) => {
//   const address = req.body.userAddress
//   // console.log(req.file.buffer)
//   const imageName = 'profileImage-' + address

//   const params = {
//     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//     Key: imageName,
//     Body: req.file.buffer,
//     ContentType: req.file.mimetype,
//   }

//   const command = new PutObjectCommand(params)

//   await s3.send(command)
//   res.send({})
// })

// app.post('/api/saveS3Banner', upload.single('banner'), async (req, res) => {
//   const address = req.body.userAddress
//   const imageName = 'bannerImage-' + address

//   const params = {
//     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//     Key: imageName,
//     Body: req.file.buffer,
//     ContentType: req.file.mimetype,
//   }

//   const command = new PutObjectCommand(params)

//   await s3.send(command)
//   res.send({})
// })


// app.get('/api/getMarketEvents', async (req, res) =>{
//   // const marketplaceAddress = req.query.marketplaceAddress
//   // const eventType = req.query.eventType
//   const eventType = 'NewOffer'
//   //get data from blockchain
//   const sdk = new ThirdwebSDK(process.env.NEXT_PUBLIC_POLYGON_RPC_URL)
//   const marketplace = sdk.getMarketplace(process.env.NEXT_PUBLIC_MARKETPLACE_ID)


//   const events = await marketplace.events.getEvents(eventType)
  
//   return res.status(200).json(JSON.stringify(events))
// })

// ipfs://QmbRphLywEnzZoyCX88PHxYbXjWqbiF2Wp1tKWJrvDZyPt/0


// app.post('/api/uploadnft', nftUpload.single('filetoupload'), function(req, res) {
//   res.status(200).json({ 'filename' : res.req.file.filename})
// })

// app.post('/api/uploadcollection', nftUpload.single('filetoupload'), function(req, res) {
//   res.status(200).json({ 'filename' : res.req.file.filename})
// })