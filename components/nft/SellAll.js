import { useActiveChain, useAddress, useSigner } from '@thirdweb-dev/react';
import Script from 'next/script'
import { v4 as uuidv4 } from 'uuid'
import React, { useEffect, useState } from 'react'
import { MdClose, MdDeleteOutline, MdOutlineSell } from 'react-icons/md';
import { RiAuctionLine } from 'react-icons/ri';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
import { config } from '../../lib/sanityClient'
import { NATIVE_TOKEN_ADDRESS, ThirdwebSDK } from '@thirdweb-dev/sdk'
import { IconAvalanche, IconBNB, IconEthereum, IconLoading, IconPolygon } from '../icons/CustomIcons';
import { getImagefromWeb3 } from '../../fetchers/s3';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import { activateReferral } from '../../mutators/SanityMutators'
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

const blockchainCurrency = {
    "80001" : {currency: "MATIC", icon: <IconPolygon />, DATABASE_COIN_NAME: "maticprice"},
    "137": {currency: "MATIC", icon: <IconPolygon />, DATABASE_COIN_NAME: "maticprice"},
    "5": {currency: "ETH", icon: <IconEthereum />, DATABASE_COIN_NAME: "ethprice"},
    "1": {currency: "ETH", icon: <IconEthereum />, DATABASE_COIN_NAME: "ethprice"},
    "97": {currency: "TBNB", icon: <IconBNB />, DATABASE_COIN_NAME: "bnbprice"},
    "56": {currency: "BNB", icon: <IconBNB />, DATABASE_COIN_NAME: "bnbprice"},
    "43114": {currency: "AVAX", icon: <IconAvalanche />, DATABASE_COIN_NAME: "avaxprice"},
    "43113":{currency: "AVAX", icon: <IconAvalanche />, DATABASE_COIN_NAME: "avaxprice"},
    }

