import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { config } from '../lib/sanityClient'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconHeart, IconImage } from './icons/CustomIcons'
import { BigNumber } from 'ethers'

const SearchItem = ({ nftItem }) => {
  const [likers, setLikers] = useState([])
  const { dark } = useThemeContext()

  useEffect(() => {
    //getting NFT likes from Sanity
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && contractAddress == "${
        nftItem.assetContractAddress
      }" && id == "${BigNumber.from(nftItem.asset.id).toNumber()}"] {
            likedBy
          }`
      const res = await sanityClient.fetch(query)
      setLikers(res[0])
    })()
  }, [nftItem])

  return (
    <div className="group relative flex flex-col !border-0">
      <Link
        href={`/nfts/${BigNumber.from(nftItem.asset.id).toNumber()}?c=${
          nftItem.assetContractAddress
        }`}
      >
        <>
          <div className="relative flex-shrink-0 ">
            <div>
              <div
                className="aspect-w-11 aspect-h-12 z-0 flex h-[300px] w-full cursor-pointer overflow-hidden rounded-3xl"
                data-nc-id="NcImage"
              >
                <img
                  src={nftItem.asset.image}
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-[1.03]"
                  alt={nftItem.asset.name}
                />
              </div>
            </div>

            <div className="absolute top-3 left-3 flex !h-9 !w-9 items-center justify-center rounded-full bg-black/50 text-white">
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>

            <button className="absolute top-3 right-3 z-10 flex h-10 !h-9 items-center justify-center rounded-full bg-black/50 px-3.5 text-white">
              <IconHeart />
              <span className="ml-2 text-sm">
                {likers?.likedBy?.length ? likers.likedBy.length : '0'}
              </span>
            </button>

            <div className="absolute inset-x-3 top-3 flex"></div>
          </div>

          <div className="space-y-3 p-4 py-5">
            {/* <div className="flex justify-between" style={{ display: 'hidden' }}>
              <div className="flex -space-x-1 ">
                <div className="wil-avatar relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase text-neutral-100 shadow-inner ring-2 ring-white dark:ring-neutral-900">
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    src="./static/media/Image-9.d879028d45de09c9ca3b.png"
                    alt="John Doe"
                  />
                  <span className="wil-avatar__name">J</span>
                </div>
                <div className="wil-avatar relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase text-neutral-100 shadow-inner ring-2 ring-white dark:ring-neutral-900">
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    src="./static/media/Image-9.d879028d45de09c9ca3b.png"
                    alt="John Doe"
                  />
                  <span className="wil-avatar__name">J</span>
                </div>

                <div className="wil-avatar relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase text-neutral-100 shadow-inner ring-2 ring-white dark:ring-neutral-900">
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    src="./static/media/Image-1.90baa8cc883db8970fda.png"
                    alt="John Doe"
                  />
                  <span className="wil-avatar__name">J</span>
                </div>

                <div className="wil-avatar relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase text-neutral-100 shadow-inner ring-2 ring-white dark:ring-neutral-900">
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    src="./static/media/Image-10.93048ca791076288cf69.png"
                    alt="John Doe"
                  />
                  <span className="wil-avatar__name">J</span>
                </div>
              </div>

              <span className="text-xs text-neutral-700 dark:text-neutral-400">
                85 in stock
              </span>
            </div> */}

            <h2 className="text-lg font-medium">{nftItem.asset.name}</h2>

            <div className={`w-2d4 w-full border-b ${dark ? 'border-sky-700/30' : 'border-neutral-100'}`}></div>

            <div className="flex items-end justify-between ">
              <div className="pt-3">
                <div className="relative flex items-baseline rounded-lg border-2 border-green-500 py-1.5 px-2.5 text-sm font-semibold sm:text-base md:py-2 md:px-3.5 ">
                  <span className={`absolute bottom-full -mx-1 block translate-y-1 p-1 ${dark ? 'bg-slate-900 text-slate-300' : 'bg-white text-neutral-500'} text-xs font-normal text-neutral-500`}>
                    Price
                  </span>

                  <span className=" !leading-none text-green-500">
                    {nftItem.buyoutCurrencyValuePerToken.displayValue}{' '}
                    {nftItem.buyoutCurrencyValuePerToken.symbol}
                  </span>
                </div>
              </div>

              <div className={`flex items-center text-sm ${dark ? 'text-slate-500': 'text-neutral-500'}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>

                <span className={`ml-1 mt-0.5 ${dark ? 'text-slate-500': 'text-neutral-500'}`}>17 hours left</span>
              </div>
            </div>
          </div>
        </>
      </Link>
    </div>
  )
}

export default SearchItem

