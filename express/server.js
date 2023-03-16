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
})

const client = new SMTPClient({
  user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
  password: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: process.env.NEXT_PUBLIC_SMTP_PORT,
  ssl: process.env.NEXT_PUBLIC_SMTP_SSL,
  tls: true,
  timeout: process.env.NEXT_PUBLIC_SMTP_TIMEOUT,
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
    else if (blockchain == 'binance-testnet') { selectedChainCurrency = 'TBNB'; } 
    else if (blockchain == "binance") { selectedChainCurrency = 'BNB'; } 
    else if (blockchain == 'avalanche-fuji' || blockchain == "avalanche") { selectedChainCurrency = 'AVAX'; } 

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
        subject
      })
    } catch (err) {
      res.status(400).send(JSON.stringify({ message: err.message }))
      return
    }
    res.status(200).send(JSON.stringify({ message: 'success' }))

})

app.post('/api/sendemail', async (req, res) => {
  const {email} = req.body
  // const emailBodyOldDesign = `<div><div style="font-family:Montserrat,DejaVu Sans,Verdana,sans-serif; padding:50px; background-image:url(https://nuvatoken.com/wp-content/uploads/2023/03/email-header.png); background-repeat:no-repeat; background-position:top; background-size:cover"><div style="margin:0 auto; width:700px"><img data-imagetype="External" src="https://nuvatoken.com/wp-content/uploads/2023/03/metanuva-whitetext.png" alt="Meta Nuva Logo" style="width:150px"> <p style="font-size:3rem; font-weight:700; color:#ffffff; padding:50px 0">We value your <br aria-hidden="true">interest in<br aria-hidden="true"><span style="color:#faf583">Meta Nuva</span></p></div></div><div style="font-family: Montserrat, &quot;DejaVu Sans&quot;, Verdana, sans-serif; line-height: 24px; font-size: 14px; margin: 0px auto; width: 700px; border-radius: 20px; padding: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(51, 51, 51) !important;" data-ogsb="rgb(255, 255, 255)"><p>We work tirelessly to support our community members, and transparency and ethical conduct are of paramount importance to us. Please speak to the person who introduced you to Meta Nuva and ask them for their referral link to enable you to join our community. If you don't have a referee, we ask you to email us at support@metanuva.com, and we will gladly help you with your onboarding. </p><p style="font-size:10px; font-style:italic; line-height:20px">This email and any attachments to it may be confidential and are intended solely for the use of the individual to whom it is addressed. Any views or opinions expressed are solely those of the author and do not necessarily represent those of Meta Nuva. Please disregard this email if you have received it by mistake or were not expecting it.</p></div></div>`;

  //all email Templates
  //Registration Mail Onboarding
  const emailBody = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
                <h1 style="font-size: 2rem; font-weight: bold; color: #00086f !important">WE VALUE <br />
                    <span>YOUR INTEREST IN</span> <br />
                    <span style="font-size: 3rem;">META NUVA</span>
              </h1>
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  We work tirelessly to support our community members, and
                  transparency and ethical conduct are of paramount importance to
                  us. Please speak to the person who introduced you to Meta Nuva and
                  ask them for their referral link to enable you to join our
                  community.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  If you don't have a referee, we ask you to email us at
                  <a href="mailto:support@metanuva.com"><b style="color: #00086f !important;">support@metanuva.com</b></a>, and we will gladly help you with your
                  onboarding.
                </p>
              </div>
            </div>
            <p><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailman.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Registration_Reply = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
                <h1 style="font-size: 2.6rem; font-weight: bold; color: #00086f !important; margin-bottom: 0;">
                  Welcome to META NUVA
                </h1>
                <p style="font-size: 1.3rem; font-weight: 700; margin-top:5px;">
                  Your number-one source for all things innovation.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important"">
                  We appreciate your interest in Meta Nuva. We work tirelessly to
                  support our community members, and transparency and ethical
                  conduct are of paramount importance to us. To protect the
                  integrity of our community, please advise us who introduced you to
                  Meta Nuva so that we can assist in sending you their referral
                  link. If you do not have a personal connection with one of our
                  members, please advise us accordingly, and we will gladly assist
                  you.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  You may reply to this email <a href="mailto:support@metanuva.com" target="_blank">support@metanuva.com</a>
                  </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  We look forward to welcoming you as one of our community members
                  in the near future.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Be sure to join the Meta Nuva Community social media channels to
                  access our full range of resources or drop an email to
                  <a href="mailto:support@metanuva.com" target="_blank">support@metanuva.com</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mail-two.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  // const emailBody_Withdrawal_Request = `
  const emailBody_Withdrawal_Confirmation  = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                Dear <span id="name"></span>,<br/> We would like to extend our appreciation to you for
                being one of our valued Community Members. We are thrilled to see
                that you are reaping the rewards of being a part of Meta Nuva.
                </p>
                <div style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Thank you for your withdrawal request of <span id="amount"></span> to be
                  deposited to your wallet. <br/>
                  <p style="background: #fff8dc; padding: 10px; margin-top: 10px; border-radius: 10px; text-align: center;">liuyhgvbnmkledoiufyhg3bnmeoriu</p>
                </div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  For the safety and security of this transaction, please confirm
                  that the above wallet details are correct, by clicking on the
                  confirm button below.
                </p>
                <div style="display: flex; justify-content: center;">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/withdrawConfirmation.aspx" style="color: #ffffff; text-decoration: none;">Confirm</a></p>
                </div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  If the above details are not correct - DO NOT click on the confirm
                  button. You should go into your portal and amend your wallet
                  details, before making a new withdrawal request. Should you have
                  any difficulties, you may contact us by emailing (Insert relevant
                  email address). If you did not make this withdrawal request, then
                  you should immediately change your password.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Once again, may we thank you for being part of Meta Nuva and we
                  look forward to a long and prosperous future together.
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailfour.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Withdrawal_Payment = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
              <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
              Dear <span id="name">Name</span>, <br/> Your withdrawal request for the amount of <span id="amount">5000 USD</span> has been processed.
            </p>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
              Please allow <span id="time">15-20 minutes</span> for this to show in your wallet.
            </p>
            <div style="font-size: 19px; line-height: 30px; color: #000000 !important">
              <p style="margin-bottom: 4px;">TXID for the transaction <span style="font-size: 13px;">(click to view)</span></p>
              <p style="background: #fff8dc;padding: 10px; margin-top: 10px; border-radius: 10px; text-align: center">
                <a href="https://tronscan.org/#/transaction/e3159f7b4db6d5b0d16f0a6568dfbb04ce911c5d838bb3044803f8f5ddd6e90a" target="_blank" style="cursor: pointer; text-decoration: none; font-weight: 500;color: #000;">e3159f7b4db6d5b0d16f0a6568dfbb04ce911c5d838bb3044803f8f5ddd6e90a</a>
              </p>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
              We hope that you are enjoying being a part of the Meta Nuva
              Community and that we can assist you with many more withdrawals in
              the future.
            </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailfive.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Newsletter = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Here at Meta Nuva we hold many values dear to us, and effective
                  communication is one of them. There are many ways that we
                  endeavour to support you and keep you informed of all of the
                  latest news and information. We are therefore incredibly proud to
                  share with you our latest member's newsletter.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  With the passing of yet another month, we trust this helps you to
                  reflect upon last month and make strong and achievable goals for
                  the month ahead.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  With the passing of yet another month, we trust this helps you to
                  reflect upon last month and make strong and achievable goals for
                  the month ahead.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  We hope that you, like us are excited about not only what we offer
                  now to our community, but also what is coming in the future – by
                  sharing our vision, we will be sharing our dreams and desires with
                  you.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Thank you for being the valued member of Meta Nuva that you are.
                  Please click the button below to open your newsletter.
                </p>
                <div style="display: flex; justify-content: center;">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/newsletter.png" style="color: #ffffff; text-decoration: none;" target="_blank">Read Newsletter</a></p>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mail-three.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_RegistrationLink = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
                <h1 style="font-size: 2.6rem; font-weight: bold; color: #00086f !important; margin-bottom: 0;">
                  Welcome to META NUVA
                </h1>
                <p style="font-size: 1.3rem; font-weight: 700; margin-top:5px;">
                  Your number-one source for all things innovation.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Thank you for helping us to protect the interests of our
                  community. We hope this demonstrates our commitment to you. Please
                  find below your registration link.
                </p>
                <div style="display: flex; font-size: 19px; line-height: 30px; color: #000000 !important; align-items: center;">
                    <img src="https://nuvatoken.com/wp-content/uploads/2023/03/chain.png" style="width: 20px; height: 20px;" />
                    <div style="box-shadow: 0 0 5px #00000077; border-radius: 10px; padding: 10px;">
                      <a href="https://www.metanuva.com/Registration.aspx?PLACEMENT=METANUVA&P">https://www.metanuva.com/Registration.aspx?PLACEMENT=METANUVA&P</a>
                    </div>
                </div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  We look forward to welcoming you to our Meta Nuva community and
                  assisting you with your onboarding. If you have any further
                  questions, please do let us know.
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Be sure to join the Meta Nuva Community social media channels to
                  access our full range of resources or drop an email to
                  <a href="mailto:support@metanuva.com">support@metanuva.com</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mail-six.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_2FA_Setup = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
              <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
              Dear <span id="name">Name</span>, <br/>
              You have setup 2FA for your Meta Nuva account. Please do not forget to keep your Authenticator Key safe. If you lose your Authenticator access, you may risk losing your account.
            </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailfive.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Birthday = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
        <!------------Start of Email Content-------------->

          <div class="text">
              <div>
                <h1>Happy Birthday, James!</h1>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  “Wishing you the best on this blessed day and everything good in the year ahead.” Our Meta Nuva Corporate team is wishing you the happiest of birthdays."  
                </p>
              </div>
          </div>
          <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
          <p style="text-align: center; flex-grow:1;"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/birthdayyy.png" style="width:300px; padding-top: 40px;"/></p>
          
          <!------------End of Email Content-------------->
        </div>

        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Email_Confirmation = ` 
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0;">
            <div class="text" style="">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                Please verify your email address by clicking the link below to complete your registration. Once verified, sign into your Meta Nuva Portal using your username and password.
                </p>
                <div style="display: flex; justify-content: center;">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/EmailConfirmation.aspx" style="color: #ffffff; text-decoration: none;">Verify Email Address</a></p>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailfour.png" style="width:300px; padding-top: 40px;"/>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_KYC_Approved = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                Your KYC documents have been approved. You can now enroll onto a course of your choice. Click below to login to the Meta Nuva Portal.
                </p>
                <div style="display: flex; justify-content: center; justify-content: center">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a></p>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important; "><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/kyc.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_KYC_Rejected = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <div style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  <p style="line-height: 28px;">Your KYC has been rejected.<br/>Reason for rejection:</p>
                  <p style="background: #fff8dc;padding: 10px; margin-top: 10px; border-radius: 10px; text-align: center">
                    <span>You have entered wrong date of birth.</span>
                  </p>
                  Please make sure all details are correct matching your identity document and resubmit by logging into your Meta Nuva portal.</p>
                </div>
                <div style="display: flex; justify-content: center;">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a></p>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/kyc.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Message_Downline = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  You have received a message from your upline. Login to Meta Nuva portal to view the message.
                </p>
                <div style="display: flex; justify-content: center;">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a>
                  </p>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/loginsm.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_New_Team = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  [Sherlok Holmes] has been enrolled in your team.
                </p>
                <div style="display: flex; justify-content: center;">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                    <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a></p>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/newmember.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Rank_Advancement = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  <span style="font-weight: 700;">Congratulations</span>, you have been promoted to Nuva Star 2.
                </p>
                <div style="display: flex; justify-content: center;">
                  <img src="https://www.metanuva.com/Images/RankBadge/2.png" style="width: 200px;"/>
                </div>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/newmember.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_New_Course_Bought = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                You have successfully purchased Elite Course $5000. The course has been sucessfully activated in your account.
                </p>
              </div>
              <div style="display: flex; justify-content: center;">
                <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                  <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/coursemed.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Course_Expiry = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Your Executive Course $5000 has expired. Login to upgrade to new course.
                </p>
              </div>
              <div style="display: flex; justify-content: center;">
                <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                  <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/coursemed.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Course_Expiry_Advance = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Your Executive Course $5000 is going to expire in next 7 days.
                </p>
              </div>
              <div style="display: flex; justify-content: center;">
                <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                  <a href="https://metanuva.com/login.aspx" style="color: #ffffff; text-decoration: none;">Login</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/coursemed.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Password_Reset = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  You have recently requested a password change for your Meta Nuva account. If this was you, you can reset the password by clicking the button below.
                </p>
              </div>
              <div style="display: flex; justify-content: center;">
                <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                  <a href="https://metanuva.com/passwordreset.aspx" style="color: #ffffff; text-decoration: none;">Reset Password</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailfive.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  const emailBody_Template = `
  <div style="font-family: 'Montserrat', sans-serif; background-image: url(https://nuvatoken.com/wp-content/uploads/2023/03/emailbackround.png); background-position: right; background-size: cover; padding: 50px 10px;">
        <p style="text-align: right; padding-right: 40px;">
            <img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/>
        </p>
        <div style="display: flex; flex-wrap: wrap; padding: 10px; padding-top: 0; justify-content: space-between;">
            <div class="text" style="flex-grow: 1; width: 100%;">
              <div>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  Dear <span id="name">Chris Jericho</span>,
                </p>
                <p style="font-size: 19px; line-height: 30px; color: #000000 !important">
                  You have recently requested a password change for your Meta Nuva account. If this was you, you can reset the password by clicking the button below.
                </p>
              </div>
              <div style="display: flex; justify-content: center;">
                <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 17px; padding: 20px 40px; border-radius: 50px;">
                  <a href="https://metanuva.com/passwordreset.aspx" style="color: #ffffff; text-decoration: none;">Reset Password</a>
                </p>
              </div>
            </div>
            <p style="font-size: 19px; line-height: 30px; color: #000000 !important"><b>Best Regards,<br/>Meta Nuva Team</b></p>
            <p style="flex-grow: 1; text-align:center"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/mailfive.png" style="width:400px; padding-top: 40px;"/></p>
        </div>
        <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;   ">
            This email and any attachments to it may be confidential and are
            intended solely for the use of the individual to whom it is addressed.
            Any views or opinions expressed are solely those of the author and do
            not necessarily represent those of Meta Nuva. Please disregard this
            email if you have received it by mistake or were not expecting it.
          </p>
          <div class="socials" style="padding: 40px;">
            <p style="text-align: center">
                <a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a>
            </p>
            <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
            </div>
          </div>
    </div>
  `;
  

  try {
    const message = await client.sendAsync({
      text: emailBody,
      attachment: [{ data: emailBody, alternative: true }],
      from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      to: email,
      subject: 'Meta Nuva Registration',
    })
  } catch (err) {
      res.status(400).send(JSON.stringify({ message: err.message }))
    return
  }
  res.status(200).send(JSON.stringify({ message: 'success' }))
})

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
                <p style="line-height: 28px; margin-top: 5em;">Be sure to join the Meta Nuva Community social media channels to access our full range of resources or drop an email to <a href="mailto:support@metanuva.com" style="color: rgb(255,255,255);">support@metanuva.com</a></p>
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