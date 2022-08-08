import Header from '../components/Header'
import Footer from '../components/Footer'
import NFTItem from '../components/NFTItem'
import { config } from '../lib/sanityClient'
import { BsChevronUp, BiChevronDown, BsChevronDown } from 'react-icons/bs'
import { FiArrowRight } from 'react-icons/fi'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSearchContext } from '../contexts/SearchContext'
import { useRouter } from 'next/router'
import {
  IconBulb,
  IconExchange,
  IconFilter,
  IconImage,
  IconSearch,
  IconWallet,
} from '../components/icons/CustomIcons'
import { useEffect, useState, Fragment, useCallback } from 'react'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import Loader from '../components/Loader'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Menu, Transition, Switch } from '@headlessui/react'
import { BigNumber } from 'ethers'

const style = {
  wrapper: ' max-w-[1000px] mx-auto mt-[4rem] p-[2rem] pb-[4rem] rounded-xl',
  pageBanner: 'py-[4rem] mb-[2rem]',
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
  nftwrapper: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`,
  closeButton:
    'sticky top-3 transition duration-[300] top-[20px] left-[100%] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70',
}

const search = () => {
  const { dark } = useThemeContext()
  const [showFilter, setShowFilter] = useState(true)
  const { activeListings } = useMarketplaceContext()
  const router = useRouter()

  const [itemName, setItemName] = useState()
  const [includeImage, setIncludeImage] = useState()
  const [includeVideo, setIncludeVideo] = useState()
  const [includeAudio, setIncludeAudio] = useState()
  const [includeAuction, setIncludeAuction] = useState()
  const [includeDirect, setIncludeDirect] = useState()
  const [includeHasOffers, setIncludeHasOffers] = useState()
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortAsc, setSortAsc] = useState(true)
  const [filteredListings, setFilteredListings] = useState()

  useEffect(() => {
    console.log(activeListings)
  }, [activeListings])

  useEffect(() => {
    const data = router.query
    setItemName(data.n)
    setIncludeImage(data.i === 'true' ? true : false)
    setIncludeVideo(data.v === 'true' ? true : false)
    setIncludeAudio(data.a === 'true' ? true : false)
    setIncludeAuction(data.ac === 'true' ? true : false)
    setIncludeDirect(data.d === 'true' ? true : false)
    setIncludeHasOffers(data.h === 'true' ? true : false)
    setPriceRange([data._r ? data._r : 0, data.r_ ? data.r_ : 100])
  }, [router.query])
  const DIVIDER = BigNumber.from(10).pow(18)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (!activeListings) return
    if (router.query._r) return

    let minPrice = activeListings[0].buyoutPrice / DIVIDER
    let maxPrice = minPrice

    for (let i = 0; i < activeListings.length; i++) {
      let currentPrice = activeListings[i].buyoutPrice

      let buyPrice = currentPrice / DIVIDER

      if (minPrice > buyPrice) {
        minPrice = buyPrice
      }
      if (maxPrice < buyPrice) {
        maxPrice = buyPrice
      }
    }
    setPriceRange([minPrice, maxPrice])
  }, [activeListings])

  useEffect(() => {
    if (!activeListings) return
    let data = []

    //sort item according to their price in selected order
    if (sortAsc) {
      data = activeListings.sort(function (a, b) {
        return a.buyoutPrice / DIVIDER - b.buyoutPrice / DIVIDER
      })
    } else {
      data = activeListings.sort(function (a, b) {
        return b.buyoutPrice / DIVIDER - a.buyoutPrice / DIVIDER
      })
    }

    data = data.filter((item) => {
      let itemPrice = item.buyoutPrice / DIVIDER
      return (
        item.asset.name.toLowerCase().includes(itemName?.toLowerCase()) &&
        parseFloat(priceRange[0]) < itemPrice &&
        parseFloat(priceRange[1]) > itemPrice
      )
    })

    setFilteredListings(data)
  }, [itemName, activeListings, priceRange, sortAsc])

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
        <div className="container relative -bottom-[100px] mx-auto">
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
                      ? 'border-slate-600 bg-slate-700'
                      : 'border-neutral-200 bg-white text-slate-900'
                  } md:pl-16`}
                  id="search-input"
                  value={itemName ? itemName : ''}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Type your keywords"
                />
                <button
                  className="absolute right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 transform items-center justify-center rounded-full bg-sky-600 !leading-none text-neutral-50  hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2  dark:focus:ring-offset-0"
                  type="submit"
                >
                  <FiArrowRight />
                </button>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 transform text-2xl md:left-6">
                  <IconSearch />
                </span>
              </label>
            </form>
          </header>
        </div>
      </div>

      <div className="space-t-16 lg:space-t-28 container mx-auto pt-16 lg:pt-20">
        <div className="relative mb-12 flex flex-col">
          <div className="flex flex-col justify-between space-y-6 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-2 ">
            <nav
              className="nc-Nav hiddenScrollbar relative flex w-full overflow-x-auto text-sm md:text-base"
              data-nc-id="Nav"
            >
              <ul className="flex  sm:space-x-2">
                <li className="nc-NavItem relative" data-nc-id="NavItem">
                  <button className="bg-primary-100/90 dark:bg-primary-100 text-primary-900 block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none focus:outline-none sm:px-6 sm:py-3  sm:text-base">
                    All NFTs
                  </button>
                </li>
                <li className="nc-NavItem relative" data-nc-id="NavItem">
                  <button
                    className={`block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none text-neutral-500 hover:text-neutral-800 ${
                      dark
                        ? 'hover:bg-slate-600 hover:text-slate-200'
                        : 'hover:bg-sky-100'
                    } focus:outline-none  sm:px-6 sm:py-3 sm:text-base`}
                  >
                    Arts
                  </button>
                </li>
                <li className="nc-NavItem relative" data-nc-id="NavItem">
                  <button
                    className={`block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none text-neutral-500 hover:text-neutral-800 ${
                      dark
                        ? 'hover:bg-slate-600 hover:text-slate-200'
                        : 'hover:bg-sky-100'
                    } focus:outline-none  sm:px-6 sm:py-3 sm:text-base`}
                  >
                    Musics
                  </button>
                </li>
                <li className="nc-NavItem relative" data-nc-id="NavItem">
                  <button
                    className={`block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none text-neutral-500 hover:text-neutral-800 ${
                      dark
                        ? 'hover:bg-slate-600 hover:text-slate-200'
                        : 'hover:bg-sky-100'
                    } focus:outline-none  sm:px-6 sm:py-3 sm:text-base`}
                  >
                    Sports
                  </button>
                </li>
                <li className="nc-NavItem relative" data-nc-id="NavItem">
                  <button
                    className={`block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none text-neutral-500 hover:text-neutral-800 ${
                      dark
                        ? 'hover:bg-slate-600 hover:text-slate-200'
                        : 'hover:bg-sky-100'
                    } focus:outline-none  sm:px-6 sm:py-3 sm:text-base`}
                  >
                    Photography
                  </button>
                </li>
              </ul>
            </nav>
            <span className="block flex-shrink-0 text-right">
              <button
                className="relative inline-flex h-auto w-auto items-center justify-center rounded-full bg-sky-600 py-2.5 pl-4 !pr-16 text-sm  font-medium text-neutral-50 transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:bg-opacity-70 dark:focus:ring-offset-0 sm:pl-6 sm:text-base"
                onClick={() => setShowFilter(!showFilter)}
              >
                <IconFilter />
                <span className="ml-2.5 block truncate">Filter</span>
                <span className="absolute top-1/2 right-5 -translate-y-1/2">
                  <BsChevronDown
                    className={`${showFilter && 'rotate-180'} transition`}
                  />
                </span>
              </button>
            </span>
          </div>

          <div className="opacity-100">
            <div
              className={`my-8 w-full border-b ${
                dark ? 'border-sky-700/30' : 'border-neutral-200/70'
              }`}
            ></div>
            <div
              className={`flex lg:space-x-4 ${showFilter ? 'block' : 'hidden'}`}
            >
              <div className="searchfields relative mb-3 flex flex-wrap justify-center gap-2">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className={`border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <IconWallet />
                      <span className="ml-2">
                        {priceRange[0]} ETH - {priceRange[1]} ETH
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
                                    value="0.01"
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
                                    value="10"
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
                      className={`border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
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
                    <Menu.Items className="absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl bg-white py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8">
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
                              <span className="block text-sm text-neutral-400">
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
                              <span className="block text-sm text-neutral-400">
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
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
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
                      className={`border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
                        dark
                          ? 'border-sky-700/30 hover:border-sky-700/60'
                          : 'border-neutral-200 hover:border-neutral-400'
                      } px-4 py-2 text-sm focus:outline-none`}
                    >
                      <IconImage />
                      <span className="ml-2">File Types</span>
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
                    <Menu.Items className="absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl bg-white py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8">
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
                              <span className="block text-sm text-neutral-400">
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
                              <span className="block text-sm text-neutral-400">
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
                              <span className="block text-sm text-neutral-400">
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
                      className={`border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-center rounded-full border ${
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
                    <Menu.Items className="absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl bg-white py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8">
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Price Low - High
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
                        <Menu.Item>
                          <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                            <div>
                              <span className="block text-[17px]">
                                Price High - Low
                              </span>
                            </div>
                            <Switch
                              checked={!sortAsc}
                              onChange={() => setSortAsc((curVal) => !curVal)}
                              className={`${
                                !sortAsc ? 'bg-blue-500' : 'bg-neutral-400'
                              }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use Setting</span>
                              <span
                                aria-hidden="true"
                                className={`${
                                  !sortAsc ? 'translate-x-9' : 'translate-x-0'
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
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        {!filteredListings && <Loader />}
        {filteredListings?.length == 0 && (
          <div className="flex justify-center">
            <span>No NFTs are available.</span>
          </div>
        )}

        {filteredListings?.length > 0 && (
          <div className={style.nftwrapper}>
            {filteredListings?.map((nftItem, id) => {
              if (itemName) {
                if (
                  nftItem.asset.name
                    .toLowerCase()
                    .includes(itemName.toLowerCase())
                ) {
                  return <NFTItem key={id} nftItem={nftItem} />
                }
              } else {
                return <NFTItem key={id} nftItem={nftItem} />
              }
            })}
            {/* {activeListings?.map((nftItem, id) => {
              if(nftItem.asset.name.includes(itemName)){
                return (
                  <NFTItem key={id} nftItem={nftItem} />
                )
              })
            })} */}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default search
