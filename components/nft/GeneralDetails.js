import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { GiShare } from 'react-icons/gi'
import { AiFillFire } from 'react-icons/ai'
import { config } from '../../lib/sanityClient'
import { ImHammer2 } from 'react-icons/im'
import { useState } from 'react'
import {
  useAddress,
  useMarketplace,
  useNFTCollection,
} from '@thirdweb-dev/react'
import { MdOutlineBugReport } from 'react-icons/md'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { RiShareBoxLine, RiCloseCircleLine, RiFireLine } from 'react-icons/ri'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { useQueryClient } from 'react-query'
import { useChainId } from '@thirdweb-dev/react'
import {
  FiMoreVertical,
  FiFacebook,
  FiTwitter,
  FiInstagram,
} from 'react-icons/fi'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useQuery } from 'react-query'
import {
  getUserContinuously,
  getNFTCollection,
} from '../../fetchers/SanityFetchers'
import { useUserContext } from '../../contexts/UserContext'
import { getUnsignedImagePath } from '../../fetchers/s3'

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

const GeneralDetails = ({ selectedNft, listingData, nftCollection }) => {
  const collectionAddress = nftCollection.contractAddress
  const { queryStaleTime } = useUserContext()
  const { marketplaceAddress } = useMarketplaceContext()
  const contract = useNFTCollection(collectionAddress)
  const market = useMarketplace(marketplaceAddress)
  const queryClient = useQueryClient()
  const { dark } = useThemeContext()
  const address = useAddress()
  const router = useRouter()
  const chainid = useChainId()
  const [collectionProfile, setCollectionProfile] = useState()
  const [userProfile, setUserProfile] = useState()
  const [auctionedItem, setAuctionedItem] = useState(false)
  const { data: collectionData, status: collectionStatus } = useQuery(
    ['collection', router.query.c],
    getNFTCollection(),
    {
      staleTime: queryStaleTime,
      enabled: Boolean(router.query.c),
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        ;(async () => {
          setCollectionProfile(await getUnsignedImagePath(res[0].profileImage))
        })()
      },
    }
  )

  //getCollection Name from Sanity
  const { data: ownerData, status: ownerStatus } = useQuery(
    ['user', selectedNft?.owner],
    getUserContinuously(),
    {
      enabled: Boolean(selectedNft),
      onError: () => {
        toast.error('Error in getting Owner info.', errorToastStyle)
      },
      onSuccess: (res) => {
        ;(async () => {
          setUserProfile(await getUnsignedImagePath(res?.profileImage))
        })()
        //check if the item is in auction, if in auction, owner will be marketplace
        if (
          !res &&
          (selectedNft?.owner == '0x9a9817a85E5d54345323e381AC503F3BDC1f01f4' ||
            selectedNft?.owner == '0x75c169b13A35e1424EC22E099e30cE9E01cF4E3D' || selectedNft?.owner == '0xBfEf2Cd3362E51Ff4C21E2Bd0253292f86DeF599')
        ) {
          setAuctionedItem(true)
        }
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
        const tx = await contract.burn(selectedNft.metadata.id.toString())

        //saving transaction in sanity
        const transactionData = {
          _type: 'activities',
          _id: tx.receipt.transactionHash,
          transactionHash: tx.receipt.transactionHash,
          from: tx.receipt.from,
          contractAddress: collectionAddress,
          tokenid: selectedNft.metadata.id.toString(),
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

          //saving transaction in sanity
          const transactionData = {
            _type: 'activities',
            _id: tx.receipt.transactionHash,
            transactionHash: tx.receipt.transactionHash,
            from: tx.receipt.from,
            contractAddress: collectionAddress,
            tokenid: selectedNft.metadata.id.toString(),
            to: tx.receipt.to,
            event: 'Delist',
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
    <div className={dark ? ' text-neutral-200' : ''}>
      <div
        className={
          dark
            ? 'space-y-5 border-b border-slate-800 pb-9'
            : 'space-y-5 border-b pb-9'
        }
      >
        <div className="flex items-center justify-between">
          <span className="relative inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
            {nftCollection?.category}
          </span>
          <div className="flow-root">
            <div className="-my-1.5 flex gap-4 text-lg">
              {selectedNft?.metadata?.properties?.external_link ? (
                <Link href={selectedNft?.metadata?.properties?.external_link}>
                  <a target="_blank" className=" scale-105 transition">
                    <RiShareBoxLine className="cursor-pointer transition hover:scale-125" />
                  </a>
                </Link>
              ) : (
                <RiShareBoxLine />
              )}

              <Menu as="div" className="relative inline-block">
                <div>
                  <Menu.Button className="transition hover:scale-125">
                    <GiShare />
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
                    className={`absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 ${
                      dark ? ' bg-slate-700' : ' bg-white'
                    } rounded-2xl  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <div className="p-3">
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
                            ) : dark ? (
                              <FiFacebook
                                className="mr-2 h-5 w-5"
                                color="#ffffff"
                              />
                            ) : (
                              <FiFacebook
                                className="mr-2 h-5 w-5"
                                color="#000000"
                              />
                            )}
                            Share on Facebook
                          </button>
                        )}
                      </Menu.Item>
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
                                <FiTwitter
                                  className="mr-2 h-5 w-5"
                                  color="#ffffff"
                                />
                              ) : (
                                <FiTwitter
                                  className="mr-2 h-5 w-5"
                                  color="#000000"
                                />
                              )
                            ) : dark ? (
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
                            Share on Twitter
                          </button>
                        )}
                      </Menu.Item>
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
                                <FiInstagram
                                  className="mr-2 h-5 w-5"
                                  color="#ffffff"
                                />
                              ) : (
                                <FiInstagram
                                  className="mr-2 h-5 w-5"
                                  color="#000000"
                                />
                              )
                            ) : dark ? (
                              <FiInstagram
                                className="mr-2 h-5 w-5"
                                color="#ffffff"
                              />
                            ) : (
                              <FiInstagram
                                className="mr-2 h-5 w-5"
                                color="#000000"
                              />
                            )}
                            Share on Instagram
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <Menu as="div" className="relative inline-block">
                <div>
                  <Menu.Button className="transition hover:rotate-90">
                    <FiMoreVertical />
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
                    className={`absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md ${
                      dark
                        ? ' bg-slate-700 text-neutral-100'
                        : ' bg-white text-gray-900'
                    } shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <div className="p-1">
                      {selectedNft?.owner == address && Boolean(listingData) && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => cancelListing()}
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
                      {selectedNft?.owner == address && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => burn()}
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
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={cancelListing}
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
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          {selectedNft?.metadata?.name}
        </h2>

        <div className="flex flex-col-reverse gap-5 space-y-4 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-8">
          <div className="flex items-center">
            <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white dark:ring-neutral-900">
              {nftCollection && (
                <Link href={`/collections/${router.query.c}`}>
                  <img
                    className="absolute inset-0 h-full w-full cursor-pointer rounded-full object-cover"
                    src={collectionProfile?.data.url}
                    alt={nftCollection?.name}
                  />
                </Link>
              )}
              <span className="wil-avatar__name">J</span>
            </div>

            <span className="ml-2.5 flex flex-col">
              <span className="text-sm">Collection</span>
              <span className="flex items-center font-medium">
                <Link href={`/collections/${router.query.c}`}>
                  <span className="cursor-pointer">{nftCollection?.name}</span>
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
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 p-2 px-4 text-white">
                    <ImHammer2 /> <span>This item is on Auction</span>
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
