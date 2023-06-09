import moment from 'moment'
import Link from 'next/link'
import millify from 'millify'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { FiImage } from 'react-icons/fi'
import { VscHeart } from 'react-icons/vsc'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'
import { useChain } from '@thirdweb-dev/react'
import { HiChevronRight } from 'react-icons/hi'
import { useMutation, useQuery } from 'react-query'
import { useEffect, useRef, useState } from 'react'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { createAwatar } from '../../utils/utilities'
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs'
import { MdOutlineCollections } from 'react-icons/md'
import { BiUserPlus, BiUserCheck } from 'react-icons/bi'
import noBannerImage from '../../assets/noBannerImage.png'
import { useUserContext } from '../../contexts/UserContext'
import noProfileImage from '../../assets/noProfileImage.png'
import CollectionCard from '../../components/CollectionCard'
import { useThemeContext } from '../../contexts/ThemeContext'
import { IconCopy } from '../../components/icons/CustomIcons'
import NFTCardExternal from '../../components/NFTCardExternal'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { RiFacebookFill, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { removeFollower, saveFollower } from '../../mutators/SanityMutators'
import CollectionCardExternal from '../../components/CollectionCardExternal'
import { getMyCollections, getMintedNFTs, getUser} from '../../fetchers/SanityFetchers'
import { INFURA_getMyAllNFTs, INFURA_getMyCollections, getFullListings } from '../../fetchers/Web3Fetchers'
import SEO from '../../components/SEO'



const User = () => {
  const router = useRouter();
  const address = router.query.useraddress;
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const { myUser, queryCacheTime, queryStaleTime } = useUserContext();
  const [isFollower, setIsFollower] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [userData, setUserData] = useState();
  const bannerRef = useRef();
  const activeChain = useChain();
  const [showCollection, setShowCollection] = useState(true);
  const { selectedBlockchain } = useMarketplaceContext();
  const { blockchainIdFromName, chainIcon } = useSettingsContext();
  const { data: fullListingData } = useQuery(['fulllistings'], getFullListings());
  const [compact, setCompact] = useState(true);
  const [cursor, setCursor] = useState();
  const [collectionsFromInfura, setCollectionsFromInfura] = useState([]);
  const [collectionCount, setCollectionCount] = useState(0);
  const [nftCount, setNftCount] = useState(0);

  const style = {
    collectionWrapper:
      'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center',
    nftWrapper:
      `grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'grid-cols-6' : 'xl:grid-cols-4'} place-items-center`,
    miniButton:
      'py-1 px-4 rounded-full gradBlue text-white text-sm mt-1 cursor-pointer',
    button:
      'rounded-xl flex items-center gap-1 cursor-pointer py-2 px-4 m-3 text-md text-white',
  }

  useEffect(() => {
    if (!address) return
    ;(async() => {
      setUserData(await getUser(address))
    })()
    
    return() => {
      //nothing , just clean up function
    }
  }, [address])
  
  useEffect(() => {
    if (!userData) return
    
    if (
      userData?.followers?.filter((u) => u._ref === myUser?.walletAddress)
        .length > 0
    ) {
      setIsFollower(true)
    }
    setFollowerCount(userData?.followers?.length)
    

    return() => {
      //nothing , just clean up function
    }
  }, [userData, address])
  
  
  const { data: collectionData, status: collectionStatus } = useQuery(
    ['mycollections', address],
    getMyCollections(),
    {
      enabled: Boolean(address), //only run this query if address is provided
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        // console.log(res)
      }
    }
  )

  //this gives all the collections from INFURA but does not gives images, so have to be imported by the user manually and then update images manually
  const {data: outsideCollection, status: outsideCollectionStatus} = useQuery(
    ['allcollections', address, selectedBlockchain, activeChain?.chainId],
    INFURA_getMyCollections(activeChain ? activeChain.chainId : blockchainIdFromName[selectedBlockchain], address),
    {
      enabled: Boolean(address) ,
      onSuccess: (res) => {
        // console.log(res);
      }
    }
  )
//filter out only those collections deployed in third party websites
  useEffect(() => {
    if(collectionStatus == 'success' && outsideCollectionStatus == 'success' ){
      const allCollections = [...outsideCollection.collections];
      
      const inhouseCollections = collectionData.map(coll => coll.contractAddress.toLowerCase());
      const outsideCollections = allCollections.filter(coll => !inhouseCollections.includes(coll.contract));
      // console.log('all',outsideCollections)
      if(outsideCollections.length > 0){
        setCollectionsFromInfura([...outsideCollections]);
      }
    }
    return () => {
      //do nothing, just clean up function
    }
  }, [collectionStatus, outsideCollectionStatus])

  const { data: mynfts, status: mynftstatus } = useQuery(
    ['mynfts', address, cursor, selectedBlockchain, activeChain?.chainId],
    INFURA_getMyAllNFTs(activeChain ? activeChain.chainId : blockchainIdFromName[selectedBlockchain]),
    {
      enabled: Boolean(address) && (Boolean(activeChain) || Boolean(selectedBlockchain)),
      onError:() => {},
      onSuccess:(res) => 
      {
        // console.log(res);
        // console.log(res.cursor)
      }
    }
  )

  //follow function
  const { mutate, isLoading: followLoading } = useMutation(
    ({ creator, admirer }) => saveFollower({ creator, admirer }),
    {
      onError: (toastHandler = toast) => {
        toastHandler.error('Error in following the user', errorToastStyle)
      },
      onSuccess: (res) => {
        toast.success(
          `You are now following ${res.userName}.`,
          successToastStyle
        )
        setFollowerCount((prevCount) => prevCount + 1)
        setIsFollower(true)
      },
    }
  )
  //unfollow function
  const { mutate: mutateFollower } = useMutation(
    ({ creator, admirer }) => removeFollower({ creator, admirer }),
    {
      onError: () => {
        toast.error('Error in unfollowing.', errorToastStyle)
      },
      onSuccess: () => {
        toast.success('You unfollowed this user.', successToastStyle)
        setFollowerCount((prevCount) => prevCount - 1)
        setIsFollower(false)
      },
    }
  )

  const addFollowers = (e, toastHandler = toast) => {
    if (!myUser || !myUser.walletAddress) {
      toastHandler.error(
        'Connected wallet is required to follow a creator.',
        errorToastStyle
      )
      return
    }
    mutate({ creator: address, admirer: myUser.walletAddress })
  }

  const handleRemoveFollower = (e, toastHandler = toast) => {
    if (!myUser || !myUser.walletAddress) {
      toastHandler.error(
        'Connected wallet is required to unfollow a creator.',
        errorToastStyle
      )
      return
    }
    mutateFollower({ creator: address, admirer: myUser.walletAddress })
  }

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
      <SEO />
      <Header />
      <div className="w-full">
        <div className="relative h-60 w-full md:h-60 2xl:h-96" ref={bannerRef}>
          <div className="nc-NcImage absolute inset-0">
            <img src={userData?.web3imagebanner ? getImagefromWeb3(userData?.web3imagebanner) : `https://picsum.photos/1500/500/?blur=10`}
              className="h-full w-full object-cover"
              alt={userData?.userName}
              />
          </div>
        </div>

        <div className="container relative  mx-auto -mt-14 lg:-mt-20 lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
          <div
              className={`flex flex-col rounded-3xl ${
                dark ? 'darkGray/30 border border-sky-700/30' : 'bg-white/30'
              } p-8 shadow-xl md:flex-row md:rounded-[40px] backdrop-blur-xl`}
            >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:block">
              <div className="w-40 sm:w-48 md:w-56 xl:w-60">
                <div className=" aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl">
                  <img
                    src={userData?.web3imageprofile ? getImagefromWeb3(userData?.web3imageprofile) : createAwatar(address)}
                    className="h-full w-full object-cover"
                    alt={userData?.userName}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3 sm:justify-center">
                <div className="flex space-x-1.5">
                  {userData?.igHandle != null && (
                    <a
                      href={
                        userData?.igHandle != ''
                          ? 'https://instagram.com/'.concat(userData?.igHandle)
                          : ''
                      }
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                        dark
                          ? ' bg-slate-700 hover:bg-slate-600'
                          : ' bg-neutral-100 hover:bg-neutral-200'
                      } md:h-10 md:w-10`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <AiOutlineInstagram fontSize="23px" />
                    </a>
                  )}
                  
                  {userData?.twitterHandle != null && (
                    <a
                      href={
                        userData?.twitterHandle != ''
                          ? 'https://twitter.com/'.concat(userData?.twitterHandle)
                          : ''
                      }
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                        dark
                          ? ' bg-slate-700 hover:bg-slate-600'
                          : ' bg-neutral-100 hover:bg-neutral-200'
                      } md:h-10 md:w-10`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <AiOutlineTwitter fontSize="23px" />
                    </a>
                  )}

                  {userData?.fbhHandle != null && (
                    <a
                      href={
                        userData?.fbhHandle != ''
                          ? 'https://facebook.com/'.concat(userData?.fbhHandle)
                          : ''
                      }
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                        dark
                          ? ' bg-slate-700 hover:bg-slate-600'
                          : ' bg-neutral-100 hover:bg-neutral-200'
                      } md:h-10 md:w-10`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <RiFacebookFill fontSize="23px" />
                    </a>

                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex-grow md:mt-0 md:ml-8 xl:ml-14">
              <div className="flex w-full justify-between">
                <div className="max-w-screen-sm ">
                  <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
                    {userData?.userName}
                  </h2>
                  <span className="mt-4 inline-block text-sm font-bold">
                    {userData?.walletAddress.slice(0, 7)}...
                    {userData?.walletAddress.slice(-4)}
                  </span>
                  <span
                    className="relative top-1 inline-block cursor-pointer pl-2"
                    onClick={() => {
                      navigator.clipboard.writeText(userData?.walletAddress)
                      toast.success('User address copied !', successToastStyle)
                    }}
                  >
                    <IconCopy />
                  </span>
                  <span className="ml-[50px] inline-block text-sm">
                    Joined from{' '}
                    {moment(userData?._createdAt).format('YYYY MMM')}
                  </span>
                  <span className="mt-4 block">{userData?.biography}</span>
                </div>

                {myUser && myUser.walletAddress != address && userData && (
                  <div className="">
                    <button
                      className={
                        isFollower
                          ? style.button +
                            (dark
                              ? ' border border-sky-400/20 text-neutral-100'
                              : ' border border-neutral-300 text-neutral-400 hover:bg-neutral-100')
                          : style.button + ' gradBlue'
                      }
                      onClick={() => {
                        if (isFollower) {
                          return handleRemoveFollower()
                        } else {
                          return addFollowers()
                        }
                      }}
                    >
                      {isFollower ? (
                        <BiUserCheck fontSize="25px" />
                      ) : (
                        <BiUserPlus fontSize="25px" />
                      )}
                      {!isFollower && (followLoading ? 'Following' : 'Follow')}
                      {isFollower &&
                        (followLoading ? 'Unfollowing' : 'Following')}
                    </button>
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
                  <MdOutlineCollections
                    fontSize="30px"
                    className={`mb-2 ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  >
                    Collections
                  </span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    {Boolean(outsideCollection?.total) ? outsideCollection?.total : 0}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <FiImage
                    fontSize="30px"
                    className={`mb-2 ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  >
                    Nfts
                  </span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    {Boolean(mynfts?.total) ? mynfts?.total : 0}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <VscHeart
                    fontSize="30px"
                    className={`mb-2 ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  >
                    Followers
                  </span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    {followerCount ? followerCount : 0}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <RiMoneyDollarCircleLine
                    fontSize="30px"
                    className={`mb-2 ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  />
                  <span
                    className={`text-sm text-center ${
                      dark ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  >
                    Volume Traded
                  </span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    ${userData?.volumeTraded
                      ? millify(userData?.volumeTraded)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-[5rem] flex justify-center px-5">
        <div
          className={`border ${
            dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
          } flex justify-between gap-2 overflow-auto rounded-full p-1 shadow`}
        >
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              showCollection &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowCollection(true)}
          >
            <span className="inline-block pl-2 w-max">Collections</span>
          </div>
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              !showCollection &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowCollection(false)}
          >
            <span className="inline-block pl-2 w-max">NFTs</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-[2rem] lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
        {showCollection ? (
          <>
          {/* Displaying in house collections */}
            <div className={style.collectionWrapper}>
              {collectionStatus == 'loading' && <Loader />}
              {collectionData?.length > 0 &&
                collectionData?.map((coll, id) => (
                  <CollectionCard
                    key={id}
                    name={coll.name}
                    id={coll._id}
                    contractAddress={coll.contractAddress}
                    profileImage={coll.web3imageprofile}
                    bannerImage={coll.web3imagebanner}
                    description={coll.description}
                    floorPrice={coll.floorPrice}
                    volumeTraded={coll.volumeTraded}
                    allOwners={coll.allOwners}
                    chainId={coll.chainId}
                    creator={coll.creator}
                    creatorAddress={coll.creatorAddress}
                  />
                ))}
              {collectionData?.length == 0 && (
                <div className={style.errorBox}>
                  <h2 className={style.errorTitle}>No Collection created yet.</h2>
                </div>
              )}
            </div>
            {/* Displaying outside Collections */}
            {Boolean(collectionsFromInfura) && collectionsFromInfura.length > 0 && (
              <div className={style.collectionWrapper + ' mt-8'}>
                {collectionsFromInfura?.map((coll, id) => (
                  <CollectionCardExternal
                    key={id}
                    name={coll.name}
                    id={coll.contract}
                    contractAddress={coll.contract}
                    chainId={blockchainIdFromName[selectedBlockchain]}
                    creator="Unnamed"
                    creatorAddress={address}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="text-center text-sm relative">
              Showing NFTs from <span className={`p-2 pl-3 ml-2 border rounded-lg ${dark ? 'border-slate-800': 'border-neutral-200'}`}> {selectedBlockchain.toUpperCase()} chain {chainIcon[blockchainIdFromName[selectedBlockchain]]}</span>
            </div>
              
            <div className="flex justify-between items-center">
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
              
              <div>
                  <button 
                    className={`rounded-md text-sm p-2 px-3 flex gap-1 items-center  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'}`}
                    onClick={() => setCursor(mynfts.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
              </div>

            </div>

            {mynftstatus == 'loading' && <Loader/>}
            
            {mynftstatus == 'success' && mynfts.length == 0 && (
              <p className="text-center mt-[3rem]">No NFTs yet</p>
            )}

            {mynftstatus == 'success' && mynfts?.assets?.length > 0 && Boolean(fullListingData) && (
              <div className={style.nftWrapper}>
                {mynfts?.assets?.filter(nft => Boolean(nft.metadata)).map((nftItem, index) => (
                    <NFTCardExternal
                      key={index}
                      chain={selectedBlockchain}
                      nftItem={nftItem}
                      listings={fullListingData}
                      creator={{ _ref: address }}
                      compact={compact}
                    />
                ))}
              </div>
            )}

            <div className="flex justify-end">
                <button 
                  className={`rounded-md text-sm p-2 px-3 flex gap-1 items-center  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'}`}
                  onClick={() => setCursor(mynfts.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default User
