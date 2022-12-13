import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAddress, useContract, useNFT } from '@thirdweb-dev/react'
import { config } from '../lib/sanityClient'
import { useThemeContext } from '../contexts/ThemeContext'
import Countdown from 'react-countdown'
import { IconHeart, IconImage, IconLoading } from './icons/CustomIcons'
import { BigNumber } from 'ethers'

const style = {
  wrapper: `bg-[#1E293BEE] shadow-[inset_0_0_0_1px_rgb(255,255,255,0.1)] flex-auto max-w-[17rem] w-[17rem] h-[29rem] mb-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-top`,
  nftImg: `w-full object-cover`,
  details: `p-4`,
  info: `text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: ``,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `text-md mt-2`,
  infoRight: `flex-0.4 text-right`,
  coinLogo: 'mr-2',
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl text-white font-bold mt-4 gap-2`,
  likes: `text-[#8a939b] font-bold flex mt-4 items-center justify-end relative`,
  likeIcon: `text-xl mr-2 hover:animate-ping absolute`,
  likeIconStatic: `text-xl mr-2 `,
  button: `mt-2 mb-2 flex items-center py-2 px-5 rounded-lg cursor-pointer text-sm justify-center`,
  buttonIcon: `text-l text-white`,
  buttonText: `text-white ml-2 text-md`,
}

const NFTCardLocal = ({ nftItem, listings }) => {
  const [isListed, setIsListed] = useState(false)
  const [price, setPrice] = useState(0)
  const [secondsUntilEnd, setSecondsUntilEnd] = useState(0)
  const [coin, setCoin] = useState('')
  const address = useAddress()
  const [likers, setLikers] = useState([])
  const { dark } = useThemeContext()
  const { contract } = useContract(nftItem.contractAddress)
  const {
    data: nft,
    isLoading,
    error,
  } = useNFT(contract?.nft, nftItem.id.toString())

  useEffect(() => {
    if (!listings) return

    const listing = listings.find(
      (listing) =>
        listing.asset.id.toString() == nftItem.id.toString() &&
        listing.assetContractAddress == nftItem.contractAddress
    )
    // console.log(listing);
    if (Boolean(listing)) {
      setIsListed(true)
      setPrice(listing.buyoutCurrencyValuePerToken.displayValue)
      setCoin(listing.buyoutCurrencyValuePerToken.symbol)
      if (listing.secondsUntilEnd) {
        setSecondsUntilEnd(BigNumber.from(listing.secondsUntilEnd).toNumber())
      }
    }
  }, [listings, nftItem])

  useEffect(() => {
    //getting NFT likes from Sanity
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && _id == "${
        nftItem._id
      }"] {
        likedBy
      }`
      const res = await sanityClient.fetch(query)
      setLikers(res[0])
    })()
  }, [nftItem])

  return (
    <div
      className={`relative ${
        dark ? ' bg-slate-800' : ' bg-white'
      } group flex flex-col rounded-3xl p-2.5 shadow-md transition hover:shadow-xl`}
    >
      <Link
        href={`/nfts/${nftItem.id.toString()}?c=${nftItem.contractAddress}`}
      >
        <div className="relative flex-shrink-0 cursor-pointer">
          <div>
            <div className="nc-NcImage aspect-w-11 aspect-h-12 relative z-0 flex h-[415px] w-full overflow-hidden rounded-2xl">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <IconLoading />
                </div>
              ) : (
                <Image
                  src={nft?.metadata.image}
                  className="h-full w-full rounded-2xl transition-transform duration-300 ease-in-out will-change-transform hover:scale-[1.03]"
                  objectFit="cover"
                  layout="fill"
                  alt={nft?.metadata.name}
                />
              )}
            </div>
          </div>

          <div className="absolute  bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white md:h-9 md:w-9">
            <IconImage />
          </div>

          <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-2">
            <button className="flex !h-9 items-center justify-center rounded-full bg-black/50 px-3.5  text-white">
              <IconHeart />
              <span className="ml-2 text-sm">
                {likers?.likedBy?.length ? likers.likedBy.length : '0'}
              </span>
            </button>

            {/* <div className="hidden md:flex -space-x-1.5">
              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white ">
                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={nftItem.metadata.image} alt="John Doe"/>
                <span className="wil-avatar__name">J</span>
              </div>

              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white ">
                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={nftItem.metadata.image} alt="John Doe"/>
                <span className="wil-avatar__name">J</span>
              </div>

              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white ">
                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={nftItem.metadata.image} alt="John Doe"/>
                <span className="wil-avatar__name">J</span>
              </div>
            </div> */}
          </div>

          {/* {secondsUntilEnd > 0 && (
            <div className="absolute top-[-1px] right-[-1px] flex items-center">
              <svg
                className={`w-44 ${
                  dark ? 'text-slate-800' : 'text-white'
                } md:w-[195px]`}
                viewBox="0 0 196 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M196 55V0H0.5V1H4.05286C12.4067 1 20.1595 5.34387 24.5214 12.4685L43.5393 43.5315C47.9012 50.6561 55.654 55 64.0078 55H196Z"
                  fill="currentColor"
                ></path>
              </svg>

              <div className="absolute right-1 top-1/2 -translate-y-1/2 pb-1 text-right">
                <span className="block text-xs tracking-wide text-neutral-500 dark:text-neutral-400">
                  Remaining time
                </span>
                <span className="block font-semibold md:text-lg">
                  {<Countdown date={Date.now() + secondsUntilEnd} />}
                </span>
              </div>
            </div>
          )} */}

          <div className="absolute left-[-1px] bottom-[-0.4px] ">
            <svg
              className={`w-64 ${
                dark ? 'text-slate-800' : 'text-white'
              } md:w-[268px]`}
              width="268"
              viewBox="0 0 281 99"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0V99H258.059C248.54 99 239.92 93.3743 236.089 84.6606L205.167 14.3394C201.335 5.62568 192.716 0 183.197 0H0Z"
                fill="currentColor"
              ></path>
            </svg>

            <div className="absolute left-4 bottom-0 w-48 ">
              <h2 className="text-left text-sm font-semibold">
                {nftItem.name}
              </h2>

              <div className="mt-1.5 flex w-full items-end justify-between ">
                <div className="pt-3">
                  <div
                    className={`relative flex items-baseline rounded-lg border ${
                      isListed ? ' border-green-500' : ' border-rose-500'
                    } py-1.5 px-2.5 text-sm font-semibold sm:text-base md:py-2 md:px-3.5 `}
                  >
                    {isListed ? (
                      <>
                        <span className="absolute bottom-full -mx-1 block translate-y-1 rounded-md bg-green-500 py-0 px-3 text-xs font-normal text-white">
                          Price
                        </span>
                        <span className=" !leading-none text-green-500">
                          {price} {coin}
                        </span>
                      </>
                    ) : (
                      <span className=" !leading-none text-rose-500">
                        Not Listed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NFTCardLocal
