import axios from 'axios'

export const getUnsignedImagePath = async (filename) => {
  const url = await axios.get('http://localhost:8080/api/getS3Image', {
    params: { filename: filename },
  })
  return url
}
