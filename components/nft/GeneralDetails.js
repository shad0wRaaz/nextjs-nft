import axios from 'axios'
import Link from 'next/link'
import Report from '../Report'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { ImHammer2 } from 'react-icons/im'
import { useQueryClient } from 'react-query'
import HelmetMetaData from '../HelmetMetaData'
import { HiOutlineMail } from 'react-icons/hi'
import { config } from '../../lib/sanityClient'
import { useAddress } from '@thirdweb-dev/react'
import { useChainId } from '@thirdweb-dev/react'
import { TbBrandTelegram } from 'react-icons/tb'
import { MdOutlineBugReport } from 'react-icons/md'
import { Menu, Transition } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import { getUnsignedImagePath } from '../../fetchers/s3'
import { useUserContext } from '../../contexts/UserContext'
import { updateListings } from '../../fetchers/Web3Fetchers'
import { useThemeContext } from '../../contexts/ThemeContext'
import { getUserContinuously } from '../../fetchers/SanityFetchers'
import { FiMoreVertical, FiFacebook, FiTwitter } from 'react-icons/fi'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { RiShareBoxLine, RiCloseCircleLine, RiFireLine, RiAuctionLine } from 'react-icons/ri'
import { AiFillFire, AiOutlineReddit, AiOutlineWhatsApp } from 'react-icons/ai'
import { FacebookShareButton, RedditShareButton, TwitterShareButton, WhatsappShareButton, TelegramShareButton, EmailShareButton } from 'react-share'

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const style = {
  wrapper: `flex`,
  infoContainer: `h-36 flex flex-col flex-1 justify-between mb-6`,
  accent: `text-black`,
  collectionName:
    'cursor-pointer rounded-md hover:opacity-90 text-sm p-2 bg-white text-black',
  nftTitle: `text-3xl font-extrabold text-black mt-2`,
  otherInfo: `flex`,
  ownedBy: `text-black mr-4`,
  likes: `flex items-center text-[#8a939b]`,
  likeIcon: `mr-1`,
  actionButtonsContainer: `w-44`,
  actionButtons: `flex container justify-between text-[1.4rem] border border-white border-slate-700 rounded-lg`,
  actionButton: `my-2`,
  divider: `border border-white border-slate-700 border-r-1`,
}

