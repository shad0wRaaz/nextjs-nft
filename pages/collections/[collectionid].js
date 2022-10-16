import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { FiSettings } from 'react-icons/fi'
import { Fragment, useEffect } from 'react'
import Loader from '../../components/Loader'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import NFTCard from '../../components/NFTCard'
import { getUnsignedImagePath } from '../../fetchers/s3'
import noBannerImage from '../../assets/noBannerImage.png'
import { useUserContext } from '../../contexts/UserContext'
import { Menu, Transition, Switch } from '@headlessui/react'
import noProfileImage from '../../assets/noProfileImage.png'
import { useThemeContext } from '../../contexts/ThemeContext'
import { changeShowUnlisted } from '../../mutators/SanityMutators'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { getAllNFTs, getActiveListings } from '../../fetchers/Web3Fetchers'
import { getNFTCollection, getAllOwners } from '../../fetchers/SanityFetchers'
import { IconDollar } from '../../components/icons/CustomIcons'
import { useQueryClient } from 'react-query'
import { RiCloseFill } from 'react-icons/ri'
import EditCollection from '../../components/EditCollection'
import { TbEdit } from 'react-icons/tb'
import { CgWebsite } from 'react-icons/cg'
import millify from 'millify'

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}
const style = {
  bannerImageContainer: `h-[30vh] w-full overflow-hidden flex justify-center items-center bg-[#ededed]`,
  bannerImage: `h-full object-cover`,
  infoContainer: `w-full px-4 pb-10`,
  midRow: `w-full flex justify-center text-white mb-2`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#ffffff] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem] mr-2`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border border-white border-slate-700 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border border-white border-slate-700 border-r-1`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg`,
  statsContainer: `lg:w-[44vw] md:w-[80vw] sm:w-full max-w-[700px] flex justify-between py-4 border border-white border-slate-700 rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-sm w-full text-center mt-1`,
  description: `text-white text-md w-max-1/4 flex-wrap my-2`,
  nftwrapper:
    'container mx-auto gap-7 mt-[5rem] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 relative  lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]',
  nftwrapper_old: `flex flex-wrap justify-center mb-[4rem] gap-[40px] sm:p-[2rem] md:p-[4rem] pt-[6rem] nftWrapper`,
  errorBox:
    'border rounded-xl p-[2rem] mx-auto text-center lg:w-[44vw] md:w-[80vw] sm:w-full max-w-[700px]',
  errorTitle: 'block text-[1.5rem] mb-3',
}


