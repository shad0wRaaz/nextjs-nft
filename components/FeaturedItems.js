import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getImagefromWeb3 } from '../fetchers/s3'
import { getFullListings } from '../fetchers/Web3Fetchers'
import { useSettingsContext } from '../contexts/SettingsContext'
import { IconAvalanche, IconBNB, IconEthereum, IconPolygon, IconWallet } from './icons/CustomIcons'

const chainIcon = {
    '97': <IconBNB width="1.0rem" height="1.0rem" />,
    '56': <IconBNB width="1.0rem" height="1.0rem" />,
    '80001': <IconPolygon width="1.0rem" height="1.0rem" />,
    '137': <IconPolygon width="1.0rem" height="1.0rem" />,
    '5': <IconEthereum width="1.0rem" height="1.0rem" />,
    '4': <IconEthereum width="1.0rem" height="1.0rem" />,
    '43113': <IconAvalanche width="1.0rem" height="1.0rem" />,
    '43114': <IconAvalanche width="1.0rem" height="1.0rem" />,
  }

const FeaturedItems = ({ item, allFeatured }) => {
    const { blockchainName } = useSettingsContext();
    const design = 1;
    const [thisItem, setThisItem] = useState();
    
    useEffect(() => {
      if(!item || !allFeatured) return
        const thisItem = allFeatured.filter(nft => nft?.id == item?.asset?.id && nft?.collection?.contractAddress == item?.assetContractAddress)
        setThisItem(thisItem[0]);

      return() => {
        //do nothing, clean up function
      }
    }, [item])
  
  return (
    <a href={`/nft/${blockchainName[thisItem?.collection?.chainId]}/${item.assetContractAddress}/${item?.asset?.id}`}>
      <div>
        <div className="p-2 rounded-xl"style={{ backgroundImage: 'linear-gradient(var(--rotate), aqua, #3c67e3 43%, #4e00c2)'}}>
          <img src={getImagefromWeb3(item?.asset?.image)} alt=" NFT Image" className="w-full object-cover h-[480px] object-center rounded-lg shadow-md"/>
        </div>
        <div className="relative px-4 -mt-16  ">
          <div className="backdrop-blur-xl bg-[#000000aa] p-6 rounded-lg shadow-lg">
            <div className="flex items-baseline">
            </div>
            
            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">{item?.asset?.name}</h4>
              <div className="mt-1 relative">
                <span className="font-semibold text-sm !leading-none">{item?.buyoutCurrencyValuePerToken?.displayValue} {item?.buyoutCurrencyValuePerToken?.symbol}</span>
              </div>
            <div className="mt-4 flex space-x-2 text-neutral-100">
            <IconWallet /> <span className=" text-md font-semibold">Buy </span>
            </div>  
          </div>
        </div>
      </div>
    </a>

  )
}

export default FeaturedItems