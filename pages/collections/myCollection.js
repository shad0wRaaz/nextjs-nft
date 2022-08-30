import { useState, useEffect } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import noBannerImage from '../../assets/noBannerImage.png'
import noProfileImage from '../../assets/noProfileImage.png'
import { useAddress, useSigner } from '@thirdweb-dev/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { CgUserList } from 'react-icons/cg'
import { MdOutlineCollections } from 'react-icons/md'
import { RiFacebookBoxFill, RiFacebookFill, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { FiImage } from 'react-icons/fi'
import CollectionCard from '../../components/CollectionCard'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useUserContext } from '../../contexts/UserContext'
import { useQuery } from 'react-query'
import {
  getMyCollections,
  getMintedNFTs,
  getCollectedNFTs,
  getFavouriteNFTs,
} from '../../fetchers/SanityFetchers'
import toast from 'react-hot-toast'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import NFTCardLocal from '../../components/NFTCardLocal'
import { IconCopy, IconLoading } from '../../components/icons/CustomIcons'
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
  nftwrapper:
    'container mx-auto gap-7 mt-[5rem] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
  collectionWrapper:
    'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center',
  miniButton:
    'py-1 px-4 rounded-full gradBlue text-white text-sm mt-1 cursor-pointer',
}

const Collection = () => {
  const router = useRouter()
  const signer = useSigner()
  const address = useAddress()
  const { dark } = useThemeContext()
  const {
    myUser,
    queryCacheTime,
    queryStaleTime,
    myProfileImage,
    myBannerImage,
    myCollections,
    setMyCollections,
  } = useUserContext()
  const { activeListings } = useMarketplaceContext()
  const [showType, setShowType] = useState('collection')
  // const { data: collectionData, status: collectionStatus } = useQuery(
  //   ['mycollections', address],
  //   getMyCollections(),
  //   {
  //     cacheTime: queryCacheTime,
  //     staleTime: queryStaleTime,
  //     enabled: Boolean(address), //only run this query if address is provided
  //     onError: () => {
  //       toast.error(
  //         'Error fetching collection data. Refresh and try again',
  //         errorToastStyle
  //       )
  //     },
  //     onSuccess: async (res) => {
  //       const unresolved = res.map(async (item) => {
  //         const obj = { ...item }
  //         const imgPath = await getUnsignedImagePath(item.profileImage)
  //         const bannerPath = await getUnsignedImagePath(item.bannerImage)
  //         obj['profileImage'] = imgPath?.data.url
  //         obj['bannerImage'] = bannerPath?.data.url
  //         return obj
  //       })

  //       const resolvedPaths = await Promise.all(unresolved)
  //       setMyCollections(resolvedPaths)
  //     },
  //   }
  // )

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

  const { data: ownedNftData, status: ownedNftStatus } = useQuery(
    ['collectedItems', address],
    getCollectedNFTs(),
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

  const { data: favouriteNftData, status: favouriteNftStatus } = useQuery(
    ['favouriteItems', address],
    getFavouriteNFTs(),
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
    }
  )

  useEffect(() => {
    if (!address) {
      router.push('/')
      return
    }
  }, [address])

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <Header />
      <div className="w-full">
        <div className="relative h-60 w-full md:h-60 2xl:h-96">
          <div className="nc-NcImage absolute inset-0" data-nc-id="NcImage">
            <img
              src={myBannerImage ? myBannerImage.data.url : noBannerImage.src}
              className="h-full w-full object-cover"
              alt={myUser?.userName}
            />
          </div>
        </div>

        <div className="container relative  mx-auto -mt-14 lg:-mt-20 lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
          <div
            className={`flex flex-col rounded-3xl ${
              dark ? 'darkGray' : 'bg-white'
            } p-8 shadow-xl md:flex-row md:rounded-[40px]`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:block">
              <div className="w-40 sm:w-48 md:w-56 xl:w-60">
                <div
                  className="nc-NcImage aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl"
                  data-nc-id="NcImage"
                >
                  <img
                    src={
                      myProfileImage
                        ? myProfileImage.data.url
                        : noProfileImage.src
                    }
                    className="h-full w-full object-cover"
                    alt="nc-imgs"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3 sm:justify-center">
                <div className="flex space-x-1.5">
                  <a
                    href={myUser?.igHandle != '' ? 'https://instagram.com/'.concat(myUser?.igHandle) : ''}
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
                  <a
                    href={
                      myUser?.twitterHandle != '' ? 'https://twitter.com/'.concat(myUser?.twitterHandle) : ''
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
                  <a
                    href={
                      myUser?.fbhHandle != '' ? 'https://facebook.com/'.concat(myUser?.fbhHandle) : ''
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
                </div>                
              </div>
            </div>

            <div className="mt-5 flex-grow md:mt-0 md:ml-8 xl:ml-14">
              <div className="max-w-screen-sm ">
                <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
                  {myUser?.userName}
                </h2>
                <span className="mt-4 inline-block text-sm font-bold">
                  {myUser?.walletAddress.slice(0, 7)}..
                  {myUser?.walletAddress.slice(-4)}
                </span>
                <span
                  className="relative top-1 inline-block cursor-pointer pl-2"
                  onClick={() => {
                    navigator.clipboard.writeText(myUser?.walletAddress)
                    toast.success('User address copied !', successToastStyle)
                  }}
                >
                  <IconCopy />
                </span>
                <span className="ml-[50px] inline-block text-sm">
                  Joined from {moment(myUser?._createdAt).format('YYYY MMM')}
                </span>
                <span className="mt-4 block text-sm">{myUser?.biography}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:mt-8 xl:gap-6">
                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <MdOutlineCollections fontSize="30px" className="mb-2" />
                  <span className="text-sm">Collections</span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    {myCollections?.length}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <FiImage fontSize="30px" className="mb-2" />
                  <span className="text-sm">NFTs</span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    {nftData?.length == 0 ? '0' : nftData?.length}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <CgUserList fontSize="30px" className="mb-2" />
                  <span className="text-sm">Followers</span>
                  <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                    {myUser?.followers?.length ? myUser.followers.length : '0'}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50'
                  } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                >
                  <RiMoneyDollarCircleLine fontSize="30px" className="mb-2" />
                  <span className="text-sm text-center">Volume Traded</span>
                  <span className="mt-4 break-all text-base font-bold sm:mt-6 sm:text-xl">
                    {myCollections?.volumeTraded
                      ? parseFloat(myCollections?.volumeTraded).toFixed(4)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-[5rem] flex justify-center">
        <div
          className={`border ${
            dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
          } flex justify-between gap-2 overflow-hidden rounded-full p-1 shadow`}
        >
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              showType == 'collection' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowType('collection')}
          >
            <span className="inline-block pl-2">My Collections</span>
          </div>
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              showType == 'createdItems' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowType('createdItems')}
          >
            <span className="inline-block pl-2">Created Items</span>
          </div>
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              showType == 'collectedItems' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowType('collectedItems')}
          >
            <span className="inline-block pl-2">Collected Items</span>
          </div>
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              showType == 'favourites' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowType('favourites')}
          >
            <span className="inline-block pl-1">Favourite Items</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-[4rem] lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
        {showType == 'collection' && (
          <>
            {myCollections && myCollections?.length > 0 && (
              <div className={style.collectionWrapper}>
                {myCollections?.map((coll, id) => (
                  <CollectionCard
                    key={id}
                    name={coll.name}
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
              </div>
            )}
          </>
        )}

        {showType == 'collection' && myCollections?.length == 0 && (
          <div className={style.errorBox + ' text-center'}>
            <h2 className={style.errorTitle + ' mb-4'}>
              No Collection created yet.
            </h2>
            <Link href="/contracts">
              <button className="text-md gradBlue cursor-pointer rounded-xl p-4 px-8 text-center text-white">
                Create Collection
              </button>
            </Link>
          </div>
        )}

        {showType == 'createdItems' &&
          (nftData.length > 0 ? (
            <div className={style.nftwrapper}>
              {Boolean(nftData) &&
                nftData.map((nftItem, id) => (
                  <NFTCardLocal
                    key={id}
                    nftItem={nftItem}
                    listings={activeListings}
                  />
                ))}
            </div>
          ) : (
            <div className="w-full text-center">
              <h2 className={style.errorTitle + ' mb-4'}>
                No NFTs created yet.
              </h2>
              <Link href="/contracts">
                <button className="text-md gradBlue cursor-pointer rounded-xl p-4 px-8 text-center text-white">
                  Mint NFT
                </button>
              </Link>
            </div>
          ))}

        {showType == 'collectedItems' &&
          (ownedNftData?.length > 0 ? (
            <div className={style.nftwrapper}>
              {Boolean(ownedNftData) &&
                ownedNftData.map((nftItem, id) => (
                  <NFTCardLocal
                    key={id}
                    nftItem={nftItem}
                    listings={activeListings}
                  />
                ))}
            </div>
          ) : (
            <div className="flex w-full justify-center">
              {' '}
              No NFT collected yet.
            </div>
          ))}

        {showType == 'favourites' &&
          (favouriteNftData.length > 0 ? (
            <div className={style.nftwrapper}>
              {Boolean(favouriteNftData) &&
                favouriteNftData.map((nftItem, id) => (
                  <NFTCardLocal
                    key={id}
                    nftItem={nftItem}
                    listings={activeListings}
                  />
                ))}
            </div>
          ) : (
            <div className="flex w-full justify-center">No favourites yet.</div>
          ))}

        {ownedNftStatus == 'loading' ||
          nftStatus == 'loading' ||
          (favouriteNftStatus == 'loading' && (
            <div className="flex items-center justify-center">
              <IconLoading />
            </div>
          ))}
      </div>
      <Footer />
    </div>
  )
}

export default Collection
