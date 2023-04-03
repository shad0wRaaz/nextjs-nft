import React from 'react'
import { Helmet } from 'react-helmet'
import nuvanft from '../assets/nuvanft.png'

const HelmetMetaData = (props) => {

    let tokenId = props.tokenId != undefined ? props.tokenId : ""
    let currentUrl = "https://nuvanft.io/nfts/" + tokenId;
    let quote = props.quote != undefined ? props.quote : "";
    let title = props.title != undefined ? props.title : "Nuva NFT - A Multichain NFT Marketplace";
    let image = props.image != undefined ? props.image : nuvanft.src;
    let description = props.description != undefined ? props.description  : "Nuva Nft is one of the largest NFT marketplace out there in the defi market.";
    let hashtag = props.hashtag != undefined ? props.hashtag : "#nuvanft";
    // console.log(title, description)
  return (
    <Helmet>
        <title>{title} - Nuva NFT</title>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="csrf_token" content="" />
        <meta property="type" content="website" />
        <meta property="url" content={currentUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="_token" content="" />
        <meta name="robots" content="noodp" />
        <meta property="title" content={title} />
        <meta property="quote" content={quote} />
        <meta name="description" content={description} />
        <meta property="image" content={image} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:quote" content={quote} />
        <meta property="og:hashtag" content={hashtag} />
        <meta property="og:image" content={image} />
        <meta content="image/*" property="og:image:type" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Nuva NFT" />
        <meta property="og:description" content={description} />    

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content={image} />
    </Helmet>
  )
}

export default HelmetMetaData