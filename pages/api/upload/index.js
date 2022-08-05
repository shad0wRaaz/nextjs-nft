import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { uploadFile } from '../../s3'

let filename = uuidv4() + '-' + new Date().getTime()

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads', // destination folder
    filename: (req, file, cb) => cb(null, getFileName(file)),
  }),
})

const getFileName = (file) => {
  filename +=
    '.' +
    file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1,
      file.originalname.length
    )
  return filename
}
