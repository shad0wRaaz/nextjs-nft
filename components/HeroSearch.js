import { RiSearchLine } from 'react-icons/ri'
import { Menu, Transition, Switch } from '@headlessui/react'
import { useThemeContext } from '../contexts/ThemeContext'
import { Fragment, useEffect, useRef, useState } from 'react'
import Slider, { Range } from 'rc-slider'
import { useRouter } from 'next/router'
import 'rc-slider/assets/index.css'
import {
  IconBulb,
  IconDollar,
  IconImage,
  IconSearch,
} from './icons/CustomIcons'

const HeroSearch = () => {
  const { dark } = useThemeContext()
  const [itemName, setItemName] = useState('Search NFTs')
  const [includeImage, setIncludeImage] = useState(true)
  const [includeVideo, setIncludeVideo] = useState(false)
  const [includeAudio, setIncludeAudio] = useState(false)
  const [includeAuction, setIncludeAuction] = useState(false)
  const [includeDirect, setIncludeDirect] = useState(true)
  const [includeHasOffers, setIncludeHasOffers] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const router = useRouter()
  const itemNameRef = useRef();

 
  return (
    <div className="heroSearchForm z-10 mb-12 w-full p-[20px] lg:mb-0">
      <div className="mx-auto w-full max-w-6xl">
        <form
          className={`relative flex w-full flex-col justify-between rounded-3xl border  p-[15px] shadow-md lg:flex-row lg:items-center lg:rounded-full xl:mt-8 ${
            dark
              ? ' border-slate-600 bg-slate-700/70 text-neutral-100'
              : ' border-neutral-100/70 bg-[#ffffff99]'
          } divide-y  lg:divide-y-0 backdrop-blur-md`}
        >
          <div className="searchfields border-slate-500  relative flex">
            <div className="relative flex flex-1 flex-shrink-0 cursor-pointer items-center space-x-3 text-left focus:outline-none  ">
              <div className={`searchfieldicon pl-5 ${dark ? ' text-white' : ' text-black'}`}>
                <IconSearch />
              </div>

              <div className="flex-grow">
                <input
                  className="block w-full truncate border-none bg-transparent p-0 font-semibold placeholder-neutral-800 focus:placeholder-neutral-300 focus:outline-none focus:ring-0  xl:text-lg"
                  placeholder="Search NFTs"
                  value={itemName}
                  ref={itemNameRef}
                  onChange={(e) => setItemName(e.target.value)}
                  onFocus={(e) => e.target.value == 'Search NFTs' && setItemName('')}
                  onBlur={(e) => e.target.value == '' && setItemName('Search NFTs')}
                />
                <span className={`mt-0.5 block text-sm font-light ${dark ? ' text-white' : ' text-black'}`}>
                  <span className="line-clamp-1">
                    What are you looking for?
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="searchfields border-slate-500 relative flex">
            <Menu as="div" className="relative inline-block text-left flex-grow">
              <div>
                <Menu.Button className="inline-flex w-full cursor-pointer items-center gap-3">
                  <div className={`${dark ? ' text-white': 'text-black'}`}>
                    <IconImage />
                  </div>

                  <div className="flex-grow">
                    <span className="block min-w-[130px] text-left font-semibold xl:text-lg">
                      Item type
                    </span>
                    <span className={`mt-1 block text-left text-sm font-light leading-none ${dark ? ' text-white' : ' text-black'}`}>
                      Type of item
                    </span>
                  </div>
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
                <Menu.Items className={`absolute left-0 top-full z-30 mt-3 w-full sm:max-w-full md:max-w-sm translate-y-0 rounded-3xl ${dark ? ' bg-slate-700' : 'bg-white'} py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <div className="mb-3 font-bold">Choose Item Type</div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                        <div>
                          <span className="block text-[17px]">Image Items</span>
                          <span className="block text-sm text-neutral-400">
                            Items in JPG, GIF, WEBP, SVG format
                          </span>
                        </div>
                        <Switch
                          checked={includeImage}
                          onChange={() => setIncludeImage((curVal) => !curVal)}
                          className={`${
                            includeImage ? 'bg-blue-500' : 'bg-neutral-400'
                          }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use Setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              includeImage ? 'translate-x-9' : 'translate-x-0'
                            }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                        <div>
                          <span className="block text-[17px]">Video Items</span>
                          <span className="block text-sm text-neutral-400">
                            Items in MP4, WEBM, AVI format
                          </span>
                        </div>
                        <Switch
                          checked={includeVideo}
                          onChange={() => setIncludeVideo((curVal) => !curVal)}
                          className={`${
                            includeVideo ? 'bg-blue-500' : 'bg-neutral-400'
                          }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use Setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              includeVideo ? 'translate-x-9' : 'translate-x-0'
                            }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                        <div>
                          <span className="block text-[17px]">Audio Items</span>
                          <span className="block text-sm text-neutral-400">
                            Items in MP3, WEBM format
                          </span>
                        </div>
                        <Switch
                          checked={includeAudio}
                          onChange={() => setIncludeAudio((curVal) => !curVal)}
                          className={`${
                            includeAudio ? 'bg-blue-500' : 'bg-neutral-400'
                          }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use Setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              includeAudio ? 'translate-x-9' : 'translate-x-0'
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

          <div className="searchfields border-slate-500 relative flex">
            <Menu as="div" className="relative inline-block text-left flex-grow">
              <div>
                <Menu.Button className="inline-flex w-full cursor-pointer items-center gap-3">
                  <div className={`${dark ? ' text-white' : ' text-black'}`}>
                    <IconBulb />
                  </div>

                  <div className="flex-grow">
                    <span className="block min-w-[130px] text-left font-semibold xl:text-lg">
                      Sale type
                    </span>
                    <span className={`mt-1 block text-left text-sm font-light leading-none ${dark ? ' text-white' : ' text-black'}`}>
                      Type of sale
                    </span>
                  </div>
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
                <Menu.Items className={`absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl ${dark ? ' bg-slate-700' : 'bg-white'} py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}>
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
                          onChange={() => setIncludeDirect((curVal) => !curVal)}
                          className={`${
                            includeDirect ? 'bg-blue-500' : 'bg-neutral-400'
                          }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use Setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              includeDirect ? 'translate-x-9' : 'translate-x-0'
                            }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                        <div>
                          <span className="block text-[17px]">On Auction</span>
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
                            includeAuction ? 'bg-blue-500' : 'bg-neutral-400'
                          }
                        relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use Setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              includeAuction ? 'translate-x-9' : 'translate-x-0'
                            }
                          pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm">
                        <div>
                          <span className="block text-[17px]">Has Offers</span>
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
                            includeHasOffers ? 'bg-blue-500' : 'bg-neutral-400'
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
          </div>

          <div className="searchfields border-slate-500  relative flex">
            <Menu as="div" className="relative inline-block text-left flex-grow">
              <div>
                <Menu.Button className="inline-flex w-full cursor-pointer items-center gap-3">
                  <div className={`${dark ? ' text-white' : ' text-black'}`}>
                    <IconDollar />
                  </div>

                  <div className="flex-grow">
                    <span className="block min-w-[130px] text-left font-semibold xl:text-lg">
                      {priceRange[0]} ~ {priceRange[1]}
                    </span>
                    <span className={`mt-1 block text-left text-sm font-light leading-none ${dark ? ' text-white' : ' text-black'}`}>
                      Price Range
                    </span>
                  </div>
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
                <Menu.Items className={`absolute left-0 top-full z-30 mt-3 w-full max-w-sm translate-y-0 rounded-3xl ${dark ? ' bg-slate-700' : 'bg-white'} py-5 px-4 opacity-100 shadow-xl sm:min-w-[340px] sm:py-6 sm:px-8`}>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <div className="mb-3 font-bold">Select Price Range</div>
                    </Menu.Item>
                    <Menu.Item>
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
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="py-4 pl-4 lg:py-0 border-slate-500">
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center rounded-full bg-blue-600 text-neutral-50 hover:bg-blue-700 focus:outline-none md:h-16 md:w-16"
              onClick={() => {
                router.push({
                  pathname: '/search',
                  query: {
                    n: itemName == 'Search NFTs' && '',
                    i: includeImage,
                    v: includeVideo,
                    a: includeAudio,
                    d: includeDirect,
                    ac: includeAuction,
                    h: includeHasOffers,
                    _r: priceRange[0],
                    r_: priceRange[1],
                  },
                })
              }}
            >
              <span className="mr-3 md:hidden">Search</span>
              <RiSearchLine fontSize="25px" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HeroSearch
