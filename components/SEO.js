import React from 'react'
import Head from 'next/head'
import nuvanft from '../assets/nuvanft.png'

const SEO = ({title, quote, hashtag, image, currentUrl,sitename, description}) => {
    let seoTitle = Boolean(title) ? title + ': ' : '';
    let seoQuote = Boolean(quote) ? quote : '';
    let seoHashTag = Boolean(hashtag) ? hashtag : '#nuvanft';
    let seoCurrentUrl = Boolean(currentUrl) ? currentUrl : 'https://nuvanft.io';
    let seoSiteName = Boolean(sitename) ? sitename : 'Nuva NFT';
    let seoDescription = Boolean(description) ? description : 'Nuva NFT is one of the largest NFT marketplace integrated with Ethereum, Binance Smart Chain, Polygon and Avalanche.';
    let seoImage = Boolean(image) ? image : nuvanft.src;

  return (
    <Head>
        <title>{seoTitle + "Nuva NFT"}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
        <meta name="csrf_token" content="" />
        <link rel="icon" type="image/png" href={nuvanft.src}></link>
        <meta property="og:locale" key="og:locale" content="en_GB" />
        <meta property="og:type" key="og:type" content="website" />
        <meta property="og:title" key="og:title" content={seoTitle} />
        <meta property="og:quote" key="og:quote" content={seoQuote} />
        <meta property="og:hashtag" key="og:hashtag" content={seoHashTag} />
        <meta property="og:image" key="og:image" content={seoImage} />
        <meta property="og:url" key="og:url" content={seoCurrentUrl} />
        <meta property="og:site_name" key="og:site_name" content={seoSiteName} />
        <meta property="og:description" key="og:description" content={seoDescription} />    

        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <meta name="twitter:card" content={seoImage} />

        <meta property="type" content="website" />
        <meta property="url" content={seoCurrentUrl} />
        <meta property="image" content={seoImage} />
        <meta property="title" key="title" content={seoTitle} />
        <meta property="quote" key="quote" content={seoQuote} />

        <meta name="_token" content="" />
        <meta name="robots" content="noodp" />
      </Head>
  )
}

export default SEO