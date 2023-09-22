import axios from 'axios';
import Link from 'next/link'
import millify from 'millify'
import { useRef } from 'react'
import { ethers } from 'ethers'
import NoSSR from 'react-no-ssr'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import Countdown from 'react-countdown'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import SEO from '../../../components/SEO'
import { WalletCards } from 'lucide-react';
import { Fragment, useEffect } from 'react'
import { FiSettings } from 'react-icons/fi'
import { RiCloseFill } from 'react-icons/ri'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { HiOutlineUsers } from 'react-icons/hi'
import { useQuery, useMutation } from 'react-query'
import Property from '../../../components/Property'
import SellAll from '../../../components/nft/SellAll'
import { getImagefromWeb3 } from '../../../fetchers/s3'
import { allbenefits } from '../../../constants/benefits'; 
import noBannerImage from '../../../assets/noBannerImage.png'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { useUserContext } from '../../../contexts/UserContext'
import EditCollection from '../../../components/EditCollection'
import noProfileImage from '../../../assets/noProfileImage.png'
import { useThemeContext } from '../../../contexts/ThemeContext'
import { BiChevronDown, BiGlobe, BiImport } from 'react-icons/bi'
import { CgClose, CgFacebook, CgSandClock } from 'react-icons/cg'
import NFTCardExternal from '../../../components/NFTCardExternal'
import { FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa'
import { BsChevronDown, BsGrid, BsGrid3X3Gap } from 'react-icons/bs'
import { getMyPayingNetwork } from '../../../fetchers/SanityFetchers'
import { TbEdit, TbParachute, TbStack2, TbUser } from 'react-icons/tb'
import { useSettingsContext } from '../../../contexts/SettingsContext'
import { MdAdd, MdBlock, MdClose, MdOutlineClose } from 'react-icons/md'
import CollectionReferral from '../../../components/CollectionReferral'
import { useMarketplaceContext } from '../../../contexts/MarketPlaceContext'
import { Menu, Transition, Switch, Dialog, Popover } from '@headlessui/react'
import AirdropSettings from '../../../components/collection/AirdropSettings'
import useIntersectionObserver from '../../../hooks/useIntersectionObserver'
import EditCollectionPayment from '../../../components/EditCollectionPayment'
import { useCollectionFilterContext } from '../../../contexts/CollectionFilterContext'
import { ConnectWallet, useAddress, useChain, useSigner, useSwitchChain } from '@thirdweb-dev/react'
import { createAwatar, isCompanyWallet, updateSingleUserDataToFindMaxPayLevel } from '../../../utils/utilities';
import { addVolumeTraded, changeShowUnlisted, importMyCollection, sendReferralCommission, updateBoughtNFTs } from '../../../mutators/SanityMutators'
import { IconArbitrum, IconAvalanche, IconBNB, IconCopy, IconDollar, IconEthereum, IconFilter, IconLoading, IconPolygon, IconUSDT, IconVerified } from '../../../components/icons/CustomIcons'

//do not remove HOST, need it for serverside props so cannot use it from context
const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080'
const INFURA_AUTH = Buffer.from(process.env.NEXT_PUBLIC_INFURA_API_KEY + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,).toString('base64');

const chainIcon = {
  '80001': <IconPolygon className="mr-0" width="22px" height="22px" />,
  '137': <IconPolygon width="20px" height="20px"/>,
  '43113': <IconAvalanche width="20px" height="20px" />,
  '43114': <IconAvalanche width="20px" height="20px" />,
  '421613': <IconArbitrum width="20px" height="20px"/>,
  '42161': <IconArbitrum width="20px" height="20px"/>,
  '5': <IconEthereum width="20px" height="20px"/>,
  '1': <IconEthereum width="20px" height="20px"/>,
  '97': <IconBNB width="20px" height="20px"/>,
  '56': <IconBNB width="20px" height="20px"/>,
}

const CollectionDetails = (props) => {

  const router = useRouter();
  const bannerRef = useRef();
  const qc = useQueryClient();
  const activeNetwork = useChain();
  const { chain, collectionAddress, collectionData } = props;
  const [owners, setOwners] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [externalLink, setExternalLink] = useState();
  const { myUser, queryStaleTime } = useUserContext();
  const [showUnlisted, setShowUnlisted] = useState(false);
  const [showPaymentModal, setPaymentModal] = useState(false);
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [thisCollectionMarketAddress, setThisCollectionMarketAddress] = useState();
  const { selectedBlockchain } = useMarketplaceContext();
  const [properties, setProperties] = useState([]);
  const { blockchainName, marketplace, chainExplorer, referralCommission, referralAllowedCollections, blockchainIdFromName, blockedCollections, coinPrices, refs} = useSettingsContext();
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
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOwners, setShowOwners] = useState(false);

  const [totalCirculatingSupply, setTotalCirculatingSupply] = useState();
  const [totalUnclaimedSupply, setTotalUnclaimedSupply] = useState();
  const [isMinting, setIsMinting] = useState(false);
  // const [mintPrice, setMintPrice] = useState();
  const [coinMultiplier, setCoinMultiplier] = useState(0);
  const [isAllowedSeperateCommission, setAllowedSeperateCommission] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Mint an NFT')
  const [claimCurrency, setClaimCurrency] = useState();

  const rewardingCollections = allbenefits.map(c => c.contractAddress.toLowerCase());
  const [moreLinks, setMoreLinks] = useState();

  const style = {
    bannerImageContainer: `h-[30vh] w-full overflow-hidden flex justify-center items-center bg-[#ededed]`,
    bannerImage: `h-full object-cover`,
    closeButton:
        'absolute transition duration-[300] top-[20px] right-[20px] rounded-md bg-[#ef4444] text-white p-1 hover:opacity-70 z-30',
    socialicon: `my-2 transition flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:-translate-y-0.5 ${
      dark
        ? ' bg-slate-700 hover:bg-slate-600'
        : ' bg-neutral-100 hover:bg-neutral-200'
    } md:h-10 md:w-10 `,
    infoContainer: `w-full px-4 pb-10`,
    midRow: `w-full flex justify-center text-white mb-2`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#ffffff] mt-[-4rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem] mr-2`,
    socialIconsWrapper: `w-44`,
    socialIconsContent: `flex container justify-between text-[1.4rem] border border-white border-slate-700 rounded-lg px-2`,
    divider: `border border-white border-slate-700 border-r-1`,
    title: `text-5xl font-bold mb-4`,
    createdBy: `text-lg`,
    statsContainer: `lg:w-[44vw] md:w-[80vw] sm:w-full max-w-[700px] flex justify-between py-4 border border-white border-slate-700 rounded-xl mb-4`,
    collectionStat: `w-1/4`,
    statValue: `text-3xl font-bold w-full flex items-center justify-center`,
    ethLogo: `h-6 mr-2`,
    statName: `text-sm w-full text-center mt-1`,
    description: `text-white text-md w-max-1/4 flex-wrap my-2`,
    nftWrapperContainer: `container mx-auto p-[2rem] lg:p-[8rem] lg:pt-0 lg:pb-0 lg:mt-12`,
    nftwrapper:
    `grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'grid-cols-6' : 'xl:grid-cols-4'} place-items-center relative`,
    nftwrapper_old: `flex flex-wrap justify-center mb-[4rem] gap-[40px] sm:p-[2rem] md:p-[4rem] pt-[6rem] nftWrapper`,
    errorBox:
      'border rounded-xl p-[2rem] mx-auto text-center lg:w-[44vw] md:w-[80vw] sm:w-full max-w-[700px]',
    errorTitle: 'block text-[1.5rem] mb-3',
    previewImage : 'previewImage relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400',
  }

  const { mutate: addVolume } = useMutation(
    ({ id, volume }) =>
      addVolumeTraded({ id, volume }),
    {
      onError: () => {
        toast.error('Error in adding Volume Traded.', errorToastStyle)
      },
    }
  );

  useEffect(() => {
    //if unsupported chain, redirect to homepage
    const supportedChains = ["mumbai", "polygon", "ethereum", "goerli", "binance", "binance-testnet", "avalanche", "avalanche-fuji"]
    if(!supportedChains.includes(chain) && Boolean(chain)){
      router.push('/');
      return
    }

    ;(async() => {
      
      try{
        if(collectionData?.type === 'drop'){
          const sdk = new ThirdwebSDK(blockchainName[collectionData.chainId], {
            clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
          } );
          const contract = await sdk.getContract(collectionAddress);
          const totalCirculatingSupply = await contract.erc721.totalCount();
          const unclaimedSupply = await contract.erc721.totalUnclaimedSupply();
          const {price, currencyAddress, currencyMetadata} = await contract.erc721.claimConditions.getActive();
          const newcurrencyObj = { 
            ...currencyMetadata, 
            currencyAddress, 
            mintPrice: Number(price.toString()) / 10 ** currencyMetadata?.decimals, 
           }
          console.log(newcurrencyObj, price.toString())
          setClaimCurrency({...newcurrencyObj});
          setTotalCirculatingSupply(parseInt(totalCirculatingSupply._hex, 16));
          setTotalUnclaimedSupply(parseInt(unclaimedSupply._hex, 16));
        }
        }catch(err){
          console.log(err)
        }
      })();

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
    if(!Boolean(coinPrices)) return;

      if (chain == "polygon" || chain == "mumbai") {
        setCoinMultiplier(coinPrices?.maticprice);
      } else if (chain == "mainnet" || chain == "goerli") {
        setCoinMultiplier(coinPrices?.ethprice);
      } else if (chain == "avalanche" || chain == "avalanche-fuji") {
        setCoinMultiplier(coinPrices?.avaxprice);
      } else if (chain == "binance" || chain == "binance-testnet") {
        setCoinMultiplier(coinPrices?.bnbprice);
      } else if(chain == "arbitrum" || chain == "arbitrum-goerli"){
        setCoinMultiplier(coinPrices?.ethprice);
      }

      return() => {
        //do nothing
      }

  }, [coinPrices]);


  const { mutate: changeBoughtNFTs } = useMutation(
    ({ walletAddress, chainId, contractAddress, tokenId, payablelevel, type}) => updateBoughtNFTs({ walletAddress, chainId, contractAddress, tokenId, payablelevel, type}),
    {
      onError: (err) => { console.log(err); },
      onSuccess: (res) => { 
        // console.log(res)
      }
    }
  )

  const payToMySponsors = async() => {

    if(!Boolean(referralCommission)) {
      toast.error("Referral commission could not be found", errorToastStyle);
      return;
    }
    let sponsors = [];
    const payNetwork = await getMyPayingNetwork(address);

    let network = updateSingleUserDataToFindMaxPayLevel(payNetwork[0], refs);
    if(Boolean(network?.sponsor)){
      network = {
        ...network,
        sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor, refs)
        }

      if(Boolean(network?.sponsor?.sponsor)){
        network = {
          ...network,
          sponsor: {
            ...network.sponsor,
            sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor, refs),
          }
        }

        if(Boolean(network?.sponsor?.sponsor?.sponsor)){
          network = {
            ...network,
            sponsor: {
              ...network.sponsor,
              sponsor: {
                ...network.sponsor.sponsor,
                sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor.sponsor, refs)
              }
            }
          }
        }

        if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor)){
          network = {
            ...network,
            sponsor: {
              ...network.sponsor,
              sponsor: {
                ...network.sponsor.sponsor,
                sponsor:{
                  ...network.sponsor.sponsor.sponsor,
                  sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor.sponsor.sponsor, refs)
                }
              }
            }
          }
        }

        if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor?.sponsor)){
          network = {
            ...network,
            sponsor: {
              ...network.sponsor,
              sponsor: {
                ...network.sponsor.sponsor,
                sponsor:{
                  ...network.sponsor.sponsor.sponsor,
                  sponsor: {
                    ...network.sponsor.sponsor.sponsor.sponsor,
                    sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor.sponsor.sponsor.sponsor, refs)
                  }
                }
              }
            }
          }
        }
      }
      // console.log(network);
    }

    if(Boolean(network?.sponsor) && network?.sponsor?.paylevel >= 1){

      let sponsor_L1 = network.sponsor.walletAddress;
      let sponsor_L1_rate = isAllowedSeperateCommission ? collectionData?.referralrate_one : referralCommission.referralrate_one;
      sponsors.push({ receiver: sponsor_L1, token: claimCurrency?.mintPrice * sponsor_L1_rate / 100 });  
    }
      if(Boolean(network?.sponsor?.sponsor) && network?.sponsor?.sponsor?.paylevel >= 2){
        let sponsor_L2 =  network.sponsor.sponsor.walletAddress;
        let sponsor_L2_rate = isAllowedSeperateCommission ? collectionData?.referralrate_two : referralCommission.referralrate_two;
        sponsors.push({ receiver: sponsor_L2, token: claimCurrency?.mintPrice * sponsor_L2_rate / 100 });
      }

      if(Boolean(network?.sponsor?.sponsor?.sponsor) && network?.sponsor?.sponsor?.sponsor?.paylevel >= 3){
        let sponsor_L3 =  network.sponsor.sponsor.sponsor.walletAddress;
        let sponsor_L3_rate = isAllowedSeperateCommission ? collectionData?.referralrate_three : referralCommission.referralrate_three;
        sponsors.push({ receiver: sponsor_L3, token: claimCurrency?.mintPrice * sponsor_L3_rate / 100 });
      }

      if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor) && network?.sponsor?.sponsor?.sponsor?.sponsor?.paylevel >= 4){
        let sponsor_L4 =  network.sponsor.sponsor.sponsor.sponsor.walletAddress;
        let sponsor_L4_rate = isAllowedSeperateCommission ? collectionData?.referralrate_four : referralCommission.referralrate_four;
        sponsors.push({ receiver: sponsor_L4, token: claimCurrency?.mintPrice * sponsor_L4_rate / 100 });
      }

      if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor?.sponsor) && network?.sponsor?.sponsor?.sponsor?.sponsor?.sponsor?.paylevel >= 5){
        let sponsor_L5 =  network.sponsor.sponsor.sponsor.sponsor.sponsor.walletAddress;
        let sponsor_L5_rate = isAllowedSeperateCommission ? collectionData?.referralrate_five : referralCommission.referralrate_five;
        sponsors.push({ receiver: sponsor_L5, token: claimCurrency?.mintPrice  * sponsor_L5_rate / 100 });
      }

    //send the tokens and get list of transaction hash to save in database
    const tx = sendReferralCommission(sponsors, address, collectionData.chainId, selectedBlockchain, collectionData.name);
  }


  const updateRoyaltyReceiver = async (claimedNFTId) => {
    if(!referralAllowedCollections || !collectionData || !address) return;

    if(isCompanyWallet(address)) return;
    
    const allowedContracts = referralAllowedCollections.map(coll => coll._ref);
    
    
    if(rewardingCollections.includes(String(collectionData.contractAddress).toLowerCase())) 
    {
      // console.log('processing change of royalty receiver')
      const mushroomContracts = [
        '0x05e9d0Fa11eFF24F3c2fB0AcD381B6866CeF2a1C'.toLowerCase(),
        '0x50Fb365F7B1c5CfaF3a0a9341029ABD0ce8e4f80'.toLowerCase(), 
        '0x023803f52a5DD566AC1E6a3B06bCE8CD0d27a8a7'.toLowerCase(), 
        '0xa98d96E636123dFB35AB037d1E5a7B76a6e7e95B'.toLowerCase()
      ];

      await axios.post(`${HOST}/api/nft/setroyaltybytoken`,
      {
        contractAddress: collectionData.contractAddress, 
        walletAddress: address, 
        tokenId: claimedNFTId,
        chain: selectedBlockchain,
        collectionname: mushroomContracts.includes(collectionData.contractAddress.toLowerCase()) ? 'mushroom-kingdom' : '',
      }).catch(err => {
        console.log(err)
      });
    }
  }

  const claimNFT = async(toastHandler = toast) => {
    if(!signer) {
      toastHandler.error('Wallet is not connected. Connect wallet and then try again', errorToastStyle);
      return;
    }
    if(activechain.chainId.toString() != collectionData.chainId.toString()){
      toastHandler.error("Wallet is connected to wrong chain.", errorToastStyle);
      
      return;
    }
    if(!claimCurrency){
      toastHandler.error("Error getting mint price. Refresh and try again.", errorToastStyle);
      return;
    }
    
    try{
      setIsMinting(true);
      setButtonLabel('Minting')
      const sdk = new ThirdwebSDK(signer, {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY,
      });
      const contract = await sdk.getContract(collectionAddress)
      const txResult = await contract.erc721.claim("1").catch(err => {
          
          if(err.reason == 'missing revert data in call exception; Transaction reverted without a reason string'){
            toast.error('Error in minting NFT. This may be due to insufficient funds.', errorToastStyle);
          }
          else{
            console.log(err)
          }

        });

        if(txResult){
          const claimedNFTId = txResult[0].id.toString()

          //update pay info-> list of all bought NFTs from the selected Collections
          setButtonLabel('Adding to your Collection');
          setTimeout(() => {
            // just delay function
          }, 2000);
          const payObj =  {
            walletAddress: address,
            chainId: collectionData.chainId,
            contractAddress: collectionData.contractAddress,
            tokenId: claimedNFTId,
            payablelevel: Boolean(collectionData.payablelevel) ? collectionData.payablelevel : 1,
            type: 'buy'
          }
          changeBoughtNFTs(payObj); // this will change buyer's bought NFT field -> add NFT

          
          const volume2Add = parseFloat(claimCurrency?.mintPrice * coinMultiplier);
                  
          //adding volume to Collection
          addVolume({
            id: collectionData?._id,
            volume: volume2Add,
          });
          
          //adding volume to the user
          addVolume({
            id: String(address).toLowerCase(),
            volume: volume2Add
          });

          if(rewardingCollections.includes(String(collectionData.contractAddress).toLowerCase())){
            await payToMySponsors();
            setButtonLabel('Creating Split Royalty Contract')
            await updateRoyaltyReceiver(claimedNFTId);
          }

          toastHandler.success('You have successfully minted a NFT.', successToastStyle);
          setButtonLabel('Mint an NFT');
          router.push('/collections/myCollection');
        }
        setIsMinting(false);
        setButtonLabel('Mint an NFT');
      }catch(err){
        console.log(err);
        if (err.reason == 'user rejected transaction'){
          toastHandler.error('Transaction rejected via wallet', errorToastStyle);
        }
        setButtonLabel('Mint an NFT');
        setIsMinting(false);
    }
  }

  useEffect(() => {
    if(!referralAllowedCollections) return
    //check if this collection id is in allowed list of collection to have referral settings
    const allcollectionIDs = referralAllowedCollections.map(collection => collection._ref);
    if(allcollectionIDs.includes(collectionid)){
      setHasReferralSetting(true);
      setAllowedSeperateCommission(true);
    }

    return() =>{
      //do nothing
    }
  }, [referralAllowedCollections])

  
  const importCollection = async(toastHandler = toast) => {
    if(!address || !collectionData) return
    const collectionId = uuidv4();
    setIsImporting(true);
    const newCollection = await importMyCollection(collectionData, address, collectionId);

    if(newCollection == 'already exists'){
      toastHandler.success('Collection already exists', errorToastStyle);
      setIsImporting(false);
      // router.reload(window.location.pathname);
    }else if(newCollection != null){
      router.replace(router.asPath).then(()=>{
        toastHandler.error('Collection has been imported', successToastStyle);
        setIsImporting(false);
      });
    }else{
      toastHandler.error('Error in importing collection', errorToastStyle);
      setIsImporting(false);
    }
  }

  useEffect(() => {
    if(!collectionData) return
    if(collectionData?.external_link){
      if(!collectionData.external_link?.startsWith('https') && !collectionData?.external_link.startsWith('http') ){
        setExternalLink('https://' + collectionData.external_link);
      }else{
        setExternalLink(collectionData?.external_link)
      }
    }

    if(Boolean(collectionData?.revealtime)){
      const nowtime = new Date();
      const datediff = nowtime - new Date(collectionData.revealtime);
      if(datediff > 0){ setRevealed(true); }
      else { setRevealed(false);}
    }else{
      setRevealed(true);
    }

    setCollectionId(collectionData._id);
    setShowUnlisted(collectionData?.showUnlisted);
    setThisCollectionMarketAddress(marketplace[collectionData.chainId]);

    const linksData = allbenefits.filter(collection => String(collection.contractAddress).toLowerCase() == String(collectionData.contractAddress).toLowerCase());
    // console.log(linksData)

    setMoreLinks({
      learnmore: linksData[0]?.learnmorelink, 
      whitepaper: linksData[0]?.whitepaper,
    });

    return() => {}
  }, [collectionData])


  const getInfiniteNfts = async ({pageParam}) => {
    const cursor = pageParam;    
    const { data } = await axios.get(`${HOST}/api/infura/getCollectionOwners/${blockchainIdFromName[chain]}/${collectionAddress}`, {params: {cursor}}, {headers: {'Content-Type': 'application/json'}});
    return data;
  }

  const { data: infiniteData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: statusNFT } = useInfiniteQuery(
      ['infinitenfts'],
      getInfiniteNfts,
      { 
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        onSuccess:(res) => { 
          setIsLoading(true)
        },
        getNextPageParam: (page) => {
          return page.cursor
        },
      },
  )

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  useEffect(() => {
    if(!infiniteData) return
    //nft metadata are in string, so need to parse it
    let parsedData = []
    infiniteData.pages.map(page => {
      page.owners.map(item => {
        const newData = {
          ...item,
          metadata: JSON.parse(item.metadata),
        };
      parsedData.push(newData);
      }); 
    });
    

  const unresolved = parsedData.map(async nft => {
    const {data} =  await axios.get(`${HOST}/api/mango/getSingle/${chain}/${nft.tokenAddress}/${nft.tokenId}`)
    const newObject= {
      ...nft,
      listingData: data[0]
    }
    return newObject;
  });

  ;(async() => {
    const resolved = await Promise.all(unresolved);
    //remove nfts without metadata
    const filternfts = resolved.filter(nft => nft.metadata != null)
    setNfts(filternfts); //these are all nfts, for displaying nft cards
    setFilteredNftData(filternfts);
  })();

    //this is for showing owners details
  const ownerArray = parsedData.map(o => o.ownerOf);
  const ownerset = new Set(ownerArray);
  setNftHolders(Array.from(ownerset));

  let propObj = [];

  parsedData?.map(nft => {
    //this will be for  nfts minted in house and opensea
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
  setIsLoading(false);
  }, [infiniteData]);


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
    return() => {}
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
    return() => {}
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
    return() => {}
  }, [showPaymentModal]);

  useEffect(() => {
    if(!address || !filteredNftData) return

    const mine = filteredNftData.filter(nft => nft.ownerOf.toLowerCase() == address.toLowerCase());

    setMyNfts(mine);

    return() => {
      //do nothing
    }
  }, [filteredNftData])

  useEffect(() => {
    if(!address || !collectionData || !filteredNftData) return;
    
    const sdk = new ThirdwebSDK(signer, {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
    });

    if(String(activechain.chainId) != collectionData.chainId) return;

    
    ;(async() => {
      if(collectionData.contractAddress != undefined) {
        const contract = await sdk.getContract(collectionData.contractAddress, "nft-collection");
        const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
        setCollectionContract(contract);
        setRecipient(royaltyInfo?.fee_recipient);
        setBasisPoints(Number(royaltyInfo?.seller_fee_basis_points) / 100);
      }
    })();

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
  if(days + hours + minutes + seconds <= 0){
    return null;
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
      <div className={`relative z-1 overflow-hidden ${dark && 'darkBackground'}`}>
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
                        <SellAll nfts={nfts} collectionData={collectionData} marketContractAddress={thisCollectionMarketAddress} />
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        )}

        {showOwners && (
          <div className="fixed inset-0 overflow-y-auto z-50 bg-black/30" onClick={() => setShowOwners(false)}>
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="w-full md:w-fit transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className={`relative flex flex-col   ${dark ? 'bg-slate-700 text-neutral-100' : 'bg-white'} p-[2rem]`}>
                    <div className="flex items-center justify-center font-bold text-lg gap-2">
                      <HiOutlineUsers className="inline" /> <span>All Owners</span>
                    </div>

                    <div className={`max-h-[500px] overflow-y-auto flex flex-col mt-3 border ${dark ? 'border-slate-600' : 'border-neutral-200'} rounded-xl`}>
                      {nftHolders.map((item, index) => (
                        <a
                          key={item}
                          href={`/user/${item}`}
                          className={` flex items-center p-4 px-6 border-b transition duration-150 ease-in-out ${dark ? 'hover:bg-slate-500 border-slate-600': 'hover:bg-gray-50'} ${index % 2 == 0 ? dark ? 'bg-slate-600/40' :'bg-neutral-100' : ''} focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50`}
                        >
                          <div className="flex h-[15px] w-[15px] shrink-0 items-center justify-center overflow-hidden ring-2 ring-neutral-200 text-white sm:h-6 sm:w-6 rounded-full">
                            <img src={createAwatar(item)} />
                          </div>
                          <div className="ml-4">
                            <p className="text-base">
                              {item}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        className="absolute top-3 right-3 justify-center rounded-md border border-transparent bg-red-600 px-1 py-1 text-sm font-medium text-neutral-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={() => setShowOwners(false)}>
                          <CgClose fontSize={20}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isBlocked && Boolean(collectionData) && (
          <div className="w-full">
            <div className="relative h-96 w-full md:h-60 lg:h-[45rem]">
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

            <div className="container relative mx-auto -mt-[15rem] lg:-mt-[31rem] lg:p-[8rem] lg:pt-0 lg:pb-0 md:p-[2rem] p-[1rem]">
              <div
                className={`flex flex-col rounded-3xl ${
                  dark ? 'bg-slate-900/80' : 'bg-white/30'
                } p-3 md:p-8 shadow-xl md:flex-row md:rounded-[40px] backdrop-blur-xl`}
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

                    <div className="mt-4 flex items-center space-x-3 justify-center">
                      <div className="flex justify-center space-x-1.5">
                        {Boolean(collectionData?.facebookHandle) && (
                          <div className="relative text-center justify-center flex">
                            <a
                              href={collectionData?.facebookHandle}
                              className={style.socialicon}
                              title="Facebook Link"
                              target="_blank"
                            >
                              <CgFacebook fontSize={22}/>
                            </a>
                          </div>

                        )}
                        {Boolean(collectionData?.twitterHandle) && (
                          <div className="relative text-center justify-center flex">
                            <a
                              href={collectionData?.twitterHandle}
                              className={style.socialicon}
                              title="Twitter Link"
                              target="_blank"
                            >
                              <FaTwitter fontSize={20}/>
                            </a>
                          </div>
                        )}
                        {Boolean(collectionData?.instagramHandle) && (
                          <div className="relative text-center justify-center flex">
                            <a
                              href={collectionData?.instagramHandle}
                              className={style.socialicon}
                              title="Instagram Link"
                              target="_blank"
                            >
                              <FaInstagram fontSize={20}/>
                            </a>
                          </div>
                        )}
                        {Boolean(collectionData?.discordHandle) && (
                          <div className="relative text-center justify-center flex">
                            <a
                              href={collectionData?.discordHandle}
                              className={style.socialicon}
                              title="Discord Link"
                              target="_blank"
                            >
                              <FaDiscord fontSize={20}/>
                            </a>
                          </div>                        
                        )}
                        {externalLink && externalLink != '' && (
                            <div className="relative text-center justify-center flex">
                              <a
                                href={externalLink}
                                className={style.socialicon}
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
                  </div>

                  
                </div>

                <div className="mt-5 flex-grow md:mt-0 md:ml-8 xl:ml-14">
                  <div className="flex w-full justify-between mb-6">
                    <div className="w-full">
                      <div className="flex flex-row w-full justify-between">
                        <div className="flex-grow">
                          <div className="flex flex-wrap md:gap-0 gap-8 justify-between">
                            <div>
                              <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl items-center justify-start">
                                {!collectionData && 'Unknown NFT Collection'}
                                {collectionData && collectionData?.name}
                              </h2>

                              <div>
                                <a href={`${chainExplorer[Number(collectionData.chainId)]}address/${collectionData?.contractAddress}`} target="_blank" className="hover:text-sky-600 transition">
                                  <span className="mt-2 inline-block text-sm break-all">
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
                              
                              <div className="flex gap-6 items-center justify-between w-full">
                                <div>
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
                                          r_: 10000,
                                        },
                                      })
                                      }}>
                                        <TbStack2/> {collectionData?.category}
                                    </span>
                                  )}
                                </div>
                                {Boolean(collectionData?.creator?.walletAddress) && (
                                  <div className={`${dark ? 'border-sky-700/30' : 'border-neutral-200'}`}>
                                    <a href={`/user/${collectionData?.creator?.walletAddress}`}>
                                      <div className="flex mt-3">
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

                            {/* this option is only available if the collection is not in database */}
                            {collectionData.datasource == 'external' && String(collectionData.creator?.walletAddress).toLowerCase() == String(address).toLowerCase() &&  (
                              <div>
                                <button 
                                  className="inline-flex w-full text-sm justify-center transition p-4 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 gap-1 items-center text-white"
                                  onClick={() => importCollection()}>
                                    {isImporting ? (
                                      <>
                                        <IconLoading dark="inbutton"/> <span className="hidden md:block">Importing</span>
                                      </>
                                    ) : (
                                      <>
                                        <BiImport fontSize="18px" className=" hover:animate-bounce transition"/> <span className="hidden md:block">Import</span>
                                      </>
                                    )}
                                </button>
                              </div>
                            )}
                            {/* this option is only available if the user is creator of this collection */}
                            <div className="z-20 flex gap-2 justify-center w-full md:w-auto md:justify-normal">
                              {Boolean(moreLinks?.learnmore) && (
                                <>
                                  <div>
                                    <div className="cursor-pointer text-sm transition p-4 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 text-white">
                                      <a 
                                        href={moreLinks?.learnmore}
                                        target="_blank">
                                        Learn More
                                      </a>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="cursor-pointer text-sm transition p-4 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 text-white">
                                      <a 
                                        href={moreLinks?.whitepaper}
                                        target="_blank">
                                        Read Whitepaper
                                      </a>
                                    </div>
                                  </div>
                                </>
                              )}
                              {collectionData && collectionData?.createdBy?._ref ==
                                myUser?.walletAddress  && collectionData.datasource =='internal' && (
                                <>
                                  {/* show airdrop only to selected collections */}
                                  {hasReferralSetting && (
                                    <div>
                                      <div 
                                        className="flex cursor-pointer w-fit text-sm justify-center transition p-4 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 gap-1 items-center text-white"
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
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {collectionData?.description && (
                        <div className="flex lg:gap-3 flex-wrap md:flex-nowrap mt-3">
                          <div className="py-4 lg:max-h-[200px] overflow-auto max-h-[200px]">
                            <span className="block text-sm">
                              {collectionData?.description}
                            </span>
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:mt-3 xl:gap-6">
                    <div
                      className={`${
                        dark
                          ? ' border border-sky-400/20'
                          : ' border border-neutral-50/30'
                      } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-3`}
                    >
                      <span className="text-sm text-center">Floor Price</span>
                      <span className="mt-2 text-base font-bold md:text-xl">
                        
                        {collectionData && chainIcon[collectionData?.chainId]}{collectionData?.floorPrice}
                      </span>
                    </div>

                    <div
                      className={`${
                        dark
                          ? ' border border-sky-400/20'
                          : ' border border-neutral-50/30'
                      } flex text-center flex-col items-center justify-center rounded-2xl p-3 shadow-md lg:p-3`}
                    >
                      <span className="text-sm text-center">Volume Traded</span>
                      <span className="mt-2 break-all text-base font-bold md:text-xl">
                        ${!isNaN(collectionData?.volumeTraded) ? millify(collectionData?.volumeTraded, { precision: 3 }) : 0}
                      </span>
                    </div>
                    
                    {collectionData?.type == 'drop' ? (
                      <>
                        <div
                          className={`${
                            dark
                              ? ' border border-sky-400/20'
                              : ' border border-neutral-50/30'
                          } flex flex-col items-center justify-center rounded-2xl p-5 text-center shadow-md lg:p-3`}>
                          <span className="text-sm text-center">Total NFTs</span>
                          <span className="mt-2 text-base font-bold md:text-xl">
                            {totalCirculatingSupply ? totalCirculatingSupply : <IconLoading dark="inbutton"/>}
                          </span>
                        </div>
                        <div
                          className={`${
                            dark
                              ? ' border border-sky-400/20'
                              : ' border border-neutral-50/30'
                          } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-3`}>
                          <span className="text-sm text-center">Unclaimed NFTs</span>
                          <span className="mt-2 text-base font-bold md:text-xl">
                            {totalUnclaimedSupply ? totalUnclaimedSupply : <IconLoading dark="inbutton" />}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div
                      className={`${
                        dark
                          ? ' border border-sky-400/20'
                          : ' border border-neutral-50/30'
                      } flex flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:p-3`}>
                      <span className="text-sm text-center">Total NFTs</span>
                      <span className="mt-2 text-base font-bold sm:text-xl">
                        {nfts?.length}
                      </span>
                    </div>
                    )}

                    <div className={`${
                      dark
                      ? ' border border-sky-400/20'
                      : ' border border-neutral-50/30'
                    } relative flex flex-col items-center justify-center z-1 rounded-2xl p-5 shadow-md lg:p-3 outline-none ring-0 focus:ring-0 focus:outline-none`}>
                      <span className="text-sm block">Owners</span>
                      <p className="mt-2 text-base font-bold sm:text-xl">
                        {nftHolders.length}
                      </p>
                      <div 
                        className="absolute bottom-0 cursor-pointer text-xs py-0.5 px-2 z-50 rounded-2xl shadow-md outline-none ring-0 focus:ring-0 focus:outline-0"
                        onClick={() => setShowOwners(true)}>
                        View
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isBlocked && revealed && (
          <div className="">
            {statusNFT == 'success' && filteredNftData.length == 0 && (
              <div
                className={
                  dark ? style.errorBox + ' border-sky-400/20' : style.errorBox
                }
              >
                <h2 className={style.errorTitle}>No NFT Minted yet.</h2>
                {collectionData?.createdBy?._ref == myUser?.walletAddress && (
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
              <AirdropSettings nftHolders={nftHolders} chain={chain} totalnfts={totalCirculatingSupply} totalremaining={totalUnclaimedSupply} contractAddress={collectionData?.contractAddress} setShowAirdrop={setShowAirdrop} />
            </div>
          </div>
        )}
        {(revealed && collectionData.type === 'drop') && (
          <div className={`container relative mx-auto mt-[1rem] lg:p-[8rem] lg:py-8 lg:pb-0 p-[2rem] text-center`}>
            <div className={`border ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-neutral-200 bg-white/80'} p-4 py-8 md:p-[4rem] rounded-[40px] m-auto backdrop-blur-xl `}>
              <p className="text-2xl font-bold mb-2">Minting Details</p>
              <p className="text-base m-auto lg:max-w-[800px] mb-8">Once you mint an NFT, one of the unique NFT from the unclaimed supply of NFTs will be minted into your wallet. You will be minting one NFT at a time.</p>
              <div className="w-full md:w-96 m-auto space-y-3 mt-3 mb-6">
                <div className="flex gap-[5rem] justify-between text-left">
                  <span>Mint Price</span>
                  <span>
                    {Boolean(claimCurrency?.mintPrice) ? (
                      <div className="flex gap-2 items-center text-xl font-bold">
                        {claimCurrency?.mintPrice} 
                        {/* <IconUSDT/> */}
                        {chainIcon[collectionData?.chainId]}
                      </div>
                    ) : (
                      <span className={`text-xs ${dark ? 'text-slate-500': 'text-neutral-300'}`}>Fetching..</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center mt-4 mb-4 gap-5 flex-wrap md:max-w-[400px] m-auto">
                
                {isMinting ? (
                    <button className="flex cursor-pointer w-full text-base justify-center transition p-4 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 py-3 gap-1 items-center text-white pointer-events-none">
                        <IconLoading dark="inbutton"/> {buttonLabel}
                    </button>
                ):(
                    <button className="flex cursor-pointer w-full text-base justify-center transition p-4 rounded-lg bg-blue-700 hover:bg-blue-800 py-3 gap-1 items-center text-white"
                    onClick={() => claimNFT()}>
                            <WalletCards strokeWidth={1.5} /> <span className="">{buttonLabel}</span>
                    </button>
                )}
                <div className="flex gap-4 justify-center flex-wrap">
                  {!Boolean(address) && (
                    <ConnectWallet className="!w-full md:!w-fit "/>
                  )}
                  {rewardingCollections.includes(collectionAddress?.toLowerCase()) &&
                  (<Link href={`/rewarding-renditions#videos`} passHref>
                    <a className={`flex flex-grow cursor-pointer w-fit text-base justify-center transition p-4 rounded-lg ${dark ? 'bg-slate-800 hover:bg-slate-700/80' :'bg-neutral-400 hover:bg-neutral-500'} py-3 gap-1 items-center text-white`} target="_blank">
                      How To / Tutorials
                    </a>
                  </Link>)}
                </div>
                  {rewardingCollections.includes(collectionAddress?.toLowerCase()) &&
                  (<Link href="/blogs/loyalty-reward" passHref>
                    <a className={`w-full cursor-pointer text-sm md:text-base justify-center transition p-4 rounded-lg ${dark ? 'bg-slate-800 hover:bg-slate-700/80' :'bg-neutral-400 hover:bg-neutral-500'} py-3 gap-1 items-center text-white`}>
                      Benefits of NFTs from this Collection
                    </a>
                  </Link>)}
              </div>
              <p className="text-sm lg:max-w-[800px] m-auto">You need to have a wallet connected to this site in order to mint an NFT. We have tutorial videos on how to create a wallet and connect. To check them, click on the How To / Tutorial above.<br/>There is no limit in number of NFTs you can mint in this collection.</p>
            </div>
          </div>
        )}
        
        <div className={style.nftWrapperContainer}>
          <div className={`relative backdrop-blur-xl pt-8 md:px-4 rounded-[40px] ${dark ? 'bg-slate-900/80' : 'bg-white/80'}`}>
            {revealed && (
              <div className="relative flex justify-center md:justify-between flex-wrap mb-8 gap-3 md:gap-2">
                <div className="flex flex-wrap justify-center gap-2">
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
                  )}

                  <Popover className="relative z-50">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                            ${open ? '' : 'text-opacity-90'}
                            group inline-flex items-center rounded-lg transition bg-sky-700 hover:bg-sky-600 px-3 py-2 text-sm  text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span>Filters by Properties</span>
                          <BiChevronDown
                            className={`${open ? 'rotate-180' : 'text-opacity-70'}
                                h-5 w-5 text-white-300 transition ease-in-out group-hover:text-opacity-80`}
                            aria-hidden="true"
                          />
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
                          <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm  transform px-4 sm:px-0">
                            <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="bg-slate-700/90 backdrop-blur-lg p-6 ">
                                {properties && (
                                  <Property traits={properties} nftData={nfts} />
                                )}
                                <div className="rounded-xl mx-auto text-sm bg-sky-600 hover:bg-sky-700 text-neutral-100 w-max py-2 p-4 mt-4 cursor-pointer"
                                  onClick={() => {
                                    setSelectedProperties([]);
                                    setFilteredNftData([...nfts]);
                                      }
                                    }>
                                        Reset Filter
                                  </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>



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
                </div>
              </div>
            )}
            
            {collectionData && String(collectionData?.createdBy?._ref).toLowerCase() == String(myUser?.walletAddress).toLowerCase() &&  (
              <button
                className="relative h-auto w-auto items-center justify-center rounded-lg mb-5 bg-blue-700 hover:bg-blue-800 p-3 font-medium text-neutral-50 transition-colors"
                onClick={() => setShowListingModal(true)}>
                List NFTs in Batch
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

            {/* {statusNFT == 'loading' && <div className="m-[5rem]"><Loader /></div>} */}

            {!isBlocked && revealed &&
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
                              showUnlisted={showUnlisted}
                              creator={collectionData?.createdBy}
                              hasOwner={true}
                              compact={compact}
                            />
                        )
                        )
                      }
                      {/* {
                        filteredNftData?.map((nftItem, id) => (
                            <NFTCardExternal
                              key={id}
                              nftItem={nftItem}
                              chain={chain}
                              collectionAddress={collectionAddress}
                              showUnlisted={showUnlisted}
                              creator={collectionData?.createdBy}
                              hasOwner={true}
                              compact={compact}
                            />
                        )
                        )
                      } */}
                    </div>
                  )}

                  <div ref={loadMoreRef} className={`${!hasNextPage ? "hidden" : ""} mt-[3rem] text-center`}>
                    {isFetchingNextPage ? (
                      <div className="flex justify-center items-center gap-1">
                        {dark? <IconLoading dark="inbutton" />: <IconLoading/>} Loading..
                      </div>
                    ) : ''}
                  </div>
                  {isLoading ? (
                        <div className="flex justify-center items-center mt-[3rem] pb-[3rem] gap-1">
                          {dark? <IconLoading dark="inbutton" />: <IconLoading/>} Parsing Data..
                        </div>
                      ) : ''}
                  {/* <div className="mt-5 flex justify-end">
                    <button 
                      className={`rounded-md text-sm p-2 px-3 flex gap-1 items-center  ${dark ? 'bg-slate-800 hover:bg-slate-600': 'bg-neutral-200 hover:bg-neutral-200'}`}
                      onClick={() => setCursor(dataNFT.cursor)}> Next <HiChevronRight fontSize={18}/> </button>
                  </div> */}
                </>
              )
            }
            {!revealed && Boolean(collectionData) && false && (
              <div className="mx-auto flex justify-center z-50 pb-10">
                <NoSSR>
                  <Countdown date={new Date(collectionData.revealtime)} renderer={renderer} />
                </NoSSR>
              </div>
            )}
          </div>
        </div>
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

export async function getServerSideProps(context){
  const {chain, collectionAddress } = context.params;
  const blockchainIdFromName = { 
    'ethereum' : '1',
    'goerli': '5',
    'avalanche': '43114',
    'avalanche-fuji': '43113',
    'polygon': '137',
    'mumbai': '80001',
    'binance': '56',
    'binance-testnet': '97',
    'arbitrum-goerli': '421613',
    'arbitrum': '42161',
  }
  let contractAddress = '';
  const link = {
    crypto_creatures: '0x9809AbFc4319271259a340775eC03E9746B76068',
    neon_dreams: '0x2945db324Ec216a5D5cEcE8B4D76f042553a213f',
    celestial_beings: '0x54265672B480fF8893389F2c68caeF29C95c7BE2',
    artifacts_of_the_future: '0x9BDa42900556fCce5927C1905084C4b3CffB23b0',
    pandagram_v2: '0xbDd60f4d2795f145C09dd4eA6d9565B185F6CBF9',
    nomin: '0x05e9d0Fa11eFF24F3c2fB0AcD381B6866CeF2a1C',
    kaioji: '0xa98d96E636123dFB35AB037d1E5a7B76a6e7e95B',
    grutzi: '0x50Fb365F7B1c5CfaF3a0a9341029ABD0ce8e4f80',
    hidoi: '0x023803f52a5DD566AC1E6a3B06bCE8CD0d27a8a7',
    ursine: '0x1585603eB9b94bCbEb16443f7923cDdbfa056A98',
    vulpine: '0x587ac4A4ab6320150ACf6B49a6eb3a519506D4b6',
    lapine: '0xbbfEB3039116Aa1f4d95C009C8eA9DD8eD4d8324',
    canine: '0xAb5f5ad36d571e1dF18A6a57F50D0e3CB93762cc',
  }
  if(String(collectionAddress).toLowerCase() == 'crypto_creatures') {contractAddress = link.crypto_creatures}
  else if(String(collectionAddress).toLowerCase() == 'neon_dreams') {contractAddress = link.neon_dreams}
  else if(String(collectionAddress).toLowerCase() == 'celestial_beings') {contractAddress = link.celestial_beings}
  else if(String(collectionAddress).toLowerCase() == 'artifacts_of_the_future') {contractAddress = link.artifacts_of_the_future}
  else if(String(collectionAddress).toLowerCase() == 'pandagram_v2') {contractAddress = link.pandagram_v2}
  else if(String(collectionAddress).toLowerCase() == 'nomin') {contractAddress = link.nomin}
  else if(String(collectionAddress).toLowerCase() == 'kaioji') {contractAddress = link.kaioji}
  else if(String(collectionAddress).toLowerCase() == 'grutzi') {contractAddress = link.grutzi}
  else if(String(collectionAddress).toLowerCase() == 'hidoi') {contractAddress = link.hidoi}
  else if(String(collectionAddress).toLowerCase() == 'ursine') {contractAddress = link.ursine}
  else if(String(collectionAddress).toLowerCase() == 'vulpine') {contractAddress = link.vulpine}
  else if(String(collectionAddress).toLowerCase() == 'lapine') {contractAddress = link.lapine}
  else if(String(collectionAddress).toLowerCase() == 'canine') {contractAddress = link.canine}
  else { contractAddress = collectionAddress}

  const fetchPoint = `${HOST}/api/infura/getCollectionSanityData/${blockchainIdFromName[chain]}/${contractAddress}`;

  const collectionData = await axios.get(fetchPoint);

  return {
    props : {
      chain,
      collectionAddress: contractAddress,
      collectionData: collectionData?.data,
    }
  }
}