const GeneralDetails = ({ nftContractData, listingData, metaDataFromSanity }) => {
  const { queryStaleTime } = useUserContext()
  const { marketplaceAddress } = useMarketplaceContext()
  const market = ''
  const queryClient = useQueryClient()
  const { dark } = useThemeContext()
  const address = useAddress()
  const router = useRouter()
  const chainid = useChainId()
  const [collectionProfile, setCollectionProfile] = useState()
  const [userProfile, setUserProfile] = useState()
  const [auctionedItem, setAuctionedItem] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const shareURL = `https://nuvanft.io/nfts/${metaDataFromSanity?._id}`

  // const { data: collectionData, status: collectionStatus } = useQuery(
  //   ['collection', router.query.c],
  //   getNFTCollection(),
  //   {
  //     staleTime: queryStaleTime,
  //     enabled: false && Boolean(router.query.c),
  //     onError: () => {
  //       toast.error(
  //         'Error fetching collection data. Refresh and try again.',
  //         errorToastStyle
  //       )
  //     },
  //     onSuccess: (res) => {
  //       console.log(res)
  //       ;(async () => {
  //         setCollectionProfile(await getUnsignedImagePath(res[0]?.profileImage))
  //       })()
  //     },
  //   }
  // )

  //get collection profile image
  useEffect(() => {
    if(!metaDataFromSanity) return
    ;(async()=>{
      setCollectionProfile(await getUnsignedImagePath(metaDataFromSanity?.collection?.profileImage))
    })()
  }, [metaDataFromSanity])

  //getCollection Name from Sanity
  const { data: ownerData, status: ownerStatus } = useQuery(
    ['user', nftContractData?.owner],
    getUserContinuously(),
    {
      enabled: Boolean(nftContractData) && Boolean(nftContractData.owner != "0x0000000000000000000000000000000000000000"),
      onError: () => {
        toast.error('Error in getting Owner info.', errorToastStyle)
      },
      onSuccess: (res) => {
        //check if the item is in auction, if in auction, owner will be marketplace
        if (!res && (nftContractData?.owner == marketplaceAddress)
        ) {
          setAuctionedItem(true)
          return
        }
        
        ;(async () => {
          setUserProfile(await getUnsignedImagePath(res?.profileImage))
        })()
      },
    }
  )

  const burn = (e, sanityClient = config, toastHandler = toast) => {
    if (Boolean(listingData)) {
      toastHandler.error(
        'Cannot burn a listed NFT. Delist this NFT first.',
        errorToastStyle
      )
      return
    }
    ;(async () => {
      try {
        const tx = await contract.burn(nftContractData.metadata.id.toString())

        //saving transaction in sanity
        const transactionData = {
          _type: 'activities',
          _id: tx.receipt.transactionHash,
          transactionHash: tx.receipt.transactionHash,
          from: tx.receipt.from,
          contractAddress: collectionAddress,
          tokenid: nftContractData.metadata.id.toString(),
          to: tx.receipt.to,
          event: 'Burn',
          price: '-',
          chainId: chainid,
          dateStamp: new Date(),
        }
        console.log(transactionData)
        await sanityClient
          .createIfNotExists(transactionData)
          .then(() => {
            queryClient.invalidateQueries(['marketplace'])
            queryClient.invalidateQueries(['activities'])
            queryClient.invalidateQueries(['user'])
          })
          .catch((err) => {
            console.log(err)
            toastHandler.error(
              'Error saving Transaction Activity. Contact administrator.',
              errorToastStyle
            )
            return
          })
      } catch (error) {
        toastHandler.error(error, errorToastStyle)
      }
    })()
  }

  const cancelListing = (
    e,
    module = market,
    sanityClient = config,
    toastHandler = toast
  ) => {
    if (!Boolean(listingData)) return
    ;(async () => {
      try {
        const tx = await module.direct.cancelListing(listingData.id)
        // console.log(tx.receipt)
        if (tx) {
          toastHandler.success(
            'The NFT has been delisted from the marketplace.',
            successToastStyle
          )

              //update listing data
          ;(async() => {
            await axios.get(process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080/api/updateListings' : 'http://localhost:8080/api/updateListings')
          })()

          //saving transaction in sanity
          const transactionData = {
            _type: 'activities',
            _id: tx.receipt.transactionHash,
            transactionHash: tx.receipt.transactionHash,
            from: tx.receipt.from,
            tokenid: nftContractData.metadata.id.toString(),
            to: tx.receipt.to,
            event: 'Delist',
            nftItem: { _ref: nftContractData.metadata.properties.tokenid, _type: 'reference'},
            price: '-',
            chainId: chainid,
            dateStamp: new Date(),
          }
          // console.log(transactionData)
          await sanityClient
            .createIfNotExists(transactionData)
            .then(() => {
              queryClient.invalidateQueries(['marketplace'])
              queryClient.invalidateQueries(['activities'])
            })
            .catch((err) => {
              console.log(err)
              toastHandler.error(
                'Error saving Transaction Activity. Contact administrator.',
                errorToastStyle
              )
              return
            })
        }
      } catch (err) {
        console.error(err)
        toastHandler.error('Error in delisting this NFT.', errorToastStyle)
        return
      }
    })()
  }

  return (
    <div className={dark ? ' text-neutral-200' : 'text-black'}>
      <HelmetMetaData 
        title={nftContractData?.metadata?.name}
        description={nftContractData?.metadata?.description}
        image={nftContractData?.metadata?.image}
        tokenId={nftContractData?.metadata?.properties?.tokenid}
        contractAddress={metaDataFromSanity?.collection?.contractAddress}>
          
        </HelmetMetaData>
      {/* Modal window*/}
      {showModal &&  
        <Report 
          showModal={showModal} 
          setShowModal={setShowModal} 
          dark={dark} 
          itemType="NFT" 
          nftContractData={nftContractData} 
          metaDataFromSanity={ metaDataFromSanity }
        />}
      {/* End of Modal window*/}
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          {nftContractData?.metadata?.name}
        </h1>
        <div 
          className="relative block w-fit rounded-lg bg-green-100 cursor-pointer border-green-200 border px-4 py-1 text-xs font-medium text-green-800"
          style={{ marginTop: '10px'}}
          onClick={() => {
            router.push({
              pathname: '/search',
              query: {
                c: metaDataFromSanity?.collection.category,
                n: '',
                i: 'true',
                v: 'true',
                a: 'true',
                d: 'true',
                ac: 'true',
                h: 'true',
                _r: 0,
                r_: 100,
              },
            })
          }}>
            { metaDataFromSanity?.collection?.category }
          </div>

        <div className="flex flex-col-reverse gap-5 space-y-4 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-8">
          <div className="flex items-center">
            <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white dark:ring-neutral-900">
              {metaDataFromSanity && (
                <Link href={`/collections/${metaDataFromSanity?.collection?._id}`}>
                  <img
                    className="absolute inset-0 h-full w-full cursor-pointer rounded-full object-cover"
                    src={collectionProfile?.data.url}
                    alt={metaDataFromSanity?.collection?.name}
                  />
                </Link>
              )}
              <span className="wil-avatar__name">J</span>
            </div>

            <span className="ml-2.5 flex flex-col">
              <span className="text-sm">Collection</span>
              <span className="flex items-center font-medium">
                <Link href={`/collections/${metaDataFromSanity?.collection?._id}`}>
                  <span className="cursor-pointer">{metaDataFromSanity?.collection?.name}</span>
                </Link>
                <span className="ml-1">
                  <svg className="h-4 w-4" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M7.66691 2.62178C8.12691 2.22845 8.88025 2.22845 9.34691 2.62178L10.4002 3.52845C10.6002 3.70178 10.9736 3.84178 11.2402 3.84178H12.3736C13.0802 3.84178 13.6602 4.42178 13.6602 5.12845V6.26178C13.6602 6.52178 13.8002 6.90178 13.9736 7.10178L14.8802 8.15512C15.2736 8.61512 15.2736 9.36845 14.8802 9.83512L13.9736 10.8884C13.8002 11.0884 13.6602 11.4618 13.6602 11.7284V12.8618C13.6602 13.5684 13.0802 14.1484 12.3736 14.1484H11.2402C10.9802 14.1484 10.6002 14.2884 10.4002 14.4618L9.34691 15.3684C8.88691 15.7618 8.13358 15.7618 7.66691 15.3684L6.61358 14.4618C6.41358 14.2884 6.04025 14.1484 5.77358 14.1484H4.62025C3.91358 14.1484 3.33358 13.5684 3.33358 12.8618V11.7218C3.33358 11.4618 3.19358 11.0884 3.02691 10.8884L2.12691 9.82845C1.74025 9.36845 1.74025 8.62178 2.12691 8.16178L3.02691 7.10178C3.19358 6.90178 3.33358 6.52845 3.33358 6.26845V5.12178C3.33358 4.41512 3.91358 3.83512 4.62025 3.83512H5.77358C6.03358 3.83512 6.41358 3.69512 6.61358 3.52178L7.66691 2.62178Z"
                      fill="#38BDF8"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M6.08691 8.98833L7.69358 10.6017L10.9136 7.375"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </span>
            </span>
          </div>

          <div
            className={`hidden h-6 border-l ${
              dark ? ' border-slate-800' : 'border-neutral-200'
            } sm:block`}
          ></div>

          <div className="flex items-center">
            {ownerStatus == 'Loading' && <Loader />}
            {ownerStatus == 'success' ? (
              !ownerData ? (
                auctionedItem ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 p-2 px-4 text-white">
                    <RiAuctionLine className="text-xl" /> <span>This item is on Auction</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-md bg-rose-500 py-2 px-4 text-white">
                    <AiFillFire /> Burnt NFT
                  </div>
                )
              ) : (
                <Link href={`/user/${ownerData?.walletAddress}`}>
                  <div className="flex">
                    <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white">
                      <img
                        className="absolute inset-0 h-full w-full rounded-full object-cover"
                        src={userProfile?.data.url}
                        alt={ownerData?.userName}
                      />
                    </div>

                    <span className="ml-2.5 flex cursor-pointer flex-col">
                      <span className="text-sm">Owner</span>
                      <span className="flex items-center font-medium">
                        <span>{ownerData?.userName}</span>
                        <span className="ml-1">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M7.66691 2.62178C8.12691 2.22845 8.88025 2.22845 9.34691 2.62178L10.4002 3.52845C10.6002 3.70178 10.9736 3.84178 11.2402 3.84178H12.3736C13.0802 3.84178 13.6602 4.42178 13.6602 5.12845V6.26178C13.6602 6.52178 13.8002 6.90178 13.9736 7.10178L14.8802 8.15512C15.2736 8.61512 15.2736 9.36845 14.8802 9.83512L13.9736 10.8884C13.8002 11.0884 13.6602 11.4618 13.6602 11.7284V12.8618C13.6602 13.5684 13.0802 14.1484 12.3736 14.1484H11.2402C10.9802 14.1484 10.6002 14.2884 10.4002 14.4618L9.34691 15.3684C8.88691 15.7618 8.13358 15.7618 7.66691 15.3684L6.61358 14.4618C6.41358 14.2884 6.04025 14.1484 5.77358 14.1484H4.62025C3.91358 14.1484 3.33358 13.5684 3.33358 12.8618V11.7218C3.33358 11.4618 3.19358 11.0884 3.02691 10.8884L2.12691 9.82845C1.74025 9.36845 1.74025 8.62178 2.12691 8.16178L3.02691 7.10178C3.19358 6.90178 3.33358 6.52845 3.33358 6.26845V5.12178C3.33358 4.41512 3.91358 3.83512 4.62025 3.83512H5.77358C6.03358 3.83512 6.41358 3.69512 6.61358 3.52178L7.66691 2.62178Z"
                              fill="#38BDF8"
                              stroke="#38BDF8"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M6.08691 8.98833L7.69358 10.6017L10.9136 7.375"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </span>
                  </div>
                </Link>
              )
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flow-root">
            <div className={`my-1.5 flex gap-4 text-lg border ${dark ? 'border-slate-700/50' : 'border-neutral-200/80 bg-neutral-100'} rounded-xl items-center py-2 px-4`}>
              <div className="text-sm hidden md:block">
                Share this NFT:
              </div>
              <FacebookShareButton className="hover:scale-125 transition"
                quote={nftContractData?.metadata?.name}
                url={shareURL}>
                {dark ? (
                    <FiFacebook
                      className="mr-2 h-5 w-5"
                      color="#ffffff"
                    />
                  ) : (
                    <FiFacebook
                      className="mr-2 h-5 w-5"
                      color="#000000"
                    />
                  )
                }
              </FacebookShareButton>
              <TwitterShareButton className="hover:scale-125 transition"
                url={shareURL}>
                {dark ? (
                  <FiTwitter
                    className="mr-2 h-5 w-5"
                    color="#ffffff"
                  />
                  ) : (
                    <FiTwitter
                      className="mr-2 h-5 w-5"
                      color="#000000"
                    />
                  )}
              </TwitterShareButton>
              <RedditShareButton className="hover:scale-150 transition scale-125"
                url={shareURL}>
                {dark ? (
                  <AiOutlineReddit
                    className="mr-2 h-5 w-5"
                    color="#ffffff"
                  />
                ) : (
                  <AiOutlineReddit
                    className="mr-2 h-5 w-5"
                    color="#000000"
                  />
                )}
              </RedditShareButton>
              <WhatsappShareButton className="hover:scale-125 transition"
                url={shareURL}>
                {dark ? (
                  <AiOutlineWhatsApp
                    className="mr-2 h-5 w-5"
                    color="#ffffff"
                  />
                ) : (
                  <AiOutlineWhatsApp
                    className="mr-2 h-5 w-5"
                    color="#000000"
                  />
                )}
              </WhatsappShareButton>
              <TelegramShareButton className="hover:scale-125 transition"
                url={shareURL}>
                {dark ? (
                  <TbBrandTelegram
                    className="mr-2 h-5 w-5"
                    color="#ffffff"
                  />
                ) : (
                  <TbBrandTelegram
                    className="mr-2 h-5 w-5"
                    color="#000000"
                  />
                )}
              </TelegramShareButton>
              <EmailShareButton className="hover:scale-125 transition"
                url={shareURL}>
                {dark ? (
                  <HiOutlineMail
                    className="mr-2 h-5 w-5"
                    color="#ffffff"
                  />
                ) : (
                  <HiOutlineMail
                    className="mr-2 h-5 w-5"
                    color="#000000"
                  />
                )}
              </EmailShareButton>
              {nftContractData?.metadata?.properties?.external_link ? (
                <Link href={nftContractData?.metadata?.properties?.external_link}>
                  <a target="_blank" className=" scale-105 transition">
                    <RiShareBoxLine className="cursor-pointer transition hover:scale-125" />
                  </a>
                </Link>
              ) : (
                <RiShareBoxLine />
              )}

              {address && (
                <Menu as="div" className="relative inline-block -top-[5px] leading-[12px]">
                  <div>
                    <Menu.Button className="transition hover:scale-125">
                      <FiMoreVertical className="top-1 relative" />
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
                      className={`absolute -right-4 z-20 mt-2 w-60 p-4 origin-top-right divide-y divide-gray-100 rounded-2xl ${
                        dark
                          ? ' bg-slate-700 text-neutral-100'
                          : ' bg-white text-gray-900'
                      } shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    >
                      <div className="p-1">
                        {/* {nftContractData?.owner == address && Boolean(listingData) && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? dark
                                      ? ' bg-slate-600 text-neutral-100'
                                      : 'bg-blue-500 text-white'
                                    : dark
                                    ? ' text-neutral-100'
                                    : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  dark ? (
                                    <RiCloseCircleLine
                                      className="mr-2 h-5 w-5"
                                      color="#ffffff"
                                    />
                                  ) : (
                                    <RiCloseCircleLine
                                      className="mr-2 h-5 w-5"
                                      color="#000000"
                                    />
                                  )
                                ) : dark ? (
                                  <RiCloseCircleLine
                                    className="mr-2 h-5 w-5"
                                    color="#ffffff"
                                  />
                                ) : (
                                  <RiCloseCircleLine
                                    className="mr-2 h-5 w-5"
                                    color="#000000"
                                  />
                                )}
                                Cancel Direct Listing
                              </button>
                            )}
                          </Menu.Item>
                        )}
                        {nftContractData?.owner == address && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? dark
                                      ? ' bg-slate-600 text-neutral-100'
                                      : 'bg-neutral-100'
                                    : dark
                                    ? ' text-neutral-100'
                                    : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  dark ? (
                                    <RiFireLine
                                      className="mr-2 h-5 w-5"
                                      color="#ffffff"
                                    />
                                  ) : (
                                    <RiFireLine
                                      className="mr-2 h-5 w-5"
                                      color="#000000"
                                    />
                                  )
                                ) : dark ? (
                                  <RiFireLine
                                    className="mr-2 h-5 w-5"
                                    color="#ffffff"
                                  />
                                ) : (
                                  <RiFireLine
                                    className="mr-2 h-5 w-5"
                                    color="#000000"
                                  />
                                )}
                                Burn this NFT
                              </button>
                            )}
                          </Menu.Item>
                        )} */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setShowModal(true)}
                              className={`${
                                active
                                  ? dark
                                    ? ' bg-slate-600 text-neutral-100'
                                    : 'bg-neutral-100'
                                  : dark
                                  ? ' text-neutral-100'
                                  : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              {active ? (
                                dark ? (
                                  <MdOutlineBugReport
                                    className="mr-2 h-5 w-5"
                                    color="#ffffff"
                                  />
                                ) : (
                                  <MdOutlineBugReport
                                    className="mr-2 h-5 w-5"
                                    color="#000000"
                                  />
                                )
                              ) : dark ? (
                                <MdOutlineBugReport
                                  className="mr-2 h-5 w-5"
                                  color="#ffffff"
                                />
                              ) : (
                                <MdOutlineBugReport
                                  className="mr-2 h-5 w-5"
                                  color="#000000"
                                />
                              )}
                              Report this NFT
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* if item is auction listed */}

      {/* end of aution timer */}
      {/* <div className={style.wrapper}>
        <div className={style.infoContainer}>
          <Link href={`/collections/${router.query.c}`}>
            <div>
              <span className={style.collectionName}>
                {collectionName?.name ? collectionName?.name: 'Collection not known'} 
              </span> 
            </div>
          </Link>
          <div className={style.nftTitle}>{selectedNft?.metadata?.name}</div>
          <div className={style.ownedBy}>
            { selectedNft?.metadata?.description }
          </div>
          <div className={style.otherInfo}>
            <div className={style.ownedBy}>
              Owned by <span className={style.accent}>{selectedNft?.owner}</span>
            </div>
          </div>
        </div>
        <div className={style.actionButtonsContainer}>
          <div className={style.actionButtons}>
            <div className={`${style.actionButton} ml-2`}>
              <MdRefresh />
            </div>
            <div className={style.divider} />
            <div className={style.actionButton}>
              <RiShareBoxLine />
            </div>
            <div className={style.divider} />
            <div className={style.actionButton}>
              <GiShare />
            </div>
            <div className={style.divider} />
            <div className={`${style.actionButton} mr-2`}>
              <FiMoreVertical />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default GeneralDetails
