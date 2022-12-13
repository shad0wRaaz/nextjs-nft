import axios from 'axios'
import Sell from './Sell'
import { BigNumber } from 'ethers'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { BsLightningCharge } from 'react-icons/bs'
import { ChainId, NATIVE_TOKENS } from '@thirdweb-dev/sdk'
import { useChainId, useAddress } from '@thirdweb-dev/react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { IconLoading, IconOffer, IconWallet } from '../icons/CustomIcons'
import { saveTransaction, addVolumeTraded } from '../../mutators/SanityMutators'
import { MdOutlineCancel, MdOutlineCheck, MdOutlineCheckCircle } from 'react-icons/md'

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-md `,
  price: 'flex gap-[10px] items-center mb-4',
  priceValue: 'text-2xl font-bold',
  buttons: 'flex',
}

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const MakeOffer = ({
  nftContractData,
  nftCollection,
  listingData,
  auctionItem,
}) => {

var listed = true
  if(listingData?.message) {
    listed = false
  }
  const { marketContract, marketplaceAddress } = useMarketplaceContext();
  const { coinPrices, loadingNewPrice, setLoadingNewPrice } = useSettingsContext();
  const { dark } = useThemeContext();
  const chainId = useChainId();
  const address = useAddress();
  const settingRef = useRef();
  const bidsettingRef = useRef();
  const [offerAmount, setOfferAmount] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const queryClient = useQueryClient();
  const [buyLoading, setBuyLoading] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  const [coinMultiplier, setCoinMultiplier] = useState();
  const burntOwnerAddress = "0x0000000000000000000000000000000000000000";
  const isburnt = nftContractData.owner == burntOwnerAddress ? true : false;
  const router = useRouter();
  
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
          'Error saving transaction. Contact administrator',
          errorToastStyle
        )
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries(['eventData']);
        queryClient.invalidateQueries(['activities']);
        queryClient.invalidateQueries(['marketplace']);
      },
    }
  )

  const { mutate: addVolume } = useMutation(
    ({ id, volume }) =>
      addVolumeTraded({ id, volume }),
    {
      onError: () => {
        toast.error('Error in adding Volume Traded.', errorToastStyle)
      },
    }
  )

  useEffect(() => {
    if (!listingData) return

    //get currency symbol from market(listed) nft item
    if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'MATIC') {
      setCoinMultiplier(coinPrices?.maticprice)
    } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'ETH') {
      setCoinMultiplier(coinPrices?.ethprice)
    } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'FTX') {
      setCoinMultiplier(coinPrices?.ftxprice)
    } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'AVAX') {
      setCoinMultiplier(coinPrices?.avaxprice)
    } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'BNB') {
      setCoinMultiplier(coinPrices?.bnbprice)
    }
  }, [listingData, coinPrices])


  //function to make offer for nfts
  const makeAnOffer = async (
    listingId = listingData.id.toString(),
    quantityDesired = 1,
    module = marketContract,
    toastHandler = toast,
    qc = queryClient
  ) => {
    if (!address) {
      toastHandler.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
      )
      return
    }
    if(offerAmount <= 0){
      toastHandler.error('Invalid Offer Amount entered.', errorToastStyle);
      return
    }
    
    if(!listingData) return

    try {
      setOfferLoading(true); 
      const tx = await module.direct.makeOffer(
        listingId,
        quantityDesired,
        NATIVE_TOKENS[ChainId.Mumbai].wrapped.address,
        offerAmount
      );

      //save transaction
      mutateSaveTransaction({
        transaction: tx,
        id: nftContractData.metadata.id.toString(),
        eventName: 'Offer',
        itemid: nftContractData.metadata.properties.tokenid,
        price: offerAmount.toString(),
        chainid: chainId,
      });

      qc.invalidateQueries(['activities']);
      qc.invalidateQueries(['eventData']);
      qc.invalidateQueries(['marketplace']);

      toastHandler.success('Offer has been placed.', successToastStyle);
      setOfferLoading(false);
      setOfferAmount(0);
      openOfferSetting('none');

    } catch (error) {
      console.log(error)
      if(error.toString().search("execution reverted: !BAL20")) {
        toastHandler.error('Not enough Wrapped Token to make an offer.', errorToastStyle)
      }else {
        toastHandler.error("Error placing offer.", errorToastStyle)
      }
      setOfferLoading(false)
    }
  }
  const bidItem = async ( 
    listingId = listingData.id.toString(),
    module = marketContract,
    toastHandler = toast,
    qc = queryClient
  ) => {
    // console.log(listingId)

    if (!address) {
      toastHandler.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
      )
      return
    }
    try {
      setBidLoading(true)
      // await module.setBidBufferBps(500) //bid buffer, next bid must be at least 5% higher than the current bid

      const tx = await module.auction.makeBid(listingId, bidAmount)
      toastHandler.success('Bid successful.', successToastStyle)
      
      //save transaction
      mutateSaveTransaction({
        transaction: tx,
        id: nftContractData.metadata.id.toString(),
        eventName: 'Bid',
        itemid: nftContractData.metadata.properties.tokenid,
        price: bidAmount.toString(),
        chainid: chainId,
      });
      qc.invalidateQueries(['activities']);
      queryClient.invalidateQueries(['eventData']);
      qc.invalidateQueries(['marketplace']);

      console.log(tx)
    } catch (error) {
      // console.log(error)
      toastHandler.error(error.message, errorToastStyle)
    }
    setBidAmount(0);
    setBidLoading(false)
    openBidSetting('none');
  }
  const buyItem = async (
    listingId = listingData.id.toString(),
    quantityDesired = 1,
    module = marketContract,
    toastHandler = toast,
    qc = queryClient
    ) => {
      if (!address) {
        toastHandler.error(
          'Wallet not connected. Connect wallet first.',
          errorToastStyle
          )
          return
        }
    try {

      setBuyLoading(true)
      setLoadingNewPrice(true);

      const bigNumberPrice = parseInt(listingData.buyoutPrice?.hex, 16)
      const divider = BigNumber.from(10).pow(18)
      const buyOutPrice = bigNumberPrice / divider
    
      const tx = await module.buyoutListing(listingId, quantityDesired)
      toastHandler.success('NFT purchase successful.', successToastStyle)

      mutateSaveTransaction({
        transaction: tx,
        id: nftContractData.metadata.id.toString(),
        eventName: 'Buy',
        itemid: nftContractData.metadata.properties.tokenid,
        price: buyOutPrice.toString(),
        chainid: chainId,
      })
      // console.log(tx)

      const volume2Add = parseFloat(buyOutPrice * coinMultiplier)
      
      //adding volume to Collection
      addVolume({
        id: nftCollection?._id,
        volume: volume2Add,
      })

      //adding volume to the user
      addVolume({
        id: address,
        volume: volume2Add
      })


      qc.invalidateQueries(['activities'])
      qc.invalidateQueries(['marketplace'])
      
      //update listing data
      ;(async() => {
        await axios.get(process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080/api/updateListings' : 'http://localhost:8080/api/updateListings').then(() => {
          setLoadingNewPrice(false);
          setBuyLoading(false)
          router.reload(window.location.pathname);
          router.replace(router.asPath);
        })
      })()
      
    } catch (error) {
      console.error(error)
      toastHandler.error(error.message, errorToastStyle)
      setBuyLoading(false)
      return
    }
    //save the transaction data
    try {
    } catch (error) {
      toastHandler.error('Error in saving NFT data. Contact administrator.')
    }
  }
  const openOfferSetting = (value) => {
    setOfferAmount(0);
    settingRef.current.style.display = value;
  }
  const openBidSetting = (value) => {
    setBidAmount(0);
    bidsettingRef.current.style.display = value;
  }

  // console.log(nftContractData)
  return (
    <div className="pb-9">
      {listed && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="relative flex flex-1 flex-col items-baseline rounded-xl border-2 border-green-500 p-6 sm:flex-row justify-center">
            <span className="absolute bottom-full translate-y-3 rounded-lg bg-green-500 py-1 px-1.5 text-sm text-white">
              Current Price
            </span>
            {loadingNewPrice ? (
            <div className="flex gap-2 justify-center text-md text-green-500 text-center w-full">
              <IconLoading color="rgb(34 197 94)" /> Loading
            </div>) : (
              <>
                <span className="text-3xl font-semibold text-green-500 xl:text-4xl">
                  {listingData?.buyoutCurrencyValuePerToken?.displayValue}{' '}
                  {listingData?.buyoutCurrencyValuePerToken?.symbol}
                </span>
                {coinMultiplier && (
                  <span className="text-lg text-neutral-400 sm:ml-5">
                    ( ≈ $
                    {parseFloat(
                      Number(listingData?.buyoutCurrencyValuePerToken?.displayValue) *
                        coinMultiplier
                    ).toFixed(5)}
                    )
                  </span>
                )}
              </>
            )}
          </div>

          {/* <span className="ml-5 mt-2 text-sm text-neutral-500 sm:mt-0 sm:ml-10">
            [96 in stock]
          </span> */}
        </div>
      )}

      {!listed && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center">
          <div className={`relative flex flex-1 flex-col ${isburnt ? 'bg-red-500' : ''} items-baseline justify-center rounded-xl border-2 border-red-500 p-6 sm:flex-row justify-center`}>
            {loadingNewPrice ? (
              <div className="flex gap-2 justify-center text-red-500 text-center w-full">
              <IconLoading color="rgb(239 68 68)" /> Loading
            </div>
            ) :(
              <>
              {isburnt ? (
                <div className="flex gap-2 text-md text-neutral-100 xl:text-md">
                  <BsLightningCharge className="text-xl" /> This NFT has been burnt.
                </div>
              ) : (
                <span className="text-xl text-red-500 xl:text-md">
                  This NFT is not in Sale
                </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
        {!listed && (address == nftContractData?.owner) && (
          <Sell
            nftContractData={nftContractData}
            nftCollection={nftCollection}
          />
        )}

        {listed && address != nftContractData?.owner && !auctionItem && (
          <>
            {buyLoading ? (
              <div className="gradBlue relative inline-flex flex-1 h-auto cursor-wait items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base">
                <IconLoading dark="inbutton" />
                <span className="ml-2.5">Processing...</span>
              </div>
            ) : (
              <div
                className="gradBlue relative inline-flex h-auto flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base"
                onClick={() => buyItem()}
              >
                <IconWallet />
                <span className="ml-2.5">Buy</span>
              </div>
            )}
                {offerLoading ? (
                  <div className={`transition relative inline-flex flex-1 w-full h-auto cursor-pointer items-center justify-center rounded-xl border ${dark ? 'border-slate-700 bg-slate-700 text-neutral-100 hover:bg-slate-600' : 'border-neutral-200 bg-white text-slate-700 hover:bg-neutral-100'} px-4 py-3 text-sm font-medium  transition-colors  focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base`}>
                    <IconLoading dark={dark ? 'inbutton' : ''}/>
                    <span className="ml-2.5">Processing...</span>
                  </div>
                  ):(
                      <div
                        className={`transition relative inline-flex flex-1 w-full h-auto cursor-pointer items-center justify-center rounded-xl border ${dark ? 'border-slate-700 bg-slate-700 text-neutral-100 hover:bg-slate-600' : 'border-neutral-200 bg-white text-slate-700 hover:bg-neutral-100'} px-4 py-3 text-sm font-medium  transition-colors  focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base`}
                        onClick={() => openOfferSetting('block')}
                      >
                        <IconOffer />
          
                        <span className="ml-2.5"> Make an offer</span>
                      </div>  
                )}
          </>
        )}

        {listed &&
          auctionItem &&
          listingData.sellerAddress != address && (
            <>
              {bidLoading ? (
                <div className="gradBlue relative inline-flex h-auto flex-1 cursor-wait items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base">
                  <IconLoading dark="inbutton" />
                  <span className="ml-2.5">Processing...</span>
                </div>
              ) : (
                <div
                  className="gradBlue relative inline-flex h-auto flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base"
                  onClick={() => openBidSetting('block')}
                >
                  <IconWallet />
                  <span className="ml-2.5">Make a Bid</span>
                </div>
              )}
            </>
          )}
      </div>
      <div className={`offerSetting w-full mt-4 p-4 rounded-xl hidden ${dark ? 'bg-slate-800' : 'bg-neutral-100'} ${offerLoading ? 'pointer-events-none opacity-40' : ''}`} ref={settingRef}>
          <div className="flex flex-wrap gap-4">
            <div className="inputControls flex flex-1">
              <div className={`text-sm p-3 border rounded-l-xl ${dark ? 'bg-slate-800 border-slate-700' : 'bg-neutral-200 border-neutral-200'}`}>WMATIC</div>
              <input 
                type="number" 
                className={`border flex-1  text-sm p-3 ring-0 outline-0 rounded-r-xl ${dark ? 'bg-slate-700 border-slate-700/50' : 'bg-white border-neutral-200 border-l-0'}`} 
                placeholder="Enter amount to offer"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)} />
            </div>
            <div className="buttonControls flex flex-1">
              <button 
                className={`gradBlue p-3 text-white rounded-xl px-6 flex items-center gap-2 w-full justify-center`}
                onClick={() => makeAnOffer()}>
                  <MdOutlineCheckCircle /> Offer
              </button>
              <button 
                className={`${dark ? 'bg-slate-700 border-slate-600 hover:bg-slate-500' :'bg-white hover:bg-blue-600 text-slate-800 hover:text-white border-netural-200'} transition border p-3 text-white items-center rounded-xl ml-3 px-6 flex gap-2 w-full justify-center`}
                onClick={() => openOfferSetting('none')}>
                  <MdOutlineCancel /> Cancel
              </button>
            </div>
          </div>
          <p className="text-neutral-500 mt-2 text-center text-xs">You need to have Wrapped MATIC Token to make an offer.</p>
        </div>

        <div className={`offerSetting w-full mt-4 p-4 rounded-xl hidden ${dark ? 'bg-slate-800' : 'bg-neutral-100'} ${bidLoading ? 'pointer-events-none opacity-40' : ''}`} ref={bidsettingRef}>
          <div className="flex flex-wrap gap-4">
            <div className="inputControls flex flex-1">
              <div className={`text-sm p-3 border rounded-l-xl ${dark ? 'bg-slate-800 border-slate-700' : 'bg-neutral-200 border-neutral-200'}`}>MATIC</div>
              <input 
                type="number" 
                className={`border flex-1  text-sm p-3 ring-0 outline-0 rounded-r-xl ${dark ? 'bg-slate-700 border-slate-700/50' : 'bg-white border-neutral-200 border-l-0'}`} 
                placeholder="Enter amount to offer"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)} />
            </div>
            <div className="buttonControls flex flex-1">
              <button 
                className={`gradBlue p-3 text-white rounded-xl ml-3 px-6 flex items-center gap-2 w-full text-center justify-center`}
                onClick={() => bidItem()}>
                  <MdOutlineCheckCircle /> Bid
              </button>
              <button 
                className={`${dark ? 'bg-slate-700 border-slate-600 hover:bg-slate-500' :'bg-white hover:bg-blue-600 text-slate-800 hover:text-white border-netural-200'} transition border p-3 justify-center text-white items-center rounded-xl ml-3 px-6 flex gap-2 w-full text-center`}
                onClick={() => openBidSetting('none')}>
                  <MdOutlineCancel /> Cancel
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default MakeOffer
