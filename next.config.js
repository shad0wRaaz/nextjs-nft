/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: {
    domains: [
      'chisnghiax.com',
      'cloudflare-ipfs.com',
      'via.placeholder.com',
      'cdn.sanity.io',
      'user-images.githubusercontent.com',
      'gateway.ipfscdn.io',
      'localhost:3000',
      'nuvanft.io',
      'nuvanft.s3.eu-west-2.amazonaws.com',
    ],
    // loader: 'imgix',
    // path: '/',
  },
}
/** **/
