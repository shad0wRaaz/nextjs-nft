import Link from 'next/link'
import { Rerousel } from 'rerousel';
import { config } from '../lib/sanityClient'
import { getImagefromWeb3 } from '../fetchers/s3'
import React, { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-0 lg:pb-0 overflow-hidden',
  container: 'text-white browseWrapper p-[2rem] md:p-[4rem] rounded-3xl ',
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
  speed: 800,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow:1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow:2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1400,
      settings: {
        slidesToShow:3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 2000,
      settings: {
        slidesToShow:4,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 3800,
      settings: {
        slidesToShow:5,
        slidesToScroll: 1
      }
    }
  ]
};

const BrowseByCategory = () => {
  const sliderRef = useRef(null);
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
  }, []);

  const randomCircle = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-slate-500'];

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
        </h2>
        <div ref={sliderRef}>
          {categoryData && (
            <Rerousel className="browsebycategory" itemRef={sliderRef}>
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
                        <div className={`h-[40px] w-[40px] rounded-full ${randomCircle[id]}`}></div>
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
            </Rerousel>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowseByCategory
