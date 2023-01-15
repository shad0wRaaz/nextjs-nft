import axios from 'axios'
import toast from 'react-hot-toast'
import { MdAdd } from 'react-icons/md'
import { FiCheck } from 'react-icons/fi'
import { useQueryClient } from 'react-query'
import { AiOutlineFire } from 'react-icons/ai'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../../lib/sanityClient'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import { IconLoading } from '../icons/CustomIcons'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { useAddress, useChainId, useNetwork, useSigner } from '@thirdweb-dev/react'


const BurnCancel = ({nftContractData, listingData, collectionAddress, thisNFTMarketAddress, thisNFTblockchain}) => {
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const address = useAddress();
    const chainid = useChainId();
    const router = useRouter();
    const { selectedBlockchain } = useMarketplaceContext()
    const { setLoadingNewPrice } = useSettingsContext();
    const [showBurnModal, setBurnModal] = useState(false);
    const [showCancelModal, setCancelModal] = useState(false);
    const queryClient = useQueryClient();
    const [isCanceling, setIsCanceling] = useState(false);
    const [isBurning, setIsBurning] = useState(false);
    const signer = useSigner();
    const [,switchNetwork] = useNetwork();


    const cancelListing = (
        e,
        sanityClient = config,
        toastHandler = toast,
      ) => {
        if (!Boolean(listingData)) return
        
        if(!signer) {
          toast.error("Wallet not connected.", errorToastStyle);
          return
        }

        ;(async () => {
          try {
            setCancelModal(false);
            setIsCanceling(true);

            const sdk = new ThirdwebSDK(signer);
            const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");

            const tx = await contract.direct.cancelListing(listingData.id)
            // console.log(tx.receipt)
            if (tx) {
              toastHandler.success('The NFT has been delisted from the marketplace.', successToastStyle)
    
              //saving transaction in sanity
              const transactionData = {
                _type: 'activities',
                _id: tx.receipt.transactionHash,
                transactionHash: tx.receipt.transactionHash,
                from: tx.receipt.from,
                tokenid: nftContractData.metadata.id.toString(),
                to: tx.receipt.to,
                event: 'Delist',
                nftItem: { _ref: nftContractData.metadata.properties.tokenid, _type: 'reference'},
                price: '-',
                chainId: chainid,
                dateStamp: new Date(),
              }

              // console.log(transactionData)
              await sanityClient
                .createIfNotExists(transactionData)
                .then(() => {
                  queryClient.invalidateQueries(['marketplace']);
                  queryClient.invalidateQueries(['activities']);
                  
                })
                .catch((err) => {
                  console.log(err);
                  toastHandler.error('Error saving Transaction Activity. Contact administrator.', errorToastStyle);
                    setIsCanceling(false);
                    return
                  })
                  
                  //update listing data
                  ;(async() => {
                    setLoadingNewPrice(true);
                    await axios.get(process.env.NODE_ENV == 'production' ? `https://nuvanft.io:8080/api/updateListings/${thisNFTblockchain}` : `http://localhost:8080/api/updateListings/${thisNFTblockchain}`).then(() => {
                      setIsCanceling(false);
                      setLoadingNewPrice(false);
                      router.reload(window.location.pathname);
                      router.replace(router.asPath);
                    })
                  })()
            }
          } catch (err) {
            console.error(err);
            toastHandler.error('Error in delisting this NFT.', errorToastStyle);
            setIsCanceling(false);
            return
          }
        })()
      }
    // console.log(listingData)
    const burn = (e, sanityClient = config, toastHandler = toast) => {
      
      if (!Boolean(listingData?.message == 'NFT data not found')) {
        toastHandler.error('Cannot burn a listed NFT. Delist this NFT first.', errorToastStyle);
        setBurnModal(false);
        return
      }
      
      if(!contract) {
        toast.error("Collection not found", errorToastStyle);
        return
      }

      if(!signer){
        toast.error("Wallet not connected.", errorToastStyle);
        return;
      }
      
      try {
          ;(async () => {
            const query = `*[_type == "nftCollection" && contractAddress == "${collectionAddress}"] {chainId}`;
            const sanitydata = await sanityClient.fetch(query);
            
            if(Number(sanitydata[0]?.chainId) != chainid){
              toast.error("Wallet is connected to wrong chain. Switching to correct chain.", errorToastStyle);
              return;
            }

            setIsBurning(true);
            setBurnModal(false);

            const sdk = new ThirdwebSDK(signer);
            const contract = await sdk.getContract(collectionAddress, "nft-collection");
              
              const tx = await contract.burn(nftContractData.metadata.id)

              //saving transaction in sanity
              const transactionData = {
                _type: 'activities',
                _id: tx.receipt.transactionHash,
                transactionHash: tx.receipt.transactionHash,
                from: tx.receipt.from,
                tokenid: nftContractData.metadata.id.toString(),
                contractAddress: collectionAddress,
                to: tx.receipt.to,
                event: 'Burn',
                nftItem: { _ref: nftContractData.metadata.properties.tokenid, _type: 'reference'},
                price: '-',
                chainId: chainid,
                dateStamp: new Date(),
              }

            await sanityClient
              .createIfNotExists(transactionData)
              .then(() => {
                queryClient.invalidateQueries(['marketplace']);
                queryClient.invalidateQueries(['activities']);
                queryClient.invalidateQueries(['user']);
                
                //update listing data
                ;(async() => {
                  await axios.get(process.env.NODE_ENV == 'production' ? `https://nuvanft.io:8080/api/updateListings/${thisNFTblockchain}` : `http://localhost:8080/api/updateListings/${thisNFTblockchain}`).then(() => {
                    router.reload(window.location.pathname);
                    router.replace(router.asPath);
                  })
                })()
              })
              .catch((err) => {
              console.log(err);
              toastHandler.error('Error saving Transaction Activity. Contact administrator.', errorToastStyle);
              return
            })
            setIsBurning(false);
          })();
      } catch (error) {
      toastHandler.error(error, errorToastStyle)
      setIsBurning(false);
      }
    }

  return (
    <>
    {showBurnModal && (
        <div className="fixed w-full h-full bg-slate-700 bg-opacity-75 top-0 left-0 z-30 backdrop-blur-sm flex align-items-center justify-center">
            <div className={`relative w-[500px] rounded-xl py-[2em] px-[3em] ${dark ? 'bg-slate-800' : 'bg-slate-50'} m-auto`}>
                <p className="fw-700 text-base">Are you sure you want to burn this NFT?</p>
                <p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Burning does not mean deleting the NFT. It will only be made unclaimable by anyone. <span className="text-red-500">This action is irreverible!</span></p>
                <div className="flex gap-4 mt-4">
                    <div 
                        className="bg-red-500 w-full text-center hover:bg-red-600 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                        onClick={() => burn()}>
                        <FiCheck className="inline-block text-lg" /> <span className="inline-block ml-1"> Yes, I am sure.</span>
                    </div>
                    <div 
                        className="bg-neutral-300 text-slate-700 w-full text-center hover:bg-neutral-400 hover:text-slate-50 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                        onClick={() => setBurnModal(false)}>
                        <MdAdd className="inline-block text-xl -mt-1 rotate-45" /> <span className="inline-block"> Cancel</span>
                    </div>
                </div>
            </div>
        </div>
    )}
    {showCancelModal && (
        <div className="fixed w-full h-full bg-slate-700 bg-opacity-75 top-0 left-0 z-30 backdrop-blur-sm flex align-items-center justify-center">
            <div className={`relative w-[500px] rounded-xl py-[2em] px-[3em] ${dark ? 'bg-slate-800' : 'bg-slate-50'} m-auto`}>
                <p className="fw-700 text-base">Are you sure you want to cancel listing of this NFT from the marketplace ?</p>
                <div className="flex gap-4 mt-4">
                    <div 
                        className="bg-red-500 w-full text-center hover:bg-red-600 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                        onClick={() => cancelListing()}>
                        <FiCheck className="inline-block text-lg" /> <span className="inline-block ml-1"> Yes, I am sure.</span>
                    </div>
                    <div 
                        className="bg-neutral-300 text-slate-700 w-full text-center hover:bg-neutral-400 hover:text-slate-50 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                        onClick={() => setCancelModal(false)}>
                        <MdAdd className="inline-block text-xl -mt-1 rotate-45" /> <span className="inline-block"> Cancel</span>
                    </div>
                </div>
            </div>
        </div>
    )}
    {nftContractData.owner == address && (
        <div className={`flex items-center flex-1 justify-center p-4 rounded-lg mt-4  ${dark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
            {!Boolean(listingData?.message) && (
              <>
                {isCanceling ? (
                  <button
                      className="flex gap-2 justify-center bg-slate-500 hover:bg-slate-600 w-full text-center mr-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                      disabled>
                        <IconLoading dark="inbutton" />
                          <span className="inline-block ml-1">Processing</span>
                  </button>
                ) : (
                <button
                    className="bg-slate-500 hover:bg-slate-600 w-full text-center mr-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                    onClick={() => setCancelModal(true)}>
                        <RiCloseCircleLine className="inline-block text-lg -mt-1" /> <span className="inline-block ml-1">Cancel Listing</span>
                </button>
                )}
              </>
            )}
            {isBurning ? (
              <button 
                  className="flex gap-2 justify-center bg-red-500 w-full text-center hover:bg-red-600 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                  disabled>
                  <IconLoading dark="inbutton" /> <span className="inline-block ml-1"> Burning NFT</span>
              </button>
            ):(
              <button 
                  className="bg-red-500 w-full text-center hover:bg-red-600 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                  onClick={() => setBurnModal(true)}>
                  <AiOutlineFire className="inline-block text-lg -mt-1" /> <span className="inline-block ml-1"> Burn NFT</span>
              </button>
            )}
        </div>
    )}
    </>
  )
}

export default BurnCancel