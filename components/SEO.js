import React from 'react'
import Head from 'next/head'


const SEO = ({title, quote, hashtag, image, currentUrl, sitename, description}) => {
    let seoTitle = Boolean(title) ? title + ': ' : '';
    let seoQuote = Boolean(quote) ? quote : '';
    let seoHashTag = Boolean(hashtag) ? hashtag : '#nuvanft';
    let seoCurrentUrl = Boolean(currentUrl) ? currentUrl : 'https://nuvanft.io';
    let seoSiteName = Boolean(sitename) ? sitename : 'Nuva NFT';
    let seoDescription = Boolean(description) ? description : 'Nuva NFT is one of the largest NFT marketplace integrated with Ethereum, Binance Smart Chain, Polygon and Avalanche.';
    let seoImage = Boolean(image) ? image : 'https://nuvanft.io/assets/nuvanft.png';

  return (
    <Head>
        <title>{seoTitle + "Nuva NFT"}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
        <meta name="csrf_token" content="" />

        <meta property="og:title" content={seoTitle + "Nuva NFT"} />
        <meta property="og:description" content={seoDescription} />    
        <meta property="og:url" content={seoCurrentUrl} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:site_name" content={seoSiteName} />
        <meta property="og:hashtag" content={seoHashTag} />
        <meta property="og:locale" content="en_GB" />

        <meta name="twitter:title" content={seoTitle + "Nuva NFT"} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <meta name="twitter:card" content={seoImage} />

        <meta property="type" content="website" />
        <meta property="url" content={seoCurrentUrl} />
        <meta property="image" content={seoImage} />
        <meta property="title" key="title" content={seoTitle + "Nuva NFT"} />
        <meta property="quote" key="quote" content={seoQuote} />

        <meta name="_token" content="" />
        <meta name="robots" content="noodp" />
        <link rel="icon" type="image/png" href="https://nuvanft.io/assets/nuvanft.png"></link>
      </Head>
  )
}

export default SEO