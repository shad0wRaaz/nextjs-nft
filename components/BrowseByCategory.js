import axios from 'axios';
import Link from 'next/link'
import { Rerousel } from 'rerousel';
import { config } from '../lib/sanityClient'
import {sortCategory} from '../utils/utilities';
import { getImagefromWeb3 } from '../fetchers/s3'
import React, { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext';

const style = {
  wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pb-0 overflow-hidden',
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

const BrowseByCategory = () => {
  const sliderRef = useRef(null);
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
        <div ref={sliderRef}>
          {categoryData.length > 0 && (
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
