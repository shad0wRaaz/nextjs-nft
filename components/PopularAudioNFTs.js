import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import AudioNFTCard from './AudioNFTCard'
import AudioNFTCardCompact from './AudioNFTCardCompact'
import Link from 'next/link'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
    wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] mt-0',
  }

const PopularAudioNFTs = () => {
    const { dark } = useThemeContext()
    const {activeListings} = useMarketplaceContext()
    const [topTwoNFTItems, setTopTwoNFTItems] = useState([])
    const [otherThreeNFTItems, setOtherThreeNFTItems] = useState([])

    useEffect(() => {
        if(!activeListings) return
        const audioItems = activeListings.filter(item => item.asset.properties?.itemtype == "audio")
        const topItems = audioItems.slice(0,2)
        const otherItems = audioItems.slice(2, 5)
        setTopTwoNFTItems(topItems) //First two Audio Items
        setOtherThreeNFTItems(otherItems) //Another three Audio Items
    }, [activeListings])
    console.log(otherThreeNFTItems)

  return (
    <div className={dark ? 'darkGray' : 'bg-neutral-100'}>
        <div className={style.wrapper}>
            <div className="relative">
                <div className="relative flex flex-col sm:flex-row sm:items-end justify-between mb-1">
                    <div className="max-w-2xl mb-8">
                        <h2 className="flex items-center  flex-wrap  text-3xl md:text-4xl font-semibold">Popular Audio NFTs</h2>
                        <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl">Click on music icon and enjoy NTF music or audio </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 2xl:gap-8">
                    {topTwoNFTItems.length > 1 && topTwoNFTItems.map(item => (
                        <Link href="/contracts">
                            <AudioNFTCard nft={item} key={item.id} />
                        </Link>
                    ))}
                
                <div className="grid grid-rows-3 gap-6 xl:gap-8 sm:col-span-6 xl:col-span-2">
                    {otherThreeNFTItems.length > 0 && otherThreeNFTItems.map(item => (
                        <AudioNFTCardCompact nft={item} key={item.id} />
                    ))}
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default PopularAudioNFTs