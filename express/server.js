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
import { ThirdwebStorage } from '@thirdweb-dev/storage'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const app = express()
app.use(cors({origin: ['http://localhost:3000', 'https://nuvanft.io', 'https://metanuva.com'],}))
// app.use(cors({origin: "*"}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

var globalActiveListings = []

// parse application/json
app.use(bodyParser.json())

dotenv.config() 
//chain ENUMS

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
  'mumbai': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
  'goerli': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
  'avalanche-fuji': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
  'binance-testnet': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
  'arbitrum-goerli': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
  'mainnet': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
  'polygon': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
  'binance': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,

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
})


cron.schedule('*/500 * * * *', async() => {
  const options = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_COINAPI_URL,
    params: { 
      referenceCurrencyUuid: 'yhjMzLPhuIDl',
      timePeriod: '24h',
      'tiers[0]': '1',
      orderBy: 'marketCap',
      orderDirection: 'desc',
      limit: '50',
      offset: '0'
     },
    headers: {
      'X-RapidAPI-Host': process.env.NEXT_PUBLIC_COINAPI_HOST,
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_COINAPI_KEY,
    },
  }
  try{
    await axios.request(options).then(async (response) => {
      const matic = response.data.data.coins?.filter(item => item.symbol == "MATIC");
      const eth = response.data.data.coins?.filter(item => item.symbol == "ETH");
      const avax = response.data.data.coins?.filter(item => item.symbol == "AVAX");
      const bnb = response.data.data.coins?.filter(item => item.symbol == "BNB");
  
      //save all prices in database
      await config.patch(process.env.NEXT_PUBLIC_SETTING_DOCUMENT_ID)
      .set({
        maticprice : Number(parseFloat(matic[0].price).toFixed(4)),
        ethprice : Number(parseFloat(eth[0].price).toFixed(4)),
        avaxprice : Number(parseFloat(avax[0].price).toFixed(4)),
        bnbprice : Number(parseFloat(bnb[0].price).toFixed(4)),
      })
      .commit()
      .then(() => { 
        var date = new Date()
        console.log(`Coins Price updated on ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
      })
    })
    console.count('Price Update Count')
  }catch(err){
    console.error(err)
  }
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage }) //for profile pic and banner pic saving in AWS

const nftStorage = multer.diskStorage({
  destination: function (req, file, cb,) {
    cb(null, '../public/assets/nfts/')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})
const nftUpload = multer({ storage: nftStorage});

const collectionStorage = multer.diskStorage({
  destination: function (req, file, cb,) {
    cb(null, '../public/assets/collections/')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})
const collectionUpload = multer({ storage: collectionStorage});

app.get('/api/getfeaturednfts', async(req, res) => {

  let featuredNfts = await redis.get("featurednfts");

  if(featuredNfts) {
    return res.status(200).send(featuredNfts);
  }else {
    const query = `*[_type == "nftItem" && featured == true] {_id, id, name, likedBy, collection->{chainId, contractAddress}} | order(featuredon desc) [0..4]`;
    const featurednfts = await config.fetch(query);

    const unresolved = featurednfts?.map(async (item) => {
      if(item?.collection){
        const sdk = new ThirdwebSDK(chainnum[item?.collection?.chainId]);
        const contract = await sdk.getContract(item?.collection?.contractAddress);
        const nft = await contract.erc721.get(item?.id);

        const getownerquery = `*[_type == "users" && _id == "${nft.owner}"] {userName, web3imageprofile}`;
        const ownerdata = await config.fetch(getownerquery);

        const obj = { ...item, nft, owner: ownerdata[0] };
        return obj;
      }
    })
    const resolvedPath = await Promise.all(unresolved);
  
    //filtering out null and undefined objects
    const filterResolved = resolvedPath.filter(Boolean);

    //save in redis if not present already
    redis.set("featurednfts", JSON.stringify(filterResolved));
    redis.expire("featurednft", 60);
  
    return (res.status(200).json(filterResolved))
  }

})

app.post('/api/saveweb3image', upload.single('imagefile'), async (req, res) => {
  const file = req.file.buffer;
  try{
    const fileURI = await web3storage.upload(file);
  
    if(fileURI){
      res.status(200).send(fileURI);
    }
    res.status(200).json({ 'message': 'Error in saving image in Web3'});
  }catch(err){
    console.log(err);
    res.status(200).json({ 'message': 'Error in saving image in Web3'});
  }
})

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
})

app.get('/api/getAllNfts', async(req, res) => {

})

app.get('/api/getAllListings/:blockchain', async (req, res) => {
  const blockchain = req.params.blockchain;

  let cache = await redis.get("activelistings-" + blockchain);
  globalActiveListings = JSON.parse(cache);
  return res.status(200).json(globalActiveListings)
})

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

})

app.get('/api/getLatestNfts/:blockchain', async (req, res) => {

  const blockchain = req.params.blockchain;
  const nftQuantity = req.query.quantity;
  
  const cache = await redis.get("activelistings-" + blockchain);

  const allArr = JSON.parse(cache);


  var selectedChainCurrency = '';

  if(blockchain != undefined){
    if (blockchain == 'mumbai' || blockchain == "polygon") { selectedChainCurrency = 'MATIC'; } 
    else if (blockchain == 'goerli' || blockchain == "mainnet") { selectedChainCurrency = 'ETH'; } 
    else if (blockchain == 'binance-testnet' || blockchain == "binance") { selectedChainCurrency = 'TBNB'; } 
    else if (blockchain == 'avalanche-fuji' || blockchain == "avalnche") { selectedChainCurrency = 'AVAX'; } 

    const thisChainNfts = allArr?.filter((item) => item.buyoutCurrencyValuePerToken.symbol == selectedChainCurrency);
    const latestNfts = thisChainNfts?.slice(-nftQuantity); 

    return res.status(200).json(latestNfts?.reverse())
  }
  
  return res.status(200).json(allArr.reverse())
})

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
})

app.get('/api/topTradedCollections/:blockchain', async( req, res) => {
  const blockchain = req.params.blockchain;
  if(blockchain){
    var topCollections;
    const chainid = chainEnum[blockchain];
  console.log(chainid)
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
          "creatorAddress" : createdBy->walletAddress,
          "allOwners" : owners[]->
      }`;
    topCollections = await config.fetch(query)
    redis.set("toptradedcollections-" + blockchain, JSON.stringify(topCollections), 'ex', 600)
    return res.status(200).json(JSON.stringify(topCollections))
    }
  }
  return res.status(200).json({ "message": "Blockchain not found"})
})
app.post('/api/savenft', async(req, res) => {
  const nftId = req.body.id
  const nftData = req.body.nftData

  if(await redis.get(nftId) == null) {
    redis.set(nftId, JSON.stringify(nftData))
    return res.status(200).json(nftData)
  } else {
    return res.status(200).json("Duplicate id. NFT data not saved.")
  }
})

app.get('/api/nft/listing/:id', async (req, res) => {
  let found = false;
  //this will return Listing Data of a NFT
  const nftId = req.params.id
  let result = []

  //search in each chain individually
  await redis.get("activelistings-binance-testnet").then((res) => {
    // console.log(res)
    result = JSON.parse(res).filter(item => item.asset.properties.tokenid == nftId)
    if(result.length > 0) { found = true;}
  })
  
  if(!found){
    await redis.get("activelistings-mumbai").then((res) =>{
      result = JSON.parse(res).filter(item => item.asset.properties.tokenid == nftId)
      if(result.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-goerli").then((res) =>{
      result = JSON.parse(res).filter(item => item.asset.properties.tokenid == nftId)
      if(result.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-avalanche-fuji").then((res) =>{
      result = JSON.parse(res).filter(item => item.asset.properties.tokenid == nftId)
      if(result.length > 0) { found = true;}
    })
  }
  if(!found){
    await redis.get("activelistings-arbitrum-goerli").then((res) =>{
      result = JSON.parse(res).filter(item => item.asset.properties.tokenid == nftId)
      if(result.length > 0) { found = true;}
    })
  }
  if(found){
    res.status(200).json(result[0])
  }else {
    res.status(200).json({"message": "NFT data not found"})
  }
})
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
    res.status(200).json(sanityData[0])
  }
  else {
    res.status(200).json({"message": "NFT data not found"})
  }
})
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
    
    // console.log(nft)
  
    if(nft.metadata.owner != '0x0000000000000000000000000000000000000000') {
      res.status(200).json(nft);
    }
    else {
      res.status(200).json({messsage: 'Could not get NFT metadata'});
    }
  }
  else {
    res.status(200).json({messsage: 'Blockchain could not be found'});
  }
})

