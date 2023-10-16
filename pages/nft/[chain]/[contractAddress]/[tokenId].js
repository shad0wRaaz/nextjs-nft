import Link from 'next/link'
import millify from 'millify'
import toast from 'react-hot-toast'
import { Router } from 'react-router'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import SEO from '../../../../components/SEO'
import { TbArrowsSplit } from 'react-icons/tb'
import { BsPause, BsPlay } from 'react-icons/bs'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { Fragment, useEffect, useState } from 'react'
import { config } from '../../../../lib/sanityClient'
import { MdAudiotrack, MdBlock } from 'react-icons/md'
import Benefits from '../../../../components/Benefits'
import { BiChevronUp, BiInfoCircle } from 'react-icons/bi'
import { getImagefromWeb3 } from '../../../../fetchers/s3'
import Purchase from '../../../../components/nft/Purchase'
import { ThirdwebSDK, getContract } from '@thirdweb-dev/sdk'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import RelatedNFTs from '../../../../components/RelatedNFTs'
import { isCompanyWallet } from '../../../../utils/utilities'
import ItemOffers from '../../../../components/nft/ItemOffers'
import BurnCancel from '../../../../components/nft/BurnCancel'
import { Disclosure, Tab, Transition } from '@headlessui/react'
import ItemActivity from '../../../../components/nft/ItemActivity'
import AuctionTimer from '../../../../components/nft/AuctionTimer'
import SkeletonLoader from '../../../../components/SkeletonLoader'
import { useThemeContext } from '../../../../contexts/ThemeContext'
import { getReferralRate } from '../../../../fetchers/SanityFetchers'
import ReportActivity from '../../../../components/nft/ReportActivity'
import GeneralDetails from '../../../../components/nft/GeneralDetails'
import BrowseByCategory from '../../../../components/BrowseByCategory'
import { MdOutlineDangerous, MdOutlineOpenInNew } from 'react-icons/md'
import { useAddress, useContract, useSigner } from '@thirdweb-dev/react'
import { useSettingsContext } from '../../../../contexts/SettingsContext'
import { useCollectionFilterContext } from '../../../../contexts/CollectionFilterContext'
import { IconAvalanche, IconBNB, IconCopy, IconEthereum, IconHeart, IconImage, IconPolygon, IconVideo } from '../../../../components/icons/CustomIcons'

