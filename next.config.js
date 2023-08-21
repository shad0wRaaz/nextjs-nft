/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  i18n: {
    locales: ["en-gb"],
    defaultLocale: "en-gb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // loader: 'imgix',
    // path: '/',
  },
}
/** **/
