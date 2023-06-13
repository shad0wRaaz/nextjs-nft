import Link from 'next/link'
import millify from 'millify'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import Countdown from 'react-countdown'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import SEO from '../../../components/SEO'
import { Fragment, useEffect } from 'react'
import { FiSettings } from 'react-icons/fi'
import { useQueryClient } from 'react-query'
import { RiCloseFill } from 'react-icons/ri'
import { CgSandClock } from 'react-icons/cg'
import Loader from '../../../components/Loader'
import Header from '../../../components/Header'
import { HiChevronRight } from 'react-icons/hi'
import Footer from '../../../components/Footer'
import NFTCard from '../../../components/NFTCard'
import Property from '../../../components/Property'
import { useQuery, useMutation } from 'react-query'
import SellAll from '../../../components/nft/SellAll'
import { BiChevronUp, BiGlobe } from 'react-icons/bi'
import { getImagefromWeb3 } from '../../../fetchers/s3'
import { createAwatar } from '../../../utils/utilities';
import noBannerImage from '../../../assets/noBannerImage.png'
import { useUserContext } from '../../../contexts/UserContext'
import { TbEdit, TbParachute, TbStack2 } from 'react-icons/tb'
import EditCollection from '../../../components/EditCollection'
import noProfileImage from '../../../assets/noProfileImage.png'
import HelmetMetaData from '../../../components/HelmetMetaData'
import { useThemeContext } from '../../../contexts/ThemeContext'
import NFTCardExternal from '../../../components/NFTCardExternal'
import { BsChevronDown, BsGrid, BsGrid3X3Gap } from 'react-icons/bs'
import { changeShowUnlisted } from '../../../mutators/SanityMutators'
import { useSettingsContext } from '../../../contexts/SettingsContext'
import CollectionReferral from '../../../components/CollectionReferral'
import { MdAdd, MdBlock, MdClose, MdOutlineClose } from 'react-icons/md'
import AirdropSettings from '../../../components/collection/AirdropSettings'
import { Menu, Transition, Switch, Dialog, Popover } from '@headlessui/react'
import EditCollectionPayment from '../../../components/EditCollectionPayment'
import { useCollectionFilterContext } from '../../../contexts/CollectionFilterContext'
import { ThirdwebSDK, useAddress, useChain, useSigner, useSwitchChain } from '@thirdweb-dev/react'
import { getNFTCollection, getAllOwners, getNewNFTCollection } from '../../../fetchers/SanityFetchers'
import { IconAvalanche, IconBNB, IconCopy, IconDollar, IconEthereum, IconFilter, IconPolygon, IconVerified } from '../../../components/icons/CustomIcons'
import { getAllNFTs, getActiveListings, getContractData, INFURA_getAllNFTs, INFURA_getAllOwners, INFURA_getCollectionMetaData } from '../../../fetchers/Web3Fetchers'

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

