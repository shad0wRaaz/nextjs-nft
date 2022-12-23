import Link from 'next/link'
import Image from 'next/image'
import Slider from 'react-slick'
import { config } from '../lib/sanityClient'
import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { HiArrowSmRight, HiArrowSmLeft } from 'react-icons/hi'
import { getImagefromWeb3 } from '../fetchers/s3'

const style = {
  wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-0 lg:pb-0 overflow-hidden',
  container: 'text-white browseWrapper md:p-[4rem] rounded-3xl ',
  title: `font-bold text-[2rem] flex justify-between items-center text-center mb-[2rem]`,
  contentWrapper:
    'flex justify-center items-center flex-row flex-nowrap gap-[20px]',
  content:
    'bg-white p-[30px] rounded-xl flex justify-center flex-col items-center',
  contentTitle: 'text-lg font-bold mb-2',
  contentDescription: 'text-md px-[25px]',
  collectionCard: 'm-[20px]  hover:opacity-90',
  collectionCardName: 'font-bold cursor-pointer p-4 pl-0 flex gap-3',
  imageContainer: 'h-[160px] w-[215px] rounded-3xl overflow-hidden relative',
  controls: 'flex gap-4 text-slate-500 cursor-pointer transition',
}

const settings = {
  dots: false,
  infinite: true,
  speed: 3000,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow:1,
        slidesToScroll: 1
      }
    }
  ]
};

const BrowseByCategory = () => {
  // const glideTrack = useRef(0)
  // const slide = useRef(0)
  const [categoryData, setCategoryData] = useState([])
  const { dark } = useThemeContext()

  const fetchCategoryData = async (sanityClient = config) => {
    const query = `*[_type == "category"] | order(totalCollection desc) {
            name,
            profileImage,
            bannerImage,
            totalCollection
        }`
    setCategoryData(await sanityClient.fetch(query))
  }

  useEffect(() => {
    fetchCategoryData()

    return() =>{
      //do nothing
    }
  }, [])

  const randomCircle = (id) => {
    const defaultStyles = 'h-[40px] w-[40px] rounded-full'
    switch (id) {
      case 0:
        return defaultStyles.concat(' bg-blue-500')
      case 1:
        return defaultStyles.concat(' bg-green-500')
      case 2:
        return defaultStyles.concat(' bg-red-500')
      case 3:
        return defaultStyles.concat(' bg-yellow-500')
      case 4:
        return defaultStyles.concat(' bg-purple-500')
      case 5:
        return defaultStyles.concat(' bg-pink-500')
      case 6:
        return defaultStyles.concat(' bg-blue-500')
      default:
        return defaultStyles.concat(' bg-slate-500')
    }
  }

  // function moveLeft() {
  //   if (slide.current <= -800) return
  //   slide.current = slide.current - 800
  //   glideTrack.current.style.transform = `translate(${slide.current}px)`
  // }
  // function moveRight() {
  //   if (slide.current == 0) return
  //   slide.current = slide.current + 800
  //   glideTrack.current.style.transform = `translate(${slide.current}px)`
  // }

  return (
    <div className={style.wrapper}>
      <div
        className={
          dark
            ? style.container + ' darkGray'
            : style.container + ' bg-[#f5f6f8]'
        }
      >
        <h2 className={dark ? style.title : style.title + ' text-black'}>
          <span>
            Browse <span className="textGradBlue">Collections</span> by Category
          </span>
          {/* <div className={style.controls}>
            <HiArrowSmLeft
              fontSize="25px"
              onClick={moveLeft}
              className="transition hover:scale-125"
            />
            <HiArrowSmRight
              fontSize="25px"
              onClick={moveRight}
              className="transition hover:scale-125"
            />
          </div> */}
        </h2>

        {categoryData && (
          <Slider {...settings} className="browsebycategory">
            {categoryData.map((category, id) => (

              <div key={id} className="relative">
                <Link href={`/browse/?c=${category?.name}`}>
                  <div className={style.collectionCard}>
                    <div className={style.imageContainer}>
                      <img
                        src={getImagefromWeb3(category.profileImage)}
                        className="h-[160px] w-[100%] cursor-pointer object-cover transition hover:scale-125"
                      />
                    </div>
                    <div className={style.collectionCardName}>
                      <div className={randomCircle(id)}></div>
                      <div>
                        <p className={`${!dark && ' text-black'}`}>
                          {category?.name}
                        </p>
                        <span className="text-sm font-normal text-slate-500">
                          {category?.totalCollection} Collections{' '}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
        {/* <div className="translate-x-[-15px] overflow-hidden " style={{display: 'none'}}>
          <div
            ref={glideTrack}
            className="linear duration-600 flex translate-x-0 flex-row justify-start transition"
          >
            {categoryData.map((category, id) => (
              <div key={id} className="relative">
                <Link href={`/browse/?c=${category?.name}`}>
                  <div className={style.collectionCard}>
                    <div className={style.imageContainer}>
                      <img
                        src={getImagefromWeb3(category.profileImage)}
                        className="h-[160px] w-[100%] cursor-pointer object-cover transition hover:scale-125"
                      />
                    </div>
                    <div className={style.collectionCardName}>
                      <div className={randomCircle(id)}></div>
                      <div>
                        <p className={`${!dark && ' text-black'}`}>
                          {category?.name}
                        </p>
                        <span className="text-sm font-normal text-slate-500">
                          {category?.totalCollection} Collections{' '}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default BrowseByCategory