const SellAll = ({nfts, collectionData, marketContractAddress, marketData}) => {
    const router = useRouter();
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const activeChain = useActiveChain();
    const address = useAddress();
    const signer = useSigner();
    const { myUser } = useUserContext();
    const { coinPrices, HOST, blockchainName } = useSettingsContext();
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
    const [batchListingData, setBatchListingData] = useState([]);
    const [includedNfts, setIncludedNfts] = useState([]);

    //include only non-listed nfts to be in the list
    useEffect(() => {
        if(!nfts) return;

        const nonlistedNfts = nfts.filter(nft => 
        {
            const returndata = marketData.some(mdata => (mdata.assetContractAddress.toLowerCase() == nft.tokenAddress.toLowerCase() && mdata.asset.id == nft.tokenId));
            return !returndata;
        }).filter(nft => Boolean(nft.metadata)); //also remove all nfts with no metadata
        setIncludedNfts(nonlistedNfts)

        return() => {
            //do nothing, clean up function
        }
    }, []);

    const style = {
        canvasMenu:
          'bg-slate-900 h-[100vh] shadow-xl px-[2rem] overflow-y-scroll z-20 text-white',
        blur: 'filter: blur(1px)',
        closeButton:
            'absolute transition duration-[300] top-[20px] right-[20px] rounded-md bg-[#ef4444] text-white p-1 hover:opacity-70 z-30',
        smallText: 'text-sm m-2 mt-0 mb-0 leading-4',
        subHeading:
          'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
        input:
          `m-2 grow outline-none p-3 ${dark? 'bg-slate-700 hover:bg-slate-600' : 'bg-neutral-100 hover:bg-neutral-200'} rounded-[0.4rem]  transition linear`,
        label: 'text-small m-2 mt-4',
        button:
          'flex gap-2 items-center gradBlue rounded-xl cursor-pointer p-3 px-6 ease-linear transition text-white',
      }

    useEffect(() => {
    const t = collectionData.chainId;
    // console.log(t)
    if(!t) return
    if(t == "80001" || t == "137") { setThisNFTBlockchainCurrency(coinPrices?.maticprice); } 
    else if(t == "1" || t == "5") { setThisNFTBlockchainCurrency(coinPrices?.ethrice); }
    else if (t == "56" || t == "97") { setThisNFTBlockchainCurrency(coinPrices?.bnbprice); }
    else if(t == "43113" || t == "43114") { setThisNFTBlockchainCurrency(coinPrices?.avaxprice); }

    if(activeChain.chainId != t) {
        toast.error('Wallet is connected to wrong chain. Switching network now.', errorToastStyle);
        return;
        // switchNetwork(Number(blockchainId[thisNFTblockchain]));
    }
    return() => {
        // do nothing
    } 
    }, [collectionData]);

    const { mutate: activate } = useMutation(
        () => activateReferral(address), {
          onError: (err) => {
            console.log(err);
          },
          onSuccess: (res) => {
            // console.log('Referral Activated');
          }
        }
      );

    const directListItem = async (e, toastHandler = toast, sanityClient = config) => {
        if(!listingPrice){
            toastHandler.error('Listing price not set', errorToastStyle);
            return;
        }
        if(!collectionData){
            toastHandler.error('NFT Collection could not be location', errorToastStyle);
            return;
        }
        // if(batchListingData.length == 0){
        //     toastHandler.error("Error building listing data", errorToastStyle);
        //     return;
        // }
        if(includedNfts.length == 0){
            toastHandler.error("No NFTs are seleted to list", errorToastStyle);
            return;
        }

        setIsLoading(true);
        //generate listing metadata

        let listings = [];
        if(includedNfts.length > 0){
            includedNfts.map(nft => {
                const listing = {
                    quantity: 1,
                    startTimestamp: new Date(),
                    buyoutPricePerToken: Number(listingPrice),
                    tokenId: nft.tokenId,
                    currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                    assetContractAddress: collectionData.contractAddress,
                    listingDurationInSeconds: Number(listingDuration) || 31449600,
                  }
                listings.push(listing);
            });
        }
        
        if(listings.length == 0){
            toastHandler.error('No NFT is selected to list', errorToastStyle);
            return;
        }

        try{
            const sdk = new ThirdwebSDK(signer);
            const contract = await sdk.getContract(marketContractAddress, "marketplace");
            
            const tx = await contract?.direct.createListingsBatch(listings);
            // console.log(tx);
            if(collectionData.floorPrice > Number(listingPrice)){
                //update Floor Price
                await sanityClient
                .patch(collectionData?._id)
                .set({ 'floorPrice': Number(listingPrice)})
                .commit();
            }

            //saving transactions in database
            const newItems = includedNfts?.map(item => {
                const itemref = { _ref: item.metadata.properties.tokenid, _type: 'reference', _key: uuidv4() };
                return itemref;
              });

            const doc = {
                _type: 'activities',
                _id: tx[0].receipt.transactionHash, 
                transactionHash: tx[0].receipt.transactionHash,
                nftItems: newItems,
                from: tx[0].receipt.from,
                to: tx[0].receipt.to,
                event: 'List',
                price: listingPrice.toString(),
                chainId: activeChain.chainId,
                dateStamp: new Date(),
                }
                console.log(doc)
                await sanityClient.createIfNotExists(doc)

            //update listing data
            ;(async() => {
                await axios.get(`${HOST}/api/updateListings/${blockchainName[activeChain.chainId]}`).finally(() => {
                toastHandler.success("NFTs successfully listed in the marketplace. Please wait for a while. Getting NFT's latest price from the marketplace.", successToastStyle);
                router.reload(window.location.pathname);
                router.replace(router.asPath);
                }).catch(err => {console.log(err)})
            })()

            //activate referral system, only if not activated
            if(!myUser?.refactivation){
                activate(address);
            }

        }catch(error){
            console.log(error)
            setIsLoading(false);
        }
    }
    
    const auctionListItem = () => {}
    
    // useEffect(() => {
    //     if(!nfts) return
    //     //create arrays of listings data
    //     let listings = [];
    //     if(nfts.length > 0){
    //         nfts.map(nft => {
    //             const listing = {
    //                 quantity: 1,
    //                 startTimestamp: new Date(),
    //                 buyoutPricePerToken: Number(listingPrice),
    //                 tokenId: nft.metadata.id.toString(),
    //                 currencyContractAddress: NATIVE_TOKEN_ADDRESS,
    //                 assetContractAddress: collectionData.contractAddress,
    //                 listingDurationInSeconds: Number(listingDuration) || 31449600,
    //               }
    //             listings.push(listing);
    //         });
    //     }
    //     setBatchListingData(listings)
    // }, [nfts, listingPrice]);

    const handleRemove = (id) => {
        if(includedNfts.length == 0) return
        const tempArr = includedNfts.filter((nft,index) => index!=id);
        setIncludedNfts([...tempArr])
    }

  return (
    <div>
        <Script src="https://unpkg.com/flowbite@1.4.7/dist/datepicker.js" />
        <div className="flex flex-col md:flex-row">
            <div className="w-full lg:w-1/3">
                <span>NFTs to be listed</span>
                <div className=" max-h-[520px] overflow-scroll pt-3">
                    {includedNfts.length > 0 && includedNfts.map((nft, index) => (
                        <div key={index}>
                        {Boolean(nft.metadata) && (
                            <div className={`${dark ? 'border-slate-600 hover:bg-slate-700' : 'border-neutral-100 hover:bg-neutral-100'} group transition border border-dashed p-2 rounded-lg lg:mr-5 mb-5 lg:mb-0 flex justify-between mt-2 relative`}>
                                <div className="text-sm">
                                    <img 
                                        src={nft.metadata?.image.startsWith('ipfs') ? getImagefromWeb3(nft.metadata?.image) : nft.metadata?.image}
                                        className="w-[30px] h-[30px] object-cover rounded-md mr-1 inline-block" /> {nft.metadata.name}
                                </div>
                                <div 
                                    className="cursor-pointer hidden group-hover:flex absolute top-1 right-1 p-0.5 rounded-md bg-red-500 hover:bg-red-400 justify-center items-center"
                                    onClick={() => handleRemove(index)}>
                                    <MdDeleteOutline />
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative flex md:w-full  lg:w-2/3 flex-col gap-5 mt-5 md:mt-0">
                Choose type of listing
                <div className="flex flex-row gap-4">
                <div
                    className={`directListing w-fit flex grow cursor-pointer items-center justify-center gap-3 rounded-xl border p-2 ${directorauction ? 'bg-slate-600 border-slate-500' :'border-slate-700'} transition hover:bg-slate-700`}
                    onClick={() => setdirectorauction(true)}
                >
                    <MdOutlineSell fontSize="25px" />
                    <span className="text-md text-white">Direct Listing</span>
                </div>
                <div
                    className={`autionListing flex w-fit grow cursor-pointer items-center justify-center gap-3 rounded-xl border p-2 ${!directorauction ? 'bg-slate-600 border-slate-500' :'border-slate-700'} transition hover:bg-slate-700`}
                    onClick={() => setdirectorauction(false)}
                >
                    <RiAuctionLine fontSize="25px" /> Auction Listing
                </div>
                </div>
                {directorauction ? (
                    <div className="w-full">
                        <div className="">
                        <p className={style.label}>Price*</p>
                        <div className="flex flex-row items-center gap-2">
                            <input
                            className={style.input}
                            style={{ margin: '0' }}
                            type="number"
                            name="listingPrice"
                            value={listingPrice}
                            onChange={(e) => setListingPrice(e.target.value)}
                            />
                            <div className={`text-sm inline-flex justify-center items-center rounded-md ${dark ? 'bg-slate-700' : 'bg-neutral-100'} p-3 py-3.5 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
                                {blockchainCurrency[collectionData.chainId].icon}
                                {blockchainCurrency[collectionData.chainId].currency}
                            </div>
                        </div>
                        <div className="p-2 text-sm">
                            ≈ $ {parseFloat(listingPrice * thisNFTBlockchainCurrency).toFixed(2)} 
                            <span className="text-sm text-slate-500 pl-2">(1 {blockchainCurrency[collectionData.chainId].currency} = ${thisNFTBlockchainCurrency})</span>
                        </div>
                        </div>

                        <div className="pt-4">
                        <p className={style.label}>Duration <span className="text-xs opacity-40">(Optional)</span></p>
                        <p className={style.smallText}>List this NFT for only selected period of time</p>
                        <div className="flex flex-row flex-wrap items-center mt-4">
                            <div className="relative w-full md:w-1/2 p-2">
                            <div className="pointer-events-none absolute inset-y-2 left-4 z-10 flex h-[40px] items-center pl-1">
                                From:
                            </div>
                            <div className="pointer-events-none absolute inset-y-2 right-4 z-10 flex h-[40px] items-center pl-1">
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
                                className={`opacity-1 block w-full cursor-pointer ring-0 outline-none rounded-lg ${dark? 'bg-slate-700 hover:bg-slate-600' :'bg-neutral-100 hover:bg-neutral-200'} p-2.5 pl-[4rem] text-slate-200 sm:text-sm`}
                            />
                            </div>
                            <div className="relative w-full md:w-1/2 p-2">
                            <div className="pointer-events-none absolute inset-y-2 left-4 z-10 flex h-[40px] items-center pl-3">
                                To:
                            </div>
                            <div className="pointer-events-none absolute inset-y-2 right-4 z-10 flex h-[40px] items-center pl-3">
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
                                className={`opacity-1 block w-full cursor-pointer ring-0 outline-none rounded-lg ${dark? 'bg-slate-700 hover:bg-slate-600' :'bg-neutral-100 hover:bg-neutral-200'} p-2.5 pl-[4rem] text-slate-200 sm:text-sm`}
                            />
                            </div>
                        </div>
                        </div>

                        <div className="flex justify-start pt-4 gap-3">
                        <span>Platform Fees: </span>
                        <span>5%</span>
                        </div>

                        <div className="pt-4">
                        {isLoading ? (
                            <button className={ style.button + ' cursor-not-allowed opacity-80' } disabled>
                                <IconLoading dark="inbutton" />
                                Processing...
                            </button>
                        ) : (
                            <button className={style.button + ' m-0'} onClick={() => directListItem()} style={{ opacity: '1' }}>
                            <MdOutlineSell fontSize="20px" /> Sell
                            </button>
                        )}
                        </div>
                    </div>
                ): (
                <div className=" w-full">
                    <div className="flex flex-row flex-wrap justify-between">
                        <div className="w-full">
                            <p className={style.label}>Buyout Price*</p>
                            <div className="flex flex-row items-center gap-2">
                            <input
                                className={style.input + ' md:w-20'}
                                style={{ margin: '0' }}
                                type="number"
                                name="buyoutPrice"
                                value={buyoutPrice}
                                onChange={(e) => setBuyoutPrice(e.target.value)}
                            />
                            <div className={`text-sm inline-flex justify-center items-center rounded-md ${dark ? 'bg-slate-700' : 'bg-neutral-100'} p-3.5 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
                                {blockchainCurrency[collectionData.chainId].icon}
                                {blockchainCurrency[collectionData.chainId].currency}
                            </div>
                            </div>
                            <div className="p-2 text-sm">
                            ≈ $ {parseFloat(buyoutPrice * thisNFTBlockchainCurrency).toFixed(2)} 
                            <span className="text-sm text-slate-500 pl-2">(1 {blockchainCurrency[collectionData.chainId].currency} = ${thisNFTBlockchainCurrency})</span>
                            </div>
                        </div>

                        <div className="w-full">
                            <p className={style.label}>Minimum Bidding Price*</p>
                            <div className="flex flex-row items-center gap-2">
                            <input
                                className={style.input + ' md:w-[140px]'}
                                style={{ margin: '0' }}
                                type="number"
                                name="minimumPrice"
                                value={reservePrice}
                                onChange={(e) => setReservePrice(e.target.value)}
                            />
                            <div className={`text-sm inline-flex justify-center items-center rounded-md ${dark ? 'bg-slate-700' : 'bg-neutral-100'} p-3.5 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
                                {blockchainCurrency[collectionData.chainId].icon}
                                {blockchainCurrency[collectionData.chainId].currency}
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                    <p className={style.label}>Duration <span className="text-xs opacity-40">(Optional)</span></p>
                    <p className={style.smallText}>List this NFT for only specified period of time.</p>
                    <div className="flex flex-row flex-wrap items-center mt-4">
                        <div className="relative w-full md:w-1/2 p-2">
                        <div className="pointer-events-none absolute inset-y-2 left-4 z-10 flex h-[40px] items-center pl-1">
                            From:
                        </div>
                        <div className="pointer-events-none absolute inset-y-2 right-4 z-10 flex h-[40px] items-center pl-1">
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
                            className={`opacity-1 block w-full cursor-pointer ring-0 outline-none rounded-lg ${dark? 'bg-slate-700 hover:bg-slate-600' :'bg-neutral-100 hover:bg-neutral-200'} p-2.5 pl-[4rem] text-slate-200 sm:text-sm`}
                        />
                        </div>
                        <div className="relative w-full md:w-1/2 p-2">
                        <div className="pointer-events-none absolute inset-y-2 left-4 z-10 flex h-[40px] items-center pl-1">
                            To:
                        </div>
                        <div className="pointer-events-none absolute inset-y-2 right-4 z-10 flex h-[40px] items-center pl-1">
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
                            className={`opacity-1 block w-full cursor-pointer ring-0 outline-none rounded-lg ${dark? 'bg-slate-700 hover:bg-slate-600' :'bg-neutral-100 hover:bg-neutral-200'} p-2.5 pl-[4rem] text-slate-200 sm:text-sm`}
                        />
                        </div>
                    </div>
                    </div>

                    <div className="flex justify-start pt-4 gap-3">
                    <span>Platform Fees: </span>
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
        </div>
    </div>
  )
}

export default SellAll