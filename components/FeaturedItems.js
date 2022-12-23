import Tilt from 'react-parallax-tilt'
import React, { useEffect, useState } from 'react'
import { useContract, useNFT } from '@thirdweb-dev/react'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { IconBNB, IconEthereum, IconPolygon } from './icons/CustomIcons'

const chainIcon = {
    '97': <IconBNB width="1.0rem" height="1.0rem" />,
    '80001': <IconPolygon width="1.0rem" height="1.0rem" />,
    '137': <IconPolygon width="1.0rem" height="1.0rem" />,
    '5': <IconEthereum width="1.0rem" height="1.0rem" />,
    '4': <IconEthereum width="1.0rem" height="1.0rem" />
  }

const FeaturedItems = ({ item, id }) => {

    const { contract } = useContract(item.collection?.contractAddress);
    const {data:nft, isLoading, error} = useNFT(contract, item.nftitem.id);
    const {activeListings} = useMarketplaceContext();
    const [price, setPrice] = useState();

    useEffect(() => {
        if(!activeListings) return
        const thisItem = activeListings.filter((nft) => nft?.asset.properties.tokenid == item.nftitem?._id)

        setPrice(thisItem[0].buyoutCurrencyValuePerToken);
        return() => {
            // do nothing
        }
    }, [activeListings])
  return (
    <div className="rounded-xl overflow-hidden">
        {isLoading ? (
            'Loading'
            ) : (
                <a href={`/nfts/${item.nftitem?._id}`}>
                    <div className="coverImage h-[485px] rounded-xl relative" style={{backgroundImage : `url(${nft?.metadata.image})`, backgroundSize: 'cover'}}>
                        <div className="rounded-xl absolute bottom-0 hover:scale-110 transition p-6 px-8 w-[300px] m-3 z-10 shadow-2xl bg-white/10 border border-neutral-50/30 backdrop-blur-md">
                            <p className="text-3xl text-white">{item.nftitem.name}</p>
                            {Boolean(price) && (
                                <p className="text-md text-white">Price: {price?.displayValue} {price?.symbol}</p>
                            )}
                        </div>
                    </div>
                    {/* <img src={nft?.metadata.image} className="rounded-2xl object-cover w-full" /> */}
                </a>

        )}
    </div>
  )
}

export default FeaturedItems