app.post('/api/sendemail', async (req,res) => {
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
                <p style="line-height: 28px; font-size: 24px;">Welcome to Meta Nuva, your number one source for all things innovation.</p>
                <p style="line-height: 28px;">Thank you for taking an interest in us. You can now use the following register button to register. Alternatively, you can also copy the given registration link and paste in your browser. </p>
                <p style="line-height:28px;"><a href="${result[0].registrationlink}" target="_blank" style="padding: 10px 20px; border-radius: 7px; background: #ffffff; text-decoration: none; ">Register</a></p>
                <p style="line-height: 28px;"><a style="color: #ffffff;" href="${result[0].registrationlink}">${result[0].registrationlink}</a></p>
                <p style="line-height: 28px; margin-top: 5em;">Be sure to join the Meta Nuva Community social media channels to access our full range of resources or drop an email to <a href="mailto:support@metanuva.com" style="color: rgb(255,255,255);">support@metanuva.com</a></p>
                <p style="line-height: 28px; font-size: 12px; font-style: italic">This email and any attachments to it may be confidential and are intended solely for the use of the individual to whom it is addressed. Any views or opinions expressed are solely those of the author and do not necessarily represent those of Meta Nuva. If you have received this by mistake or were not expecting it, please disregard this email.</p>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://t.me/metanuva" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Telegram</a> |
                <a href="https://twitter.com/nuvacommunity" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Twitter</a> |
                <a href="https://www.instagram.com/nuva.community/" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Instagram</a> |
                <a href="https://www.facebook.com/METANUVA" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Facebook</a> |
                <a href="https://www.linkedin.com/company/nuvatoken" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Linked In</a> |
                <a href="https://t.me/metanuva" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Telegram</a> |
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" target="_blank" style="color: rgb(255,255,255); font-size: 12px;">Youtube</a>
            </td>
        </tr>
        <tr>
            <td><p style="font-size: 12px;">Copyright @ 2022 Meta Nuva.</p>
            </td>
        </tr>
      </table>
    </body></html>`;


  const client = new SMTPClient({
    user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
    password: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: process.env.NEXT_PUBLIC_SMTP_PORT,
    ssl: process.env.NEXT_PUBLIC_SMTP_SSL,
    tls: true,
    timeout: process.env.NEXT_PUBLIC_SMTP_TIMEOUT,
  })

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
})

app.listen(8080, () => console.log('listening on 8080'))






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