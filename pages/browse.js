import axios from 'axios'
import SEO from '../components/SEO'
import { useRouter } from 'next/router'
import { Tab } from '@headlessui/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {sortCategory} from '../utils/utilities';
import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import CollectionByCategory from '../components/CollectionByCategory'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const style = {
  wrapper: 'container mx-auto sm:px-[2rem] lg:px-[8rem]',
  pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
  pageTitle: 'text-4xl font-bold text-center text-white',
  categoryImage: 'rounded-full ring-2 ring-white h-[40px] w-[40px]',
  categoryTitle: 'text-md p-4 px-8 rounded-full w-max',
}

const browse = () => {
  const router = useRouter();
  const { c } = router.query;
  const { dark } = useThemeContext()
  const [categoryData, setCategoryData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const { HOST } = useSettingsContext();

  useEffect(() => {
    if(!c || !categoryData) return
    const index = categoryData.findIndex(category => category.name == c)
    setSelectedTab(index);
  }, [c, categoryData]);



  useEffect(() => {
    if(HOST){
      ;(async() => {
        await axios.get(`${HOST}/api/getcategories`)
          .then(result => {
            let sortedArray = sortCategory(JSON.parse(result.data));
            setCategoryData(sortedArray);
        }).catch(err => console.error(err));
      })();
  
      return () => {
        //just clean up codes, nothing else here
      }
    }
  }, [HOST])

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <SEO title="Browse NFT Collections"/>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' darkGray'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Browse NFT Collections</h2>
      </div>
      <div className={style.wrapper}>
        <Tab.Group defaultIndex={0} selectedIndex={selectedTab} onChange={setSelectedTab} manual>
          <div className="mx-[20px] mb-[2rem] ">
            <Tab.List
              className={`mx-auto -mt-[65px] flex max-w-fit md:justify-center space-x-1 overflow-x-auto rounded-full border ${
                dark
                  ? 'border-slate-600 bg-slate-700 text-white'
                  : ' border-neutral-100 bg-white'
              } p-1 shadow`}
            >
              {categoryData.map((category, id) => (
                <Tab
                  key={id}
                  data-headlessui-state=""
                  className={({ selected }) =>
                    classNames(
                      'flex items-center justify-center space-x-2 rounded-full border-0 text-sm font-medium leading-5 outline-0',
                      selected
                        ? dark
                          ? ' bg-slate-600'
                          : 'bg-sky-200'
                        : dark
                        ? ' text-neutral-100 hover:bg-slate-600 hover:text-neutral-200'
                        : 'text-black ring-0 hover:bg-sky-100 hover:text-slate-600'
                    )
                  }
                >
                  <span className={style.categoryTitle}>{category.name}</span>
                </Tab>
              ))}
            </Tab.List>
          </div>
          <Tab.Panels className="mt-2">
            {categoryData.map((category, id) => (
              <Tab.Panel
                key={id}
                className={`rounded-xl  p-[1rem] focus:outline-none`}
              >
                <CollectionByCategory categoryName={category.name} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
      <Footer />
    </div>
  )
}

export default browse
