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

const app = express()
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://nuvanft.io'],
  })
)

dotenv.config()

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex')

const s3BucketName = 'nuvanft'
const s3BucketRegion = 'eu-west-2'
const s3AccessKey = 'AKIA4B5XZ7FBATGSZFK6'
const s3SecretKey = '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'

// const s3BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
// const s3BucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION
// const s3AccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY
// const s3SecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
  region: 'eu-west-2',
})

const config = sanityClient({
  projectId: 'ugh5vm1v',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
    'skVSEOqGcxVgsIPK9zjcltFDqU235c1ToyzTJauO9qrZxrJoUChMB7QVfo5RvhZyPInSRYMZxbOxcmctZMCDxyaNkSSkDfVA1OGYMLDQy40CVnea1AMlmKAdxgk7laYgxu2DVuMdZLq3kf2px9yBKWoXfXgmGGyuiFEAUAAWkNkKM42MTyzS',
  useCdn: false,
  ignoreBrowserTokenWarning: true,
})

// import sanityClient from '@sanity/client'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// const sanity = new sanityClient()

app.get('/api/getS3Image', async (req, res) => {
  // console.log('req.params', req.query.filename)
  const params = {
    Bucket: s3BucketName,
    Key: req.query.filename,
  }
  const command = new GetObjectCommand(params)
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

  res.send({ url }).status(200)
})

app.post('/api/saveS3Image', upload.single('profile'), async (req, res) => {
  const address = req.body.userAddress
  // const imageName = randomImageName() + '-' + req.file.originalname
  const imageName = 'profileImage-' + address

  const params = {
    Bucket: s3BucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)

  // //saving image name in database
  // await config
  //   .patch(address)
  //   .set({
  //     profileImage: imageName,
  //   })
  //   .commit()

  res.send({})
})

app.post('/api/saveS3Banner', upload.single('banner'), async (req, res) => {
  const address = req.body.userAddress
  // const imageName = randomImageName() + '-' + req.file.originalname
  const imageName = 'bannerImage-' + address

  const params = {
    Bucket: s3BucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)

  //saving image name in database
  // await config
  //   .patch(address)
  //   .set({
  //     bannerImage: imageName,
  //   })
  //   .commit()

  res.send({})
})

app.listen(8080, () => console.log('listening on 8080'))
