import axios from 'axios';
import Link from 'next/link'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import {sortCategory} from '../utils/utilities';
import { getImagefromWeb3 } from '../fetchers/s3'
import React, { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext';

const style = {
  wrapper: 'container mx-auto lg:p-[8rem] p-[1.2rem] lg:pb-0 overflow-hidden',
  container: 'text-white browseWrapper p-[2rem] md:p-[4rem] rounded-xl ',
  title: `font-bold text-[2rem] flex justify-between items-center text-center mb-[2rem]`,
  contentWrapper:
    'flex justify-center items-center flex-row flex-nowrap gap-[20px]',
  content:
    'bg-white p-[30px] rounded-xl flex justify-center flex-col items-center',
  contentTitle: 'text-lg font-bold mb-2',
  contentDescription: 'text-md px-[25px]',
  collectionCard: 'hover:opacity-90 rounded-2xl overflow-hidden',
  collectionCardName: 'font-bold cursor-pointer p-4 pl-0 flex gap-3',
  imageContainer: 'h-[160px] w-[215px] rounded-3xl overflow-hidden relative',
  controls: 'flex gap-4 text-slate-500 cursor-pointer transition',
}

const BrowseByCategory = () => {
  const animation = { duration: 15000, easing: (t) => t }
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    breakpoints: {
      "(min-width: 300px)": {
        slides: { perView: 1, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 20 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 5, spacing: 20 },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    mode: 'free-snap',
  });
  const [categoryData, setCategoryData] = useState([]);
  const { dark } = useThemeContext();
  const { HOST } = useSettingsContext();


  useEffect(() => {
    // fetchCategoryData()
    ;(async() => {
      await axios.get(`${HOST}/api/getcategories`).then(result => {
        setCategoryData(sortCategory(JSON.parse(result.data)))
      }).catch(err => console.error(err));
    })();

    return() =>{
      //do nothing
    }
  }, [HOST]);

  const randomCircle = ['bg-indigo-500', 'bg-cyan-500', 'bg-teal-500', 'bg-lime-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-slate-500', ];

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
          {categoryData.length > 0 && (
            <div ref={sliderRef} className="keen-slider">
              {categoryData.map((category, id) => (

                <div className="keen-slider__slide" key={id}>
                  <Link href={`/browse/?c=${category?.name}`}>
                    <div className={style.collectionCard}>
                        <img
                          src={getImagefromWeb3(category.profileImage)}
                          className="m-0 rounded-2xl h-[160px] w-[300px] md:w-[220px] cursor-pointer object-cover transition"
                        />
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
            </div>
          )}
      </div>
    </div>
  )
}

export default BrowseByCategory
