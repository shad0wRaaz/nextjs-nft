import Link from 'next/link'
import millify from 'millify'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import Countdown from 'react-countdown'
import { useRouter } from 'next/router'
import { TbEdit } from 'react-icons/tb'
import React, { useState } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { Fragment, useEffect } from 'react'
import Loader from '../../components/Loader'
import Header from '../../components/Header'
import { FiSettings } from 'react-icons/fi'
import Footer from '../../components/Footer'
import { useQueryClient } from 'react-query'
import { RiCloseFill } from 'react-icons/ri'
import { CgSandClock } from 'react-icons/cg'
import { BsChevronDown } from 'react-icons/bs'
import NFTCard from '../../components/NFTCard'
import Property from '../../components/Property'
import SellAll from '../../components/nft/SellAll'
import { useQuery, useMutation } from 'react-query'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { MdAdd, MdBlock, MdClose } from 'react-icons/md'
import noBannerImage from '../../assets/noBannerImage.png'
import { useUserContext } from '../../contexts/UserContext'
import EditCollection from '../../components/EditCollection'
import noProfileImage from '../../assets/noProfileImage.png'
import HelmetMetaData from '../../components/HelmetMetaData'
import { useThemeContext } from '../../contexts/ThemeContext'
import { changeShowUnlisted } from '../../mutators/SanityMutators'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { Menu, Transition, Switch, Dialog } from '@headlessui/react'
import CollectionReferral from '../../components/CollectionReferral'
import EditCollectionPayment from '../../components/EditCollectionPayment'
import { getNFTCollection, getAllOwners } from '../../fetchers/SanityFetchers'
import { useCollectionFilterContext } from '../../contexts/CollectionFilterContext'
import { getAllNFTs, getActiveListings, getContractData } from '../../fetchers/Web3Fetchers'
import { ThirdwebSDK, useActiveChain, useAddress, useSigner, useSwitchChain } from '@thirdweb-dev/react'
import { IconAvalanche, IconBNB, IconCopy, IconDollar, IconEthereum, IconFilter, IconPolygon, IconVerified } from '../../components/icons/CustomIcons'


const style = {
  bannerImageContainer: `h-[30vh] w-full overflow-hidden flex justify-center items-center bg-[#ededed]`,
  bannerImage: `h-full object-cover`,
  closeButton:
      'absolute transition duration-[300] top-[20px] right-[20px] rounded-md bg-[#ef4444] text-white p-1 hover:opacity-70 z-30',
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
  nftWrapperContainer: `container mx-auto mt-[5rem] lg:p-[8rem] lg:pt-0 lg:pb-0 p-[2rem]`,
  nftwrapper:
    'gap-7  grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 relative  ',
  nftwrapper_old: `flex flex-wrap justify-center mb-[4rem] gap-[40px] sm:p-[2rem] md:p-[4rem] pt-[6rem] nftWrapper`,
  errorBox:
    'border rounded-xl p-[2rem] mx-auto text-center lg:w-[44vw] md:w-[80vw] sm:w-full max-w-[700px]',
  errorTitle: 'block text-[1.5rem] mb-3',
  previewImage : 'previewImage relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400',
}

const chainIcon = {
  '80001': <IconPolygon className="mr-0" width="22px" height="22px" />,
  '137': <IconPolygon width="30px" height="30px"/>,
  '43113': <IconAvalanche width="40px" height="40px" />,
  '43114': <IconAvalanche/>,
  '421563': <IconAvalanche/>,
  '5': <IconEthereum width="30px" height="30px"/>,
  '1': <IconEthereum width="30px" height="30px"/>,
  '97': <IconBNB width="30px" height="30px"/>,
  '56': <IconBNB width="30px" height="30px"/>,
}

