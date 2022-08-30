import Head from 'next/head'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { CgSpinner } from 'react-icons/cg'
import { RiAuctionLine } from 'react-icons/ri'
import CoinSelection from './CoinSelection'
import { config } from '../../lib/sanityClient'
import { useChainId, useMarketplace, useAddress } from '@thirdweb-dev/react'
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk'
import 'react-datepicker/dist/react-datepicker.css'
import { MdClose, MdOutlineSell } from 'react-icons/md'
import React, { useEffect, useState, useRef } from 'react'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas'
import { IconLoading, IconWallet } from '../icons/CustomIcons'
import { saveTransaction } from '../../mutators/SanityMutators'
import { useMutation } from 'react-query'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { useQueryClient } from 'react-query'
import { NATIVE_TOKENS } from '@thirdweb-dev/sdk'
import { useThemeContext } from '../../contexts/ThemeContext'

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

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const Sell = ({ selectedNft, collectionAddress }) => {
  const { dark } = useThemeContext()
  const address = useAddress()
  const queryClient = useQueryClient()
  const { marketplaceAddress } = useMarketplaceContext()
  const marketPlaceModule = useMarketplace(marketplaceAddress)
  const directListingPanel = useRef()
  const auctionListingPanel = useRef()
  const chainid = useChainId()
  const [isOpen, setIsOpen] = useState(false)
  const [listingPrice, setListingPrice] = useState(0)
  const [buyoutPrice, setBuyoutPrice] = useState(0)
  const [reservePrice, setReservePrice] = useState(0)
  const [currency, setCurrency] = useState()
  const [buyoutcurrency, setBuyoutCurrency] = useState()

  useEffect(() => {
    if (!chainid) {
      return
    } else if (chainid == 80001) {
      setCurrency(NATIVE_TOKEN_ADDRESS)
      setBuyoutCurrency(NATIVE_TOKEN_ADDRESS)
    } else if (chainid == 4) {
      setCurrency(NATIVE_TOKEN_ADDRESS)
      setBuyoutCurrency(NATIVE_TOKEN_ADDRESS)
    }
  }, [chainid])

  // useEffect(() => {
  //   console.log(currency)
  // }, [currency])
  //   '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  // )
  //   '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  // )
  const [listingDuration, setListingDuration] = useState('')
  const [auctionDuration, setAuctionDuration] = useState('')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [startAuctionDate, setAuctionStartDate] = useState()
  const [endAuctionDate, setAuctionEndDate] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: mutateSaveTransaction } = useMutation(
    ({ transaction, collectionAddress, id, eventName, price, chainid }) =>
      saveTransaction({
        transaction,
        collectionAddress,
        id,
        eventName,
        price,
        chainid,
      }),
    {
      onError: () => {
        toast.error(
          'Error saving transaction. Contact administrator',
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
    setListingDuration(differenceInSeconds(endDate, startDate))
  }, [startDate, endDate])

  useEffect(() => {
    if (!startAuctionDate || !endAuctionDate) return
    setAuctionDuration(differenceInSeconds(endAuctionDate, startAuctionDate))
  }, [startAuctionDate, endAuctionDate])

  const directListItem = async (
    e,
    module = marketPlaceModule,
    toastHandler = toast
  ) => {
    if (!listingPrice) {
      toastHandler.error('Listing price not set.', errorToastStyle)
      return
    }
    if (!currency) {
      toastHandler.error('Listing currency not chosen.', errorToastStyle)
      return
    }
    // if (!listingDuration) {
    //   toastHandler.error('Listing duration not set.', errorToastStyle)
    //   return
    // }
    // if (listingDuration <= 0) {
    //   toastHandler.error(
    //     'Listing duration cannot be negative or zero.',
    //     errorToastStyle
    //   )
    //   return
    // }
    // console.log(ethers.utils.parseUnits(listingPrice,18).toString());
    setIsLoading(true)
    const listing = {
      //NFT Collection Contract Address
      assetContractAddress: collectionAddress,
      tokenId: selectedNft.metadata.id.toString(),
      startTimestamp: new Date(),
      listingDurationInSeconds: Number(listingDuration),
      quantity: 1,
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      buyoutPricePerToken: listingPrice,
    }
    // console.log(listing);
    try {
      const tx = await module.direct.createListing(listing)

      //saving transaction data
      mutateSaveTransaction({
        transaction: tx,
        collectionAddress: collectionAddress,
        id: selectedNft.metadata.id.toString(),
        eventName: 'List',
        price: listingPrice,
        chainid: chainid,
      })

      queryClient.invalidateQueries(['activities'])
      queryClient.invalidateQueries(['marketplace'])

      toastHandler.success(
        'NFT successfully listed in the marketplace.',
        successToastStyle
      )
    } catch (error) {
      toastHandler.error(error.message, errorToastStyle)
      console.error(error)
    }
    setIsLoading(false)
  }

  const auctionListItem = async (
    quantityDesired = 1,
    module = marketPlaceModule,
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
    if (!buyoutcurrency) {
      toastHandler.error('Listing currency not chosen.', errorToastStyle)
      return
    }
    if (!auctionDuration) {
      toastHandler.error('Listing duration not set.', errorToastStyle)
      return
    }
    if (auctionDuration <= 0) {
      toastHandler.error(
        'Listing duration cannot be negative or zero.',
        errorToastStyle
      )
      return
    }
    // console.log(ethers.utils.parseUnits(listingPrice,18).toString());
    setIsLoading(true)
    const auction = {
      //NFT Collection Contract Address
      assetContractAddress: collectionAddress,
      tokenId: selectedNft.metadata.id.toString(),
      startTimestamp: new Date(),
      listingDurationInSeconds: Number(listingDuration),
      quantity: 1,
      currencyContractAddress: currency,
      buyoutPricePerToken: buyoutPrice,
      reservePricePerToken: reservePrice,
    }
    // console.log(listing);
    try {
      const tx = await module.auction.createListing(auction)
      const receipt = tx.receipt
      const newListingId = tx.id
      toastHandler.success(
        'NFT successfully auctioned in the marketplace.',
        successToastStyle
      )

      // console.log(tx)
      // console.log(receipt)
      // console.log(newListingId)

      //saving transaction data
      mutateSaveTransaction({
        transaction: tx,
        collectionAddress: collectionAddress,
        id: selectedNft.metadata.id.toString(),
        eventName: 'Auction',
        price: buyoutPrice,
        chainid: chainid,
      })

      //saving transaction data
      const transactionData = {
        _type: 'activities',
        _id: receipt.transactionHash,
        transactionHash: receipt.transactionHash,
        from: receipt.from,
        to: receipt.to,
        event: 'Auction',
        price: buyoutPrice,
        chainId: chainid,
      }

      setAuctionDuration('')
      setAuctionStartDate('')
      setAuctionEndDate('')

      // window.location.reload(false); //refresh the page
    } catch (error) {
      toastHandler.error(error.message, errorToastStyle)
      console.error(error)
    }
    setIsLoading(false)
  }

  const showDirect = () => {
    if (!address) return
    directListingPanel.current.style.visibility = 'visible'
    auctionListingPanel.current.style.visibility = 'hidden'
  }

  const showAuction = () => {
    if (!address) return
    directListingPanel.current.style.visibility = 'hidden'
    auctionListingPanel.current.style.visibility = 'visible'
  }
  //show direct listing by default
  useEffect(() => {
    if (!address) return
    showDirect()
  }, [])
  return (
    <>
      <Head>
        <script
          src="https://unpkg.com/flowbite@1.4.7/dist/datepicker.js"
          defer
        ></script>
      </Head>
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
              className="gradBlue relative inline-flex h-auto w-full flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base"
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
                      className="directListing flex grow cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-700 p-5 transition hover:bg-slate-800"
                      onClick={showDirect}
                    >
                      <MdOutlineSell fontSize="25px" />
                      <span className="text-md text-white">Direct Listing</span>
                    </div>
                    <div
                      className="autionListing flex grow cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-700 p-5 transition hover:bg-slate-800"
                      onClick={showAuction}
                    >
                      <RiAuctionLine fontSize="25px" /> Auction Listing
                    </div>
                  </div>
                  <div
                    className="directListingPanel absolute top-[130px] w-full"
                    ref={directListingPanel}
                  >
                    <div className="">
                      <p className={style.label}>Price*</p>
                      <div className="flex flex-row items-center gap-5">
                        <CoinSelection />
                        <input
                          className={style.input}
                          style={{ margin: '0' }}
                          type="text"
                          name="listingPrice"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className={style.label}>Duration</p>
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
                      <span>2.5%</span>
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
                  <div
                    className="auctionListingPanel absolute top-[130px] w-full"
                    ref={auctionListingPanel}
                  >
                    <div className="">
                      <p className={style.label}>Buyout Price*</p>
                      <div className="flex flex-row items-center gap-5">
                        <CoinSelection />
                        <input
                          className={style.input}
                          style={{ margin: '0' }}
                          type="number"
                          name="buyoutPrice"
                          value={buyoutPrice}
                          onChange={(e) => setBuyoutPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative mt-4 w-full">
                      <p className={style.label}>Minimum Bidding Price*</p>
                      <input
                        className={style.input}
                        style={{ margin: '0', width: '100%' }}
                        type="number"
                        name="minimumPrice"
                        value={reservePrice}
                        onChange={(e) => setReservePrice(e.target.value)}
                      />
                    </div>

                    <div className="pt-4">
                      <p className={style.label}>Duration*</p>
                      <p className={style.smallText}>List this NFT for only specified period of time.</p>
                      <div className="flex flex-col items-center">
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
                      <span>2.5%</span>
                    </div>

                    <div className="pt-8">
                      {isLoading ? (
                        <button
                          className={style.button}
                          style={{ opacity: '0.8', cursor: 'disabled' }}
                          disabled
                        >
                          <CgSpinner className="animate-spin" fontSize="20px" />{' '}
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
                </div>
              </>
            )}
            {!address && <>ConnectWallet</>}
          </OffCanvasMenu>
        </OffCanvas>
      </div>
    </>
  )
}

export default Sell
