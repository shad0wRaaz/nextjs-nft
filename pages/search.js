import axios from 'axios'
import { ethers } from 'ethers'
import { BigNumber } from 'ethers'
import 'rc-slider/assets/index.css'
import SEO from '../components/SEO'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Loader from '../components/Loader'
import Slider, { Range } from 'rc-slider'
import Footer from '../components/Footer'
import ReactPaginate from 'react-paginate'
import NFTItem from '../components/NFTItem'
import { config } from '../lib/sanityClient'
import { FiArrowRight } from 'react-icons/fi'
import { RiRefreshLine } from 'react-icons/ri'
import SearchItem from '../components/SearchItem'
import { useEffect, useState, Fragment } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { Menu, Transition, Switch } from '@headlessui/react'
import { useSettingsContext } from '../contexts/SettingsContext'
import { BsChevronDown, BsGrid, BsGrid3X3Gap } from 'react-icons/bs'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { HiChevronDown, HiOutlineRefresh, HiOutlineViewGrid } from 'react-icons/hi'
import { IconBulb, IconExchange, IconFilter, IconImage, IconSearch, IconWallet} from '../components/icons/CustomIcons'

const search = ({category}) => {
  const { dark } = useThemeContext()
  const [showFilter, setShowFilter] = useState(true)
  const { activeListings, selectedBlockchain } = useMarketplaceContext()
  const router = useRouter();
  const { HOST } = useSettingsContext();
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [itemName, setItemName] = useState('')
  const [includeImage, setIncludeImage] = useState(true)
  const [includeVideo, setIncludeVideo] = useState(true)
  const [includeAudio, setIncludeAudio] = useState(true)
  const [includeAuction, setIncludeAuction] = useState(true)
  const [includeDirect, setIncludeDirect] = useState(true)
  const [includeHasOffers, setIncludeHasOffers] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortAsc, setSortAsc] = useState(true)
  const [filteredListings, setFilteredListings] = useState()
  const [loading, setLoading] = useState(false);
  //variables for pagination
  // const [itemsPerPage, setItemsPerPage] = useState(4)
  const [currentItems, setCurrentItems] = useState(null)
  // const [pageCount, setPageCount] = useState(0)
  // const [itemOffset, setItemOffset] = useState(0)
  const [compact, setCompact] = useState(true);

  const style = {
    wrapper: ' max-w-[1000px] mx-auto mt-[4rem] p-[2rem] pb-[4rem] rounded-xl',
    pageBanner: 'py-[4rem] mb-[2rem] gradSky',
    pageTitle: 'text-4xl text-center text-black font-bold my-4 textGradBlue',
    contractsWrapper: 'flex flex-wrap justify-center gap-[40px] pt-4',
    contractItem:
      'flex justify-center flex-col text-center hover:opacity-80 cursor-pointer py-[2rem] px-[1rem] md:w-1/3 sm:w-full flex justify-start rounded-xl border',
    contractItemIcon: 'mb-[1rem] text-5xl mx-auto',
    contractTitle: 'font-bold text-xl mb-2',
    contractDescription: 'text-sm',
    canvasMenu: 'bg-[#0f172a] h-[100vh] shadow-xl px-[2rem] overflow-y-scroll',
    blur: 'filter: blur(1px)',
    smallText: 'text-sm text-center mb-[2rem]',
    noPointer: ' pointer-events-none',
    nftwrapper: `mb-8 grid ${compact ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}`,
    closeButton:
      'sticky top-3 transition duration-[300] top-[20px] left-[100%] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70',
  }

  // useEffect(() => {
  //   if (!filteredListings) return
  //   const endOffset = itemOffset + itemsPerPage;
  //   setCurrentItems(filteredListings.slice(itemOffset, endOffset));
  //   setPageCount(Math.ceil(filteredListings.length / itemsPerPage));
  // }, [itemOffset, itemsPerPage, filteredListings])

  // const handlePageClick = (event) => {
  //   const newOffset = (event.selected * itemsPerPage) % filteredListings.length;
  //   setItemOffset(newOffset);

  //   return() => {
  //     //nothing, just clean up codes
  //   }
  // }
  
  useEffect(() => {
    ;(async() => {
      const query = `*[_type == "category"] {name}`;
      const res = await config.fetch(query);
      setCategories(res);
    })()
    
    return() => {
      //nothing, just clean up codes
    }
  }, [])

  const searchNFTs = async() => {
    try{
      setLoading(true);
      setCurrentItems([])
      const {data} = await axios.get(`${HOST}/api/mango/${selectedBlockchain}/search/`, {
        params: {
          minPrice: priceRange[0], 
          maxPrice: priceRange[1], 
          direct: includeDirect, 
          auction: includeAuction,
          category: selectedCategory,
          image: includeImage,
          video: includeVideo,
          audio: includeAudio,
          name: itemName,
          limit: 100,
        }
      });
      setFilteredListings(data); //this will be base search data //without filter
      setCurrentItems(data); //this will be current data with / without filter
      setLoading(false);
    }catch(err){
      setLoading(false);
    }
  }


  useEffect(() => {
    const data = router.query

    setItemName(data?.n ? data?.n : '');
    setSelectedCategory(curVal => data?.c ? data.c : curVal);
    setIncludeImage(curval => data?.i === 'true' ? true : curval);
    setIncludeVideo(curval => data?.v === 'true' ? true : curval);
    setIncludeAudio(curval => data?.a === 'true' ? true : curval);
    setIncludeAuction(curval => data?.ac === 'true' ? true : curval);
    setIncludeDirect(curval =>data?.d === 'true' ? true : curval);
    setIncludeHasOffers(curval => data?.h === 'true' ? true : curval);
    setPriceRange([data?._r ? data._r : 0, data?.r_ ? data.r_ : 10000]);

    searchNFTs();
    return() => {
      //nothing, just clean up codes
    }
  }, [router.query])

  useEffect(() => {
    searchNFTs();
  }, [selectedBlockchain, selectedCategory])

  useEffect(() => {
    if(!filteredListings) return
    let data = [];

    //sort item according to their price in selected order
    if (sortAsc) {
      data = filteredListings.sort(function (a, b) {
        return (ethers.utils.formatUnits(a.buyoutPrice.hex, 18) - ethers.utils.formatUnits(b.buyoutPrice.hex, 18));
      })
    } else {
      data = filteredListings.sort(function (a, b) {
        return (ethers.utils.formatUnits(b.buyoutPrice.hex, 18) - ethers.utils.formatUnits(a.buyoutPrice.hex, 18));
      })
    }

    //filter according to category selected
    // if (selectedCategory != 'all') {
    //   data = data.filter((item) => {
    //     return (item.asset?.properties?.category == selectedCategory);
    //   })
    // }
    
    //filter for price range
    data = data.filter((item) => {
      let itemPrice = parseInt(item.buyoutPrice.hex, 16) / DIVIDER;
      return (
        item.asset.name.toLowerCase().includes(itemName?.toLowerCase()) &&
        parseFloat(priceRange[0]) <= itemPrice &&
        parseFloat(priceRange[1]) >= itemPrice
        )
      })

    //filter for auction and direct listings
    if(!(includeAuction && includeDirect)){
      if(!includeAuction){
        data = data.filter(item => !(item.type == 1));
      }else {
        data = data.filter(item => item.type == 1);
      }
      if(!includeDirect){
        data = data.filter(item => !(item.type == 0));
      }else {
        data = data.filter(item => item.type == 0);
      }
    }

    //filter according to chosen file type audio, video or image
    const supportedImgExt = ['jpg', 'png','webp', 'gif', 'bmp', 'jpeg', 'svg', 'jfif', 'glb', '3mf'];
    const supportedAudioExt = ['wav', 'mp3', 'webm', 'ogg', 'wav'];
    const supportedVideoExt = ['mp4', 'webm', 'flv', '3gp', 'mkv']
    const audioNFTs = data.filter((item) => Boolean(item?.asset?.animation_url) && supportedAudioExt.includes(item?.asset?.animation_url.slice(-3)));
    const videoNFTs = data.filter((item) => Boolean(item?.asset?.animation_url) && supportedVideoExt.includes(item?.asset?.animation_url.slice(-3)));
    const imageNFTs = data.filter((item) => !Boolean(item?.asset?.animation_url) && supportedImgExt.includes(item.asset.image.slice(-3)));

    let newFiltered = [];

    if(includeAudio){
      newFiltered = [...newFiltered, ...audioNFTs];
    }
    if(includeVideo){
      newFiltered = [...newFiltered, ...videoNFTs];
    }
    if(includeImage){
      newFiltered = [...newFiltered, ...imageNFTs];
    }


    setCurrentItems(newFiltered);

    return() => {
      //nothing, just clean up codes
    }
  }, [itemName, priceRange, sortAsc, selectedCategory, includeAudio, includeVideo, includeImage, includeAuction, includeDirect])

  const DIVIDER = BigNumber.from(10).pow(18)

  const handleSubmit = (e) => {
    e.preventDefault()
  }


  //below two useeffect are based on previous activelisting redis data, now not in use
  // useEffect(() => {
  //   return
  //   if (!activeListings) return
  //   if (!router.query._r) return
    

  //   let minPrice = parseInt(activeListings[0]?.buyoutPrice.hex,16) / DIVIDER
  //   let maxPrice = minPrice
    

  //   for (let i = 0; i < activeListings.length; i++) {
  //     let currentPrice = parseInt(activeListings[i]?.buyoutPrice.hex, 16)

  //     let buyPrice = currentPrice / DIVIDER

  //     if (minPrice > buyPrice) {
  //       minPrice = buyPrice
  //     }
  //     if (maxPrice < buyPrice) {
  //       maxPrice = buyPrice
  //     }
  //   }
  //   setPriceRange([minPrice, maxPrice])

  //   return() => {
  //     //nothing, just clean up codes
  //   }
  // }, [activeListings])

  // useEffect(() => {
  //   return
  //   if (!activeListings) return;
  //   let data = []

  //   //sort item according to their price in selected order
  //   if (sortAsc) {
  //     data = activeListings.sort(function (a, b) {
  //       return (parseInt(a.buyoutPrice.hex, 16) / DIVIDER) - (parseInt(b.buyoutPrice.hex, 16) / DIVIDER);
  //     })
  //   } else {
  //     data = activeListings.sort(function (a, b) {
  //       return (parseInt(b.buyoutPrice.hex, 16) / DIVIDER) - (parseInt(a.buyoutPrice.hex, 16) / DIVIDER);
  //     })
  //   }

  //   //filter according to category selected
  //   if (selectedCategory != 'all') {
  //     data = data.filter((item) => {
  //       return (item.asset?.properties?.category == selectedCategory);
  //     })
  //   }
    
  //   //filter for price range
  //   data = data.filter((item) => {
  //     let itemPrice = parseInt(item.buyoutPrice.hex, 16) / DIVIDER;
  //     return (
  //       item.asset.name.toLowerCase().includes(itemName?.toLowerCase()) &&
  //       parseFloat(priceRange[0]) <= itemPrice &&
  //       parseFloat(priceRange[1]) >= itemPrice
  //       )
  //     })
  //   //filter for auction and direct listings
  //   if(!(includeAuction && includeDirect)){
  //     if(!includeAuction){
  //       data = data.filter(item => !item.hasOwnProperty('reservePrice'));
  //     }else {
  //       data = data.filter(item => item.hasOwnProperty('reservePrice'));
  //     }
  //     if(!includeDirect){
  //       data = data.filter(item => !(!item.hasOwnProperty('reservePrice')));
  //     }else {
  //       data = data.filter(item => !item.hasOwnProperty('reservePrice'));
  //     }
  //   }

  //   //filter according to chosen file type audio, video or image
  //   const audioNFTs = data.filter((item) => item.asset.properties?.itemtype == "audio");
  //   const videoNFTs = data.filter((item) => item.asset.properties?.itemtype == "video");
  //   const imageNFTs = data.filter((item) => item.asset.properties?.itemtype != "audio" && item.asset.properties?.itemtype != "video");

  //   let newFiltered = [];

  //   if(includeAudio){
  //     newFiltered = [...newFiltered, ...audioNFTs];
  //   }
  //   if(includeVideo){
  //     newFiltered = [...newFiltered, ...videoNFTs];
  //   }
  //   if(includeImage){
  //     newFiltered = [...newFiltered, ...imageNFTs];
  //   }

  //   // console.log(newFiltered)
  //   //This filter will filter out all nfts that does not have tokenid. Only Old NFTs do not have tokenid.
  //   newFiltered = newFiltered.filter((item) => item.asset.properties?.tokenid != null);

  //   setFilteredListings(newFiltered);

  //   return() => {
  //     //nothing, just clean up codes
  //   }
  // }, [itemName, activeListings, priceRange, sortAsc, selectedCategory, includeAudio, includeVideo, includeImage, includeAuction, includeDirect])

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <SEO />
      <Header />
      <div className={ dark ? style.pageBanner + ' darkGray' : style.pageBanner + ' bg-sky-100'}>
        <div className="container relative -bottom-[110px] mx-auto p-4">
          <header className="mx-auto -mt-10 flex max-w-2xl flex-col lg:-mt-7">
            <form
              className="relative w-full "
              method="post"
              onSubmit={handleSubmit}
            >
              <label
                htmlFor="search-input"
                className="text-neutral-500 dark:text-neutral-300"
              >
                <span className="sr-only">Search all items</span>
                <input
                  type="search"
                  className={`focus:border-primary-300 block w-full rounded-full border py-5 pl-14 pr-5 text-sm font-normal shadow-lg ${
                    dark
                      ? 'border-slate-600 bg-slate-700 text-slate-200'
                      : 'border-neutral-200 bg-white text-slate-900'
                  } md:pl-16 focus:ring-0 focus-visible:ring-0 focus:outline-0`}
                  id="search-input"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Type your keywords"
                />
                <button 
                  className="absolute transition right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 transform items-center justify-center rounded-full bg-sky-600 !leading-none text-neutral-50  hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2  dark:focus:ring-offset-0"
                  type="submit"
                  onClick={searchNFTs}>
                  <FiArrowRight />
                </button>
                <span className={`absolute left-5 top-1/2 -translate-y-1/2 transform text-2xl md:left-6 ${dark ? 'text-slate-200' : ' text-slate-700'} `}>
                  <IconSearch />
                </span>
              </label>
            </form>
          </header>
        </div>
      </div>

      <div className="space-t-16 lg:space-t-28 container p-4 mx-auto pt-16 lg:pt-20 lg:px-[8rem] sm:px-[2rem]">
        <div className="relative mb-0 flex flex-col">
          <div className="flex flex-col justify-between space-y-6 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-2 ">
            <nav className="hiddenScrollbar relative flex w-full overflow-x-auto text-sm md:text-base">
              <ul className="flex sm:space-x-2">
                <li className="relative">
                  <button
                    className={`block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none ${
                      dark
                        ? selectedCategory === 'all'
                          ? 'bg-slate-600 text-slate-200'
                          : 'text-slate-500 hover:bg-slate-600/20 hover:text-slate-200'
                        : selectedCategory === 'all'
                        ? 'bg-sky-100 text-neutral-800'
                        : 'text-neutral-500 hover:bg-sky-100'
                    } focus:outline-none  sm:px-6 sm:py-3 sm:text-base`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All NFTs
                  </button>
                </li>
                {categories.length > 0 &&
                  categories.map((item, index) => (
                    <li key={index} className="relative" data-nc-id="NavItem">
                      <button
                        className={`block transition whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none ${
                          dark
                            ? selectedCategory === item.name
                              ? 'bg-slate-600 text-slate-200'
                              : 'text-slate-500 hover:bg-slate-600/20 hover:text-slate-200'
                            : selectedCategory === item.name
                            ? 'bg-sky-100 text-neutral-800'
                            : 'text-neutral-500 hover:bg-sky-100'
                        } focus:outline-none  sm:px-6 sm:py-3 sm:text-base`}
                        onClick={() => setSelectedCategory(`${item.name}`)}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </nav>
            <span className="block flex-shrink-0 text-right">
              <button
                className="transition relative inline-flex h-auto w-auto items-center justify-center rounded-full bg-sky-600 py-2.5 pl-4 !pr-16 text-sm  font-medium text-neutral-50 hover:bg-sky-700  disabled:bg-opacity-70 ring-0 outline-0 sm:pl-6 sm:text-base"
                onClick={() => setShowFilter(!showFilter)}
              >
                <IconFilter />
                <span className="ml-2.5 block truncate">Filter</span>
                <span className="absolute top-1/2 right-5 -translate-y-1/2">
                  <HiChevronDown fontSize={20}
                    className={`${showFilter && 'rotate-180'} transition`}
                  />
                </span>
              </button>
            </span>
          </div>

          <div className="opacity-100">
            <div
              className={`my-4 w-full border-b ${
                dark ? 'border-sky-700/30' : 'border-neutral-200/70'
              }`}></div>
            <div className={`flex flex-wrap items-center justify-center lg:justify-between lg:space-x-4 ${showFilter ? 'flex' : 'hidden'}`}>
              <div className="searchfields relative mb-3 flex flex-wrap justify-center gap-2">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className={`transition border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <IconWallet />
                      <span className="ml-2">
                        {priceRange[0]} - {priceRange[1]}
                      </span>
                      <span className="bg-primary-500 ml-3 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-full">
                        <BsChevronDown />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className={`absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl ${
                        dark ? 'bg-slate-700' : 'bg-white'
                      } py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}
                    >
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          <div className="mb-3 font-bold">
                            Select Price Range
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div>
                            <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                              <Slider
                                range
                                min={0}
                                max={10000}
                                allowCross={false}
                                defaultValue={priceRange}
                                onChange={(value) => setPriceRange(value)}  
                              />
                            </div>
                            <div className="flex justify-between space-x-5">
                              <div>
                                <label
                                  htmlFor="minPrice"
                                  className="block text-sm font-medium"
                                >
                                  Min price
                                </label>
                                <div className="relative mt-1 hidden rounded-md">
                                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center sm:text-sm">
                                    ETH
                                  </span>
                                  <input
                                    type="text"
                                    name="minPrice"
                                    disabled=""
                                    id="minPrice"
                                    className="block w-32 rounded-full border-neutral-200 bg-transparent pr-10 pl-4 sm:text-sm"
                                  />
                                </div>
                              </div>
                              <div className="text-right">
                                <label
                                  htmlFor="maxPrice"
                                  className="block text-sm font-medium"
                                >
                                  Max price
                                </label>
                                <div className="relative mt-1 hidden rounded-md">
                                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center sm:text-sm">
                                    ETH
                                  </span>
                                  <input
                                    type="text"
                                    disabled=""
                                    name="maxPrice"
                                    id="maxPrice"
                                    className="block w-32 rounded-full border-neutral-200 bg-transparent pr-10 pl-4 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className={`transition border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <IconBulb />
                      <span className="ml-2">Sale Types</span>
                      <span className="bg-primary-500 ml-3 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-full">
                        <BsChevronDown />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className={`absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl ${
                        dark ? 'bg-slate-700' : 'bg-white'
                      } py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}>
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          <div className="mb-3 font-bold">Choose Sale Type</div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                On Direct Listing
                              </span>
                              <span className="block text-xs text-neutral-400">
                                Items put on direct sale
                              </span>
                            </div>
                            <Switch
                              checked={includeDirect}
                              onChange={() =>
                                setIncludeDirect((curVal) => !curVal)
                              }
                              className={`${
                                includeDirect ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  includeDirect
                                    ? 'translate-x-9'
                                    : 'translate-x-0'
                                }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                On Auction
                              </span>
                              <span className="block text-xs text-neutral-400">
                                Items put on Auction
                              </span>
                            </div>
                            <Switch
                              checked={includeAuction}
                              onChange={() =>
                                setIncludeAuction((curVal) => !curVal)
                              }
                              className={`${
                                includeAuction
                                  ? 'bg-blue-500'
                                  : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  includeAuction
                                    ? 'translate-x-9'
                                    : 'translate-x-0'
                                }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="group flex w-full items-center hidden justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Has Offers
                              </span>
                              <span className="block text-sm text-neutral-400">
                                Items having offers
                              </span>
                            </div>
                            <Switch
                              checked={includeHasOffers}
                              onChange={() =>
                                setIncludeHasOffers((curVal) => !curVal)
                              }
                              className={`${
                                includeHasOffers
                                  ? 'bg-blue-500'
                                  : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  includeHasOffers
                                    ? 'translate-x-9'
                                    : 'translate-x-0'
                                }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className={`transition border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <IconImage />
                      <span className="ml-2">NFT Type</span>
                      <span className="bg-primary-500 ml-3 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-full">
                        <BsChevronDown />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className={`absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl ${
                        dark ? 'bg-slate-700' : 'bg-white'
                      } py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}>
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          <div className="mb-3 font-bold">Choose Item Type</div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Image Items
                              </span>
                              <span className="block text-xs text-neutral-400">
                                Items in JPG, GIF, WEBP, SVG format
                              </span>
                            </div>
                            <Switch
                              checked={includeImage}
                              onChange={() =>
                                setIncludeImage((curVal) => !curVal)
                              }
                              className={`${
                                includeImage ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  includeImage
                                    ? 'translate-x-9'
                                    : 'translate-x-0'
                                }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Video Items
                              </span>
                              <span className="block text-xs text-neutral-400">
                                Items in MP4, WEBM, AVI format
                              </span>
                            </div>
                            <Switch
                              checked={includeVideo}
                              onChange={() =>
                                setIncludeVideo((curVal) => !curVal)
                              }
                              className={`${
                                includeVideo ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  includeVideo
                                    ? 'translate-x-9'
                                    : 'translate-x-0'
                                }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Audio Items
                              </span>
                              <span className="block text-xs text-neutral-400">
                                Items in MP3, WEBM format
                              </span>
                            </div>
                            <Switch
                              checked={includeAudio}
                              onChange={() =>
                                setIncludeAudio((curVal) => !curVal)
                              }
                              className={`${
                                includeAudio ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  includeAudio
                                    ? 'translate-x-9'
                                    : 'translate-x-0'
                                }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className={`transition border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <IconExchange />
                      <span className="ml-2">Sort order</span>
                      <span className="bg-primary-500 ml-3 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-full">
                        <BsChevronDown />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className={`absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl ${
                        dark ? 'bg-slate-700' : 'bg-white'
                      } py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}>
                      <div className="px-1 py-1 ">
                        {/* <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Name from {sortAlpha ? 'A-Z' : 'Z-A'}
                              </span>
                            </div>
                            <Switch
                              checked={sortAlpha}
                              onChange={() => {setSortAlpha((curVal) => !curVal);  setSortAsc((curVal) => !curVal)}}
                              className={`${
                                sortAlpha ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                              relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  sortAlpha ? 'translate-x-9' : 'translate-x-0'
                                }
                                pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item> */}

                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Price {sortAsc ? 'Low - High' : 'High - Low'}
                              </span>
                            </div>
                            <Switch
                              checked={sortAsc}
                              onChange={() => setSortAsc((curVal) => !curVal)}
                              className={`${
                                sortAsc ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                              relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  sortAsc ? 'translate-x-9' : 'translate-x-0'
                                }
                                pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className={`flex overflow-hidden rounded-md shadow-md border ${dark ? 'border-slate-700': 'border-sky-500'}`}>
                <div 
                  className={` ${!compact ? (dark ? 'bg-slate-500 hover:bg-slate-500' : 'bg-sky-600 text-white') : (dark ? 'bg-slate-700' :'bg-neutral-100  hover:bg-sky-200')} p-2 cursor-pointer`}
                  onClick={() => setCompact(false)}>
                  <BsGrid/>
                </div>
                <div 
                  className={` ${compact ? (dark ? 'bg-slate-500 hover:bg-slate-500' : 'bg-sky-600 text-white') : (dark ? 'bg-slate-700' :'bg-neutral-100 hover:bg-sky-200')} p-2 cursor-pointer`}
                  onClick={() => setCompact(true)}>
                  <BsGrid3X3Gap/>
                </div>
              </div>
              {/* <div className={`transition border-primary-500 w-full lg:w-fit cursor-pointer bg-primary-50 text-primary-900 flex gap-1 mb-3 mx-3 md:mx-0 items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60 bg-sky-700/20'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}>
                <HiOutlineRefresh fontSize={18} /> Update Filter
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 lg:px-[8rem] sm:px-[2rem]">
        {loading && <Loader />}
        {currentItems?.length == 0 && loading == false && (
          <div className="flex justify-center">
            <span>No NFTs are available.</span>
          </div>
        )}

        {currentItems?.length > 0 && (
          <>
            <div className={style.nftwrapper}>
              {currentItems?.map((nftItem, id) => <SearchItem key={id} nftItem={nftItem} compact={compact}/> )}
            </div>
            {/* <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="Previous"
              renderOnZeroPageCount={null}
              className="mt-[4rem] flex justify-center gap-3"
              previousClassName={`px-3 text-sm rounded-full flex items-center justify-center border w-[100px] cursor-pointer ${dark ? 'hover:bg-slate-600 hover:border-slate-700 hover:text-slate-200 border-sky-700/30' : 'hover:bg-neutral-100 hover:border-neutral-200'}`}
              nextClassName={`px-3 text-sm rounded-full flex items-center justify-center border w-[100px] cursor-pointer ${dark ? 'hover:bg-slate-600 hover:border-slate-700 hover:text-slate-200 border-sky-700/30' : 'hover:bg-neutral-100 hover:border-neutral-200'}`}
              activeClassName="bg-sky-600 p-3 text-sky-100 hover:bg-sky-600 border"
              pageLinkClassName=""
              pageClassName={`flex items-center justify-center rounded-full border w-[50px] h-[50px]  ${dark ? 'text-white-500 hover:bg-slate-600 hover:border-slate-700 hover:text-slate-200 border-sky-700/30' : 'hover:bg-neutral-100 hover:border-neutral-200'} cursor-pointer`}
            /> */}

            {/* Selection of items per page */}
            {/* <Menu
              as="div"
              className="relative mt-4 flex justify-center text-left">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button
                      className={`border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <HiOutlineViewGrid />
                      <span className="ml-2">
                        Showing{' '}
                        {itemsPerPage == '100000' ? 'All' : itemsPerPage} items
                      </span>
                      <span className="bg-primary-500 ml-3 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-full">
                        <BsChevronDown
                          className={`transition ${open && 'rotate-180'}`}
                        />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className={`absolute top-full z-30 mt-3 max-w-md translate-y-0 rounded-3xl text-sm ${
                        dark ? 'bg-slate-700' : 'bg-white border border-neutral-200'
                      } py-5 px-4 opacity-100 shadow-xl sm:py-4 sm:px-4`}
                    >
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          <div
                            className={`cursor-pointer rounded-md py-2 px-6 ${dark ? 'hover:bg-slate-600' : 'hover:bg-neutral-100'}`}
                            onClick={() => setItemsPerPage('100000')}
                          >
                            Show All
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            className={`cursor-pointer rounded-md py-2 px-6 ${dark ? 'hover:bg-slate-600' : 'hover:bg-neutral-100'}`}
                            onClick={() => setItemsPerPage(4)}
                          >
                            Show 4 items per page
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            className={`cursor-pointer rounded-md py-2 px-6 ${dark ? 'hover:bg-slate-600' : 'hover:bg-neutral-100'}`}
                            onClick={() => setItemsPerPage(8)}
                          >
                            Show 8 items per page
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            className={`cursor-pointer rounded-md py-2 px-6 ${dark ? 'hover:bg-slate-600' : 'hover:bg-neutral-100'}`}
                            onClick={() => setItemsPerPage(12)}
                          >
                            Show 12 items per page
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            className={`cursor-pointer rounded-md py-2 px-6 ${dark ? 'hover:bg-slate-600' : 'hover:bg-neutral-100'}`}
                            onClick={() => setItemsPerPage(16)}
                          >
                            Show 16 items per page
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            className={`cursor-pointer rounded-md py-2 px-6 ${dark ? 'hover:bg-slate-600' : 'hover:bg-neutral-100'}`}
                            onClick={() => setItemsPerPage(20)}
                          >
                            Show 20 items per page
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu> */}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default search

