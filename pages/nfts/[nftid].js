import millify from 'millify'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import { BiChevronUp } from 'react-icons/bi'
import Header from '../../components/Header'
import { Disclosure } from '@headlessui/react'
import { config } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { BsPause, BsPlay } from 'react-icons/bs'
import Purchase from '../../components/nft/Purchase'
import { MdAudiotrack, MdBlock } from 'react-icons/md'
import RelatedNFTs from '../../components/RelatedNFTs'
import ItemOffers from '../../components/nft/ItemOffers'
import BurnCancel from '../../components/nft/BurnCancel'
import ItemActivity from '../../components/nft/ItemActivity'
import AuctionTimer from '../../components/nft/AuctionTimer'
import { useThemeContext } from '../../contexts/ThemeContext'
import { getReferralRate } from '../../fetchers/SanityFetchers'
import ReportActivity from '../../components/nft/ReportActivity'
import BrowseByCategory from '../../components/BrowseByCategory'
import GeneralDetails from '../../components/nft/GeneralDetails'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useAddress, useContract, useSigner } from '@thirdweb-dev/react'
import { IconAvalanche, IconBNB, IconEthereum, IconHeart, IconImage, IconPolygon, IconVideo } from '../../components/icons/CustomIcons'
import {
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineDotsVertical,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi'
import { useCollectionFilterContext } from '../../contexts/CollectionFilterContext'
import Link from 'next/link'

const style = {
  wrapper: `flex flex-col pt-[5rem] sm:px-[2rem] lg:px-[8rem] items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}
const chainIcon = {
  '97': <IconBNB width="1.3rem" height="1.3rem" />,
  '56': <IconBNB width="1.3rem" height="1.3rem" />,
  '80001': <IconPolygon width="1.3rem" height="1.3rem" />,
  '137': <IconPolygon width="1.3rem" height="1.3rem" />,
  '5': <IconEthereum width="1.3rem" height="1.3rem" />,
  '4': <IconEthereum width="1.3rem" height="1.3rem" />,
  '43114': <IconAvalanche width="1.3rem" height="1.3rem" />,
  '43113': <IconAvalanche width="1.3rem" height="1.3rem" />,
}
const chainName = {
  '80001': 'Mumbai',
  '137': 'Polygon',
  '97': 'Binance Smart Chain Testnet',
  '56': 'Binance Smart Chain',
  '4': 'Rinkeby',
  '5': 'Goerli',
  '1': 'Ethereum',
  '43114': 'Avalanche',
  '43113': 'Avalanche Fuji',
}

const HOST = process.env.NODE_ENV == "production" ? 'https://nuvanft.io:8080': 'http://localhost:8080'
const Nft = (props) => { //props are from getServerSideProps

  const {nftContractData, metaDataFromSanity, listingData, thisNFTMarketAddress, thisNFTblockchain, listedItemsFromThisMarket, royaltyData } = props;
  const [totalLikers, setTotalLikers] = useState(metaDataFromSanity?.likedBy?.length);
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const address = useAddress();
  const signer = useSigner();
  const [isLiked, setIsLiked] = useState(false)
  const [playItem, setPlayItem] = useState(false)
  const [thisNFTMarketContract, setThisNFTMarketContract] = useState();
  const { chainExplorer, blockedNfts, blockedCollections } = useSettingsContext();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isZoom, setIsZoom] = useState(false);
  const { setReferralCommission } = useSettingsContext();
  const router = useRouter();
  const { setSelectedProperties } = useCollectionFilterContext();

  const {data, status} = useQuery(
    ['referralRate'],
    getReferralRate(),
    {
      onSuccess:(res) => {
        setReferralCommission(res);
      }
    }
  );

  useEffect(() => {
    if(!blockedNfts) return;
    const items = blockedNfts?.filter(item => item._id == metaDataFromSanity?._id);
    if(items?.length > 0){
      setIsBlocked(true);
    }
    //check for blocked collections
    const collitems = blockedCollections?.filter(coll => coll._id == metaDataFromSanity?.collection?._id);
    if(collitems?.length > 0){
      setIsBlocked(true);
    }
    return() => {
      //do nothing, cleanup functions
    }
  }, [metaDataFromSanity, blockedNfts])


  //get Market Contract signed with connected wallet otherwise get generic
  useEffect(()=>{
    if(!thisNFTMarketAddress && !thisNFTblockchain) {
      toast.error("Marketplace could not be found.", errorToastStyle);
      return;
    }

    ;(async () => {
      let sdk = '';
      if(signer) { 
        sdk = new ThirdwebSDK(signer); 
      }
      else { 
        sdk = new ThirdwebSDK(thisNFTblockchain); 
      }

      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");
      setThisNFTMarketContract(contract);
    })();

    return() => {
      // just clean up function, nothing else
    }
  }, [thisNFTMarketAddress, address, signer])


  let isAuctionItem = false;
  if(listingData?.reservePrice) {
    isAuctionItem = true;
  }

 
  
  //Add or Remove Likes/Heart
  const addRemoveLike = async (
    e,
    toastHandler = toast,
    sanityClient = config
  ) => {
    if (!address) {
      toastHandler.error(
        'Wallet not connected.',
        errorToastStyle
      )
      return
    }

    if (!metaDataFromSanity?._id) return
    let filteredLikers = []

    if (isLiked) {
      //change like color
      setIsLiked(false)

      //remove like
      setTotalLikers(prev => prev - 1);
      toastHandler.success('You unliked this NFT.', successToastStyle);
      const likerToRemove = [`likedBy[_ref == "${address}"]`]
      await sanityClient
        .patch(metaDataFromSanity?._id)
        .unset(likerToRemove)
        .commit()
        .then(() => {
          //remove from state variable too , to reflect updated likes count value
          const filteredLikers = metaDataFromSanity.likedBy.filter((likers) => {
            return likers._ref != address
          })
        })
        .catch((err) => {
          console.log(err)
          toastHandler.error('Error in unliking.', errorToastStyle)
        })
    } else {
      //add like
      setIsLiked(true)
      setTotalLikers(prev => prev + 1);
      toastHandler.success('You liked this NFT.', successToastStyle)
      await sanityClient
        .patch(metaDataFromSanity?._id)
        .setIfMissing({ likedBy: [] })
        .insert('before', 'likedBy[0]', [{ _ref: address }])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {

          //add current user into likedby array
          filteredLikers = [
            ...metaDataFromSanity.likedBy,
            { _ref: address, _type: 'reference' },
          ]
        })
        .catch((err) => {
          // console.error(err)
        })
    }
  }


  useEffect(() => {
    setIsLiked(false);
    if (!address) return;
    //check if current user has liked this NFT or not and set isLiked state accordingly
    if (metaDataFromSanity?.likedBy?.length > 0) {
      const amILiker = metaDataFromSanity.likedBy.find(
        (likers) => likers._ref == address
      )
      if (amILiker) {
        setIsLiked(true);
      }
    } else {
      setIsLiked(false);
    }

    return() => {
      //nothing , just clean up function
    }
  }, [metaDataFromSanity, address])

  return (
    <div
      className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white'}`}
    >
      {isZoom && (
        <div className=" h-full fixed z-20 w-full top-0 left-0 backdrop-blur-3xl bg-[#00000022] flex justify-center items-center cursor-pointer" onClick={() => setIsZoom(false)}>
          <div className="relative max-w-lg max-h-lg ">
            {!playItem && nftContractData?.metadata?.properties.itemtype == "video" && (
              <video className="w-full h-full" autoPlay loop>
                <source src={nftContractData?.metadata?.animation_url}/>
                Your browser does not support video tag. Upgrade your browser.
              </video>
            )}
            {!playItem && nftContractData?.metadata?.properties.itemtype == "audio" && (
              <>
                <audio className="w-full h-full" autoPlay loop>
                  <source src={nftContractData?.metadata?.animation_url}/>
                  Your browser does not support video tag. Upgrade your browser.
                </audio>
                <img
                  src={nftContractData?.metadata?.image}
                  className="h-full w-full object-cover"
                />
              </>
            )}
            {!playItem && nftContractData?.metadata?.properties.itemtype == "image" && (
              <img
                src={nftContractData?.metadata?.image}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      ) }
      <Header />
      {isBlocked ? (
        <div className="p-[4rem] text-center">
          <div className="mt-[10rem] flex justify-center mb-5"><MdBlock fontSize={100} color='#ff0000'/></div>
          <h2 className=" text-3xl font-bold mb-4">This NFT is blocked.</h2>
          <p className="leading-10">If you own this NFT and if you think there has been a mistake, please contact us at <a href="mailto:enquiry@metanuva.com" className="p-2 border border-slate-600 rounded-md">enquiry@metanuva.com</a></p>
        </div>
      ): (
        <main className="container sm:px-[2rem] lg:px-[8rem] mx-auto mt-11 flex pt-[5rem] md:pt-[8rem]">
          <div className="grid w-full grid-cols-1 gap-10 px-[1.2rem] md:gap-14 lg:grid-cols-2">
            <div className="space-y-8">
              <div
                className={
                  nftContractData?.owner?.toString() ==
                  '0x0000000000000000000000000000000000000000'
                    ? 'disabled pointer-none relative opacity-50 grayscale cursor-not-allowed'
                    : 'relative'
                }
              >
                <div className="aspect-w-11 aspect-h-12 overflow-hidden rounded-2xl max-h-[38rem] cursor-zoom-in" onClick={() => setIsZoom(true)}>
                  {playItem && nftContractData?.metadata?.properties.itemtype == "video" && (
                    <video className="w-full h-full" autoPlay loop>
                      <source src={nftContractData?.metadata?.animation_url}/>
                      Your browser does not support video tag. Upgrade your browser.
                    </video>
                  )}
                  {playItem && nftContractData?.metadata?.properties.itemtype == "audio" && (
                    <>
                      <audio className="w-full h-full" autoPlay loop>
                        <source src={nftContractData?.metadata?.animation_url}/>
                        Your browser does not support video tag. Upgrade your browser.
                      </audio>
                      <img
                        src={nftContractData?.metadata?.image}
                        className="h-full w-full object-cover"
                      />
                    </>
                  )}
                  {!playItem && (
                    <img
                      src={nftContractData?.metadata?.image}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full  bg-black/50 text-white md:h-10 md:w-10">
                  {nftContractData?.metadata?.properties?.itemtype == "audio" ? <MdAudiotrack /> : nftContractData?.metadata?.properties?.itemtype  == "video" ? <IconVideo /> : <IconImage />}
                </div>

                {(nftContractData?.metadata?.properties?.itemtype == "audio" || nftContractData?.metadata?.properties?.itemtype == "video") && 
                  (<div 
                      className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white md:h-10 md:w-10 cursor-pointer"
                      onClick={() => setPlayItem(curVal => !curVal)}>
                      { playItem ? <BsPause size={25} /> : <BsPlay size={25}/> }
                  </div>
                  )
                }

                <button
                  className="absolute right-3 top-3 flex h-10 items-center justify-center rounded-full bg-black/50 px-3.5 text-white "
                  onClick={addRemoveLike}
                >
                  <IconHeart color={isLiked ? '#ef4444' : ''} />
                  {totalLikers > 0 ? (
                    <span className="ml-2 text-sm">
                      {millify(totalLikers)}
                    </span>
                  ) : (
                    <span className="ml-2 text-sm">0</span>
                  )}
                </button>
              </div>

              <GeneralDetails
                nftContractData={nftContractData}
                listingData={listingData}
                chain={thisNFTblockchain}
                metaDataFromSanity={ metaDataFromSanity }
                />

              <div className="mt-4 w-full rounded-2xl">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                      <Tab
                        key={category}
                        className={({ selected }) =>
                          classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            selected
                              ? 'bg-white shadow'
                              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                          )
                        }
                      >
                        Details
                      </Tab>
                      <Tab
                        key={category}
                        className={({ selected }) =>
                          classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            selected
                              ? 'bg-white shadow'
                              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                          )
                        }
                      >
                        Description
                      </Tab>
                      
                      <Tab
                        key={category}
                        className={({ selected }) =>
                          classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            selected
                              ? 'bg-white shadow'
                              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                          )
                        }
                      >
                        Properties
                      </Tab>

                      

                  </Tab.List>
                  <Tab.Panels className="mt-2">

                      <Tab.Panel
                        key={idx}
                        className={classNames(
                          'rounded-xl bg-white p-3',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                        )}
                      >
                        {nftContractData?.metadata?.description}
                      </Tab.Panel>
                      <Tab.Panel
                        key={idx}
                        className={classNames(
                          'rounded-xl bg-white p-3',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                        )}
                      >
                        {nftContractData?.metadata?.description}
                      </Tab.Panel>
                      <Tab.Panel
                        key={idx}
                        className={classNames(
                          'rounded-xl bg-white p-3',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                        )}
                      >
                        {nftContractData?.metadata?.description}
                      </Tab.Panel>

                  </Tab.Panels>
                </Tab.Group>

                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`mt-3 flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                          dark
                            ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                            : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <HiOutlineDotsVertical fontSize={18} />
                          <span className="text-lg">Details</span>
                        </div>
                        <BiChevronUp
                          className={`${
                            open ? 'transform transition' : 'rotate-180 '
                          } h-5 w-5 text-neutral-500 transition`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                        <div>
                          <div className="flex flex-row justify-between py-2 flex-wrap break-words">
                            <span>Contract Address</span>
                            <a href={`${chainExplorer[metaDataFromSanity?.chainId]}address/${metaDataFromSanity?.collection?.contractAddress}`} target="_blank">
                              <span className="line-clamp-1 text-sm hover:text-sky-600 transition">{metaDataFromSanity?.collection?.contractAddress}</span>
                            </a>
                          </div>
                          <div className="flex flex-row justify-between py-2 flex-wrap break-words">
                            <span>Item ID</span>
                            <span className="line-clamp-1 text-sm">{nftContractData?.metadata?.id}</span>
                          </div>
                          <div className="flex flex-row justify-between py-2">
                            <span>Token Standard</span>
                            <span className={`line-clamp-1 text-xs border rounded-lg py-1 px-2 bg-slate-${dark ? '700' : '100'} border-slate-${dark ? '600' : '200'}`}>
                              {nftContractData?.type}
                            </span>
                          </div>
                          <div className="flex flex-row justify-between py-2">
                            <span>Blockchain</span>
                            <span className="line-clamp-1 text-base">
                              {chainIcon[metaDataFromSanity?.collection?.chainId]}
                              {chainName[metaDataFromSanity?.collection?.chainId]}
                            </span>
                          </div>
                          <div className="flex flex-row justify-between py-2">
                            <span>Royalty Receiver ({royaltyData?.seller_fee_basis_points? Number(royaltyData.seller_fee_basis_points) / 100 + '%' : ''})</span>
                            <span className="line-clamp-1 text-sm cursor-pointer">
                              <Link href={`/user/${royaltyData?.fee_recipient}`} passHref>
                                <a>
                                  {royaltyData?.fee_recipient?.slice(0,7)}...{royaltyData?.fee_recipient?.slice(-7)}
                                </a>
                              </Link>
                            </span>
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                          dark
                            ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                            : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <HiOutlineDocumentText fontSize={18} />
                          <span className="text-lg">Description</span>
                        </div>
                        <BiChevronUp
                          className={`${
                            open ? 'transform transition' : 'rotate-180'
                          } h-5 w-5 text-neutral-500 transition`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                        {nftContractData?.metadata?.description}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`mt-3 flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                          dark
                            ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                            : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <HiOutlineStar fontSize={18} />
                          <span className="text-lg">Properties</span>
                        </div>
                        <BiChevronUp
                          className={`${
                            open ? 'transform transition' : 'rotate-180 '
                          } h-5 w-5 text-neutral-500 transition`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-md flex flex-wrap justify-start gap-3 px-4 pt-4 pb-2">
                        {nftContractData?.metadata?.properties?.traits?.map(
                          (props, id) => (
                            <div key={id} className="cursor-pointer" onClick={() => {
                              setSelectedProperties([{ propertyKey: props.propertyKey, propertyValue: props.propertyValue}]);
                              router.push(`/collections/${metaDataFromSanity.collection._id}`)
                            }}>
                              {props.propertyKey != "" ? (

                              <div
                                className={`w-[130px] rounded-xl border border-solid ${
                                  dark
                                    ? 'border-slate-600 bg-slate-700'
                                    : 'border-sky-200/70 bg-sky-100'
                                } py-2 px-2 text-center transition  duration-500 hover:border-solid`}
                                key={id}
                              >
                                <p
                                  className={
                                    dark
                                      ? 'text-sm font-bold text-neutral-200'
                                      : 'text-sm font-bold text-sky-400'
                                  }
                                >
                                  {props.propertyKey}
                                </p>
                                <p
                                  className={
                                    dark ? 'text-neutral-100 text-sm' : 'text-sm text-sky-500'
                                  }
                                >
                                  {props.propertyValue}
                                </p>
                                {/* <p className="mt-2  py-0 text-center text-[0.7rem] font-bold">
                                  <span
                                    className={`w-fit rounded-md ${
                                      dark
                                        ? ' border border-slate-500 px-2 text-neutral-50'
                                        : 'border border-sky-300 px-2 text-sky-500'
                                    }`}
                                  >
                                    100% Match
                                  </span>
                                </p> */}
                              </div>
                              ) : (<span className={`text-sm ${dark ? 'text-slate-500' : 'text-neutral-600'}`}>No properties defined.</span>)}
                            </div>
                          )
                        )}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                

                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`mt-3 flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                          dark
                            ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                            : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <HiOutlineQuestionMarkCircle fontSize={18} />
                          <span className="text-lg">
                            About { metaDataFromSanity?.collection?.name }
                          </span>
                        </div>
                        <BiChevronUp
                          className={`${
                            open ? 'transform transition' : 'rotate-180 '
                          } h-5 w-5 text-neutral-500 transition`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                        { metaDataFromSanity?.collection?.description }
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
            <div className={`border-t ${dark ? ' border-slate-600' : ' border-neutral-200'} pt-10 lg:border-t-0 lg:pt-0 xl:pl-10`}>
              
              {/* {listingData && (parseInt(listingData?.secondsUntilEnd.hex, 16) != parseInt(listingData?.startTimeInSeconds.hex, 16)) && (
                <AuctionTimer
                selectedNft={selectedNft}
                listingData={listingData}
                auctionItem={isAuctionItem}
                />
                )} */}
              
              <Purchase
                nftContractData={nftContractData}
                listingData={listingData}
                nftCollection={metaDataFromSanity?.collection}
                auctionItem={isAuctionItem}
                thisNFTMarketAddress={thisNFTMarketAddress}
                thisNFTblockchain={thisNFTblockchain}
                />

              {/* {isAuctionItem && ( */}
                <ItemOffers
                  selectedNft={nftContractData}
                  listingData={listingData}
                  metaDataFromSanity={metaDataFromSanity}
                  thisNFTMarketAddress={thisNFTMarketAddress}
                  thisNFTblockchain={thisNFTblockchain}
                  isAuctionItem={isAuctionItem}
                  />
              {/* )} */}

              <ItemActivity
                collectionAddress={metaDataFromSanity?.collection?.contractAddress}
                selectedNft={nftContractData}
                metaDataFromSanity={ metaDataFromSanity }
                />
              {address && (
                <ReportActivity
                  collectionAddress={metaDataFromSanity?.collection?.contractAddress}
                  selectedNft={nftContractData}
                  metaDataFromSanity={ metaDataFromSanity }
                />
              )}
              <BurnCancel 
                nftContractData={nftContractData} 
                listingData={listingData} 
                collectionAddress={metaDataFromSanity?.collection?.contractAddress}
                thisNFTMarketAddress={thisNFTMarketAddress}
                thisNFTblockchain={thisNFTblockchain}
                />
            </div>
          </div>
        </main>

      )}
      <RelatedNFTs collection={metaDataFromSanity.collection} listingData={listingData} allNfts={listedItemsFromThisMarket} />
      <BrowseByCategory />
      <Footer />
    </div>
  )
}

export default Nft

export async function getServerSideProps(context){
  const { query } = context;
  var nftdata = "";
  var sanityData = "";
  var nftcontractdata = "";
  var allListedFromThisChain = "";
  var marketAddress = process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE; //by default, save a market address
  var nftChainid = 56;
  var royaltyData = {}

  const marketplace = {
    '80001': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
    '5': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
    '43113': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
    '43114': process.env.NEXT_PUBLIC_AVALANCE_MARKETPLACE,
    '97': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
    '421563': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
    '1': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
    '137': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
    '56': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
  }

  const blockchainName = {
    '80001': 'mumbai',
    '137': 'polygon',
    '43113': 'avalanche-fuji',
    '43114': 'avalanche',
    '97': 'binance-testnet',
    '56': 'binance',
    '421563': 'arbitrum-goerli',
    '5': 'goerli',
    '1': 'mainnet',
  }

  try {
    //nft's listing data
    const response = await fetch(`${HOST}/api/nft/listing/${query.nftid}`).catch(err => {
      console.error('Error getting NFT Listing data')
    }); 

    if(response.status == 200) {nftdata = await response.json();}

    //nfts sanity data
    const response2 = await fetch(`${HOST}/api/nft/${query.nftid}`).catch(err => {
          console.log('Error getting NFT data')
        });
    
    if(response2.status == 200) { 

      sanityData = await response2.json(); 
      
      // get royalty info for this token
      const tokenId = sanityData?.id;
      const contractAddress = sanityData?.collection?.contractAddress;
      const chain = blockchainName[sanityData?.collection.chainId];

      const sdk = new ThirdwebSDK(chain);

      const contract = await sdk.getContract(contractAddress, "nft-collection");

      const royalty = await contract.royalties.getTokenRoyaltyInfo(tokenId);

      royaltyData = {...royalty};

    }

    //collection's sanity data 
    const collectionAddress = sanityData.collection?.contractAddress;
    const response3 = await fetch(`${HOST}/api/nft/contract/${sanityData.chainId}/${collectionAddress}/${sanityData.id}`).catch(err => {
          console.error('Error getting Collection data')
        });
    if(response3.status == 200) { nftcontractdata = await response3.json(); }


    //determine which marketplace is current NFT is in

    nftChainid = sanityData?.collection.chainId;

    marketAddress = marketplace[nftChainid];

    const response4 = await fetch(`${HOST}/api/getAllListings/${blockchainName[nftChainid]}`);
    allListedFromThisChain = await response4.json();
  }catch(err){
    console.error(err)
  }
  

  return {
    props: {
      listingData: nftdata,
      metaDataFromSanity: sanityData,
      nftContractData: nftcontractdata,
      thisNFTMarketAddress: marketAddress,
      thisNFTblockchain: blockchainName[nftChainid],
      listedItemsFromThisMarket: allListedFromThisChain,
      royaltyData, 
    }
  }
}