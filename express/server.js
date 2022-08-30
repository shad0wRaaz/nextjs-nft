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


const app = express()
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://nuvanft.io'],
  })
)

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

cron.schedule('*/60 * * * *', async() => {
  const options = {
    method: 'GET',
    url: `https://coinranking1.p.rapidapi.com/coins`,
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
      'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
    },
  }
  try{
    await axios.request(options).then(async (response) => {
      // console.log(response.data)
      const matic = response.data.data.coins?.filter(item => item.symbol == "MATIC")
      const eth = response.data.data.coins?.filter(item => item.symbol == "ETH")
      const ftx = response.data.data.coins?.filter(item => item.symbol == "FTT")
      const avax = response.data.data.coins?.filter(item => item.symbol == "AVAX")
      const bnb = response.data.data.coins?.filter(item => item.symbol == "BNB")
  
      //save all prices in database
      await config.patch(process.env.NEXT_PUBLIC_SETTING_DOCUMENT_ID)
      .set({
        maticprice : Number(parseFloat(matic[0].price).toFixed(4)),
        ethprice : Number(parseFloat(eth[0].price).toFixed(4)),
        ftxprice : Number(parseFloat(ftx[0].price).toFixed(4)),
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
  console.log(process.env.NEXT_PUBLIC_AWS_BUCKET_REGION)
  const address = req.body.userAddress
  console.log(req.file.buffer)
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

app.listen(8080, () => console.log('listening on 8080'))
