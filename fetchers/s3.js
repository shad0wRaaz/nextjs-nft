import axios from 'axios'

const HOST = process.env.NODE_ENV === 'production' ? 'http://nuvanft.io:8080' : 'http://localhost:8080'


//get image path from Amazon S3
export const getUnsignedImagePath = async (filename) => {
  const url = await axios.get(`${HOST}/api/getS3Image`, {
    params: { filename: filename },
  })
  return url
}

//get image path from Web3.Storage
export const getWeb3ImagePath = async (cid) => {
  const url = await axios.get(`${HOST}/api/getImageFromWeb3`, {
    params: { cid: cid }
  })
  //return only image data
  return url?.data
}

export const saveImageToWeb3 = async (image) => {
  const imageURI = await axios.put(`${HOST}/api/saveImageToWeb3`, {
    params : {
      image: image
    }
  })
  return imageURI
}
