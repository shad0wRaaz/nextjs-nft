import React, { useState } from 'react'
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

const FeaturedItems = ({ item }) => {
    const [price, setPrice] = useState();
    const { blockchainName } = useSettingsContext()
    const design = 1;
    //get all active listings from all blockchain
  const { data: fullListingData } = useQuery(
    ['fulllistings'], 
    getFullListings(),
    {
        onSuccess: (res) => {
          // console.log(res)
            const thisItem = res.filter((nft) => nft?.asset.properties.tokenid == item?.nft?.metadata?.properties?.tokenid);
            setPrice(thisItem[0]?.buyoutCurrencyValuePerToken);
        }
    });

  return (
    <a href={`/nft/${blockchainName[item.collection.chainId]}/${item.collection.contractAddress}/${item?.id}`}>
      <div>
        <div className="p-2 rounded-xl"style={{ backgroundImage: 'linear-gradient(var(--rotate), aqua, #3c67e3 43%, #4e00c2)'}}>
          <img src={item?.nft?.metadata?.image} alt=" NFT Image" className="w-full object-cover h-[480px] object-center rounded-lg shadow-md"/>
        </div>
        <div className="relative px-4 -mt-16  ">
          <div className="backdrop-blur-xl bg-[#000000aa] p-6 rounded-lg shadow-lg">
            <div classNamess="flex items-baseline">
              {/* <div className="ml-2 uppercase text-xs font-semibold tracking-wider">
                2 baths  &bull; 3 rooms
              </div>   */}
            </div>
            
            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">{item?.nft?.metadata?.name}</h4>
            {Boolean(price) && (
              <div className="mt-1 relative">
                <span className="font-semibold text-sm !leading-none">{price?.displayValue} {price?.symbol}</span>
              </div>
            )}
            <div className="mt-4 flex space-x-2 text-neutral-100">
            <IconWallet /> <span className=" text-md font-semibold">Buy </span>
            </div>  
          </div>
        </div>
      </div>
    </a>
      
     /* <div className="rounded-xl">
    {design == 1 ? (
        <div className="featuredCard rounded-md !p-2" style={{ backgroundImage: 'linear-gradient(var(--rotate), aqua, #3c67e3 43%, #4e00c2)'}}>
          <a href={`/nft/${blockchainName[item.collection.chainId]}/${item.collection.contractAddress}/${item?.id}`}>
            <div className="relative overflow-hidden h-full rounded-md">
              <img src={item?.nft?.metadata?.image} className="object-cover rounded-t-md shadow-md"/>
              <div className="absolute left-0 bottom-0 w-full flex-grow rounded-b-md min-h-[150px] shadow-md text-white p-5 space-y-3">
                <p className="text-xl font-semibold text-left">{item?.nft?.metadata?.name}</p>
                <div className="flex items-center gap-2 pt-1 !mt-0">
                  <div className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white">
                        <img
                          className="absolute inset-0 h-full w-full cursor-pointer rounded-full object-cover"
                          src={getImagefromWeb3(item?.owner?.web3imageprofile)}
                          alt={item?.owner?.userName}
                        />
                  </div>
                  <span className="text-sm">{item?.owner?.userName}</span>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm rounded-xl inline-flex cursor-pointer gradBlue py-3 px-4 text-neutral-100 max-w-fit m-sm-auto items-center">
                      <IconWallet /> <span className="pl-2">Buy Now</span>
                  </div>
                  {Boolean(price) && (
                        <div className="flex items-baseline border-2 border-green-500 rounded-lg relative py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold ">
                            <span className="block absolute font-normal bottom-full translate-y-1 p-0.5 px-2 -mx-1 text-xs bg-green-500 text-white rounded-md">Price</span>
                            <span className=" text-green-500 !leading-none">{price?.displayValue} {price?.symbol}</span>
                        </div>
                  )}
                </div>
              </div>
            </div>
          </a>
        </div>
      ) : (
        <a href={`/nft/${blockchainName[item.collection.chainId]}/${item.collection.contractAddress}/${item?.id}`}>
            <div className="coverImage h-[485px] w-full rounded-xl relative" style={{backgroundImage : `url(${item?.nft?.metadata?.image})`, backgroundSize: 'cover'}}>
                <div className="rounded-xl absolute -bottom-[80px] hover:translate-x-20 transition p-6 px-8 w-[95%] md:w-[400px]  m-3 z-10 shadow-2xl bg-white border border-neutral-50/30 backdrop-blur-md">
                  <button className="px-3.5 flex items-center justify-center rounded-full absolute top-3 right-4 z-10 !h-9">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" fill="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <span className="text-sm text-black">{item?.likedBy?.length }</span>
                  </button>
                  <p className="text-xl font-bold  text-black">{item?.nft?.metadata?.name}</p>
                  <div className="flex items-center gap-1 pt-1">
                    <div className="wil-avatar relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white dark:ring-neutral-900">
                          <img
                            className="absolute inset-0 h-full w-full cursor-pointer rounded-full object-cover"
                            src={getImagefromWeb3(item?.owner?.web3imageprofile)}
                            alt={item?.owner?.userName}
                          />
                    </div>
                    <span className="text-black text-sm">{item?.owner?.userName}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3.5">
                    {Boolean(price) && (
                      <div className="pt-3">
                          <div className="flex items-baseline border-2 border-green-500 rounded-lg relative py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold ">
                              <span className="block absolute font-normal bottom-full translate-y-1 p-0.5 px-2 -mx-1 text-xs bg-green-500 text-white rounded-md">Price</span>
                              <span className=" text-green-500 !leading-none">{price?.displayValue} {price?.symbol}</span>
                          </div>
                      </div>
                    )}
                    <div className="pt-3">
                        <div className="text-sm rounded-xl inline-flex cursor-pointer gradBlue py-3 px-4 text-neutral-100 max-w-fit m-sm-auto items-center">
                            <IconWallet /> <span className="pl-2">Buy Now</span>
                        </div>
                    </div>
                   </div>
                </div>
            </div>
        </a>
      )}
    </div> */
  )
}

export default FeaturedItems