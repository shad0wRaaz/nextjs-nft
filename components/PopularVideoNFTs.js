
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import VideoNFTCard from './VideoNFTCard'
import "slick-carousel/slick/slick-theme.css";
import React, {useState, useEffect} from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'

const PopularVideoNFTs = () => {
    const { dark } = useThemeContext()
    const { activeListings } = useMarketplaceContext()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [topVideoItems, setTopVideoItems] = useState([])
    var settings = {
        dots: true,
        infinite: true,
        speed: 3000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
    };
    // const [sliderRef, instanceRef] = useKeenSlider(
    //     {
    //         slideChanged() {
    //             console.log('slide changed')
    //         },
    //         slides: {
    //             perView: 3,
    //             spacing: 30,
    //         },
    //         // breakpoints : {
    //         //     '(max-width: 767px)': {
    //         //         slides: {
    //         //             perView: 1,
    //         //             spacing: 15,
    //         //         }
    //         //     }
    //         // },
    //         initial: 0,
    //         slideChanged(slider) {
    //             setCurrentSlide(slider.track.details.rel)
    //         },
    //         created() {
    //             setLoaded(true)
    //         },
    //     },
    //   )

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
                    {/* {loaded && instanceRef.current && (
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
                    )} */}
                </div>
            </div>
            <div className="popularvideowrapper">
                {/* <div ref={sliderRef} className="keen-slider py-4">
                    {topVideoItems && topVideoItems?.map((nft, index) => <VideoNFTCard key={index} nft={nft} />)}
                </div> */}
                {topVideoItems.length > 0 && (
                    <Slider {...settings}>
                        {topVideoItems?.map((nft, index) => <VideoNFTCard key={index} nft={nft} />)}
                    </Slider>
                )}
            </div>
        </div>
    </div>
  )
}

export default PopularVideoNFTs

// function Arrow(props) {
//     const dark = props.dark
//     const disabeld = props.disabled ? " opacity-40" : ""
//     return (
//         <div 
//             onClick={props.onClick}
//             className={`border rounded-full flex justify-center items-center ${dark ? 'hover:bg-slate-600 border-slate-700' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer w-[45px] h-[45px] ${disabeld}`}>
//             {props.left ? <HiArrowSmLeft fontSize={25}/> : <HiArrowSmRight fontSize={25} />}
//         </div>
//     )
//   }