const Collection = () => {
  const router = useRouter()
  const {
    marketplaceAddress,
    activeListings,
    setMarketplaceAddress,
    rpcUrl,
    setRpcUrl,
  } = useMarketplaceContext()
  const { collectionid } = router.query
  const { dark } = useThemeContext()
  const [owners, setOwners] = useState()
  const { myUser, queryStaleTime } = useUserContext()
  const [showUnlisted, setShowUnlisted] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState()
  const [bannerImageUrl, setBannerImageUrl] = useState()
  const [showModal, setShowModal] = useState(false)
  const [newCollectionData, setNewCollectionData] = useState()
  const [creatorProfileImage, setCreatorProfileImage] = useState()
  const qc = useQueryClient()
  const bannerRef = useRef()

  const { data: collectionData, status: collectionStatus } = useQuery(
    ['collection', collectionid],
    getNFTCollection(),
    {
      staleTime: queryStaleTime,
      enabled: Boolean(collectionid),
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        if(res){
          setNewCollectionData(res[0])
          setShowUnlisted(res[0]?.showUnlisted)
          ;(async () => {
            setCreatorProfileImage(await getUnsignedImagePath(res[0]?.creator.profileImage))
            setProfileImageUrl(await getUnsignedImagePath(res[0]?.profileImage))
            setBannerImageUrl(await getUnsignedImagePath(res[0]?.bannerImage))
          })()
  
          setMarketplaceAddress('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4')
  
          if (res[0]?.chainId == '80001') {
            setRpcUrl(process.env.NEXT_PUBLIC_INFURA_MUMBAI_URL)
          } else if (res[0]?.chainId == '4') {
            setRpcUrl(process.env.NEXT_PUBLIC_INFURA_RINKEBY_URL)
          } else if (res[0]?.chainId == '5') {
            setRpcUrl(process.env.NEXT_PUBLIC_INFURA_GOERLI_URL)
          } else if (res[0]?.chainId == '97') {
            setRpcUrl(process.env.NEXT_PUBLIC_INFURA_TBNB_URL)
          }
        }
      },
    }
  )

  const { data: nftData, status: nftStatus } = useQuery(
    ['allnftss', newCollectionData?.contractAddress],
    getAllNFTs(rpcUrl),
    {
      staleTime: queryStaleTime,
      enabled: Boolean(rpcUrl) && Boolean(newCollectionData?._id),
      onError: (error) => {
        console.log(error)
        toast.error(
          'Error fetching NFTs. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        
      },
    }
  )
  const { data: marketData, status: marketStatus } = useQuery(
    ['marketplace', marketplaceAddress],
    getActiveListings(rpcUrl),
    {
      // enabled: Boolean(marketplaceAddress) && Boolean(nftData),
      enabled: false,
      onError: () => {
        toast.error(
          'Error fetching marketplace data. Refresh and try again.',
          errorToastStyle
        )
      },
    }
  )

  const { data: ownersData, status: ownerStatus } = useQuery(
    ['owners', collectionid],
    getAllOwners(),
    {
      enabled: Boolean(newCollectionData?._id),
      onError: () => {
        toast.error('Error in getting owner info', errorToastStyle)
      },
      onSuccess: (res) => {
        // console.log(collectionid)
        //getting unique owners of NFT (not collection) from the all owner data result
        if(res){
          const unique = [...new Set(res.map((item) => item.ownedBy._ref))]
          setOwners(unique)
        }
      },
    }
  )

  const { mutate: updateShowListed } = useMutation(
    ({ collectionid, showUnlisted }) =>
      changeShowUnlisted({ collectionid, showUnlisted }),
    {
      onSuccess: (res) => {
        if (!showUnlisted) {
          setShowUnlisted(true)
          toast.success(
            'Unlisted NFTs can now be publicly viewable',
            successToastStyle
          )
        } else {
          setShowUnlisted(false)
          toast.success(
            'Unlisted NFTs cannot be viewed by others.',
            successToastStyle
          )
        }
      },
    }
  )

  const handleShowUnlisted = () => {
    setShowUnlisted(!showUnlisted)
    updateShowListed(collectionid)
  }


  

  useEffect(() => {
    // console.log(showUnlisted)
  }, [showUnlisted])

  //parallax scrolling effect in banner
  useEffect(() => {
    const handleScroll = event => {
      if(!bannerRef.current) return
      bannerRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])
 

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <Header />
      {/* {collectionStatus == 'loading' && <Loader />} */}
      {showModal && (
        <div className="fixed top-0 flex items-center justify-center p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-10 rounded-3xl w-[55.5rem] h-[50rem] overflow-y-scroll z-50 relative`}>
            <div
              className="absolute top-5 right-5 bg-gray-300 p-3 rounded-full hover:bg-gray-400 transition-all cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              <RiCloseFill fontSize={25}/>
            </div>
            <EditCollection collection={newCollectionData} profileImageUrl={profileImageUrl?.data?.url} bannerImageUrl={bannerImageUrl?.data?.url}/>
          </div>
        </div>
      )}
      {collectionStatus == 'success' && (
        <div className="w-full">
          <div className="relative h-96 w-full md:h-60 2xl:h-96">
            <div className="nc-NcImage absolute inset-0" ref={bannerRef}>
              <img
                src={
                  bannerImageUrl ? bannerImageUrl?.data?.url : noBannerImage.src
                }
                className="h-full w-full object-cover"
                alt={collectionData[0]?.name}
              />
            </div>
          </div>

          <div className="container relative  mx-auto -mt-14 lg:-mt-20 lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
            <div
              className={`flex flex-col rounded-3xl ${
                dark ? 'darkGray/30' : 'bg-white/30'
              } p-8 shadow-xl md:flex-row md:rounded-[40px] backdrop-blur-xl`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:block">
                <div className="w-40 sm:w-48 md:w-56 xl:w-60">
                  <div
                    className="aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl"
                    data-nc-id="NcImage"
                  >
                    <img
                      src={
                        profileImageUrl
                          ? profileImageUrl?.data?.url
                          : noProfileImage.src
                      }
                      className="h-full w-full object-cover"
                      alt={collectionData[0]?.name}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-3 sm:justify-center">
                  <div className="flex flex-col justify-center space-x-1.5">
                    {collectionData[0]?.external_link && collectionData[0]?.external_link != '' && (
                        <div className="relative inline-block text-center justify-center flex">
                          <a
                            href={
                              collectionData[0].external_link != ''
                                ? collectionData[0].external_link
                                : ''
                            }
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                              dark
                                ? ' bg-slate-700 hover:bg-slate-600'
                                : ' bg-neutral-100 hover:bg-neutral-200'
                            } md:h-10 md:w-10 `}
                            title="External Link"
                            id="headlessui-menu-button-:r3e:"
                            type="button"
                            target="_blank"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <CgWebsite fontSize={20}/>
                          </a>
                        </div>                      
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex-grow md:mt-0 md:ml-8 xl:ml-14">
                <div className="flex w-full justify-between">
                  <div>
                    <h2 className="inline-block text-2xl font-semibold sm:text-3xl lg:text-4xl">
                      {!newCollectionData && 'Unknown NFT Collection'}
                      {collectionData[0]?.name}
                    </h2>
                    
                    <div className="flex lg:gap-3 flex-wrap ">
                      <div className={`border border-t-0 border-l-0 border-b-0 ${dark ? 'lg:border-r-sky-700/30' : 'lg:border-r-neutral-200'} pr-8 mt-4 mb:mb-0 lg:mb-4`}>
                        <span 
                          className="relative block w-fit mt-3 rounded-lg bg-green-100 cursor-pointer border-green-200 border px-4 py-1 text-xs font-medium text-green-800"
                          onClick={() => {
                          router.push({
                            pathname: '/search',
                            query: {
                              c: collectionData[0].category,
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
                            {collectionData[0]?.category}
                        </span>

                        <Link href={`/user/${newCollectionData?.creator?.walletAddress}`}>
                          <div className="flex my-4">
                            <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white">
                              {creatorProfileImage && (
                                <img
                                  className="absolute inset-0 h-full w-full rounded-full object-cover"
                                  src={creatorProfileImage?.data?.url}
                                  alt="test"
                                />
                              )}
                            </div>

                            <span className="ml-2.5 flex cursor-pointer flex-col">
                              <span className="text-sm">Creator</span>
                              <span className="flex items-center font-medium">
                                <span>{newCollectionData?.creator.userName}</span>
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
                      </div>

                      <div className="py-4 md:ml-4">
                        <span className="block text-sm">
                          {collectionData[0]?.description}
                        </span>
                      </div>
                    </div>
                    
                  </div>

                  {/* this option is only available if the user is creator of this collection */}
                  {newCollectionData && collectionData[0]?.createdBy._ref ==
                    myUser?.walletAddress && (
                    <div>
                      <Menu as="div" className="relative inline-block">
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center transition hover:scale-110">
                            <FiSettings fontSize="20px" />
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
                            className={`${
                              dark ? 'bg-slate-700' : 'bg-white'
                            } absolute p-4 right-0 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                          >
                            <div className="px-1 py-1 ">
                              <Menu.Item>
                                {({active}) => (
                                  <div 
                                    className={`flex w-full rounded-md p-2 text-sm cursor-pointer ${active ? dark ? 'bg-slate-600' : 'bg-neutral-100' : ''}`}
                                    onClick={() => setShowModal(curVal => !curVal)}
                                    >
                                    <TbEdit fontSize={20} className="ml-[4px]"/> <span className="ml-1">Edit Collection Metadata</span>
                                  </div>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({active}) => (
                                  <div 
                                    className={`flex w-full items-center rounded-md p-2 text-sm cursor-pointer ${active ? dark ? 'bg-slate-600' : 'bg-neutral-100' : ''}`}
                                    onClick={() => setShowModal(curVal => !curVal)}
                                    >
                                    <IconDollar className="" /> <span className="ml-1">Update Payment Settings</span>
                                  </div>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <div
                                    className={`group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                                  >
                                    Show Unlisted to Others
                                    <Switch
                                      checked={showUnlisted}
                                      onChange={() =>
                                        updateShowListed({
                                          collectionid: collectionid,
                                          showUnlisted: showUnlisted,
                                        })
                                      }
                                      className={`${
                                        showUnlisted
                                          ? 'bg-sky-500'
                                          : dark
                                          ? 'bg-slate-500'
                                          : 'bg-neutral-300'
                                      }
                                        relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                    >
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          showUnlisted
                                            ? 'translate-x-6'
                                            : 'translate-x-0'
                                        }
                                          pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                      />
                                    </Switch>
                                  </div >
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  )} 
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:mt-8 xl:gap-6">
                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm">Floor Price</span>
                    <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                      ${collectionData[0]?.floorPrice}
                    </span>
                    <span className="mt-1 text-xs">total</span>
                  </div>

                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm">Volume</span>
                    <span className="mt-4 break-all text-base font-bold sm:mt-6 sm:text-xl">
                      ${millify(collectionData[0]?.volumeTraded)}
                    </span>
                    <span className="mt-1 text-xs">total</span>
                  </div>

                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm">Items</span>
                    <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                      {nftData?.length}
                    </span>
                    <span className="mt-1 text-xs">total</span>
                  </div>

                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm">Owners</span>
                    <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                      {owners && owners.length != 0 ? owners.length : '1'}
                    </span>
                    <span className="mt-1 text-xs text-green-500"> --</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-[5rem]">
        {nftStatus == 'loading' && <Loader />}
        {nftStatus == 'success' && nftData.length == 0 && (
          <div
            className={
              dark ? style.errorBox + ' border-sky-400/20' : style.errorBox
            }
          >
            <h2 className={style.errorTitle}>No NFT Minted yet.</h2>
            {collectionData[0]?.createdBy._ref == myUser?.walletAddress && (
              <Link href="/contracts">
                <button className="text-md gradBlue cursor-pointer rounded-xl p-4 px-8 text-center font-bold text-white">
                  Mint NFT
                </button>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className={style.nftwrapper}>
        {nftStatus == 'success' &&
          nftData.length > 0 &&
          nftData.map((nftItem, id) => (
            nftItem?.metadata?.properties?.tokenid ? (
            <NFTCard
              key={id}
              nftItem={nftItem}
              title={collectionData[0]?.name}
              listings={activeListings}
              showUnlisted={showUnlisted}
              creator={collectionData[0]?.createdBy}
            />) : ''
          ))}
      </div>
      <Footer />
    </div>
  )
}

export default Collection
