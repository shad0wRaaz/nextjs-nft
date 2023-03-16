import axios from 'axios'
import Script from 'next/script'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import DatePicker from 'react-datepicker'
import { CgSpinner } from 'react-icons/cg'
import CoinSelection from './CoinSelection'
import { useQueryClient } from 'react-query'
import { RiAuctionLine } from 'react-icons/ri'
import { Router, useRouter } from 'next/router'
import { config } from '../../lib/sanityClient'
import 'react-datepicker/dist/react-datepicker.css'
import { MdClose, MdOutlineSell } from 'react-icons/md'
import React, { useEffect, useState, useRef } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { saveTransaction } from '../../mutators/SanityMutators'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { NATIVE_TOKEN_ADDRESS, ThirdwebSDK } from '@thirdweb-dev/sdk'
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { IconAvalanche, IconBNB, IconEthereum, IconLoading, IconPolygon, IconWallet } from '../icons/CustomIcons'
import { useChainId, useAddress, useContract, ConnectWallet, useSigner, useNetworkMismatch, useNetwork } from '@thirdweb-dev/react'


const style = {
  canvasMenu:
    'bg-slate-900 h-[100vh] shadow-xl px-[2rem] overflow-y-scroll z-20 text-white',
  blur: 'filter: blur(1px)',
  closeButton:
    'absolute transition duration-[300] top-[20px] right-[20px] rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70',
  smallText: 'text-sm m-2 text-[#bbb] mt-0 mb-0 leading-4',
  subHeading:
    'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
  input:
    'm-2 grow outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
  label: 'text-small m-2 mt-4',
  button:
    'flex gap-2 items-center gradBlue rounded-xl cursor-pointer p-3 m-3 px-6 ease-linear transition text-white',
}

const blockchainCurrency = {
"mumbai" : {currency: "MATIC", icon: <IconPolygon />, DATABASE_COIN_NAME: "maticprice"},
"polygon": {currency: "MATIC", icon: <IconPolygon />, DATABASE_COIN_NAME: "maticprice"},
"goerli": {currency: "ETH", icon: <IconEthereum />, DATABASE_COIN_NAME: "ethprice"},
"mainnet": {currency: "ETH", icon: <IconEthereum />, DATABASE_COIN_NAME: "ethprice"},
"binance-testnet": {currency: "TBNB", icon: <IconBNB />, DATABASE_COIN_NAME: "bnbprice"},
"binance": {currency: "BNB", icon: <IconBNB />, DATABASE_COIN_NAME: "bnbprice"},
"avalanche": {currency: "AVAX", icon: <IconAvalanche />, DATABASE_COIN_NAME: "avaxprice"},
"avalanche-fuji":{currency: "AVAX", icon: <IconAvalanche />, DATABASE_COIN_NAME: "avaxprice"},
}

const blockchainId = {
  'mumbai': '80001',
  'polygon': '137',
  'avalanche-fuji': '43113',
  'avalanche': '43114',
  'binance-testnet': '97',
  'binance': '56',
  'goerli': '5',
  'mainnet': '1',
}

