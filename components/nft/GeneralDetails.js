import SEO from '../SEO'
import Link from 'next/link'
import Report from '../Report'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useState, Fragment } from 'react'
import HelmetMetaData from '../HelmetMetaData'
import { HiOutlineMail } from 'react-icons/hi'
import { useAddress } from '@thirdweb-dev/react'
import { IconVerified } from '../icons/CustomIcons'
import { MdOutlineBugReport } from 'react-icons/md'
import { Menu, Transition } from '@headlessui/react'
import { createAwatar } from '../../utils/utilities'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { TbBrandTelegram, TbStack2 } from 'react-icons/tb'
import { useThemeContext } from '../../contexts/ThemeContext'
import { RiShareBoxLine , RiAuctionLine } from 'react-icons/ri'
import { getUserContinuously } from '../../fetchers/SanityFetchers'
import { FiMoreVertical, FiFacebook, FiTwitter } from 'react-icons/fi'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { AiFillFire, AiOutlineReddit, AiOutlineWhatsApp } from 'react-icons/ai'
import { FacebookShareButton, RedditShareButton, TwitterShareButton, WhatsappShareButton, TelegramShareButton, EmailShareButton } from 'react-share'


const style = {
  wrapper: `flex`,
  infoContainer: `h-36 flex flex-col flex-1 justify-between mb-6`,
  accent: `text-black`,
  collectionName: 'cursor-pointer rounded-md hover:opacity-90 text-sm p-2 bg-white text-black',
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

const GeneralDetails = ({ nftContractData, chain, owner, listingData, metaDataFromSanity, contractAddress }) => {
  const { marketAddress } = useMarketplaceContext();
  const { dark, successToastStyle, errorToastStyle } = useThemeContext();
  const address = useAddress();
  const router = useRouter();
  const [auctionedItem, setAuctionedItem] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const shareURL = `https://nuvanft.io/nft/${chain}/${nftContractData.contract}/${nftContractData.tokenId}`;

  //getCollection Name from Sanity
  const { data: ownerData, status: ownerStatus } = useQuery(
    ['owner', owner?.owners[0]?.ownerOf.toUpperCase()],
    getUserContinuously(),
  {
      enabled: Boolean(owner?.owners[0]?.ownerOf) && Boolean(owner?.owners[0]?.ownerOf != "0x0000000000000000000000000000000000000000"),
      onError: () => {
        toast.error('Error in getting Owner info.', errorToastStyle);
      },
      onSuccess: (res) => {
        //check if the item is in auction, if in auction, owner will be marketplace
        // if the item is auctioned, then res will be undefined
        const marketArray = [
          process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE.toLowerCase(), 
          process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE.toLowerCase()
          ];
        if (!res && (marketArray.includes(owner?.owners[0]?.ownerOf))) {
          setAuctionedItem(true);
        }
      },
    }
  )

  return (
    <div className={dark ? ' text-neutral-200' : 'text-black'}>
      {nftContractData ? (
        <SEO 
          title={nftContractData?.metadata?.name}
          description={nftContractData?.metadata?.description}
          image={getImagefromWeb3(nftContractData?.metadata?.image)}/>
      ) : ''}
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
        {Boolean(metaDataFromSanity?.category) &&(
          <div 
            className="relative flex w-fit items-center gap-1 rounded-lg transition bg-green-200 hover:bg-green-300 cursor-pointer px-4 py-1 text-xs font-medium text-green-800"
            style={{ marginTop: '10px'}}
            onClick={() => {
              router.push({
                pathname: '/search',
                query: {
                  c: metaDataFromSanity?.category,
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
              <TbStack2/> { metaDataFromSanity?.category }
            </div>
        )}

        <div className="flex flex-col-reverse justify-between gap-5 space-y-4 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-8">
          <div className="flex items-center">
            <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white dark:ring-neutral-900">
              {Boolean(metaDataFromSanity) && (
                <Link href={`/collection/${chain}/${contractAddress}`} passHref>
                  <a>
                    <img
                      className="absolute inset-0 h-full w-full cursor-pointer rounded-full object-cover"
                      src={ Boolean(metaDataFromSanity?.web3imageprofile) ? getImagefromWeb3(metaDataFromSanity?.web3imageprofile) : createAwatar(nftContractData.contract)}
                      alt={metaDataFromSanity?.name}
                    />
                  </a>
                </Link>
              )}
            </div>

            <Link href={`/collection/${chain}/${contractAddress}`} passHref>
              <a>
                <span className="ml-2.5 flex flex-col">
                  <span className="text-sm">Collection:</span>
                  <span className="flex items-center font-medium">
                      {/* <Link href={`/collections/${metaDataFromSanity?.collection?._id}`}> */}
                    <span className="cursor-pointer">{metaDataFromSanity?.name ? metaDataFromSanity?.name : `${nftContractData.contract.slice(0,7)}...${nftContractData.contract.slice(-7)}`}</span>
                  </span>
                </span>
              </a>
            </Link>
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
                    <RiAuctionLine className="text-xl" /> <span>Auctioned NFT</span>
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
                      {ownerData?.web3imageprofile ? (
                        <img
                          className="absolute inset-0 h-full w-full rounded-full object-cover"
                          src={getImagefromWeb3(ownerData?.web3imageprofile)}
                          alt={ownerData?.userName}
                        />
                      ) :(
                        <img src="https://api.dicebear.com/6.x/bottts/svg?seed=Charlie" alt="Avatar"/>
                      )}
                    </div>

                    <span className="ml-2.5 flex cursor-pointer flex-col">
                      <span className="text-sm">Owned by: </span>
                      <span className="flex items-center font-medium">
                        {ownerData?.userName == "Unnamed" ? (
                          <span>{ownerData?.walletAddress.slice(0,5)}...{ownerData?.walletAddress.slice(-5)}</span>
                        ) : (
                          <span>{ownerData?.userName}</span>
                        )}
                        {ownerData?.verified ? (
                          <IconVerified />
                        ) : ''}
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

        <div className="flex flex-wrap gap-3 items-center justify-center">
            <div className={`my-1.5 w-full flex gap-4 text-lg justify-center border ${dark ? 'border-slate-700/50' : 'border-neutral-200/80 bg-neutral-100'} rounded-xl items-center py-2 px-4`}>
              <div className="text-sm hidden md:block">
                Share:
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
