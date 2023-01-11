import React, {useState, useEffect} from 'react'
import noProfileImage from '../assets/noProfileImage.png'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { useThemeContext } from '../contexts/ThemeContext'
import { HiArrowSmRight, HiArrowSmLeft } from 'react-icons/hi'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import VideoNFTCard from './VideoNFTCard'
import Link from 'next/link'


const PopularVideoNFTs = () => {
    const { dark } = useThemeContext()
    const { activeListings } = useMarketplaceContext()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [topVideoItems, setTopVideoItems] = useState()
    const [sliderRef, instanceRef] = useKeenSlider(
        {
            slideChanged() {
                console.log('slide changed')
            },
            slides: {
                perView: 3,
                spacing: 30,
            },
            // breakpoints : {
            //     '(max-width: 767px)': {
            //         slides: {
            //             perView: 1,
            //             spacing: 15,
            //         }
            //     }
            // },
            initial: 0,
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel)
            },
            created() {
                setLoaded(true)
            },
        },
      )

    useEffect(() => {
        if(!activeListings) return
        const videoItems = activeListings.filter(item => item.asset.properties?.itemtype == "video" && item.asset.properties?.tokenid != null)
        setTopVideoItems(videoItems)
    }, [activeListings])

  return (
    <div className="container mx-auto lg:p-[8rem] p-[2rem] mt-0">
        <div className="relative">
            <div className="relative flex flex-col sm:flex-row sm:items-end justify-between md:mb-8 gap-4">
                <div className="max-w-2xl">
                    <h2 className="flex items-center  flex-wrap  text-3xl md:text-4xl font-semibold">Explore <span className="textGradRed pl-3">Video NFTs</span></h2>
                    <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl">Click play and enjoy Video NFTs </span>
                </div>
                <div className="navigation-controls">
                    {loaded && instanceRef.current && (
                        <div className="flex gap-4">
                            <Arrow
                            left
                            onClick={(e) =>
                                e.stopPropagation() || instanceRef.current?.prev()
                            }
                            disabled={currentSlide === 0}
                            dark={dark}
                            />

                            <Arrow
                            onClick={(e) =>
                                e.stopPropagation() || instanceRef.current?.next()
                            }
                            disabled={
                                currentSlide ===
                                instanceRef.current.track.details?.slides.length - 1
                            }
                            dark={dark}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="navigation-wrapper">
                <div ref={sliderRef} className="keen-slider py-4">
                    {topVideoItems && topVideoItems?.map((nft, index) => <VideoNFTCard key={index} nft={nft} />)}
                    {/* <div className="relative flex flex-col group keen-slider__slide h-full shadow-md rounded-3xl bg-neutral-50">
                        <div className="relative rounded-3xl overflow-hidden">
                            <div className="">
                                <div className="flex h-full w-full aspect-video flex-col z-0 items-center justify-center">
                                    <div className="flex items-center text-lg font-bold">NFT Videos <HiArrowSmRight /></div>
                                    <div>Click to view more</div>
                                </div>
                            </div>
                        </div>
                        <Link href={{
                            pathname: '/search',
                            query: {
                                c: 'all',
                                n: '',
                                i: 'false',
                                v: 'true',
                                a: 'false',
                                d: 'true',
                                ac: 'true',
                                h: 'true',
                                _r: 0,
                                r_: 100,
                            },
                            }}>
                            <a className="absolute inset-0 shadow-md" href="" draggable="true"></a>
                        </Link>
                    </div> */}
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default PopularVideoNFTs

function Arrow(props) {
    const dark = props.dark
    const disabeld = props.disabled ? " opacity-40" : ""
    return (
        <div 
            onClick={props.onClick}
            className={`border rounded-full flex justify-center items-center ${dark ? 'hover:bg-slate-600 border-slate-700' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer w-[45px] h-[45px] ${disabeld}`}>
            {props.left ? <HiArrowSmLeft fontSize={25}/> : <HiArrowSmRight fontSize={25} />}
        </div>
    )
  }