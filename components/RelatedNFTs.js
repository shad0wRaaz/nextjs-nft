import { useUserContext } from '../contexts/UserContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { useState, useEffect, useMemo } from 'react'
import SearchItem from './SearchItem'


const style= {
    container: 'container p-6 my-[4rem] mx-auto relative sm:px[2rem] lg:px-[8rem]',
    headTitle: 'text-center py-3 px-8 bg-slate-600 text-white w-fit rounded-full mx-auto z-10 relative',
    divider: 'h-[1px] w-full  z-1 relative -mt-6',
    nftContainer: 'mt-[4rem] rounded-3xl p-[4rem]',
    nftWrapper: 'grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 mt-[4rem]',
    buttonContainer: 'mt-[4rem] flex justify-center items-center',
    btnRefresh: 'rounded-xl p-3 px-6 gradBlue text-white'
}
const RelatedNFTs = ({collection}) => {
    const { dark } = useThemeContext()
    const { activeListings } = useMarketplaceContext()
    const [relatedItems, setRelatedItems] = useState()

    useEffect(() => {
      if(!activeListings) return
      // const filtered = activeListings.filter(item => item.assetContractAddress == collection.contractAddress)
      //set 4 items randomly
      getRandomItems();
    }, [activeListings])

    const getRandomItems = () => {
      if(!activeListings) return
      const filtered = activeListings.filter(item => item.assetContractAddress == collection?.contractAddress)
      
      if(filtered.length > 0) {
        var randomItems = []
  
        for(var i = 0; i < 4; i++){
          var idx = Math.floor(Math.random() * filtered.length)
          randomItems.push(filtered[idx])
          filtered.splice(idx,1) //remove selected item from the array so it wont be selected again
        }

        //removing undefined elements from the array
        const noUndefined = randomItems.filter((item) => item != undefined)
        
        if(noUndefined.length > 0) {
          setRelatedItems(noUndefined)
        }
      }
    }

  return (
    <div className={style.container}>
      <div className={style.nftContainer.concat(dark ? ' bg-slate-800': ' bg-slate-100')}>
        <h2 className={style.headTitle}>More NFTs from {collection?.name}</h2>
        <div className={style.divider.concat(dark ? ' bg-slate-700' : ' bg-slate-300')}></div>
        <div className={style.nftWrapper}>
          {!relatedItems || relatedItems.length == 0 && ('No NFTs available')}
          {relatedItems && relatedItems.length > 0 && relatedItems.map((item, index) => (
            item?.owner != '0x0000000000000000000000000000000000000000' && <SearchItem key={index} nftItem={item} />  
          ))}
        </div>
        <div className={style.buttonContainer}>
          {relatedItems && relatedItems.length > 0 && (
            <button onClick={() => getRandomItems()} className={style.btnRefresh}>Reload</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RelatedNFTs