const style = {
  wrapper: `flex flex-col pt-[5rem] sm:px-[2rem] lg:px-[8rem] items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
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
const HOST = process.env.NODE_ENV == "production" ? 'https://nuvanft.io:8080': 'http://localhost:8080';

const Nft = (props) => { //props are from getServerSideProps
  const { nftContractData, metaDataFromSanity, listingData, thisNFTMarketAddress, thisNFTblockchain, listedItemsFromThisMarket, ownerData, contractAddress } = props;
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const address = useAddress();
  const signer = useSigner();
  // const [isLiked, setIsLiked] = useState(false)
  const [playItem, setPlayItem] = useState(false);
  const [itemType, setItemType] = useState('image');
  const [thisNFTMarketContract, setThisNFTMarketContract] = useState();
  const { chainExplorer, blockchainIdFromName, blockedNfts, blockedCollections, referralAllowedCollections } = useSettingsContext();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isZoom, setIsZoom] = useState(false);
  const { setReferralCommission } = useSettingsContext();
  const router = useRouter();
  const { setSelectedProperties } = useCollectionFilterContext();
  const [isAuctionItem, setIsAuctionItem] = useState(false);
  const [royaltySplitData, setRoyaltySplitData] = useState();
  const [showSplit, setShowSplit] = useState(false);
  const [animationUrl, setAnimationUrl] = useState();
  const [imgPath, setImgPath] = useState();

  const {data: royaltyData, status: royaltyStatus} = useQuery(
    ['royalty'],
    async() => {
      const sdk = new ThirdwebSDK(thisNFTblockchain,
        {
          clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
        });
      const contract = await sdk.getContract(nftContractData.contract);
      return await contract.royalties.getTokenRoyaltyInfo(
        nftContractData.tokenId,
      );
    },
    {
      enabled: Boolean(nftContractData?.contract),
      onSuccess: (res) => {
        // console.log(res)
      }
    }
  )

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

      ;(async () => {
        const nftImagePath = await getImagefromWeb3(nftContractData?.metadata?.image);
        const nftAVPath = await getImagefromWeb3(nftContractData?.metadata?.animation_url);
        // console.log(nftImagePath)
        setImgPath(nftImagePath?.data);
        setAnimationUrl(nftAVPath?.data);
      })();
    return() => {}

  }, [])
  
  useEffect(() => {
    if(!nftContractData || nftContractData === null || !Boolean(nftContractData.metadata)) return

    if(Boolean(nftContractData.metadata?.animation_url)){
      const audioExts = ['m4a', 'wav', 'wma', 'aac', 'flac', 'mp3', 'ogg'];
      const videoExts = ['mov', 'flv', 'mp4', '3gp', 'mpg', 'wmv', 'webm', 'avi', 'mkv'];
      const nftExt = nftContractData.metadata?.animation_url?.slice(-3);
      if(audioExts.includes(nftExt)) { setItemType('audio');}
      else if(videoExts.includes(nftExt)) { setItemType('video');}
    }else {
      setItemType('image');
    }
    
    return() => {}
  }, [nftContractData])

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
  }, [metaDataFromSanity, blockedNfts]);

  useEffect(() => {
    if(!metaDataFromSanity || !referralAllowedCollections || !royaltyData) return;
    const isAllowed = referralAllowedCollections.filter(coll => coll._ref == metaDataFromSanity._id);
    
    if(isAllowed?.length > 0){

      //check if the recipeint is company wallet, if it is donot need to show royalty data
      if(!isCompanyWallet(royaltyData.fee_recipient)){
        const sdk = new ThirdwebSDK(thisNFTblockchain, {
          clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY,
        });
        ;(async() => {
          const splitContract = await sdk.getContract(royaltyData.fee_recipient, "split");
          const allRecipient = await splitContract.getAllRecipients();
          setRoyaltySplitData(allRecipient);
        })();
      }
    }
    return() => {
      //do nothing
    }
  }, [metaDataFromSanity, referralAllowedCollections, royaltyData]);


  //get Market Contract signed with connected wallet otherwise get generic
  useEffect(()=>{
    if(!thisNFTblockchain) return;
    if(!thisNFTMarketAddress && !thisNFTblockchain) {
      toast.error("Marketplace could not be found.", errorToastStyle);
      return;
    }

    ;(async () => {
      let sdk = '';
      if(signer) { 
        sdk = new ThirdwebSDK(signer,
          {
            clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
          }); 
      }
      else { 
        sdk = new ThirdwebSDK(thisNFTblockchain,
          {
            clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
          }); 
      }

      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");
      setThisNFTMarketContract(contract);
    })();

    return() => {
      // just clean up function, nothing else
    }
  }, [thisNFTMarketAddress, address, signer])

  useEffect(() => {
    if(Boolean(listingData?.type == 1)) {
      setIsAuctionItem(true);
    }

    return() => {}
  }, [listingData])


  //Add or Remove Likes/Heart
  // const addRemoveLike = async (
  //   e,
  //   toastHandler = toast,
  //   sanityClient = config
  // ) => {
  //   if (!address) {
  //     toastHandler.error(
  //       'Wallet not connected.',
  //       errorToastStyle
  //     )
  //     return
  //   }

  //   if (!metaDataFromSanity?._id) return
  //   let filteredLikers = []

  //   if (isLiked) {
  //     //change like color
  //     setIsLiked(false)

  //     //remove like
  //     setTotalLikers(prev => prev - 1);
  //     toastHandler.success('You unliked this NFT.', successToastStyle);
  //     const likerToRemove = [`likedBy[_ref == "${address}"]`]
  //     await sanityClient
  //       .patch(metaDataFromSanity?._id)
  //       .unset(likerToRemove)
  //       .commit()
  //       .then(() => {
  //         //remove from state variable too , to reflect updated likes count value
  //         const filteredLikers = metaDataFromSanity.likedBy.filter((likers) => {
  //           return likers._ref != address
  //         })
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         toastHandler.error('Error in unliking.', errorToastStyle)
  //       })
  //   } else {
  //     //add like
  //     setIsLiked(true)
  //     setTotalLikers(prev => prev + 1);
  //     toastHandler.success('You liked this NFT.', successToastStyle)
  //     await sanityClient
  //       .patch(metaDataFromSanity?._id)
  //       .setIfMissing({ likedBy: [] })
  //       .insert('before', 'likedBy[0]', [{ _ref: address }])
  //       .commit({ autoGenerateArrayKeys: true })
  //       .then(() => {

  //         //add current user into likedby array
  //         filteredLikers = [
  //           ...metaDataFromSanity.likedBy,
  //           { _ref: address, _type: 'reference' },
  //         ]
  //       })
  //       .catch((err) => {
  //         // console.error(err)
  //       })
  //   }
  // }


  // useEffect(() => {
  //   setIsLiked(false);
  //   if (!address) return;
  //   //check if current user has liked this NFT or not and set isLiked state accordingly
  //   if (metaDataFromSanity?.likedBy?.length > 0) {
  //     const amILiker = metaDataFromSanity.likedBy.find(
  //       (likers) => likers._ref == address
  //     )
  //     if (amILiker) {
  //       setIsLiked(true);
  //     }
  //   } else {
  //     setIsLiked(false);
  //   }

  //   return() => {
  //     //nothing , just clean up function
  //   }
  // }, [metaDataFromSanity, address])

  return (
    <div className={` ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white'}`}>
      {isZoom && (
        <div className=" h-full fixed z-20 w-full top-0 left-0 backdrop-blur-3xl bg-[#00000022] flex justify-center items-center cursor-pointer" onClick={() => setIsZoom(false)}>
          <div className="relative">
            {!playItem && itemType == "video" && (
              <>
                <video className="w-full h-full" autoPlay loop>
                  <source src={nftContractData?.metadata?.animation_url}/>
                  Your browser does not support video tag. Upgrade your browser.
                </video>
                <img
                src={getImagefromWeb3(nftContractData?.metadata?.image)}
                className="h-full w-full object-cover"
                loading='lazy'
                />
            </>
            )}
            {!playItem && itemType == "audio" && (
              <>
                <audio className="w-full h-full" autoPlay loop>
                  <source src={nftContractData?.metadata?.animation_url}/>
                  Your browser does not support video tag. Upgrade your browser.
                </audio>
                <img
                  src={getImagefromWeb3(nftContractData?.metadata?.image)}
                  className="h-full w-full object-cover"
                />
              </>
            )}
            {!playItem && (
              <img
                src={getImagefromWeb3(nftContractData?.metadata?.image)}
                className="relative top-10" style={{ maxHeight: '850px' }}
              />
            )}
          </div>
        </div>
      ) }
      <Header />
      {(contractAddress === 'undefined' || nftContractData === null) ? (
        <>
          <SEO/>
          <div className="pt-[10rem] text-center  p-4 container mx-auto lg:p-[8rem] lg:pb-0 overflow-hidden">
            <div className="rounded-xl bg-red-100 border-red-300 text-red-700 m-auto p-8">
              <MdOutlineDangerous fontSize={30} className='inline'/><span className="text-xl font-bold block pb-2 pt-2">The item you are looking could not be found.</span> It might have been moved, doesnot exist or burnt.
            </div>
          </div>
        </>
      ) : (
        <>
          <SEO 
            title={nftContractData?.metadata?.name}
            description={nftContractData?.metadata?.description}
            image={getImagefromWeb3(nftContractData?.metadata?.image)}
            currentUrl={`https://nuvanft.io/nft/${thisNFTblockchain}/${contractAddress}/${nftContractData?.tokenId}`} />
          {isBlocked ? (
            <div className="p-[4rem] text-center">
              <div className="mt-[10rem] flex justify-center mb-5"><MdBlock fontSize={100} color='#ff0000'/></div>
              <h2 className=" text-3xl font-bold mb-4">This NFT is blocked.</h2>
              <p className="leading-10">If you own this NFT and if you think there has been a mistake, please contact us at <a href="mailto:enquiry@metanuva.com" className="p-2 border border-slate-600 rounded-md">enquiry@metanuva.com</a></p>
            </div>
          ) : (
            <main className="container sm:px-[2rem] lg:px-[8rem] mx-auto mt-11 flex pt-[5rem] md:pt-[8rem]">
              <div className="grid w-full grid-cols-1 gap-10 px-[1.2rem] md:gap-14 lg:grid-cols-2">
                <div className="space-y-8">
                  <div
                    className={
                      ownerData?.owners[0]?.ownerOf.toString() ==
                      '0x0000000000000000000000000000000000000000'
                        ? 'disabled pointer-none relative opacity-50 grayscale cursor-not-allowed'
                        : 'relative'
                    }
                  >
                    <div className="aspect-w-11 aspect-h-12 overflow-hidden rounded-2xl max-h-[38rem] cursor-zoom-in" onClick={() => setIsZoom(true)}>
                      {playItem && itemType == "video" && (
                        <>
                          <video className="w-full h-full" autoPlay loop>
                            <source src={animationUrl}/>
                            Your browser does not support video tag. Upgrade your browser.
                          </video>
                          <img
                          src={imgPath}
                          className="h-full w-full object-cover"
                          />
                      </>
                      )}
                      {playItem && itemType == "audio" && (
                        <>
                          <audio className="w-full h-full" autoPlay loop>
                            <source src={animationUrl}/>
                            Your browser does not support video tag. Upgrade your browser.
                          </audio>
                          <img
                            src={imgPath}
                            className="h-full w-full object-cover"
                          />
                        </>
                      )}
                      {!playItem && (
                        <>
                        {imgPath ? (
                          <img
                            src={imgPath}
                            className="h-full w-full object-cover"
                          />
                          ) : 
                            <SkeletonLoader roundness="xl" />
                          }
                        </>
                      )}
                    </div>

                    {/* <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full  bg-black/50 text-white md:h-10 md:w-10">
                      {nftContractData?.metadata?.properties?.itemtype == "audio" ? <MdAudiotrack /> : nftContractData?.metadata?.properties?.itemtype  == "video" ? <IconVideo /> : <IconImage />}
                    </div> */}

                    {(itemType == "audio" || itemType == "video") && 
                      (<div 
                          className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white md:h-10 md:w-10 cursor-pointer"
                          onClick={() => setPlayItem(curVal => !curVal)}>
                          { playItem ? 
                            <div className={playItem ? 'opacity-100 transition': 'transition opacity-0'}>
                              <BsPause size={25} />
                            </div> 
                            : 
                            <div className={!playItem ? 'opacity-100 transition': 'transition opacity-0'}>
                              <BsPlay size={25} />
                            </div>
                          }
                      </div>
                      )
                    }

                    {/* <button
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
                    </button> */}
                  </div>

                  <GeneralDetails
                    nftContractData={nftContractData}
                    listingData={listingData}
                    chain={thisNFTblockchain}
                    owner={ownerData}
                    contractAddress={contractAddress}
                    metaDataFromSanity={ metaDataFromSanity }
                    />

                  <div className="mt-4 w-full rounded-2xl">
                    <Tab.Group>
                      <Tab.List className={`flex space-x-1 rounded-xl ${dark ? 'bg-slate-800' : 'bg-neutral-100'} p-2`}>
                        <Tab
                              className={({ selected }) =>
                                classNames(
                                  'w-full rounded-lg text-sm p-2.5 transition font-medium outline-0', 
                                  selected
                                    ? (dark ? 'bg-slate-600 text-neutral-100 shadow' : ' bg-neutral-300 text-slate-700 shadow ring-2 ring-neutral-300')
                                    : (dark ? 'text-blue-100 hover:bg-white/[0.12] hover:text-white' : 'hover:bg-neutral-200')
                                )
                              }
                            >
                            Details
                        </Tab>

                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'w-full rounded-lg text-sm p-2.5 transition font-medium outline-0', 
                              selected
                                ? (dark ? 'bg-slate-600 text-neutral-100 shadow' : ' bg-neutral-300 text-slate-700 shadow ring-2 ring-neutral-300')
                                : (dark ? 'text-blue-100 hover:bg-white/[0.12] hover:text-white' : 'hover:bg-neutral-200')
                            )
                          }
                        >
                          Description
                        </Tab>
                        
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'w-full rounded-lg text-sm p-2.5 transition font-medium outline-0', 
                              selected
                                ? (dark ? 'bg-slate-600 text-neutral-100 shadow' : ' bg-neutral-300 text-slate-700 shadow ring-2 ring-neutral-300')
                                : (dark ? 'text-blue-100 hover:bg-white/[0.12] hover:text-white' : 'hover:bg-neutral-200')
                            )
                          }
                        >
                          Properties
                        </Tab>
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        <Tab.Panel className={'rounded-xl p-3'}>
                          <div className="flex flex-row justify-between py-2 flex-wrap break-words">
                            <span className="text-sm md:text-base">Contract Address</span>
                            <div className="flex gap-1 items-center">
                                <Link href={`/collection/${thisNFTblockchain}/${contractAddress}`} passHref>
                                  <a>
                                    <span className="line-clamp-1 text-sm hover:text-sky-600 transition">{nftContractData?.contract}</span>
                                  </a>
                                </Link>
                                <Link href={`${chainExplorer[blockchainIdFromName[thisNFTblockchain]]}address/${nftContractData?.contract}`} passHref>
                                  <a target="_blank">
                                    <MdOutlineOpenInNew />
                                  </a>
                                </Link>
                            </div>
                          </div>
                          <div className="flex flex-row justify-between py-2 flex-wrap break-words">
                            <span className="text-sm md:text-base">Item ID</span>
                            <span className="line-clamp-1 text-sm">{nftContractData?.tokenId}</span>
                          </div>
                          <div className="flex flex-row justify-between py-2">
                            <span className="text-sm md:text-base">Token Standard</span>
                            <span className={`line-clamp-1 text-xs border rounded-lg py-1 px-2 bg-slate-${dark ? '700' : '100'} border-slate-${dark ? '600' : '200'}`}>
                              {ownerData?.owners[0]?.contractType}
                            </span>
                          </div>
                          <div className="flex flex-row justify-between py-2">
                            <span className="text-sm md:text-base">Blockchain</span>
                            <span className="line-clamp-1 text-base">
                              {chainIcon[blockchainIdFromName[thisNFTblockchain]]}
                              {chainName[blockchainIdFromName[thisNFTblockchain]]}
                            </span>
                          </div>
                          <div className="flex flex-row items-start justify-between py-2">
                            <span className="text-sm md:text-base">Creator Earnings</span>
                            <div className="flex justify-end flex-col flex-wrap items-end">
                              <div className="flex gap-2 items-center relative">
                                <span className="cursor-pointer" onClick={() => {
                                        navigator.clipboard.writeText(royaltyData?.fee_recipient)
                                        toast.success('Address copied !', successToastStyle);
                                      }}>
                                  <IconCopy />
                                </span>
                                <span className="line-clamp-1 text-sm cursor-pointer">
                                  {royaltyData?.fee_recipient?.slice(0,7)}...{royaltyData?.fee_recipient?.slice(-7)}
                                </span>
                                {Boolean(royaltyData?.seller_fee_basis_points) && (
                                  <span className={`py-1 px-2 rounded-md border ${dark ? 'border-sky-700/50 bg-sky-700/20' : 'border-neutral-200'}  text-xs`}>{Number(royaltyData.seller_fee_basis_points) / 100 + '%'}</span>
                                )}
                                {royaltySplitData && (
                                  <div 
                                    className="rounded-lg bg-yellow-400 p-1 hover:bg-yellow-400 transition cursor-pointer"
                                    onClick={() => {
                                      setShowSplit(curVal => !curVal);
                                    }}>
                                    <TbArrowsSplit className={`text-yellow-700 transition font-bold ${showSplit && 'rotate-90'}`} fontSize={18}/>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Transition
                            as={Fragment}
                            show={showSplit}
                            enter="transform transition duration-[300ms]"
                            enterFrom="opacity-0 scale-50"
                            enterTo="opacity-100 scale-100"
                            leave="transform duration-200 transition ease-in-out"
                            leaveFrom="opacity-100 scale-100 "
                            leaveTo="opacity-0 scale-95 "
                          >
                            <div className={`relative ${dark ? 'bg-slate-700' : 'bg-neutral-200'} p-7 rounded-xl mt-3 overflow-hidden`}>
                              <BiInfoCircle className={`absolute ${dark ? 'text-slate-500' : 'text-neutral-400'} -top-7 -left-7 z-0 opacity-25`} fontSize={100}/> <span className="text-sm max-w-10 z-10 relative">The royalty is received by the Split contract. When this NFT is sold, the Split contract receives royalty, it will split equally between the given two receivers.</span>
                                {royaltySplitData?.map((recipient, index) => (
                                    <div key={recipient.address} className="line-clamp-1 text-sm cursor-pointer mt-2 pl-4">
                                      <Link href={`/user/${recipient.address}`}>
                                        <>
                                          <p className="block md:hidden">{recipient.address.slice(0,10)}...{recipient.address.slice(-10)}</p>
                                          <p className={`hidden md:block p-1 rounded-lg border text-center ${dark ? 'border-slate-600': 'border-neutral-300'}`}>{recipient.address}</p>
                                        </>
                                      </Link>
                                    </div>
                                ))}
                                {Boolean(royaltyData?.fee_recipient) && (
                                  <Link href={`${chainExplorer[blockchainIdFromName[thisNFTblockchain]]}address/${royaltyData?.fee_recipient}/#internaltx`}>
                                    <a target="_blank">
                                      <p className="w-fit text-sm px-3 cursor-pointer gradBlue mt-4 rounded-xl p-2 m-auto text-center">View all Royalty Distribution</p>
                                    </a>
                                  </Link>
                                )}
                            </div>
                          </Transition>
                        </Tab.Panel>

                        <Tab.Panel className={'rounded-xl text-sm ring-white p-3 ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'}>
                          {nftContractData?.metadata?.description == '' ? <p className={`text-sm my-5 text-center ${dark ? 'text-slate-500' : 'text-neutral-600'}`}>No description provided</p> : nftContractData?.metadata?.description}
                        </Tab.Panel>
                        <Tab.Panel className={'rounded-xl p-3 my-5  ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'}>
                          <div className="flex flex-wrap gap-2">
                            {nftContractData?.metadata?.attributes?.map(
                              (props, id) => (
                                <div key={id}>
                                  {props.propertyKey != "" ? (
                                    <div
                                      className={`w-[130px] cursor-pointer rounded-xl border border-solid h-full ${
                                        dark
                                          ? 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                                          : 'border-sky-200/70 bg-sky-100 hover:bg-sky-200/90'
                                      } p-2 text-center transition`}
                                      onClick={() => {
                                        setSelectedProperties([{ propertyKey: props.propertyKey, propertyValue: props.propertyValue}]);
                                        router.push(`/collection/${thisNFTblockchain}/${contractAddress}`)
                                      }}>
                                      <p className={dark ? 'text-sm font-bold text-neutral-200' : 'text-sm font-bold text-sky-400'}>
                                        {props.trait_type}
                                      </p>
                                      <p className={ dark ? 'text-neutral-100 text-sm' : 'text-sm text-sky-500' }>
                                        {props.value}
                                      </p>
                                    </div>
                                    ) : (<p className="text-sm text-center">No properties defined.</p>)}
                                </div>
                              )
                            )}
                            {nftContractData?.metadata?.properties?.traits?.map(
                              (props, id) => (
                                <div key={id} className="cursor-pointer" onClick={() => {
                                  setSelectedProperties([{ propertyKey: props.propertyKey, propertyValue: props.propertyValue}]);
                                  router.push(`/collection/${thisNFTblockchain}/${contractAddress}`)
                                }}>
                                  {props.propertyKey != "" ? (

                                  <div
                                    className={`w-[130px] rounded-xl border border-solid h-full ${
                                      dark
                                        ? 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                                        : 'border-sky-200/70 bg-sky-100 hover:bg-sky-200/90'
                                    } py-2 px-2 text-center transition`}
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
                                  ) : (<p className={`text-sm text-center`}>No properties defined.</p>)}
                                </div>
                              )
                            )}
                          </div>
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
                              <HiOutlineQuestionMarkCircle fontSize={18} />
                              <span className="text-md">
                                About { Boolean(metaDataFromSanity?.name) ? metaDataFromSanity?.name : 'Collection' }
                              </span>
                            </div>
                            <BiChevronUp
                              className={`${
                                open ? 'transform transition' : 'rotate-180 '
                              } h-5 w-5 text-neutral-500 transition`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="text-sm px-4 pt-4 pb-2">
                            { metaDataFromSanity?.description }
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
                <div className={`border-t ${dark ? ' border-slate-600' : ' border-neutral-200'} pt-10 lg:border-t-0 lg:pt-0 xl:pl-10 relative`}>
                  <div className="sticky lg:top-[150px]">
                    <Purchase
                      nftContractData={nftContractData}
                      listingData={listingData}
                      nftCollection={metaDataFromSanity}
                      auctionItem={isAuctionItem}
                      ownerData={Boolean(ownerData?.owners[0]) ? ownerData?.owners[0] : null}
                      thisNFTMarketAddress={thisNFTMarketAddress}
                      thisNFTblockchain={thisNFTblockchain}
                      splitContract={royaltyData?.fee_recipient}
                      royaltySplitData={royaltySplitData}
                      />
                      
                    <Benefits nftCollection={metaDataFromSanity}/>

                    {/* {listingData && isAuctionItem && (parseInt(listingData?.endTimeInEpochSeconds.hex, 16) != parseInt(listingData?.startTimeInEpochSeconds.hex, 16)) && (
                      <AuctionTimer
                      selectedNft={nftContractData}
                      listingData={listingData}
                      auctionItem={isAuctionItem}
                      />
                    )} */}
                    {Boolean(listingData) && (
                      <ItemOffers
                      selectedNft={ownerData}
                      listingData={listingData}
                      metaDataFromSanity={metaDataFromSanity}
                      thisNFTMarketAddress={thisNFTMarketAddress}
                      thisNFTblockchain={thisNFTblockchain}
                      isAuctionItem={isAuctionItem}
                      />
                    )}

                    <ItemActivity
                      thisNFTblockchain={thisNFTblockchain}
                      selectedNft={nftContractData}
                      metaDataFromSanity={ metaDataFromSanity }
                      />
                    {address && (
                      <ReportActivity
                        selectedNft={nftContractData}
                        metaDataFromSanity={ metaDataFromSanity }
                      />
                    )}

                    <BurnCancel 
                      nftContractData={nftContractData} 
                      ownerData={ownerData?.owners[0].ownerOf}
                      listingData={listingData}
                      auctionItem={isAuctionItem}
                      nftCollection={metaDataFromSanity}
                      thisNFTMarketAddress={thisNFTMarketAddress}
                      thisNFTblockchain={thisNFTblockchain}
                      />

                  </div>
                </div>
              </div>
            </main>

          )}
        </>
      )}

      {/* <RelatedNFTs collection={metaDataFromSanity.collection} listingData={listingData} allNfts={listedItemsFromThisMarket} /> */}
      {/* <BrowseByCategory /> */}
      <Footer />
    </div>
  )
}