const Collection = () => {
  const router = useRouter();
  const bannerRef = useRef();
  const qc = useQueryClient();
  const activeNetwork = useActiveChain();
  const { collectionid } = router.query;
  const [owners, setOwners] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [externalLink, setExternalLink] = useState();
  const { myUser, queryStaleTime } = useUserContext();
  const [showUnlisted, setShowUnlisted] = useState(false);
  const [showPaymentModal, setPaymentModal] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState()
  const { blockchainName, marketplace, chainExplorer, referralAllowedCollections } = useSettingsContext();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [thisCollectionBlockchain, setThisCollectionBlockchain] = useState();
  const [thisCollectionMarketAddress, setThisCollectionMarketAddress] = useState();
  const [properties, setProperties] = useState([]);
  const { selectedProperties, setSelectedProperties } = useCollectionFilterContext();
  const [filteredNftData, setFilteredNftData] = useState();
  const { blockedCollections } = useSettingsContext();
  const [isBlocked, setIsBlocked] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const switchChain = useSwitchChain();
  const [hasReferralSetting, setHasReferralSetting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const signer = useSigner();
  const address = useAddress();
  const activechain = useActiveChain();
  const [recipient, setRecipient] = useState();
  const [basisPoints, setBasisPoints] = useState();
  const [collectionContract, setCollectionContract] = useState();

  useEffect(() => {
    if(!blockedCollections || !collectionid) return;
    const blockedCollection = blockedCollections?.filter(coll => coll._id == collectionid);
    if(blockedCollection.length > 0) {
      setIsBlocked(true);
    }
    return() => {
      //do nothing
    }
  }, []);

  useEffect(() => {
    //check if this collection id is in allowed list of collection to have referral settings
    const allcollectionIDs = referralAllowedCollections.map(collection => collection._ref);
    if(allcollectionIDs.includes(collectionid)){
      setHasReferralSetting(true);
    }
  }, [referralAllowedCollections])

  //collections' sanity data
  const { data: collectionData, status: collectionStatus } = useQuery(
    ['collection', collectionid],
    getNFTCollection(),
    {
      enabled: Boolean(collectionid),
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        if(res?.length > 0){
          const nowtime = new Date();
          const datediff = nowtime - new Date(res[0].revealtime);
          if(datediff > 0){ setRevealed(true); }
          setNewCollectionData(res[0]);
          setShowUnlisted(res[0]?.showUnlisted);
          setThisCollectionBlockchain(blockchainName[res[0].chainId]);
          setThisCollectionMarketAddress(marketplace[res[0].chainId]);
        }
      },
    }
  );

  //collections' contract data

  const { data: contractData, status: contractStatus } = useQuery(
    ['collectioncontract'],
    () => getContractData(collectionData),
    {
      enabled: Boolean(collectionData) && false,
      onSuccess:(res) => {
        // console.log(res)
      }
    }
  );


  useEffect(() => {
    if(!collectionData) return
    if(collectionData[0]?.external_link){
      if(!collectionData[0].external_link?.startsWith('https') && !collectionData[0]?.external_link.startsWith('http') ){
        setExternalLink('https://' + collectionData[0].external_link);
      }else{
        setExternalLink(collectionData[0]?.external_link)
      }
    }
      return() => {
        //do nothing, clean up function
      }
  }, [collectionData])



  //get all nfts from blockchain
  const { data: nftData, status: nftStatus } = useQuery(
    ['allnftss', newCollectionData?.contractAddress],
    getAllNFTs(thisCollectionBlockchain),
    {
      enabled: Boolean(thisCollectionBlockchain) && Boolean(newCollectionData?._id),
      onError: (error) => {
        toast.error(
          'Error fetching NFTs. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        setFilteredNftData(res);


        let propObj = [];
        res?.map(nft => {
          nft?.metadata?.properties?.traits?.filter(props => props.propertyKey != "" || props.propertyValue != "").map(props => {

            if(propObj.findIndex(p => (p.propertyKey == props.propertyKey && p.propertyValue == props.propertyValue)) < 0){
              propObj.push({propertyKey: props.propertyKey, propertyValue: props.propertyValue});
            }

          })
        })
      setProperties(propObj);
      }
    }
  )

  const { data: marketData, status: marketStatus } = useQuery(
    ['marketplace', thisCollectionBlockchain],
    getActiveListings(),
    {
      enabled: Boolean(thisCollectionBlockchain),
      onError: () => {
        toast.error(
          'Error fetching marketplace data. Refresh and try again.',
          errorToastStyle
        )
      }
    }
  )

  const { data: ownersData, status: ownerStatus } = useQuery(
    ['owners', collectionid],
    getAllOwners(),
    {
      enabled: Boolean(newCollectionData?._id),
      onError: () => {
        toast.error('Error in getting owner info.', errorToastStyle)
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
            'Unlisted NFTs can now be publicly viewable.',
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
    if(!showModal) return
    if (String(activeNetwork.chainId) != newCollectionData.chainId){
      // toast.error('Your wallet is connected to the wrong chain. Connecting to correct chain', errorToastStyle);
      switchChain(Number(newCollectionData.chainId)).catch(err => {
        toast.error('Error in changing chain.', errorToastStyle);
      });
      setShowModal(false);
    }
  }, [showModal]);
  
  useEffect(() => {
    if(!showListingModal) return
    if (String(activeNetwork.chainId) != newCollectionData.chainId){
      // toast.error('Wallet is connected to wrong chain. Connecting to correct chain.', errorToastStyle);
      switchChain(Number(newCollectionData.chainId)).catch(err => {
        toast.error('Error in changing chain.', errorToastStyle);
      });
      setShowListingModal(false);
    }
  }, [showListingModal]);

  useEffect(() => {
    if(!showPaymentModal) return
    if (String(activeNetwork.chainId) != newCollectionData.chainId){
      // toast.error('Wallet is connected to wrong chain. Connecting to correct chain.', errorToastStyle);
      switchChain(Number(newCollectionData.chainId)).catch(err => {
        toast.error('Error in changing chain.', errorToastStyle);
      });
      setPaymentModal(false);
    }
  }, [showPaymentModal]);

  useEffect(() => {
    if(!address || !collectionData) return;
    const sdk = new ThirdwebSDK(signer);
    if(String(activechain.chainId) != collectionData[0].chainId) return;
      ;(async() => {
          if(collectionData[0].contractAddress != undefined) {
            const contract = await sdk.getContract(collectionData[0].contractAddress, "nft-collection");
            const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
            setCollectionContract(contract);
            setRecipient(royaltyInfo?.fee_recipient);
            setBasisPoints(Number(royaltyInfo?.seller_fee_basis_points) / 100);
          }
      })()
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
  }, []);

  useEffect(() => {

    if(!filteredNftData || !nftData || !selectedProperties) return;

    const f = nftData.filter(nft => {
      const thisNftTraits = [...nft.metadata.properties.traits];
      
        // const res = selectedProperties.some(el => {   //use some 'if any nfts can have any selected property'
        const res = selectedProperties.every(el => {    // use every if any nfts should have all the selected property
          let test = [];
          test = thisNftTraits.filter(ell => ell.propertyKey == el.propertyKey && ell.propertyValue === el.propertyValue);
          if(test.length > 0) return true
        });

        return res;
      
    });

    setFilteredNftData(f);
  }, [selectedProperties, nftData]);


//count down timer design renderer
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if(completed){
    window.location.reload(false);
  }
  return (
    <div className="py-9">
        <div className="space-y-5">
          <div className="flex items-center space-x-2 justify-center">
            <CgSandClock className="animate-pulse duration-700" fontSize={25}/>
            <span className="leading-none mt-1">Revealing in</span>
          </div>
            
          <div className="flex space-x-5 sm:space-x-10">
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-4xl font-semibold">{days}</span>
              <span className="sm:text-lg">Days</span>
            </div>
            
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-4xl font-semibold">{hours}</span>
              <span className="sm:text-lg">hours</span>
            </div>
            
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-4xl font-semibold">{minutes}</span>
              <span className="sm:text-lg ">minutes</span>
            </div>
            
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-4xl font-semibold">{seconds}</span>
              <span className="sm:text-lg">seconds</span>
            </div>
          </div>
        </div>
      </div>
  )
}

  return (
    <div className={`relative z-0 overflow-hidden ${dark && 'darkBackground'}`}>
      <Header />
      {/* {collectionStatus == 'loading' && <Loader />} */}
      {!isBlocked && (collectionData?.length > 0) && (
        <HelmetMetaData
          title={collectionData[0]?.name}
          description={collectionData[0]?.description}
          image={getImagefromWeb3(collectionData[0]?.web3imageprofile)}
          tokenId={collectionData[0]?._id}
          contractAddress={collectionData[0]?.contractAddress}>
        </HelmetMetaData>
      )}

      {showModal && (collectionData?.length > 0) && (
        <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[55.5rem] h-[50rem] overflow-y-scroll z-50 relative`}>
            <div
              className="absolute top-5 right-6 md:right-12  transition duration-[300] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              <RiCloseFill fontSize={25}/>
            </div>
            <EditCollection collection={collectionData} setShowModal={setShowModal} />
          </div>
        </div>
      )}

      {showPaymentModal && (collectionData?.length > 0) && (
        <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[40rem] overflow-y-scroll z-50 relative`}>
            <div
              className="absolute top-5 right-6 md:right-12  transition duration-[300] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
              onClick={() => setPaymentModal(false)}
            >
              <RiCloseFill fontSize={25}/>
            </div>
            <EditCollectionPayment collectionContract={collectionContract} setPaymentModal={setPaymentModal} rcp={recipient} bp={basisPoints}/>
          </div>
        </div>
      )}

      {hasReferralSetting && showReferralModal && (collectionData?.length > 0) && (
        <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[40rem] overflow-y-scroll z-50 relative`}>
            <div
              className="absolute top-5 right-6 md:right-12  transition duration-[300] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
              onClick={() => setShowReferralModal(false)}
            >
              <RiCloseFill fontSize={25}/>
            </div>
            <CollectionReferral collectionData={collectionData} setShowReferralModal={setShowReferralModal} />
          </div>
        </div>
      )}

      {showListingModal && (collectionData?.length > 0) && (
        <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-20 bg-black z-20">
          <Transition appear show={showListingModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowListingModal(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-0" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className={`md:w-full lg:w-1/2 h-[600px] md:h-[700px] overflow-scroll transform rounded-2xl ${dark? 'bg-slate-800 text-white': 'bg-white'} p-6 text-left align-middle shadow-xl transition-all`}>
                      <button
                        className="absolute top-5 right-6 transition duration-[300] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
                        onClick={() => setShowListingModal(false)}
                      >
                        <MdClose fontSize="15px" />
                      </button>
                      <SellAll nfts={nftData} collectionData={newCollectionData} marketContractAddress={thisCollectionMarketAddress} marketData={marketData} />
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      )}

      {!isBlocked && collectionStatus == 'success' && (collectionData?.length > 0) && (
        <div className="w-full">
          <div className="relative h-96 w-full md:h-60 2xl:h-96">
            <div className="nc-NcImage absolute inset-0" ref={bannerRef}>
              <img
                src={
                  collectionData[0]?.web3imagebanner ? getImagefromWeb3(collectionData[0]?.web3imagebanner) : noBannerImage.src
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
                <div className="w-full md:w-56 xl:w-60">
                  <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl">
                    <img
                      src={
                        collectionData[0]?.web3imageprofile
                          ? getImagefromWeb3(collectionData[0]?.web3imageprofile)
                          : noProfileImage.src
                      }
                      className="h-full w-full object-cover"
                      alt={collectionData[0]?.name}
                    />
                  </div>

                  <div className="mt-4 flex items-center space-x-3 sm:justify-center">
                  <div className="flex flex-col justify-center space-x-1.5">
                    {externalLink && externalLink != '' && (
                        <div className="relative text-center justify-center flex">
                          <a
                            href={externalLink}
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
                            <BiGlobe fontSize={20}/>
                          </a>
                        </div>                      
                    )}
                  </div>
                </div>

                  <div className={`${dark ? 'border-sky-700/30' : 'border-neutral-200'} pr-8 mt-4 mb:mb-0 lg:mb-4`}>
                    <a href={`/user/${newCollectionData?.creator?.walletAddress}`}>
                      <div className="flex my-4">
                        <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white">
                        {Boolean(collectionData[0]?.creator?.web3imageprofile) ? (
                            <img 
                              src={getImagefromWeb3(collectionData[0]?.creator?.web3imageprofile)} 
                              className="absolute inset-0 h-full w-full rounded-full object-cover" 
                              alt={newCollectionData?.creator?.name}/>    
                        ): (
                            <img src="https://api.dicebear.com/6.x/bottts/svg?seed=Charlie" alt="Avatar"/>
                        )}
                        </div>

                        <span className="ml-2.5 w-max flex cursor-pointer flex-col">
                          <span className="text-sm">Creator</span>
                          <span className="flex items-center font-medium">
                          {newCollectionData?.creator.userName == "Unnamed" ? (
                            <span>{newCollectionData?.creator.walletAddress.slice(0,5)}...{newCollectionData?.creator.walletAddress.slice(-5)}</span>
                          ) : (
                            <span>{newCollectionData?.creator.userName}</span>
                          )}
                            {newCollectionData?.creator.verified ? <IconVerified/> : '' }
                          </span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                
              </div>

              <div className="mt-5 flex-grow md:mt-0 md:ml-8 xl:ml-14">
                <div className="flex w-full justify-between">
                  <div className="w-full">
                    <div className="flex flex-row w-full justify-between">
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            
                            <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl items-center justify-start">
                              {!newCollectionData && 'Unknown NFT Collection'}
                              {newCollectionData && collectionData[0]?.name}
                            </h2>
                            <span 
                              className="relative block w-fit my-1 rounded-full bg-green-100 cursor-pointer border-green-200 border px-4 py-1 text-xs font-medium text-green-800"
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
                          </div>
                          {/* this option is only available if the user is creator of this collection */}
                          {newCollectionData && collectionData[0]?.createdBy._ref ==
                            myUser?.walletAddress && (
                            <div className="z-20">
                              <Menu as="div" className="relative inline-block">
                                <div>
                                  <Menu.Button className="inline-flex w-full text-sm justify-center transition p-4 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 gap-1 items-center text-white">
                                    <FiSettings fontSize="18px" className=" hover:rotate-45 transition"/> <span className="hidden md:block">Settings</span>
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
                                            onClick={() => setPaymentModal(curVal => !curVal)}
                                            >
                                            <IconDollar className="" /> <span className="ml-1"> Payout Settings</span>
                                          </div>
                                        )}
                                      </Menu.Item>
                                      {hasReferralSetting && (
                                        <Menu.Item>
                                          {({active}) => (
                                            <div 
                                              className={`flex w-full items-center rounded-md p-2 text-sm cursor-pointer ${active ? dark ? 'bg-slate-600' : 'bg-neutral-100' : ''}`}
                                              onClick={() => setShowReferralModal(curVal => !curVal)}
                                              >
                                              <IconDollar className="" /> <span className="ml-1"> Referral Commission Rate</span>
                                            </div>
                                          )}
                                        </Menu.Item>
                                      )}
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
                        
                        {revealed ? (
                          <>
                            <a href={`${chainExplorer[Number(collectionData[0].chainId)]}address/${collectionData[0]?.contractAddress}`} target="_blank" className="hover:text-sky-600 transition">
                              <span className="mt-4 inline-block text-sm break-all">
                                {collectionData[0]?.contractAddress}
                              </span>
                            </a>
                            <span
                              className="relative top-1 inline-block cursor-pointer pl-2"
                              onClick={() => {
                                navigator.clipboard.writeText(collectionData[0]?.contractAddress)
                                toast.success('NFT Collection\'s Contract Address copied !', successToastStyle);
                              }}
                            >
                              <IconCopy />
                            </span>
                          </>
                        ) : (
                          <span className="mt-4 inline-block text-sm break-all">
                              Contract Address: Not revealed yet
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex lg:gap-3 flex-wrap md:flex-nowrap ">
                      <div className="py-4 lg:max-h-[200px] overflow-scroll max-h-[200px]">
                        <span className="block text-sm">
                          {collectionData[0]?.description}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:mt-8 xl:gap-6">
                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm text-center">Floor Price</span>
                    <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                      {newCollectionData && chainIcon[collectionData[0]?.chainId]}{collectionData[0]?.floorPrice}
                    </span>
                  </div>

                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex text-center flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm">Volume Traded</span>
                    <span className="mt-4 break-all text-base font-bold sm:mt-6 sm:text-xl">
                      ${millify(collectionData[0]?.volumeTraded)}
                    </span>
                  </div>

                  <div
                    className={`${
                      dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                    } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                  >
                    <span className="text-sm">NFTs</span>
                    <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                      {nftData?.length}
                    </span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isBlocked && (
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

      )}

      
      {!isBlocked && revealed && nftStatus == 'success' &&
            nftData.length > 0 && (
              <>
                <div className={style.nftWrapperContainer}>
                  <div className="relative flex justify-center flex-wrap mb-8">
                    <h2 className="text-2xl font-semibold sm:text-xl lg:text-2xl text-center mb-4">NFT's in this Collection</h2>
                    <button
                      className="relative md:absolute md:top-0 md:right-0 inline-flex h-auto w-auto items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800 py-2.5 pl-3 pr-10 text-sm  font-medium text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:bg-opacity-70 dark:focus:ring-offset-0 sm:text-xs"
                      onClick={() => setShowFilter(curval => !curval)}
                    >
                      <span className="ml-2.5 block truncate">Filter by Properties</span>
                      <span className="absolute top-1/2 right-5 -translate-y-1/2">
                        <BsChevronDown
                          className={`${showFilter && 'rotate-180'} transition`}
                        />
                      </span>
                    </button>
                  </div>
                  {showFilter && (
                    <div className="fixed w-full h-full bg-slate-700 bg-opacity-75 top-0 left-0 z-30 backdrop-blur-sm flex align-items-center justify-center">
                        <div className={`relative w-[500px] rounded-xl py-[2em] px-[3em] ${dark ? 'bg-slate-800' : 'bg-slate-50'} mx-4 my-auto md:m-auto`}>
                          <p className="fw-700 text-lg mb-4 flex gap-2"><IconFilter/> Properties Filter</p>
                          <div className="w-full pt-4">
                            <div className="mx-auto w-full max-w-md max-h-96 overflow-y-scroll py-4">
                              {properties && (
                                <Property traits={properties} nftData={nftData} />
                              )}
                            </div>
                          </div>
                          <div 
                            className="absolute top-3 transition duration-[300] px-2.5 right-3 cursor-pointer z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70"
                            onClick={() => setShowFilter(false)}>
                            <MdAdd className="inline-block text-xl -mt-1 rotate-45" />
                          </div>
                          <div className="rounded-xl bg-blue-700 hover:bg-blue-800 w-max py-2 p-4 mt-4 cursor-pointer"
                          onClick={() => {
                            setSelectedProperties([]);
                            setFilteredNftData([...nftData]); 
                            setShowFilter(false);
                              }
                            }>
                                Clear Filter
                          </div>
                        </div>
                    </div>
                  )}
                  {newCollectionData && collectionData[0]?.createdBy._ref == myUser?.walletAddress && (
                    <button
                      className="relative h-auto w-auto items-center justify-center rounded-lg mb-5 bg-blue-700 hover:bg-blue-800 p-3 font-medium text-neutral-50 transition-colors"
                      onClick={() => setShowListingModal(true)}>
                      List Multiple NFTs
                    </button>
                  )}

                  {/* show applied filter keys */}
                  {selectedProperties.length > 0 && (
                    <div className="w-full p-2 overflow-scroll mb-4 flex gap-2 items-center">
                      <span className="text-xs">Filters:</span>
                      {selectedProperties.map((traits,index) => (
                        <div className="rounded-md px-2 py-1 bg-sky-700/30 text-xs w-fit" key={index}>
                          <span className="inline-block">{traits.propertyKey}:</span> <span className="inline-block">{traits.propertyValue}</span>
                        </div>
                      ))}

                    </div>
                  )}

                  <div className={style.nftwrapper}>
                    {
                      filteredNftData?.map((nftItem, id) => (
                        nftItem?.metadata?.properties?.tokenid ? (
                          <NFTCard
                            key={id}
                            nftItem={nftItem}
                            title={collectionData[0]?.name}
                            listings={marketData}
                            showUnlisted={showUnlisted}
                            creator={collectionData[0]?.createdBy}
                          />
                          )   : ''
                      ))
                    }
                  </div>
                </div>
              </>
            )
      }
      {!revealed && Boolean(collectionData) && (
        <div className="mx-auto flex justify-center">
          <Countdown date={new Date(collectionData[0].revealtime)} renderer={renderer} />
        </div>
      )}
      {isBlocked && (
        <div className="p-[4rem] text-center">
          <div className="mt-[10rem] flex justify-center mb-5"><MdBlock fontSize={100} color='#ff0000'/></div>
          <h2 className="text-3xl font-bold mb-4">This NFT Collection is blocked.</h2>
          <p className="leading-10">If you own this collection and if you think there has been a mistake, please contact us at <a href="mailto:enquiry@metanuva.com" className="block md:inline p-2 border border-slate-600 rounded-md">enquiry@metanuva.com</a></p>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Collection


