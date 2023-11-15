import Link from 'next/link'
import Image from 'next/image'
import { BigNumber } from 'ethers'
import Countdown from 'react-countdown'
import { useEffect, useState } from 'react'
import { config } from '../lib/sanityClient'
import { MdAudiotrack } from 'react-icons/md'
import { RiAuctionLine } from 'react-icons/ri'
import { getImagefromWeb3 } from '../fetchers/s3'
import { useUserContext } from '../contexts/UserContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconHeart, IconImage, IconVideo } from './icons/CustomIcons'
import SkeletonLoader from './SkeletonLoader'

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

const NFTCardExternal = ({
  chain,
  nftItem,
  showUnlisted,
  collectionAddress,
  creator,
  hasOwner,
  compact,
}) => {
  // const [likers, setLikers] = useState([])
  const { dark } = useThemeContext();
  const { myUser } = useUserContext();
  const [listedItem, setListedItem] = useState();
  const [isAuctionItem, setIsAuctionItem] = useState(null);
  const [imgPath, setImgPath] = useState();

  useEffect(() => {

    ;(async () => {
      const nftImagePath = await getImagefromWeb3(nftItem.metadata.image);
      // console.log(nftImagePath)
      setImgPath(nftImagePath?.data);
    })();

    return () => {}

  }, []);

  // useEffect(() => {
  //   if (!listings || !nftItem) return
  //   let listing = [];

  //   if(hasOwner){
  //     //check if the nftItem is contract data or owner data,, main idea is to get the nft collection's contract address
  //     if(Boolean(nftItem?.contract)){
  //       listing = listings.find((listing) => listing.assetContractAddress.toLowerCase() == nftItem.contract.toLowerCase() && listing.asset.id == nftItem.tokenId)
  //     }
  //     else if(Boolean(nftItem?.tokenAddress)){
  //       listing = listings.find((listing) => listing.assetContractAddress.toLowerCase() == nftItem.tokenAddress.toLowerCase() && listing.asset.id == nftItem.tokenId)
  //     }
  //   }else{
  //     //check if the nftItem is contract data or owner data
  //     if(Boolean(nftItem?.contract)){
  //       listing = listings.find((listing) => listing.assetContractAddress.toLowerCase() == nftItem.contract.toLowerCase() && listing.asset.id == nftItem.tokenId)
  //     }
  //     else if(Boolean(nftItem?.tokenAddress)){
  //       listing = listings.find((listing) => listing.assetContractAddress.toLowerCase() == nftItem.tokenAddress.toLowerCase() && listing.asset.id == nftItem.tokenId)
  //     }
  //   }
  //   // console.log(listing);
  //   if (Boolean(listing)) {
  //     setListedItem(listing)
  //   }
  //   return() =>{
  //     //do nothing
  //   }
  // }, [listings, nftItem])

  // useEffect(() => {
  //   //getting NFT likes from Sanity
  //   ;(async (sanityClient = config) => {
  //     if (nftItem?.metadata?.properties?.tokenid != null){
  //       const query = `*[_type == "nftItem" && _id == "${nftItem.metadata.properties.tokenid}"] {
  //         likedBy, "totalLikers": count(likedBy)
  //       }`

  //       const res = await sanityClient.fetch(query)

  //       setLikers(res[0])
  //     }
  //   })()
  //   return() => {
  //     //do nothing
  //   }
  // }, [nftItem])

  return (
    <>
      {/* {!Boolean(listedItem) &&
      !showUnlisted && !Boolean(nftItem.metadata) &&
      creator._ref != myUser?.walletAddress ? ( */}
      {!Boolean(nftItem.metadata) ? (
        ''
      ) : (
        <div
          className={`relative z-0 ${
            dark ? ' bg-slate-800' : ' bg-white'
          } group flex flex-col rounded-2xl p-2 shadow-md transition hover:shadow-xl overflow-hidden w-full`}
         >
          {/* <Link
            href={nftItem?.metadata?.properties?.tokenid ? `/nfts/${nftItem?.metadata?.properties?.tokenid}` : "#"}
          > */}
          <a
            href={`/nft/${chain}/${collectionAddress ? collectionAddress : nftItem.token_address}/${nftItem.token_id}`}
          >
            <div className="relative flex-shrink-0 cursor-pointer">
              <div>
                <div className={`aspect-w-11 aspect-h-12 relative z-0 flex ${compact ?  'h-[250px]' : 'h-[415px]'} w-full overflow-hidden rounded-2xl`}>
                  {imgPath ? (
                    <img
                      src={imgPath}
                      className="h-full w-full rounded-2xl transition-transform duration-300 ease-in-out will-change-transform hover:scale-[1.03] max-w-full object-cover"
                      alt={nftItem?.metadata?.name}
                      loading='lazy'
                    />
                  ) : 
                  <SkeletonLoader roundness="xl"/> 
                  }
                </div>
                {Boolean(nftItem?.listingData?.type == 1) && (
                  <div className="absolute left-2 top-2 bg-slate-800/90 rounded-full p-2">
                    <RiAuctionLine />
                  </div>
                )}
              </div>

              <div className="absolute  bottom-2.5 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white md:h-9 md:w-9">
                {nftItem?.metadata?.properties?.itemtype == "audio" ? <MdAudiotrack /> :
                nftItem?.metadata?.properties?.itemtype == "video" ? <IconVideo /> : <IconImage />}
              </div>

              {/* <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-2">
                <button className="flex !h-9 items-center justify-center rounded-full bg-black/50 px-3.5  text-white">
                  <IconHeart />
                  <span className="ml-2 text-sm">
                    {likers?.likedBy?.length ? likers.likedBy.length : '0'}
                  </span>
                </button>
              </div> */}

              {/* Remaining timer is currently disabled in every NFT card, performance issues */}
              {/* {Boolean(listedItem) && false && (
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
                      {isAuctionItem ? 'Auction ends in' : 'Remaining time'}
                    </span>
                    <span className="block font-semibold md:text-lg">
                      {!isAuctionItem &&
                        Boolean(listedItem.secondsUntilEnd) && (
                          <Countdown
                            date={
                              Date.now() +
                              (BigNumber.from(
                                listedItem.secondsUntilEnd
                              ).toNumber() -
                                BigNumber.from(
                                  listedItem.startTimeInSeconds
                                ).toNumber()) *
                                1000
                            }
                          />
                        )}
                      {isAuctionItem != null && isAuctionItem && (
                        <Countdown
                          date={
                            Date.now() +
                            BigNumber.from(
                              listedItem.endTimeInEpochSeconds
                            ).toNumber()
                          }
                        />
                      )}
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

                <div className={`absolute ${!compact && 'left-4'} bottom-2 w-44 `}>
                  <h2 className="text-left text-sm font-semibold">
                    {nftItem.metadata?.name}
                  </h2>

                  <div className="mt-1.5 flex w-full items-end justify-between ">
                    <div className="pt-1">
                      <div
                        className={`relative flex items-baseline rounded-lg border ${
                          Boolean(nftItem?.listingData)
                            ? ' border-green-500'
                            : ' border-rose-500'
                        } py-1.5 px-2.5 text-xs font-semibold sm:text-base md:py-2 md:px-3.5 `}
                      >
                        {Boolean(nftItem?.listingData) ? (
                          <>
                            {/* <span className="absolute bottom-full -mx-1 block translate-y-1 rounded-md bg-green-500 py-0 px-3 text-xs font-normal text-white">
                              Price
                            </span> */}
                            <span className=" !leading-none text-green-500">
                              {
                                parseInt(nftItem?.listingData?.buyoutPrice.hex, 16) / Math.pow(10, 18)
                              }{' '}
                              <span className="text-xs">{nftItem?.listingData?.buyoutCurrencyValuePerToken.symbol}</span>
                            </span>
                          </>
                        ) : (
                          <span className="text-xs !leading-none text-rose-500">
                            Not Listed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      )}
    </>
  )
}

export default NFTCardExternal