export default Nft

export async function getServerSideProps(context){
  const {chain, contractAddress, tokenId } = context.params;
  const supportedChains = ["binance", "binance-testnet", "mainnet", "goerli", "polygon", "mumbai", "avalanche", "avalanche-fuji"];

  if(chain === 'undefined' || contractAddress === 'undefined' || (!supportedChains.includes(String(chain).toLowerCase()))) {

    return {
      props: {
        contractAddress,
        listingData: null, //listing data of the nft in the marketplace
        metaDataFromSanity: null, //this is collection data
        nftContractData: null, //this is nft's contract data with metadata
        thisNFTMarketAddress: null, //current chains' marketplace
        thisNFTblockchain: null,  //currently connected chain
        listedItemsFromThisMarket: null,
        ownerData: null,
      }
    }
  }else{

    var nftcontractdata = "";
    var sanityData = "";
    var ownerdata = "";
    var marketplace = ""
    var nftdata = "";
    let resolvedJSON = "";
    
  
    if(supportedChains.includes(chain)){
      const marketplaces = {
        'mumbai': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
        'goerli': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
        'avalanche-fuji': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
        'avalanche': process.env.NEXT_PUBLIC_AVALANCE_MARKETPLACE,
        'binance-testnet': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
        'arbitrum-goerli': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
        'mainnet': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
        'polygon': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
        'binance': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
      } 
      marketplace = marketplaces[chain];
  
      const blockchainIdFromName = { 
        'mainnet' : '1',
        'goerli': '5',
        'avalanche': '43114',
        'avalanche-fuji': '43113',
        'polygon': '137',
        'mumbai': '80001',
        'binance': '56',
        'binance-testnet': '97',
        'arbitrum-goerli': '421563',
        'arbitrum': '421564',
      }
      
      // try{
        const endPoints = [
          `${HOST}/api/infura/getNFTMetadata/${blockchainIdFromName[chain]}/${contractAddress}/${tokenId}`,
          `${HOST}/api/infura/getCollectionSanityData/${blockchainIdFromName[chain]}/${contractAddress}/`,
          `${HOST}/api/infura/getNFTOwnerData/${blockchainIdFromName[chain]}/${contractAddress}/${tokenId}`,
          `${HOST}/api/mango/getSingle/${chain}/${contractAddress}/${tokenId}`,
        ]
        //old marketlisting fetchpoint
        // `${HOST}/api/nft/marketListing/${chain}/${contractAddress}/${tokenId}`,
        const unresolved = endPoints.map(point => fetch(point));
        const resolved = await Promise.all(unresolved);
  
        const unresolvedJSON = resolved.map(data => data.json());
        resolvedJSON = await Promise.all(unresolvedJSON);
    }
    var allListedFromThisChain = "";
  
    return {
      props: {
        contractAddress,
        listingData: Boolean(resolvedJSON[3][0]) ? resolvedJSON[3][0] : null, //listing data of the nft in the marketplace
        metaDataFromSanity: resolvedJSON[1], //this is collection data
        nftContractData: resolvedJSON[0], //this is nft's contract data with metadata
        thisNFTMarketAddress: marketplace, //current chains' marketplace
        thisNFTblockchain: chain,  //currently connected chain
        listedItemsFromThisMarket: allListedFromThisChain,
        ownerData: resolvedJSON[2],
      }
    }
  }
}