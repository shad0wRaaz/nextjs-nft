import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'
import { useRouter } from 'next/router'
import { FiImage } from 'react-icons/fi'
import { CgUserList } from 'react-icons/cg'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { HiChevronRight } from 'react-icons/hi'
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
import { BsGrid, BsGrid3X3Gap, BsListTask } from 'react-icons/bs'
import { MdOutlineCollections, MdVerified } from 'react-icons/md'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { RiFacebookFill, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import CollectionCardExternal from '../../components/CollectionCardExternal'
import { useAddress, useChain, useChainId, useSigner } from '@thirdweb-dev/react'
import { IconCopy, IconLoading, IconVerified } from '../../components/icons/CustomIcons'
import { getMintedNFTs, getCollectedNFTs, getFavouriteNFTs } from '../../fetchers/SanityFetchers'
import { getFullListings, INFURA_getMyAllNFTs, INFURA_getMyCollections } from '../../fetchers/Web3Fetchers'

const Collection = () => {
  const router = useRouter();
  const signer = useSigner();
  const address = useAddress();
  const chainid = useChainId();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const { blockchainName, blockchainIdFromName, chainIcon, HOST } = useSettingsContext();
  const { selectedBlockchain } = useMarketplaceContext();
  const bannerRef = useRef();
  const activechain = useChain();
  const [listStyle, setListStyle] = useState('grid');
  const { myUser, myCollections} = useUserContext();
  const [showType, setShowType] = useState('myallnfts');
  const qc = useQueryClient();
  const [compact, setcompact] = useState(true);
  const [cursor, setCursor] = useState();
  const [cursorHistory, setCursorHistory] = useState([]);
  const [ collectionsFromInfura, setCollectionsFromInfura] = useState([]);
  const [mynfts, setMynfts] = useState();
  const style = {
    nftwrapper:
    `grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'grid-cols-6' : 'xl:grid-cols-4'} place-items-center`,
    collectionWrapper:
      'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center',
    miniButton:
      'py-1 px-4 rounded-full gradBlue text-white text-sm mt-1 cursor-pointer',
  }

  //this gives all the collections from INFURA but does not gives images, so have to be imported by the user manually and then update images manually
  
  const {data: outsideCollection, status: outsideCollectionStatus} = useQuery(
    ['allcollections', address, selectedBlockchain],
    INFURA_getMyCollections(chainid ? chainid : blockchainIdFromName[selectedBlockchain], address),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(address) ,
      onSuccess: (res) => {
        // console.log('res', res);
      }
    }
  );

  //filter out only those collections deployed in third party websites
  useEffect(() => {
    if(myCollections && outsideCollectionStatus == 'success' ){
      const allCollections = [...outsideCollection.collections];
      
      const inhouseCollections = myCollections.map(coll => coll.contractAddress.toLowerCase());
      const outsideCollections = allCollections.filter(coll => !inhouseCollections.includes(coll.contract));
      // console.log('all',outsideCollections)
      if(outsideCollections.length > 0){
        setCollectionsFromInfura([...outsideCollections]);
      }
    }
    return () => {
      //do nothing, just clean up function
    }
  }, [myCollections, outsideCollectionStatus]);

  const { data, status: mynftstatus } = useQuery(
    ['mynfts', address, cursor, activechain],
    INFURA_getMyAllNFTs(activechain?.chainId),
    {
      enabled: Boolean(address) && Boolean(activechain),
      onError:() => {},
      onSuccess:(res) => 
      {
        const unresovled = res?.assets.map(async nft => {
          const {data} =  await axios.get(`${HOST}/api/mango/getSingle/${blockchainName[activechain.chainId]}/${nft.contract}/${nft.tokenId}`);
          const newObject= {
            ...nft,
            listingData: data[0]
          }
          return newObject;
        })

        ;(async() => {
          const resolved = await Promise.all(unresovled);
          setMynfts(resolved);
        })()
      }
    }
  )

  const { data: favouriteNftData, status: favouriteNftStatus } = useQuery(
    ['favouriteItems', address],
    getFavouriteNFTs(),
    {
      enabled: Boolean(address) && false,
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
      <SEO title="My NFTs and Collections"/>
      <Header />
      <div className="w-full">
        <div className="relative h-60 w-full md:h-60 2xl:h-96" ref={bannerRef}>
          <div className="absolute inset-0">
            <img
              src={myUser?.web3imagebanner ? getImagefromWeb3(myUser?.web3imagebanner) : `https://picsum.photos/1500/500/?blur=10`}
              className="h-full w-full object-cover"
              alt={myUser?.userName}
            />
          </div>
        </div>

        <div className="container relative  mx-auto -mt-14 lg:-mt-64 lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]">
          <div
              className={`flex flex-col rounded-3xl ${
                dark ? 'darkGray/30' : 'bg-white/30'
              } md:p-8 p-4 shadow-xl md:flex-row md:rounded-[40px] backdrop-blur-xl`}
            >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:block">
              <div className="sm:w-full md:w-20 xl:w-20">
                <div
                  className="aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl"
                >
                  <img
                    src={ myUser?.web3imageprofile ? getImagefromWeb3(myUser?.web3imageprofile) : createAwatar(address) }
                    className="h-full w-full object-cover"
                    alt={myUser?.userName}
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

            <div className="mt-5 flex flex-wrap flex-grow md:mt-0 md:ml-8 xl:ml-5 items-center justify-between gap-5">
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
                  {!dark ? <IconCopy color="#3d3d3d"/> : <IconCopy color="#ffffff" />}
                  
                </span>
                <span className={`block text-xs ${dark ? 'text-white/50' : 'text-black/80'}`}>
                  Joined from {moment(myUser?._createdAt).format('YYYY MMM')}
                </span>
                <span className="mt-4 block text-sm">{myUser?.biography}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-5">
                <div
                  className={`${
                    dark
                      ? 'border  border-sky-400/20'
                      : ' border border-neutral-50/20'
                  } flex flex-col items-center justify-center rounded-2xl p-5 lg:p-2`}
                >
                  <MdOutlineCollections fontSize="20px" className="mb-2 inlineblock" />
                  <span className="text-sm inline-block">Collections</span>
                  <span className="mt-1 text-base font-bold sm:mt-2 sm:text-xl">
                    {Boolean(outsideCollection?.total) ? outsideCollection?.total : Boolean(myCollections.length) ? myCollections.length : 0}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? 'border  border-sky-400/20'
                      : ' border border-neutral-50/20'
                  } flex flex-col items-center justify-center rounded-2xl p-5 lg:p-2`}
                >
                  <FiImage fontSize="20px" className="mb-2" />
                  <span className="text-sm">NFTs</span>
                  <span className="mt-1 text-base font-bold sm:mt-2 sm:text-xl">
                  {Boolean(mynfts?.length) ? mynfts?.length : 0}
                  </span>
                </div>

                <div
                  className={`${
                    dark
                      ? 'border  border-sky-400/20'
                      : ' border border-neutral-50/20'
                  } flex flex-col items-center justify-center rounded-2xl p-5 lg:p-2`}
                >
                  <RiMoneyDollarCircleLine fontSize="20px" className="mb-2" />
                  <span className="text-sm text-center">Volume Traded</span>
                  <span className="mt-1 break-all text-base font-bold sm:mt-2 sm:text-xl">
                    {/* {myCollections?.volumeTraded
                      ? parseFloat(myCollections?.volumeTraded).toFixed(4)
                      : 0} */}
                      ${myUser?.volumeTraded ? Number(myUser.volumeTraded).toFixed(4) : 0 }
                  </span>
                </div>
                <div
                  className={`${
                    dark
                      ? 'border  border-sky-400/20'
                      : ' border border-neutral-50/20'
                  } flex flex-col items-center justify-center rounded-2xl p-5 lg:p-2`}
                >
                  <CgUserList fontSize="20px" className="mb-2" />
                  <span className="text-sm">Followers</span>
                  <span className="mt-1 text-base font-bold sm:mt- sm:text-xl">
                    {myUser?.followers?.length ? myUser.followers.length : '0'}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" relative z-10  container mx-auto lg:mt-[4rem] lg:p-[8rem] lg:pt-12 pt-0 pb-0 lg:pb-0 p-[2rem]">
        <div className={`${dark ? 'md:bg-[#111827]' : 'md:bg-white'} rounded-3xl md:rounded-[40px] pt-[2rem]`}>
          <div className="container mx-auto flex justify-center mb-8">
            <div
              className={`border ${
                dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
              } flex justify-between gap-2 overflow-auto rounded-full p-1 shadow`}
            >
              <div
                className={`transition cursor-pointer rounded-full md:p-4 md:px-8 p-2 px-4 ${
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
                className={` transition cursor-pointer rounded-full md:p-4 md:px-8 p-2 px-4 ${
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
              {/* <div
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
              </div> */}
            </div>
          </div>
          <div className="text-center text-sm relative">
            Showing {showType == 'collection' ? 'Collections' : 'NFTs'} from 
            <span className={`p-2 pl-3 ml-2 border rounded-lg ${dark ? 'border-slate-800': 'border-neutral-200'}`}> 
            {selectedBlockchain.toUpperCase()} chain {chainIcon[blockchainIdFromName[selectedBlockchain]]}</span>
          </div>
          <div className=" mx-auto  lg:pt-8 lg:pb-0 pb-0 pt-8 md:pt-0 flex justify-between items-center">
            <div className={`flex overflow-hidden rounded-md border ${dark ? 'border-slate-700': 'border-neutral-200/80'}`}>
              <div 
                className={` ${!compact ? (dark ? 'bg-slate-500 hover:bg-slate-500' : 'bg-sky-600 text-white') : (dark ? 'bg-slate-700' :'bg-neutral-100  hover:bg-sky-200')} p-2 cursor-pointer`}
                onClick={() => setcompact(false)}>
                <BsGrid/>
              </div>
              <div 
                className={` ${compact ? (dark ? 'bg-slate-500 hover:bg-slate-500' : 'bg-sky-600 text-white') : (dark ? 'bg-slate-700' :'bg-neutral-100 hover:bg-sky-200')} p-2 cursor-pointer`}
                onClick={() => setcompact(true)}>
                <BsGrid3X3Gap/>
              </div>
            </div>
            
            {/* {Boolean(mynfts?.cursor) && ( */}
              <div>
                <button 
                  className={`rounded-md text-sm p-2 px-3 flex gap-1 items-center  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'}`}
                  onClick={() => setCursor(mynfts?.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
              </div>
            {/* )} */}
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
            {Boolean(collectionsFromInfura) && collectionsFromInfura.length > 0 && (
              <div className={style.collectionWrapper + ' mt-8'}>
                {collectionsFromInfura?.map((coll, id) => (
                  <CollectionCardExternal
                    key={id}
                    name={coll.name}
                    id={coll.contract}
                    contractAddress={coll.contract}
                    chainId={activechain?.chainId}
                    creator="Unnamed"
                    creatorAddress={address}
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
            <Link href="/collections/create">
              <button className="text-md gradBlue cursor-pointer rounded-xl p-4 px-8 text-center text-white">
                Create Collection
              </button>
            </Link>
          </div>
        )}


        {showType == 'myallnfts' &&
          ((mynftstatus == 'success' && mynfts?.length > 0) ? (
            <>
              <div className={style.nftwrapper}>
                {mynfts?.map((nftItem, id) => (

                    <NFTCardExternal
                      key={id}
                      chain={blockchainName[chainid]}
                      nftItem={nftItem}
                      metadata={nftItem.metadata}
                      creator={{ _ref: address }}
                      compact={compact}
                    />
                  ))}

              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className={`rounded-md text-sm p-2 px-3 flex gap-1 items-center  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'}`}
                  onClick={() => setCursor(mynfts?.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
              </div>
            </>
          ) : (
            <>
              {mynftstatus == 'loading' ? (
                <>
                  {dark ? <IconLoading dark="inbutton"/> : <IconLoading />}
                </>
              ) : (
                <div className="flex w-full justify-center">
                  {' '}
                  No NFTs yet.
                </div>
              )}
            </>
          ))}

        {/* {showType == 'favourites' &&
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
          ))} */}

        {/* {mynftstatus == 'loading' && (
            <div className="flex items-center justify-center">
              {dark ? <IconLoading dark="inbutton"/> : <IconLoading/>}
            </div>
          )} */}
      </div>
      <Footer />
    </div>
  )
}

export default Collection