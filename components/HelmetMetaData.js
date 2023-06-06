import React from 'react'
import { Helmet } from 'react-helmet'
import nuvanft from '../assets/nuvanft.png'
import { getImagefromWeb3 } from '../fetchers/s3'

const HelmetMetaData = (props) => {

    let tokenId = props.tokenId != undefined ? props.tokenId : ""
    let currentUrl = "https://nuvanft.io/nfts/" + tokenId;
    let quote = props.quote != undefined ? props.quote : "";
    let title = props.title != undefined ? props.title : "Nuva NFT - A Multichain NFT Marketplace";
    let image = props.image != undefined ? getImagefromWeb3(props.image) : nuvanft.src;
    let description = props.description != undefined ? props.description  : "Nuva NFT is one of the largest NFT marketplace integrated with Ethereum, Binance Smart Chain, Polygon and Avalanche.";
    let hashtag = props.hashtag != undefined ? props.hashtag : "#nuvanft";

  return (
    <Helmet>
        <title>{title} - Nuva NFTs</title>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="csrf_token" content="" />
        <meta property="type" content="website" />
        <meta property="url" content={currentUrl} />
        <meta property="image" content={image} />
        <meta property="title" key="title" content={title} />
        <meta property="quote" key="quote" content={quote} />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="_token" content="" />
        <meta name="robots" content="noodp" />


        <meta property="og:locale" key="og:locale" content="en_GB" />
        <meta property="og:type" key="og:type" content="website" />
        <meta property="og:title" key="og:title" content={title} />
        <meta property="og:quote" key="og:quote" content={quote} />
        <meta property="og:hashtag" key="og:hashtag" content={hashtag} />
        <meta property="og:image" key="og:image" content={image} />
        <meta property="og:url" key="og:url" content={currentUrl} />
        <meta property="og:site_name" key="og:site_name" content="Nuva NFT" />
        <meta property="og:description" key="og:description" content={description} />    

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content={image} />
    </Helmet>
  )
}

export default HelmetMetaData