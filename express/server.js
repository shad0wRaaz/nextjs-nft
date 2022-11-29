import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'
import crypto from 'crypto'
import sanityClient from '@sanity/client'
import cron from 'node-cron'
import axios from 'axios'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import Redis from 'ioredis'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { v4 as uuidv4 } from 'uuid'
import { useMarketplace } from '@thirdweb-dev/react'
import bodyParser from 'body-parser'


const app = express()
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://nuvanft.io'],
  })
)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const redis = new Redis({
  host: process.env.NEXT_PUBLIC_REDIS_URL,
  port: process.env.NEXT_PUBLIC_REDIS_PORT
})

dotenv.config() 

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

const web3Client = new Web3Storage({ 
  token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY
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
      // console.log(response.data)
      const matic = response.data.data.coins?.filter(item => item.symbol == "MATIC")
      const eth = response.data.data.coins?.filter(item => item.symbol == "ETH")
      const avax = response.data.data.coins?.filter(item => item.symbol == "AVAX")
      const bnb = response.data.data.coins?.filter(item => item.symbol == "BNB")
  
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

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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

app.post('/api/saveImageToWeb3', async (req, res) => {
  const file = req.body.image
  console.log(file)

  const ext = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${ext}`
  const newFile = new File([file], fileName, {type: file.type})
  // const cid = await web3Client.put([newFile, {
  //   name: fileName
  // }])

  // const imageURI = `https://${cid}.ipfs.dweb.link/${fileName}`
  const imageURI = `https://w3s.link/ipfs/cid/${fileName}`
  return res.status(200).send({ imageURI })
})

app.get('/api/getImageFromWeb3', async(req, res) => {
  const cid = req.query.cid
  const returnFile = await web3Client.get(cid)
  console.log(returnFile)
  return res.status(200).send(`https://w3s.link/ipfs/${cid}`)

  const result = await web3Client.get(cid)
  if(!result) {
    return res.status(200).json('Not Found')
  }else {
    console.log(result)
    // const files = await res.files()
    // for(const file of files){
    //   console.log(file.cid, file.path, file.size)
    // }
    return res.status(200).send({ result })
  }
})

app.get('/api/getS3Image', async (req, res) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: req.query.filename,
  }
  const command = new GetObjectCommand(params)
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

  res.send({ url }).status(200)
})

app.post('/api/saveS3Image', upload.single('profile'), async (req, res) => {
  const address = req.body.userAddress
  // console.log(req.file.buffer)
  const imageName = 'profileImage-' + address

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)
  res.send({})
})

app.post('/api/saveS3Banner', upload.single('banner'), async (req, res) => {
  const address = req.body.userAddress
  const imageName = 'bannerImage-' + address

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)
  res.send({})
})

app.get('/api/updateListings', async (req, res) => {
  //get data from blockchain
  const sdk = new ThirdwebSDK(process.env.NEXT_PUBLIC_POLYGON_RPC_URL)
  const marketplace = sdk.getMarketplace(process.env.NEXT_PUBLIC_MARKETPLACE_ID)
  const listedItems = await marketplace.getActiveListings()

  redis.del("cache")
  redis.set("cache", JSON.stringify(listedItems))
  
  return res.status(200).json(listedItems)
})

app.get('/api/getAllListings', async (req, res) => {
  let cache = await redis.get("cache")
  cache = JSON.parse(cache)
  
  return res.status(200).json(cache)
})

app.get('/api/getLatestNfts', async (req, res) => {
  
  let cache = await redis.get("cache")
  let allArr = JSON.parse(cache)

  let nftQuantity = req.query.quantity
  let latestNfts = allArr.slice(-nftQuantity)
  let sortedNfts = latestNfts.reverse()
  
  return res.status(200).json(sortedNfts)
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

app.get('/api/topTradedCollections', async( req, res) => {
  var topCollections
  if(await redis.get("toptradedcollections") != null) {
    topCollections = await redis.get("toptradedcollections")
    return res.status(200).json(topCollections)    
  }
  else{
    const query = `*[_type == "nftCollection"][0..7] | order(volumeTraded desc) {
      "id": _id,
      name, 
      category, 
      contractAddress,
      profileImage,
      bannerImage,
      description,
      _createdAt,
      chainId,
      floorPrice,
      volumeTraded,
      "creator": createdBy->userName,
      "creatorAddress" : createdBy->walletAddress,
      "allOwners" : owners[]->
  }`
  topCollections = await config.fetch(query)
  redis.del("toptradedcollections")
  redis.set("toptradedcollections", 900, JSON.stringify(topCollections))
  return res.status(200).json(JSON.stringify(topCollections))
  }
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
app.get('/api/nft/:id', async (req, res) => {
  const nftId = req.params.id
  const nftData = await redis.get(nftId)
  res.status(200).json(nftData)
})

app.listen(8080, () => console.log('listening on 8080'))
