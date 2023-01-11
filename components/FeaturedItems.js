import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getFullListings } from '../fetchers/Web3Fetchers'
import { IconBNB, IconEthereum, IconPolygon } from './icons/CustomIcons'

const chainIcon = {
    '97': <IconBNB width="1.0rem" height="1.0rem" />,
    '80001': <IconPolygon width="1.0rem" height="1.0rem" />,
    '137': <IconPolygon width="1.0rem" height="1.0rem" />,
    '5': <IconEthereum width="1.0rem" height="1.0rem" />,
    '4': <IconEthereum width="1.0rem" height="1.0rem" />
  }

const FeaturedItems = ({ item }) => {
    const [price, setPrice] = useState();
    //get all active listings from all blockchain
  const { data: fullListingData } = useQuery(
    ['fulllistings'], 
    getFullListings(),
    {
        onSuccess: (res) => {
            const thisItem = res.filter((nft) => nft?.asset.properties.tokenid == item?.nft?.metadata?.properties?.tokenid);
            setPrice(thisItem[0]?.buyoutCurrencyValuePerToken);
        }
    });

  return (
    <div className="rounded-xl overflow-hidden">
        <a href={`/nfts/${item?._id}`}>
            <div className="coverImage h-[485px] w-full rounded-xl relative" style={{backgroundImage : `url(${item?.nft?.metadata?.image})`, backgroundSize: 'cover'}}>
                <div className="rounded-xl absolute bottom-0 hover:scale-110 transition p-6 px-8 w-[300px] m-3 z-10 shadow-2xl bg-white/10 border border-neutral-50/30 backdrop-blur-md">
                    <p className="text-xl text-white">{item?.nft?.metadata?.name}</p>
                    {Boolean(price) && (
                        <p className="text-md text-white">Price: {price?.displayValue} {price?.symbol}</p>
                    )}
                </div>
            </div>
        </a>
    </div>
  )
}

export default FeaturedItems