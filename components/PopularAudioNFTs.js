import { useRouter } from 'next/router'
import AudioNFTCard from './AudioNFTCard'
import { config } from '../lib/sanityClient'
import React, { useEffect, useState } from 'react'
import AudioNFTCardCompact from './AudioNFTCardCompact'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import axios from 'axios'
import { useSettingsContext } from '../contexts/SettingsContext'
import toast from 'react-hot-toast'

const style = {
    wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] mt-0 z-0 relative',
  }

const PopularAudioNFTs = () => {
    const { dark, errorToastStyle } = useThemeContext();
    const { HOST } = useSettingsContext();
    const {activeListings, selectedBlockchain} = useMarketplaceContext()
    const [topTwoNFTItems, setTopTwoNFTItems] = useState([])
    const [otherThreeNFTItems, setOtherThreeNFTItems] = useState([])
    const router = useRouter();

    useEffect(() => {
        ;(async () => {
            await axios.get(`${HOST}/api/popularaudionfts/${selectedBlockchain}`).then(result => {
                const popularItems = JSON.parse(result.data);
                setTopTwoNFTItems(popularItems.topItems);
                setOtherThreeNFTItems(popularItems.otherItems);
                // console.log(popularItems)
            }).catch(err => {
                toast.error('Error getting Popular Audio NFTs', errorToastStyle);
            });
        })();
        // if(!activeListings) return
        // const audioItems = activeListings.filter(item => item.asset.properties?.itemtype == "audio" && item.asset.properties?.tokenid != null)
        // const tempList = audioItems.map(async (item) => {
        //     var obj = { ...item };
        //     const query = `*[_type == "nftItem" && _id == "${item.asset?.properties.tokenid}"] {"likers":count(likedBy)}`;
        //     const result = await config.fetch(query);

        //     if(result[0].likers){
        //         obj['likedBy'] = result[0].likers;
        //     }else {
        //         obj['likedBy'] = 0;
        //     }
        //     return obj;
        // });
        // ;(async () => {
        //     const updatedList = await Promise.all(tempList);
        //     //sort out the array based on number of likers

        //     const sortedList = updatedList.sort((a,b) => { return (b.likedBy - a.likedBy)});
        //     if(audioItems.length < 2) {
        //         setTopTwoNFTItems(sortedList)
        //     }
        //     else {
        //         const topItems = sortedList.slice(0,2)
        //         const otherItems = sortedList.slice(2, 5)
        //         setTopTwoNFTItems(topItems) //First two Audio Items
        //         setOtherThreeNFTItems(otherItems) //Another three Audio Items
        //     }
        // })()
        return() => {
            //do nothing
        }
    }, [activeListings])

  return (
    <div className={dark ? 'darkGray' : 'bg-neutral-100'}>
        <div className={style.wrapper}>
            <div className="relative">
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <div className="max-w-2xl mb-8">
                        <h2 className="flex items-center  flex-wrap  text-3xl md:text-4xl font-semibold ">Popular <span className="textGradGreen pl-3"> Audio NFTs</span></h2>
                        <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl">Click on music icon and enjoy NFT music or audio </span>
                    </div>
                    <div 
                        className="text-sm rounded-full cursor-pointer gradBlue py-2 px-4 text-neutral-100 max-w-fit mb-4 m-sm-auto" 
                        onClick={() => {
                            router.push({
                            pathname: '/search',
                            query: {
                                c: 'all',
                                n: '',
                                i: 'false',
                                v: 'false',
                                a: 'true',
                                d: 'true',
                                ac: 'true',
                                h: 'true',
                                _r: 0,
                                r_: 10000,
                            },
                            })
                        }}>View All</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 2xl:gap-8">
                    {topTwoNFTItems.length > 0 && topTwoNFTItems.map(item => (
                        <AudioNFTCard nft={item} key={item.id}/>
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