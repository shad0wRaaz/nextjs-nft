
import { Rerousel } from 'rerousel';
import VideoNFTCard from './VideoNFTCard'
import React, {useState, useEffect, useRef} from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'


const PopularVideoNFTs = () => {
    const { dark } = useThemeContext()
    const { activeListings } = useMarketplaceContext()
    const sliderRef = useRef(null);
    const [topVideoItems, setTopVideoItems] = useState([])

    useEffect(() => {
        if(!activeListings) return
        const videoItems = activeListings.filter(item => item.asset.properties?.itemtype == "video" && item.asset.properties?.tokenid != null);
        setTopVideoItems(videoItems)
    }, [activeListings])

  return (
    <div className="container mx-auto lg:p-[8rem] p-[2rem] mt-0">
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between md:mb-8 gap-4">
          <div className="max-w-2xl">
              <h2 className="flex items-center  flex-wrap  text-3xl md:text-4xl font-semibold">Explore <span className="textGradRed pl-3">Video NFTs</span></h2>
              <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl">Click play and enjoy Video NFTs </span>
          </div>
      </div>
      <div class="sliderContainer" ref={sliderRef}>
        {topVideoItems.length > 0 && (
            <Rerousel itemRef={sliderRef}>
              {topVideoItems?.map((nft, index) => <VideoNFTCard key={index} nft={nft} />)}
            </Rerousel>
        )}
      </div>
    </div>
  )
}

export default PopularVideoNFTs