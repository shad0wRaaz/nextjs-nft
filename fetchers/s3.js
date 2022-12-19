import axios from 'axios'

const HOST = process.env.NODE_ENV === 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080'


//get image path from Amazon S3
export const getUnsignedImagePath = async (filename) => {
  const url = await axios.get(`${HOST}/api/getS3Image`, {
    params: { filename: filename },
  })
  return url
}

//get image path from Web3.Storage
// export const getWeb3ImagePath = async (cid) => {
//   const url = await axios.get(`${HOST}/api/getImageFromWeb3`, {
//     params: { cid: cid }
//   })
//   //return only image data
//   return url?.data
// }

export const saveImageToWeb3 = async (formdata) => {
  const imageURI = await axios.post(
    `${HOST}/api/saveweb3image`, 
    formdata,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((imageURI) => {
      return imageURI
    })
}

export const getImagefromWeb3 = (ipfsuri) => {
  const image = "https://gateway.ipfscdn.io/ipfs/" + String(ipfsuri).slice(7);
  // const image = "https://api.ipfsbrowser.com/ipfs/get.php?hash=" + String(ipfsuri).slice(7);
  // const image = "https://ipfs.io/ipfs/" + String(ipfsuri).slice(7);
  return image;
}
