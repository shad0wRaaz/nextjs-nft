import moment from 'moment'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { FiImage } from 'react-icons/fi'
import { VscHeart } from 'react-icons/vsc'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'
import { useMutation, useQuery } from 'react-query'
import { MdOutlineCollections } from 'react-icons/md'
import { BiUserPlus, BiUserCheck } from 'react-icons/bi'
import { RiFacebookFill, RiMoneyDollarCircleLine } from 'react-icons/ri'
import noBannerImage from '../../assets/noBannerImage.png'
import { useUserContext } from '../../contexts/UserContext'
import noProfileImage from '../../assets/noProfileImage.png'
import CollectionCard from '../../components/CollectionCard'
import { useThemeContext } from '../../contexts/ThemeContext'
import { IconCopy } from '../../components/icons/CustomIcons'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { removeFollower, saveFollower } from '../../mutators/SanityMutators'
import {
  getMyCollections,
  getMintedNFTs,
  getUserContinuously,
  getUser,
} from '../../fetchers/SanityFetchers'
import { getUnsignedImagePath, getWeb3ImagePath } from '../../fetchers/s3'
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
  collectionWrapper:
    'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center',
  miniButton:
    'py-1 px-4 rounded-full gradBlue text-white text-sm mt-1 cursor-pointer',
  button:
    'rounded-xl flex items-center gap-1 cursor-pointer py-2 px-4 m-3 text-md text-white',
}

const User = () => {
  const router = useRouter()
  const address = router.query.useraddress
  const { dark } = useThemeContext()
  const { myUser, queryCacheTime, queryStaleTime } = useUserContext()
  const [isFollower, setIsFollower] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [profile, setProfile] = useState()
  const [banner, setBanner] = useState()
  const [userCollections, setUserCollections] = useState([])
  const [userData, setUserData] = useState()
  const bannerRef = useRef()
  useEffect(async () => {
    if (!address) return
    setUserData(await getUser(address))
  }, [address])
  
  useEffect(() => {
    if (!userData) return
    
    if (
      userData?.followers?.filter((u) => u._ref === myUser?.walletAddress)
        .length > 0
    ) {
      setIsFollower(true)
      console.log(isFollower)
    }
    setFollowerCount(userData?.followers?.length)
    ;(async () => {
      setProfile(await getUnsignedImagePath(userData.profileImage))
      setBanner(await getUnsignedImagePath(userData.bannerImage))
    })()
  }, [userData, address])
  
  
  const { data: collectionData, status: collectionStatus } = useQuery(
    ['mycollections', address],
    getMyCollections(),
    {
      enabled: Boolean(address), //only run this query if address is provided
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again',
          errorToastStyle
        )
      },
      onSuccess: async (res) => {
        const unresolved = res.map(async (item) => {
          const obj = { ...item }
          const imgPath = await getUnsignedImagePath(item.profileImage)
          const bannerPath = await getUnsignedImagePath(item.bannerImage)
          obj['profileImage'] = imgPath?.data.url
          obj['bannerImage'] = bannerPath?.data.url
          return obj
        })

        const resolvedPathss = await Promise.all(unresolved)

        setUserCollections(resolvedPathss)
      },
    }
  )
  const { data: nftData, status: nftStatus } = useQuery(
    ['createdItems', address],
    getMintedNFTs(),
    {
      cacheTime: queryCacheTime,
      staleTime: queryStaleTime,
      enabled: Boolean(address),
      onError: () => {
        toast.error(
          'Error fetching minted NFTs. Refresh and try again',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        // console.log(res)
      },
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
          `You are now following ${res.userName}`,
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

  useEffect(() => {
    ;(async() => {
      
      // console.log(await getWeb3ImagePath('QmRgm5x1fhezfiBcmkFN5afuSnZsNzhF6e4D87rXa7ntki/0'))
    })()
  }, [])

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
      <div className="w-full">
        <div className="relative h-60 w-full md:h-60 2xl:h-96" ref={bannerRef}>
          <div className="nc-NcImage absolute inset-0">
            {banner ? (
              <img
                src={banner?.data.url}
                className="h-full w-full object-cover"
                alt={userData?.userName}
              />
            ) : (
              <img
                src={noBannerImage.src}
                className="h-full w-full object-cover"
                alt={userData?.userName}
              />
            )}
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
                  {profile ? (
                    <img
                      src={profile?.data.url}
                      className="h-full w-full object-cover"
                      alt={userData?.userName}
                    />
                  ) : (
                    <img
                      src={noProfileImage.src}
                      className="h-full w-full object-cover"
                      alt={userData?.userName}
                    />
                  )}
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
                    {userData?.walletAddress.slice(0, 7)}..
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
                    {collectionData?.length}
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
                    {nftStatus == 'success' && nftData?.length}
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

      <div className="container mx-auto mt-[4rem] lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
        <h2 className="mb-[3rem] lg:pt-[4rem] text-center text-3xl font-bold">
          {userData?.userName}'s Collections
        </h2>

        <div className={style.collectionWrapper}>
          {collectionStatus == 'loading' && <Loader />}
          {userCollections?.length > 0 &&
            userCollections?.map((coll, id) => (
              <CollectionCard
                key={id}
                name={coll.name}
                id={coll._id}
                contractAddress={coll.contractAddress}
                profileImage={coll.profileImage}
                bannerImage={coll.bannerImage}
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
              <h2 className={style.errorTitle}>No Collection create yet.</h2>
              <Link href="/contracts">
                <button className="text-md gradBlue cursor-pointer rounded-full p-4 px-8 text-center font-bold text-white">
                  Create Collection
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default User