const Sell = ({ nftContractData, nftCollection,thisNFTMarketAddress, thisNFTblockchain }) => {
  const { dark, errorToastStyle, successToastStyle } = useThemeContext()
  const address = useAddress()
  const router = useRouter()
  const { loadingNewPrice, setLoadingNewPrice, coinPrices, HOST } = useSettingsContext();
  const queryClient = useQueryClient()
  const directListingPanel = useRef()
  const auctionListingPanel = useRef()
  const chainid = useChainId()
  const signer = useSigner()
  const [isOpen, setIsOpen] = useState(false)
  const [listingPrice, setListingPrice] = useState(0)
  const [buyoutPrice, setBuyoutPrice] = useState(0)
  const [reservePrice, setReservePrice] = useState(0)
  const [listingDuration, setListingDuration] = useState('')
  const [auctionDuration, setAuctionDuration] = useState('')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [startAuctionDate, setAuctionStartDate] = useState()
  const [endAuctionDate, setAuctionEndDate] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [thisNFTBlockchainCurrency, setThisNFTBlockchainCurrency] = useState(0)
  const [directorauction, setdirectorauction] = useState(true);

  const isMismatch = useNetworkMismatch();
  const [{ data, error, loading }, switchNetwork] = useNetwork();


  useEffect(() => {
    const t = thisNFTblockchain;
    // console.log(t)
    if(!t) return
    if(t == "mumbai" || t == "polygon") { setThisNFTBlockchainCurrency(coinPrices?.maticprice); } 
    else if(t == "mainnet" || t == "goerli") { setThisNFTBlockchainCurrency(coinPrices?.ethrice); }
    else if (t == "binance" || t == "binance-testnet") { setThisNFTBlockchainCurrency(coinPrices?.bnbprice); }
    else if(t == "avalanche" || t == "avalanche-fuji") { setThisNFTBlockchainCurrency(coinPrices?.avaxprice); }

    if(isMismatch) {
      toast.error('Wallet is connected to wrong chain. Switching network now.', errorToastStyle)
      switchNetwork(Number(blockchainId[thisNFTblockchain]));
    }
    return() => {
      // do nothing
    } 
  }, [thisNFTblockchain])

  const { mutate: mutateSaveTransaction } = useMutation(
    ({ transaction, id, eventName, price, chainid, itemid }) =>
      saveTransaction({
        transaction,
        id,
        eventName,
        price,
        chainid,
        itemid,
      }),
    {
      onError: () => {
        toast.error(
          'Error saving transaction. Contact administrator.',
          errorToastStyle
        )
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['activities'])
        queryClient.invalidateQueries(['marketplace'])
        setListingPrice('')
        setStartDate('')
        setEndDate('')
        setIsOpen(false)
      },
    }
  )

  useEffect(() => {
    if (!startDate || !endDate) return
    setListingDuration(differenceInSeconds(endDate, startDate));

    return() =>{ 
      //do nothing
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (!startAuctionDate || !endAuctionDate) return
    setAuctionDuration(differenceInSeconds(endAuctionDate, startAuctionDate));

    return() =>{ 
      //do nothing
    }
  }, [startAuctionDate, endAuctionDate])

  const directListItem = async (
    e,
    toastHandler = toast,
    sanityClient = config,
  ) => {

    if (!listingPrice) {
      toastHandler.error('Listing price not set.', errorToastStyle);
      return
    }

    if(!nftCollection?.contractAddress) {
      toastHandler.error("NFT Collection Address could not be located.", errorToastStyle);
      return
    }
    //check for correct network
    


    setIsLoading(true);
    setLoadingNewPrice(true);
    setIsOpen(false);

    //NFT Collection Contract Address
    const listing = {
      assetContractAddress: nftCollection?.contractAddress,
      tokenId: nftContractData.metadata.id.toString(),
      startTimestamp: new Date(),
      listingDurationInSeconds: Number(listingDuration) || 31449600,
      quantity: 1,
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      buyoutPricePerToken: listingPrice,
    }
    
    try {
      const sdk = new ThirdwebSDK(signer);
      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");

      const tx = await contract?.direct.createListing(listing);

      //update market listing id in database
      const marketListingId = tx.id.toString();
      ;(async(id = marketListingId , dbClient = sanityClient)=> {
        await dbClient.patch(nftContractData?.metadata?.properties?.tokenid).set({ 'listingid': id }).commit();
      })()

       //update Floor Price
      ;(async( dbClient = sanityClient) => {
        // console.log(listingPrice, nftCollection);
        if(nftCollection?.floorPrice == 0 || nftCollection?.floorPrice > listingPrice){
          await dbClient.patch(nftCollection?._id).set({ 'floorPrice': Number(listingPrice) }).commit();
        }
      })()


      //saving transaction data
      mutateSaveTransaction({
        transaction: tx,
        chainid: chainid,
        eventName: 'List',
        price: listingPrice,
        id: nftContractData.metadata.id.toString(),
        itemid: nftContractData.metadata.properties.tokenid,
      })

      queryClient.invalidateQueries(['activities']);
      queryClient.invalidateQueries(['marketplace']);
      
      toastHandler.success("NFT successfully listed in the marketplace. Please wait for a while. Getting the NFT's latest price from the marketplace.", successToastStyle);

      //update listing data
      ;(async() => {
        await axios.get(`${HOST}/api/updateListings/${thisNFTblockchain}`).then(() => {
          router.reload(window.location.pathname);
          router.replace(router.asPath);
          setLoadingNewPrice(false);
        })
      })()

    } catch (error) {
      toastHandler.error(error.message, errorToastStyle)
      console.error(error)
    }
    setLoadingNewPrice(false);
    setIsLoading(false);
  }

  const auctionListItem = async (
    quantityDesired = 1,
    toastHandler = toast,
    sanityClient = config
  ) => {
    if (!buyoutPrice) {
      toastHandler.error('Buyout price not set.', errorToastStyle)
      return
    }
    if (!reservePrice) {
      toastHandler.error('Reserve price not set.', errorToastStyle)
      return
    }
    
    if(!nftCollection?.contractAddress) {
      toastHandler.error("NFT Collection Address could not be located.", errorToastStyle)
      return
    }
    setIsLoading(true)
    const auction = {
      //NFT Collection Contract Address
      assetContractAddress: nftCollection?.contractAddress,
      tokenId: nftContractData.metadata.id.toString(),
      startTimestamp: new Date(),
      listingDurationInSeconds: Number(listingDuration) || 31449600,
      quantity: 1,
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      buyoutPricePerToken: buyoutPrice,
      reservePricePerToken: reservePrice,
    }
    // console.log(listing);
    try {
      const sdk = new ThirdwebSDK(signer);
      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");

      const tx = await contract.auction.createListing(auction);
      const receipt = tx.receipt
      const newListingId = tx.id

      toastHandler.success(
        'NFT successfully auctioned in the marketplace.',
        successToastStyle
      )

      //saving transaction data
      mutateSaveTransaction({
        transaction: tx,
        id: nftContractData.metadata.id.toString(),
        eventName: 'Auction',
        itemid: nftContractData.metadata.properties.tokenid,
        price: buyoutPrice,
        chainid: chainid,
      })

      queryClient.invalidateQueries(['activities'])
      queryClient.invalidateQueries(['marketplace'])

      setAuctionEndDate('')
      setAuctionDuration('')
      setAuctionStartDate('')

      //update listing data
      ;(async() => {
        setLoadingNewPrice(true);
        await axios.get(`${HOST}/api/updateListings/${thisNFTblockchain}`).then(() => {
          setLoadingNewPrice(false);
          router.reload(window.location.pathname);
          router.replace(router.asPath);
        })
      })()

      // window.location.reload(false); //refresh the page
    } catch (error) {
      toastHandler.error(error.message, errorToastStyle)
      console.error(error)
    }
    setIsLoading(false)
  }

  // const showDirect = () => {
  //   if (!address) return
  //   setdirectorauction(true);
    
  // }
  // useEffect(() => {
  //   console.log(directorauction)
  //   if(!address) return;
  //   if(directorauction){
  //     directListingPanel.current.style.display = 'block';
  //     auctionListingPanel.current.style.display = 'none';
  //     return;
  //   }
  //   directListingPanel.current.style.display = 'none'
  //   auctionListingPanel.current.style.display = 'block'
  // }, [directorauction])

  // //show direct listing by default
  // useEffect(() => {
  //   if (!address) return
  //   showDirect()

  //   return() =>{ 
  //     //do nothing
  //   }
  // }, [])
  
  return (
    <>
      <Script src="https://unpkg.com/flowbite@1.4.7/dist/datepicker.js" />
      <div className="grow">
        <OffCanvas
          width={650}
          transitionDuration={300}
          effect={'overlay'}
          isMenuOpened={isOpen}
          position={'right'}
        >
          <OffCanvasBody className={isOpen ? '' : ''}>
            <div
              className={`${loadingNewPrice ? 'pointer-events-none opacity-75' : '' } gradBlue relative inline-flex h-auto w-full flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base`}
              onClick={() => setIsOpen(true)}
            >
              <IconWallet />

              <span className="ml-2.5">Sell</span>
            </div>
          </OffCanvasBody>

          <OffCanvasMenu className={dark ? style.canvasMenu + 'border border-l-4 border-slate-700' : style.canvasMenu}>
            {address && (
              <>
                <button
                  className={style.closeButton}
                  onClick={() => setIsOpen(false)}
                >
                  <MdClose fontSize="30px" />
                </button>

                <div className="relative mt-[7rem] flex w-full flex-col gap-5">
                  Choose type of listing
                  <div className="flex flex-row gap-4">
                    <div
                      className={`directListing flex grow cursor-pointer items-center justify-center gap-3 rounded-xl border p-5 ${directorauction ? 'bg-slate-700 border-blue-500' :'border-slate-700'} transition hover:bg-slate-800`}
                      onClick={() => setdirectorauction(true)}
                    >
                      <MdOutlineSell fontSize="25px" />
                      <span className="text-md text-white">Direct Listing</span>
                    </div>
                    <div
                      className={`autionListing flex grow cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-700 p-5 ${!directorauction ? 'bg-slate-700 border-blue-500' :'border-slate-700'} transition hover:bg-slate-800`}
                      onClick={() => setdirectorauction(false)}
                    >
                      <RiAuctionLine fontSize="25px" /> Auction Listing
                    </div>
                  </div>
                  {directorauction ? (
                    <div className=" absolute top-[130px] w-full">
                      <div className="">
                        <p className={style.label}>Price*</p>
                        <div className="flex flex-row items-center gap-5">
                          <input
                            className={style.input}
                            style={{ margin: '0' }}
                            type="number"
                            name="listingPrice"
                            value={listingPrice}
                            onChange={(e) => setListingPrice(e.target.value)}
                          />
                          <div className="text-sm inline-flex justify-center items-center rounded-md bg-[#1e293b] p-3 font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            {blockchainCurrency[thisNFTblockchain].icon}
                            {blockchainCurrency[thisNFTblockchain].currency}
                          </div>
                        </div>
                        <div className="p-2 text-sm">
                          ≈ $ {parseFloat(listingPrice * thisNFTBlockchainCurrency).toFixed(2)} 
                          <span className="text-sm text-slate-500 pl-2">(1$ = {thisNFTBlockchainCurrency})</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className={style.label}>Duration <span className="text-xs opacity-40">(Optional)</span></p>
                        <p className={style.smallText}>List this NFT for only selected period of time</p>
                        <div className="flex flex-col items-center mt-4">
                          <div className="relative w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex h-[40px] items-center pl-3">
                              From:
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex h-[40px] items-center pl-3">
                              <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>

                            <DatePicker
                              dateFormat="dd/MM/yyyy HH:mm:SS"
                              selected={startDate}
                              minDate={new Date()}
                              onChange={(date) => setStartDate(date)}
                              className="opacity-1 block w-full cursor-pointer rounded-lg bg-slate-800 p-2.5 pl-[6.5rem] text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="relative mt-4 w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex h-[40px] items-center pl-3">
                              To:
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex h-[40px] items-center pl-3">
                              <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>

                            <DatePicker
                              dateFormat="dd/MM/yyyy HH:mm:SS"
                              selected={endDate}
                              minDate={startDate}
                              onChange={(date) => setEndDate(date)}
                              className="opacity-1 block w-full cursor-pointer rounded-lg bg-slate-800 p-2.5 pl-[6.5rem] text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-8">
                        <span>Platform Fees</span>
                        <span>5%</span>
                      </div>

                      <div className="pt-8">
                        {isLoading ? (
                          <button
                            className={
                              style.button + ' cursor-not-allowed opacity-80'
                            }
                            disabled
                          >
                            <IconLoading dark="inbutton" />
                            {/* <CgSpinner className="animate-spin" fontSize="20px" />{' '} */}
                            Processing...
                          </button>
                        ) : (
                          <button
                            className={style.button}
                            onClick={() => directListItem()}
                            style={{ opacity: '1' }}
                          >
                            <MdOutlineSell fontSize="20px" /> Complete Listing
                          </button>
                        )}
                      </div>
                    </div>
                  ): (
                    <div className="absolute top-[130px] w-full">
                      <div className="">
                        <p className={style.label}>Buyout Price*</p>
                        <div className="flex flex-row items-center gap-5">
                          <input
                            className={style.input}
                            style={{ margin: '0' }}
                            type="number"
                            name="buyoutPrice"
                            value={buyoutPrice}
                            onChange={(e) => setBuyoutPrice(e.target.value)}
                          />
                          <div className="text-sm inline-flex justify-center items-center rounded-md bg-[#1e293b] p-3 font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            {blockchainCurrency[thisNFTblockchain].icon}
                            {blockchainCurrency[thisNFTblockchain].currency}
                          </div>
                        </div>
                        <div className="p-2 text-sm">
                          ≈ $ {parseFloat(buyoutPrice * thisNFTBlockchainCurrency).toFixed(2)} 
                          <span className="text-sm text-slate-500 pl-2">(1$ = {thisNFTBlockchainCurrency})</span>
                        </div>
                      </div>

                      <div className="relative mt-4 w-full">
                        <p className={style.label}>Minimum Bidding Price*</p>
                        <div className="flex flex-row items-center gap-5">
                          <input
                            className={style.input}
                            style={{ margin: '0', width: '100%' }}
                            type="number"
                            name="minimumPrice"
                            value={reservePrice}
                            onChange={(e) => setReservePrice(e.target.value)}
                          />
                          <div className="text-sm inline-flex justify-center items-center rounded-md bg-[#1e293b] p-3 font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            {blockchainCurrency[thisNFTblockchain].icon}
                            {blockchainCurrency[thisNFTblockchain].currency}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className={style.label}>Duration <span className="text-xs opacity-40">(Optional)</span></p>
                        <p className={style.smallText}>List this NFT for only specified period of time.</p>
                        <div className="flex flex-col items-center mt-4">
                          <div className="relative w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex h-[40px] items-center pl-3">
                              From:
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex h-[40px] items-center pl-3">
                              <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>

                            <DatePicker
                              dateFormat="dd/MM/yyyy HH:mm:SS"
                              selected={startAuctionDate}
                              minDate={new Date()}
                              onChange={(date) => setAuctionStartDate(date)}
                              className="opacity-1 block w-full cursor-pointer rounded-lg bg-slate-800 p-2.5 pl-[6.5rem] text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="relative mt-4 w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex h-[40px] items-center pl-3">
                              To:
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex h-[40px] items-center pl-3">
                              <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>

                            <DatePicker
                              dateFormat="dd/MM/yyyy HH:mm:SS"
                              selected={endAuctionDate}
                              minDate={startAuctionDate}
                              onChange={(date) => setAuctionEndDate(date)}
                              className="opacity-1 block w-full cursor-pointer rounded-lg bg-slate-800 p-2.5 pl-[6.5rem] text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-8">
                        <span>Platform Fees</span>
                        <span>5%</span>
                      </div>

                      <div className="pt-8">
                        {isLoading ? (
                          <button
                            className={style.button}
                            style={{ opacity: '0.8', cursor: 'disabled' }}
                            disabled
                          >
                            <IconLoading dark="in-button" /> {' '}
                            Processing...
                          </button>
                        ) : (
                          <button
                            className={style.button}
                            onClick={auctionListItem}
                            style={{ opacity: '1' }}
                          >
                            <MdOutlineSell fontSize="20px" /> Put on Auction
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {!address && <><ConnectWallet accentColor="#0053f2" colorMode="light" className="rounded-xxl ml-4" /></>}
          </OffCanvasMenu>
        </OffCanvas>
      </div>
    </>
  )
}

export default Sell