const CollectionDetails = () => {
  const router = useRouter();
  const bannerRef = useRef();
  const qc = useQueryClient();
  const activeNetwork = useChain();
  const { chain, collectionAddress } = router.query;
  const [owners, setOwners] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [externalLink, setExternalLink] = useState();
  const { myUser, queryStaleTime } = useUserContext();
  const [showUnlisted, setShowUnlisted] = useState(false);
  const [showPaymentModal, setPaymentModal] = useState(false);
  const { blockchainName, marketplace, chainExplorer, referralAllowedCollections, blockchainIdFromName, blockedCollections } = useSettingsContext();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [thisCollectionMarketAddress, setThisCollectionMarketAddress] = useState();
  const [properties, setProperties] = useState([]);
  const { selectedProperties, setSelectedProperties } = useCollectionFilterContext();
  const [filteredNftData, setFilteredNftData] = useState();
  const [isBlocked, setIsBlocked] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const switchChain = useSwitchChain();
  const [hasReferralSetting, setHasReferralSetting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const signer = useSigner();
  const address = useAddress();
  const activechain = useChain();
  const [recipient, setRecipient] = useState();
  const [basisPoints, setBasisPoints] = useState();
  const [collectionContract, setCollectionContract] = useState();

  const [collectionid, setCollectionId] = useState();
  const [nftHolders, setNftHolders] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [showMine, setShowMine] = useState(false);
  const [compact, setCompact] = useState(false);
  const [cursor, setCursor] = useState();
  const [showAirdrop, setShowAirdrop] = useState(false);

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
    nftWrapperContainer: `container mx-auto lg:p-[8rem] lg:pt-[8rem] lg:pb-0 p-[2rem]`,
    nftwrapper:
    `grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'grid-cols-6' : 'xl:grid-cols-4'} place-items-center relative`,
    nftwrapper_old: `flex flex-wrap justify-center mb-[4rem] gap-[40px] sm:p-[2rem] md:p-[4rem] pt-[6rem] nftWrapper`,
    errorBox:
      'border rounded-xl p-[2rem] mx-auto text-center lg:w-[44vw] md:w-[80vw] sm:w-full max-w-[700px]',
    errorTitle: 'block text-[1.5rem] mb-3',
    previewImage : 'previewImage relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400',
  }

  useEffect(() => {
    //if unsupported chain, redirect to homepage
    const supportedChains = ["mumbai", "polygon", "mainnet", "goerli", "binance", "binance-testnet", "avalanche", "avalanche-fuji"]
    if(!supportedChains.includes(chain) && Boolean(chain)){
      router.push('/');
      return
    }

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

    return() =>{
      //do nothing
    }
  }, [referralAllowedCollections])

  //collections' sanity data
  const { data: collectionData, status: collectionStatus } = useQuery(
    ['collection', collectionAddress],
    getNewNFTCollection(blockchainIdFromName[chain]),
    {
      enabled: Boolean(collectionAddress),
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        // console.log(res)
        if(res){
          const nowtime = new Date();
          const datediff = nowtime - new Date(res.revealtime);
          if(datediff > 0){ setRevealed(true); }
          setCollectionId(res._id);
          setShowUnlisted(res?.showUnlisted);
          setThisCollectionMarketAddress(marketplace[res.chainId]);
        }
      },
    }
  );

  //collections' contract data

  // const { data: contractData, status: contractStatus } = useQuery(
  //   ['collectioncontract'],
  //   () => getContractData(collectionData),
  //   {
  //     enabled: Boolean(collectionData) && false,
  //     onSuccess:(res) => {
  //       // console.log(res)
  //     }
  //   }
  // );


  useEffect(() => {
    if(!collectionData) return
    if(collectionData?.external_link){
      if(!collectionData.external_link?.startsWith('https') && !collectionData?.external_link.startsWith('http') ){
        setExternalLink('https://' + collectionData.external_link);
      }else{
        setExternalLink(collectionData?.external_link)
      }
    }
      return() => {
        //do nothing, clean up function
      }
  }, [collectionData])


  const { data: marketData, status: marketStatus } = useQuery(
    ['marketplace', chain],
    getActiveListings(),
    {
      enabled: Boolean(chain),
      onError: () => {
        toast.error(
          'Error fetching marketplace data. Refresh and try again.',
          errorToastStyle
        )
      }
    }
  )

  //this query is just to get the total no of NFTs in the given collection
  const {data: collectionMetaData, status: collectionMetaDataStatus } = useQuery(
    ['nftnumber', collectionAddress],
    INFURA_getCollectionMetaData(blockchainIdFromName[chain]),
    {
      enabled: Boolean(collectionAddress),
      onSuccess: (res) => {
        // console.log(res);
      },
      onError:(err) => {
        console.log(err)
      }
    }
  )

  const { data: dataNFT, status: statusNFT } = useQuery(
    ['collectionnft', collectionAddress, cursor],
    INFURA_getAllOwners(blockchainIdFromName[chain]),
    {
      enabled: Boolean(collectionAddress),
      onError: () => {
        toast.error('Error in getting owner info.', errorToastStyle)
      },
      onSuccess: (res) => {

        const allowners = res.owners;

        //nft metadata are in string, so need to parse it
        const parsedData = allowners.map(nft => {
          const pdata = { ...nft, metadata: JSON.parse(nft.metadata) }
          return pdata
        });
        
        // console.log(parsedData);

        setNfts(parsedData); //these are all nfts, for displaying nft cards

        //this is for showing owners details
        const ownerArray = res.owners.map(o => o.ownerOf);
        const ownerset = new Set(ownerArray);
        setNftHolders(Array.from(ownerset));


        setFilteredNftData(parsedData);
        // console.log(parsedData)
        let propObj = [];

        parsedData?.map(nft => {
          //this will be for  nfts minted in house
          if(Boolean(nft?.metadata?.properties?.traits)){
            nft?.metadata?.properties?.traits?.filter(props => props.propertyKey != "" || props.propertyValue != "").map(props => {
              if(propObj.findIndex(p => (p.propertyKey == props.propertyKey && p.propertyValue == props.propertyValue)) < 0){
                propObj.push({propertyKey: props.propertyKey, propertyValue: props.propertyValue});
              }
            });
          }
          //this will be for any other nfts
          else if(Boolean(nft?.metadata?.attributes)){
            nft?.metadata?.attributes?.filter(trait => trait.trait_type != "" || trait.value != "").map(trait => {
              if(propObj.findIndex(p => (p.trait_type == trait.trait_type && p.value == trait.value)) < 0){
                propObj.push({propertyKey: trait.trait_type, propertyValue: trait.value});
              }
            });
          }

        })
        setProperties(propObj);
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
    if (String(activeNetwork.chainId) != collectionData.chainId){
      // toast.error('Your wallet is connected to the wrong chain. Connecting to correct chain', errorToastStyle);
      switchChain(Number(collectionData.chainId)).catch(err => {
        toast.error('Error in changing chain.', errorToastStyle);
      });
      setShowModal(false);
    }
  }, [showModal]);
  
  useEffect(() => {
    if(!showListingModal) return
    if (String(activeNetwork.chainId) != collectionData.chainId){
      // toast.error('Wallet is connected to wrong chain. Connecting to correct chain.', errorToastStyle);
      switchChain(Number(collectionData.chainId)).catch(err => {
        toast.error('Error in changing chain.', errorToastStyle);
      });
      setShowListingModal(false);
    }
  }, [showListingModal]);

  useEffect(() => {
    if(!showPaymentModal) return
    if (String(activeNetwork.chainId) != collectionData.chainId){
      // toast.error('Wallet is connected to wrong chain. Connecting to correct chain.', errorToastStyle);
      switchChain(Number(collectionData.chainId)).catch(err => {
        toast.error('Error in changing chain.', errorToastStyle);
      });
      setPaymentModal(false);
    }
  }, [showPaymentModal]);

  useEffect(() => {
    if(!address || !filteredNftData) return
    // console.log(filteredNftData)
    const mine = filteredNftData.filter(nft => nft.ownerOf.toLowerCase() == address.toLowerCase());

    setMyNfts(mine);

    return() => {
      //do nothing
    }
  }, [filteredNftData])

  useEffect(() => {
    if(!address || !collectionData || !filteredNftData) return;
    
    const sdk = new ThirdwebSDK(signer);

    if(String(activechain.chainId) != collectionData.chainId) return;


      ;(async() => {
          if(collectionData.contractAddress != undefined) {
            const contract = await sdk.getContract(collectionData.contractAddress, "nft-collection");
            const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
            setCollectionContract(contract);
            setRecipient(royaltyInfo?.fee_recipient);
            setBasisPoints(Number(royaltyInfo?.seller_fee_basis_points) / 100);
          }
      })()

      

      return() => {
        //do nothing
      }
  }, [address, collectionData])
  
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
    if(!filteredNftData || !nfts || !selectedProperties) return;
    if(Boolean(nfts[0]?.metadata?.attributes)){

      const n = nfts.filter(nft => {
        if(Boolean(nft?.metadata) && Boolean(nft?.metadata?.attributes)){
          const thisNftTraits = [...nft.metadata?.attributes];
          
            // const res = selectedProperties.some(el => {   //use 'some' , if any nfts can have any selected property'
            const res = selectedProperties.every(el => {    // use 'every' , if any nfts should have all the selected property
              let test = [];
              test = thisNftTraits.filter(ell => ell.trait_type == el.propertyKey && ell.value === el.propertyValue);
              if(test.length > 0) return true
            });
            return res;
        }
        // console.log('res',res)
        
      });
      setFilteredNftData(n);

    }else if(Boolean(nfts[0]?.metadata?.properties?.traits)){

      const f = nfts.filter(nft => {
        if(Boolean(nft?.metadata) && Boolean(nft?.metadata?.properties?.traits)){
          const thisNftTraits = [...nft.metadata?.properties.traits];
          
            // const res = selectedProperties.some(el => {   //use some 'if any nfts can have any selected property'
            const res = selectedProperties.every(el => {    // use every if any nfts should have all the selected property
              let test = [];
              test = thisNftTraits.filter(ell => ell.propertyKey == el.propertyKey && ell.propertyValue === el.propertyValue);
              if(test.length > 0) return true
            });
    
            return res;
        }
        
      });
      setFilteredNftData(f);

    }
    return() => {
      //do nothing
    }
  }, [selectedProperties, nfts]);


  const removeProperties = (index) => {
    if(!selectedProperties) return;
    const properties = selectedProperties.filter((item, itemindex) => itemindex != index);
    setSelectedProperties(properties);
  }


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
    <>
      {!isBlocked && Boolean(collectionData) && (
        <SEO
          title={collectionData?.name}
          description={collectionData?.description}
          image={getImagefromWeb3(collectionData?.web3imageprofile)}
          currentUrl={`https://nuvanft.io/collection/${chain}/${collectionAddress}`} />
        )}
      <div className={`relative z-0 overflow-hidden ${dark && 'darkBackground'}`}>
        <Header />
        {/* {collectionStatus == 'loading' && <Loader />} */}
        {showModal && Boolean(collectionData) && (
          <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
            <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[55.5rem] h-[45rem] overflow-y-auto z-50 relative`}>
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

        {showPaymentModal && Boolean(collectionData) && (
          <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
            <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[40rem] overflow-y-auto z-50 relative`}>
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

        {hasReferralSetting && showReferralModal && Boolean(collectionData) && (
          <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
            <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[40rem] overflow-y-auto z-50 relative`}>
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

        {showListingModal && Boolean(collectionData) && (
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
                      <Dialog.Panel className={`md:w-full lg:w-1/2 h-[600px] md:h-[700px] overflow-auto transform rounded-2xl ${dark? 'bg-slate-800 text-white': 'bg-white'} p-6 text-left align-middle shadow-xl transition-all`}>
                        <button
                          className="absolute top-5 right-6 transition duration-[300] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
                          onClick={() => setShowListingModal(false)}
                        >
                          <MdClose fontSize="15px" />
                        </button>
                        <SellAll nfts={nfts} collectionData={collectionData} marketContractAddress={thisCollectionMarketAddress} marketData={marketData} />
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        )}

        {!isBlocked && collectionStatus == 'success' && Boolean(collectionData) && (
          <div className="w-full">
            <div className="relative h-96 w-full md:h-60 2xl:h-96">
              <div className="absolute inset-0" ref={bannerRef}>
                <img
                  src={
                    collectionData?.web3imagebanner ? getImagefromWeb3(collectionData?.web3imagebanner) : noBannerImage.src
                  }
                  className="h-full w-full object-cover"
                  alt={collectionData?.name}
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
                          collectionData?.web3imageprofile
                            ? getImagefromWeb3(collectionData?.web3imageprofile)
                            : noProfileImage.src
                        }
                        className="h-full w-full object-cover"
                        alt={collectionData?.name}
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

                  {Boolean(collectionData?.creator.walletAddress) && (
                    <div className={`${dark ? 'border-sky-700/30' : 'border-neutral-200'} pr-8 mt-4 mb:mb-0 lg:mb-4`}>
                      <a href={`/user/${collectionData?.creator?.walletAddress}`}>
                        <div className="flex my-4">
                          <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white">
                          {Boolean(collectionData?.creator?.web3imageprofile) ? (
                              <img 
                                src={getImagefromWeb3(collectionData?.creator?.web3imageprofile)} 
                                className="absolute inset-0 h-full w-full rounded-full object-cover" 
                                alt={collectionData?.creator?.name}/>    
                          ): (
                              <img src="https://api.dicebear.com/6.x/bottts/svg?seed=Charlie" alt="Avatar"/>
                          )}
                          </div>

                          <span className="ml-2.5 w-max flex cursor-pointer flex-col">
                            <span className="text-sm">Creator</span>
                            
                            <span className="flex items-center font-medium">
                            {collectionData?.creator.userName == "Unnamed" ? (
                              <span>{collectionData?.creator.walletAddress?.slice(0,5)}...{collectionData?.creator.walletAddress?.slice(-5)}</span>
                            ) : (
                              <span>{collectionData?.creator.userName}</span>
                            )}
                              {collectionData?.creator.verified ? <IconVerified/> : '' }
                            </span>
                          </span>
                        </div>
                      </a>
                    </div>
                  )}

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
                                {!collectionData && 'Unknown NFT Collection'}
                                {collectionData && collectionData?.name}
                              </h2>
                              {Boolean(collectionData?.category) &&(
                                <span 
                                  className="relative flex items-center gap-1 w-fit my-1 rounded-full bg-green-100 cursor-pointer border-green-200 border px-4 py-1 text-xs font-medium text-green-800"
                                  onClick={() => {
                                  router.push({
                                    pathname: '/search',
                                    query: {
                                      c: collectionData.category,
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
                                    <TbStack2/> {collectionData?.category}
                                </span>
                              )}
                            </div>
                            {/* this option is only available if the user is creator of this collection */}
                            {collectionData && collectionData?.createdBy._ref ==
                              myUser?.walletAddress && (
                              <div className="z-20 flex gap-2">
                                {/* show airdrop only to selected collections */}
                                {hasReferralSetting && (
                                  <div className="">
                                    <div 
                                      className="flex cursor-pointer w-full text-sm justify-center transition p-4 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 gap-1 items-center text-white"
                                      onClick={() => setShowAirdrop(true)}>
                                      <TbParachute/> Airdrop
                                    </div>
                                  </div>
                                )}
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
                          
                          
                          <div>
                            <a href={`${chainExplorer[Number(collectionData.chainId)]}address/${collectionData?.contractAddress}`} target="_blank" className="hover:text-sky-600 transition">
                              <span className="mt-4 inline-block text-sm break-all">
                                {collectionData?.contractAddress}
                              </span>
                            </a>
                            <span
                              className="relative top-1 inline-block cursor-pointer pl-2"
                              onClick={() => {
                                navigator.clipboard.writeText(collectionData?.contractAddress)
                                toast.success('NFT Collection\'s Contract Address copied !', successToastStyle);
                              }}
                            >
                              <IconCopy />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:gap-3 flex-wrap md:flex-nowrap ">
                        <div className="py-4 lg:max-h-[200px] overflow-auto max-h-[200px]">
                          <span className="block text-sm">
                            {collectionData?.description}
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
                        {collectionData && chainIcon[collectionData?.chainId]}{collectionData?.floorPrice}
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
                        ${!isNaN(collectionData?.volumeTraded) ? millify(collectionData?.volumeTraded) : 0}
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
                        {collectionMetaDataStatus == "success" ? collectionMetaData?.total : ''}
                      </span>
                    </div>
                    <div className={`${
                            dark
                            ? ' border border-sky-400/20'
                            : ' border border-neutral-50'
                          } relative flex flex-col items-center justify-center z-1 rounded-2xl p-5 shadow-md lg:p-6 outline-none ring-0 focus:ring-0 focus:outline-none`}>
                            <span className="text-sm block">Owners</span>
                            <p className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                              {nftHolders.length}
                            </p>
                            <Popover className={`absolute bottom-2  text-xs py-0.5 px-2 z-50 rounded-2xl shadow-md outline-none ring-0 focus:ring-0 focus:outline-0`}>
                              {({ open }) => (
                                <>
                                  <Popover.Button>
                                    <span>View</span>
                                  </Popover.Button>
                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                  >
                                    <Popover.Panel className="absolute left-1/2 z-40 top-[2rem] w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0">
                                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className={`relative flex flex-col gap-8 max-h-[200px] overflow-y-auto ${dark ? 'bg-slate-700' : 'bg-white'} p-7`}>
                                          {nftHolders.map((item) => (
                                            <a
                                              key={item}
                                              href={`/user/${item}`}
                                              className={`-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out ${dark ? 'hover:bg-slate-500': 'hover:bg-gray-50'} focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50`}
                                            >
                                              <div className="flex h-[15px] w-[15px] shrink-0 items-center justify-center overflow-hidden ring-2 ring-neutral-200 text-white sm:h-6 sm:w-6 rounded-full">
                                                <img src={createAwatar(item)} />
                                              </div>
                                              <div className="ml-4">
                                                <p className="text-sm">
                                                  {item.slice(0,10)}.....{item.slice(-10)}
                                                </p>
                                              </div>
                                            </a>
                                          ))}
                                          
                                        </div>
                                      </div>
                                    </Popover.Panel>
                                  </Transition>
                                </>
                              )}
                            </Popover>
                    </div>
                    {/* <div
                      className={`${
                        dark
                        ? ' border border-sky-400/20'
                        : ' border border-neutral-50'
                      } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-6`}
                      >
                      <span className="text-sm">Owners</span>
                      <span className="mt-4 text-base font-bold sm:mt-6 sm:text-xl">
                        {ownersStatus == 'success' && ownersData.length}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isBlocked && revealed && (
          <div className="">
            {statusNFT == 'success' && nfts.length == 0 && (
              <div
                className={
                  dark ? style.errorBox + ' border-sky-400/20' : style.errorBox
                }
              >
                <h2 className={style.errorTitle}>No NFT Minted yet.</h2>
                {collectionData?.createdBy._ref == myUser?.walletAddress && (
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

        {showAirdrop && hasReferralSetting && Boolean(collectionData) && (
          <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20">
            <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 md:mt-12 rounded-3xl w-[55.5rem] overflow-y-auto z-50 relative`}>
              <AirdropSettings nftHolders={nftHolders} chain={chain} contractAddress={collectionData?.contractAddress} setShowAirdrop={setShowAirdrop} />
            </div>
          </div>
        )}
        
        
        <div className={style.nftWrapperContainer}>
          {revealed && (
            <div className="relative flex justify-between flex-wrap mb-8 gap-2">
              <div className="flex gap-2">
                {address && (
                  <div className={`mb-[0.125rem] block min-h-[1.5rem] pl-[2rem] border ${dark ? 'border-slate-700' : 'border-neutral-200'} rounded-md p-2`}>
                    <input
                      className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                      type="checkbox"
                      value=""
                      id="checkboxDefault" 
                      onClick={() => setShowMine(curval => !curval)}/>
                    <label
                      className="inline-block pl-[0.15rem] hover:cursor-pointer text-sm"
                      htmlFor="checkboxDefault">
                      Show My NFTs only
                    </label>
                  </div>
                  // <button
                  //   className={`-z-1 relative flex h-auto w-auto items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800 py-2.5 pl-3 pr-6 text-sm  font-medium text-neutral-50 transition-colors focus:outline-none ring-2 ${showMine ? 'ring-2 ring-sky-600 ring-offset-2' : ''} disabled:bg-opacity-70  sm:text-xs`}
                  //   onClick={() => setShowMine(curval => !curval)}>
                  //   <span className="ml-2.5 block truncate">Show My NFTs only</span>
                  // </button>
                )}
                <button
                  className="-z-1 mr-[6rem] relative flex h-auto w-auto items-center justify-center rounded-full bg-sky-600 hover:bg-sky-700 py-2.5 pl-3 pr-10 text-sm  font-medium text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:bg-opacity-70 dark:focus:ring-offset-0 sm:text-xs"
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
              
              <div className="flex gap-2 items-center">
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
                    onClick={() => setCursor(dataNFT.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
                </div>
              </div>
            </div>
          )}

          {showFilter && (
            <div className="fixed w-full h-full bg-slate-700 bg-opacity-75 top-0 left-0 z-30 backdrop-blur-sm flex align-items-center justify-center">
                <div className={`relative w-[500px] rounded-xl py-[2em] px-[3em] ${dark ? 'bg-slate-800' : 'bg-slate-50'} mx-4 my-auto md:m-auto`}>
                  <p className="fw-700 text-lg mb-4 flex gap-2"><IconFilter/> Properties Filter</p>
                  <div className="w-full pt-4">
                    <div className="mx-auto w-full max-w-md max-h-96 overflow-y-auto py-4">
                      {properties && (
                        <Property traits={properties} nftData={nfts} />
                      )}
                    </div>
                  </div>
                  <div 
                    className="absolute top-3 transition duration-[300] px-2.5 right-3 cursor-pointer z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70"
                    onClick={() => setShowFilter(false)}>
                    <MdAdd className="inline-block text-xl -mt-1 rotate-45" />
                  </div>
                  <div className="rounded-xl mx-auto text-sm bg-sky-600 hover:bg-sky-700 text-neutral-100 w-max py-2 p-4 mt-4 cursor-pointer"
                  onClick={() => {
                    setSelectedProperties([]);
                    setFilteredNftData([...nfts]); 
                    setShowFilter(false);
                      }
                    }>
                        Clear Filter
                  </div>
                </div>
            </div>
          )}
          {collectionData && collectionData?.createdBy._ref == myUser?.walletAddress && (
            <button
              className="relative h-auto w-auto items-center justify-center rounded-lg mb-5 bg-blue-700 hover:bg-blue-800 p-3 font-medium text-neutral-50 transition-colors"
              onClick={() => setShowListingModal(true)}>
              List Multiple NFTs
            </button>
          )}

          {/* show applied filter keys */}
          {selectedProperties.length > 0 && (
            <div className="w-full p-2 overflow-auto mb-4 flex gap-2 items-center">
              <span className="text-xs">Filters:</span>
              {Boolean(selectedProperties[0].propertyKey) && (
                <>
                  {selectedProperties.map((traits,index) => (
                    <div className={`rounded-md flex px-2 py-1 ${dark ? 'bg-sky-700/30' : 'bg-neutral-200'} text-sm items-center w-fit gap-1`} key={index}>
                      <span className="inline-block">{traits.propertyKey}:</span> <span className="inline-block">{traits.propertyValue}</span>
                      <div 
                        className="cursor-pointer transition hover:rotate-90"
                        onClick={() => removeProperties(index)}>
                        <MdOutlineClose fontSize={18} />
                      </div>
                    </div>
                  ))}
                </>
              )}
              {Boolean(selectedProperties[0].trait_type) && (
                <>
                  {selectedProperties.map((traits,index) => (
                    <div className="rounded-md flex px-2 py-1 bg-sky-700/30 text-sm items-center w-fit gap-1" key={index}>
                      <span className="inline-block">{traits.trait_type}:</span> <span className="inline-block">{traits.value}</span>
                      <div 
                        className="cursor-pointer hover:scale-110"
                        onClick={() => removeProperties(index)}>
                        <MdOutlineClose fontSize={18} />
                      </div>
                    </div>
                  ))}
                </>
              )}

            </div>
          )}

          {statusNFT == 'loading' && <div className="m-[5rem]"><Loader /></div>}

          {!isBlocked && revealed && statusNFT == 'success' &&
            (
              <>
                {showMine && myNfts.length == 0 && (
                  <p className="text-center">No NFTs owned</p>
                )}
                {showMine && Boolean(myNfts.length > 0) && (
                  <div className={style.nftwrapper}> 
                    {myNfts?.map((nftItem, id) => (
                          <NFTCardExternal
                            key={id}
                            nftItem={nftItem}
                            title={collectionData?.name}
                            listings={marketData}
                            showUnlisted={showUnlisted}
                            creator={collectionData?.createdBy}
                            compact={compact}
                          />
                      ))
                    }
                  </div>
                    )}
                {!showMine && (
                  <div className={style.nftwrapper}>
                    {
                      filteredNftData?.map((nftItem, id) => (
                          <NFTCardExternal
                            key={id}
                            nftItem={nftItem}
                            chain={chain}
                            collectionAddress={collectionAddress}
                            listings={marketData}
                            showUnlisted={showUnlisted}
                            creator={collectionData?.createdBy}
                            hasOwner={true}
                            compact={compact}
                          />
                      )
                      )
                    }
                  </div>
                )}
                <div className="mt-5 flex justify-end">
                  <button 
                    className={`rounded-md text-sm p-2 px-3 flex gap-1 items-center  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'}`}
                    onClick={() => setCursor(dataNFT.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
                </div>
              </>
            )
          }
        </div>

        {!revealed && Boolean(collectionData) && (
          <div className="mx-auto flex justify-center">
            <Countdown date={new Date(collectionData.revealtime)} renderer={renderer} />
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
    </>
  )
}

export default CollectionDetails
