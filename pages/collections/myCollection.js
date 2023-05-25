import moment from 'moment'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { FiImage } from 'react-icons/fi'
import { CgUserList } from 'react-icons/cg'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { BsGrid, BsGrid3X3Gap, BsListTask } from 'react-icons/bs'
import { useState, useEffect, useRef } from 'react'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { createAwatar } from '../../utils/utilities'
import { useQuery, useQueryClient } from 'react-query'
import NFTCardLocal from '../../components/NFTCardLocal'
import noBannerImage from '../../assets/noBannerImage.png'
import { useUserContext } from '../../contexts/UserContext'
import noProfileImage from '../../assets/noProfileImage.png'
import CollectionCard from '../../components/CollectionCard'
import { useThemeContext } from '../../contexts/ThemeContext'
import NFTCardExternal from '../../components/NFTCardExternal'
import NFTCardLocalList from '../../components/NFTCardLocalList'
import { MdOutlineCollections, MdVerified } from 'react-icons/md'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { RiFacebookFill, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { useActiveChain, useAddress, useChainId, useSigner } from '@thirdweb-dev/react'
import { getFullListings, INFURA_getMyAllNFTs } from '../../fetchers/Web3Fetchers'
import { IconCopy, IconLoading, IconVerified } from '../../components/icons/CustomIcons'
import { getMintedNFTs, getCollectedNFTs, getFavouriteNFTs } from '../../fetchers/SanityFetchers'
import { useSettingsContext } from '../../contexts/SettingsContext'

const Collection = () => {
  const router = useRouter();
  const signer = useSigner();
  const address = useAddress();
  const chainid = useChainId();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const { blockchainName } = useSettingsContext();
  const bannerRef = useRef();
  const activechain = useActiveChain();
  const [listStyle, setListStyle] = useState('grid');
  const {
    myUser,
    queryCacheTime,
    queryStaleTime,
    myCollections,
  } = useUserContext();
  const [showType, setShowType] = useState('collection');
  const qc = useQueryClient();
  const [compact, setcompact] = useState(true);

  const style = {
    nftwrapper:
    `grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'grid-cols-6' : 'xl:grid-cols-4'} place-items-center`,
    collectionWrapper:
      'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center',
    miniButton:
      'py-1 px-4 rounded-full gradBlue text-white text-sm mt-1 cursor-pointer',
  }
console.log(blockchainName[chainid]);

  //get all active listings from all blockchain
  const { data: fullListingData } = useQuery(
    ['fulllistings', blockchainName[chainid]], 
    getFullListings(),
    {
      enabled: Boolean(chainid),
      onSuccess: (res) => {
        // console.log(res);
      }
    });

  // const { data: nftData, status: nftStatus } = useQuery(
  //   ['createdItems', address],
  //   getMintedNFTs(),
  //   {
  //     enabled: Boolean(address) && false,
  //     onError: () => {
  //       toast.error(
  //         'Error fetching minted NFTs. Refresh and try again.',
  //         errorToastStyle
  //       )
  //     },
  //     onSuccess: (res) => {
  //       // console.log(res)
  //     },
  //   }
  // )

  const { data: mynfts, status: mynftstatus } = useQuery(
    ['mynfts', address],
    INFURA_getMyAllNFTs(activechain?.chainId),
    {
      enabled: Boolean(address) && Boolean(activechain),
      onError:() => {},
      onSuccess:(res) => 
      {
        // console.log(res);
      }
    }
  )

  // const { data: ownedNftData, status: ownedNftStatus } = useQuery(
  //   ['collectedItems', address],
  //   getCollectedNFTs(),
  //   {
  //     enabled: Boolean(address) && false,
  //     onError: () => {
  //       toast.error(
  //         'Error fetching minted NFTs. Refresh and try again.',
  //         errorToastStyle
  //       )
  //     },
  //     onSuccess: (res) => {
  //       // console.log(res)
  //     },
  //   }
  // )

  const { data: favouriteNftData, status: favouriteNftStatus } = useQuery(
    ['favouriteItems', address],
    getFavouriteNFTs(),
    {
      enabled: Boolean(address),
      onError: () => {
        toast.error(
          'Error fetching minted NFTs. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess:(res)=> {
        // console.log(res)
      }
    }
  )

  useEffect(() => {
    if (!address) {
      router.push('/')
      return
    }

    return() => {
      //do nothing
    }
  }, [address])

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
            <img
              src={myUser?.web3imagebanner ? getImagefromWeb3(myUser?.web3imagebanner) : `https://picsum.photos/1500/500/?blur=10`}
              className="h-full w-full object-cover"
              alt={myUser?.userName}
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
              <div className="sm:w-full md:w-56 xl:w-60">
                <div
                  className="nc-NcImage aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl"
                  data-nc-id="NcImage"
                >
                  <img
                    src={ myUser?.web3imageprofile ? getImagefromWeb3(myUser?.web3imageprofile) : createAwatar(address) }
                    className="h-full w-full object-cover"
                    alt="userprofile"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3 sm:justify-center">
                <div className="flex space-x-1.5">
                  {myUser?.igHandle != null ? (
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
                  ) : ''}
                  {myUser?.twitterhandle != null ? (
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
                  ) : ''}
                  {myUser?.fbhHandle != null ? (
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

                  ) :''}
                </div>                
              </div>
            </div>

            <div className="mt-5 flex-grow md:mt-0 md:ml-8 xl:ml-14">
              <div className="max-w-screen-sm ">
                <div className="flex flex-start gap-2 items-center">
                  <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
                    {myUser?.userName}
                  </h2>
                  {myUser?.verified ? <IconVerified fontSize={8} /> : ''}
                </div>
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
                    {mynfts?.length == 0 ? '0' : mynfts?.length}
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
                    {/* {myCollections?.volumeTraded
                      ? parseFloat(myCollections?.volumeTraded).toFixed(4)
                      : 0} */}
                      ${myUser?.volumeTraded ? Number(myUser.volumeTraded).toFixed(4) : 0 }
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

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-[5rem] flex justify-center px-5">
        <div
          className={`border ${
            dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
          } flex justify-between gap-2 overflow-scroll rounded-full p-1 shadow`}
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
            <span className="inline-block pl-2 w-max">My Collections</span>
          </div>
          <div
            className={`cursor-pointer rounded-full p-4 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              showType == 'myallnfts' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setShowType('myallnfts')}
          >
            <span className="inline-block pl-2 w-max">My NFTs</span>
          </div>
          {/* <div
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
            <span className="inline-block pl-2 w-max">Minted NFTs</span>
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
            <span className="inline-block pl-2 w-max">Collected NFTs</span>
          </div> */}
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
            <span className="inline-block pl-1 w-max">Liked NFTs</span>
          </div>
        </div>
      </div>
      

        <div className="flex  justify-center mt-5 rounded-md overflow-hidden">
            <div className="rounded-md flex overflow-hidden">
              <div 
                className={`p-2  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'} ${!compact && '!bg-slate-600'} cursor-pointer`}
                onClick={() => setcompact(false)}>
                  <BsGrid/>
              </div>
              <div 
                className={`p-2  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'} ${compact && '!bg-slate-600'} cursor-pointer`}
                onClick={() => setcompact(true)}>
                  <BsGrid3X3Gap/>
              </div>
            </div>
        </div>



      <div className="container mx-auto lg:p-[8rem] lg:pt-8 lg:pb-0 p-[2rem]">
        {showType == 'collection' && (
          <>
            {myCollections && myCollections?.length > 0 && (
              <div className={style.collectionWrapper}>
                {myCollections?.map((coll, id) => (
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


        {showType == 'myallnfts' &&
          (mynftstatus == "success" && mynfts?.length > 0 ? (
            <div className={style.nftwrapper}>
              {mynfts.map((nftItem, id) => (

                  <NFTCardExternal
                    key={id}
                    chain={blockchainName[chainid]}
                    nftItem={nftItem}
                    metadata={nftItem.metadata}
                    listings={fullListingData}
                    creator={{ _ref: address }}
                    compact={compact}
                  />

                ))}
            </div>
          ) : (
            <div className="flex w-full justify-center">
              {' '}
              No NFTs yet.
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
                    listings={fullListingData}
                  />
                ))}
            </div>
          ) : (
            <div className="flex w-full justify-center">No Liked NFTs yet.</div>
          ))}

        {mynftstatus == 'loading' ||
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