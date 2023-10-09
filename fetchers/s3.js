import axios from 'axios';
import { ThirdwebStorage } from "@thirdweb-dev/storage";


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
  await axios.post(
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

export const getImagefromWeb3 = async (ipfsuri) => {
  if(!ipfsuri) return;
  const web3image = await axios.get(`${HOST}/api/getweb3image`, {
    params: {
      uri: ipfsuri,
    }
  })
  return web3image;


  if(ipfsuri?.startsWith("https://")) 
  {
    return ipfsuri;
  }else if(ipfsuri?.startsWith("ipfs://")){
    const image = "https://ipfs.io/ipfs/" + String(ipfsuri).slice(7);
    // const image = "https://ipfs.thirdwebcdn.com/ipfs/" + String(ipfsuri).slice(7);
    return image;
  }else{
    return ipfsuri;
  }
  
}
