import { useRouter } from 'next/router'
import { Tab } from '@headlessui/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { config } from '../lib/sanityClient'
import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import CollectionByCategory from '../components/CollectionByCategory'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const style = {
  wrapper: 'container mx-auto sm:px-[2rem] lg:px-[8rem]',
  pageBanner: 'py-[4rem] mb-[2rem]',
  pageTitle: 'text-4xl font-bold text-center textGradBlue',
  categoryImage: 'rounded-full ring-2 ring-white h-[40px] w-[40px]',
  categoryTitle: 'text-md p-4 px-8 rounded-full w-max',
}

const browse = () => {
  const router = useRouter();
  const { dark } = useThemeContext()
  const [categoryData, setCategoryData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchCategoryData = async (sanityClient = config) => {
    const query = `*[_type == "category"] | order(name asc) {
            name,
            totalCollection
        }`

    setCategoryData(await sanityClient.fetch(query))
  }

  useEffect(() => {
    fetchCategoryData()

    return () => {
      //just clean up codes, nothing else here
    }
  }, [])

  useEffect(() => {
    
    const param = router.query?.c
    if(!param) { return }
    console.log(param)
    if(param == 'Sports') {
      // setSelectedTab(4);
    }
    // switch(router.query.c){
    //   case 'Collectibles':
    //     setSelectedIndex(4);
    //     console.log('i changed')
    //     default:
    //       setSelectedIndex(1);
    //       console.log('i changed 00')
    // }
    return() => {
      //do nothing 
    }
  },[router.query.c])

  useEffect(() => {
      console.log(selectedTab)
  }, [selectedTab])
  useEffect(() => {
      setSelectedTab(5)
  }, [])

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
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
        <Tab.Group defaultIndex={0} onChange={setSelectedTab}>
          <Tab.List
            className={`mx-auto -mt-[55px] mb-[2rem] flex max-w-fit justify-center space-x-1 overflow-x-auto rounded-full border ${
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
                    'flex items-center justify-center space-x-2 rounded-full border-0 text-sm font-medium leading-5 focus:border-0 focus:ring-0',
                    selected
                      ? dark
                        ? ' bg-slate-600 ring-0'
                        : 'bg-sky-200 border-0 ring-0 focus-within:ring-0 focus:ring-0'
                      : dark
                      ? ' text-neutral-100 hover:bg-slate-600 hover:text-neutral-200'
                      : 'text-black ring-0 hover:bg-sky-100 hover:text-slate-600 focus:ring-0'
                  )
                }
              >
                <span className={style.categoryTitle}>{category.name}</span>
              </Tab>
            ))}
          </Tab.List>
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
