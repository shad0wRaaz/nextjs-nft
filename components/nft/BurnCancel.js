import axios from 'axios'
import toast from 'react-hot-toast'
import { MdAdd } from 'react-icons/md'
import { FiCheck } from 'react-icons/fi'
import { useMutation, useQueryClient } from 'react-query'
import { BiTransferAlt } from 'react-icons/bi'
import { AiOutlineFire } from 'react-icons/ai'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../../lib/sanityClient'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import { IconLoading, IconWallet } from '../icons/CustomIcons'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { useAddress, useChainId, useSigner, useSwitchChain } from '@thirdweb-dev/react'
import { updateBoughtNFTs } from '../../mutators/SanityMutators'


const BurnCancel = ({nftContractData, listingData, auctionItem, nftCollection, thisNFTMarketAddress, ownerData, thisNFTblockchain}) => {
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const address = useAddress();
    const chainid = useChainId();
    const router = useRouter();
    const { selectedBlockchain } = useMarketplaceContext()
    const { setLoadingNewPrice, HOST, referralAllowedCollections } = useSettingsContext();
    const [showBurnModal, setBurnModal] = useState(false);
    const [showCancelModal, setCancelModal] = useState(false);
    const queryClient = useQueryClient();
    const [isCanceling, setIsCanceling] = useState(false);
    const [isBurning, setIsBurning] = useState(false);
    const signer = useSigner();
    const [isTransfer, setIsTransfer] = useState(false);
    const [transferModal, setTransferModal] = useState(false);
    const [transferAddress, setTransferAddress] = useState('');
    const switchChain = useSwitchChain();

    const { mutate: changeBoughtNFTs } = useMutation(
      ({ walletAddress, chainId, contractAddress, tokenId, payablelevel, type}) => updateBoughtNFTs({ walletAddress, chainId, contractAddress, tokenId, payablelevel, type}),
      {
        onError: (err) => { console.log(err); },
        onSuccess: (res) => { 
          // console.log(res)
        }
      }
    )

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
        
        if(chainid != nftCollection?.chainId){
          toast.error("Wallet is connected to wrong chain. Switching to correct chain.", errorToastStyle);
          switchChain(Number(nftCollection?.chainId)).catch((err) => {
            toast.error('Error in changing chain. Please change chain manually', errorToastStyle);
          })
          return;
        }
        
        
        ;(async () => {
          try {
            setCancelModal(false);
            setIsCanceling(true);
            
            const sdk = new ThirdwebSDK(signer);
            const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace-v3");
            let tx = '';
            // console.log(auctionItem)
            if(listingData?.type  == 0){
              tx = await contract.directListings
              .cancelListing(listingData.id)
              .catch(err => {
                if(err.reason == 'user rejected transaction'){
                  toastHandler.error('Transaction rejected via wallet', errorToastStyle);
                }
                setIsCanceling(false);
                setLoadingNewPrice(false);
              });
            }else{
              tx = await contract.englishAuctions
              .cancelAuction(listingData.id)
              .catch(err => {
                if(err.reason == 'user rejected transaction'){
                  toastHandler.error('Transaction rejected via wallet', errorToastStyle);
                }
                setIsCanceling(false);
                setLoadingNewPrice(false);
              });
            }
            
            if (tx) {
    
              //saving transaction in sanity
              // const transactionData = {
              //   _type: 'activities',
              //   _id: tx.receipt.transactionHash,
              //   transactionHash: tx.receipt.transactionHash,
              //   from: tx.receipt.from,
              //   tokenid: nftContractData.metadata.id.toString(),
              //   to: tx.receipt.to,
              //   event: 'Delist',
              //   nftItems: [{ _ref: nftContractData.metadata.properties.tokenid, _type: 'reference', _key: nftContractData.metadata.properties.tokenid }],
              //   price: '-',
              //   chainId: chainid,
              //   dateStamp: new Date(),
              // }

              // console.log(transactionData)
              // await sanityClient
              //   .createIfNotExists(transactionData)
              //   .then(() => {
              //     queryClient.invalidateQueries(['marketplace']);
              //     queryClient.invalidateQueries(['activities']);
                  
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //     toastHandler.error('Error saving Transaction Activity. Contact administrator.', errorToastStyle);
              //       setIsCanceling(false);
              //       return
              //     })
                queryClient.invalidateQueries(['marketplace']);
                queryClient.invalidateQueries(['activities']);
                
                //delete data from market data in mango
                ;(async() => {
                  setLoadingNewPrice(true);
                  await axios
                        .get(`${HOST}/api/mango/deleteSingle/${thisNFTblockchain}/${nftContractData?.contract}/${nftContractData?.tokenId}`)
                        .catch(err => console.log(err))
                        .then((res) =>{
                          setIsCanceling(false);
                          setLoadingNewPrice(false);
                          router.reload(window.location.pathname);
                          router.replace(router.asPath);
                          toastHandler.success('The NFT has been delisted from the marketplace.', successToastStyle);
                        })
                })()
                //update listing data
                // ;(async() => {
                //   setLoadingNewPrice(true);
                //   await axios.get(process.env.NODE_ENV == 'production' ? `https://nuvanft.io:8080/api/updateListings/${thisNFTblockchain}` : `http://localhost:8080/api/updateListings/${thisNFTblockchain}`).finally(() => {
                //     setIsCanceling(false);
                //     setLoadingNewPrice(false);
                //     router.reload(window.location.pathname);
                //     router.replace(router.asPath);
                //     toastHandler.success('The NFT has been delisted from the marketplace.', successToastStyle);
                //   })
                // })()
            }
          } catch (err) {
            // console.error(err);
            // toastHandler.error('Error in delisting this NFT.', errorToastStyle);
            setIsCanceling(false);
            return
          }
        })()
      }

    const burn = (e, sanityClient = config, toastHandler = toast) => {
      
      if (Boolean(listingData?.id)) {
        toastHandler.error('Cannot burn a listed NFT. Delist this NFT first.', errorToastStyle);
        setBurnModal(false);
        return
      }
      
      if(!nftCollection) {
        toast.error("Collection not found.", errorToastStyle);
        return;
      }

      if(!signer){
        toast.error("Wallet not connected.", errorToastStyle);
        return;
      }
      
      if(chainid != nftCollection?.chainId){
        toast.error("Wallet is connected to wrong chain. Switching to correct chain.", errorToastStyle);
        switchChain(Number(nftCollection?.chainId)).catch((err) => {
          toast.error('Error in changing chain. Please change chain manually', errorToastStyle);
        })
        return;
      }
      
      try {
          ;(async () => {
            
            setIsBurning(true);
            setBurnModal(false);

            const sdk = new ThirdwebSDK(signer);
            const contract = await sdk.getContract(nftContractData.contract, "nft-collection");
              
            const tx = await contract
                              .burn(nftContractData?.tokenId)
                              .catch(err => {
                                if (err.reason == 'user rejected transaction'){
                                  toastHandler.error('Transaction rejected via wallet', errorToastStyle);
                                  setIsBurning(false);
                                  return;
                                }
                                });
            if(tx){
              //update listing data
              ;(async() => {
                await axios.get(`${HOST}/api/updateListings/${thisNFTblockchain}`).then(() => {
                  queryClient.invalidateQueries(['marketplace']);
                  queryClient.invalidateQueries(['activities']);
                  queryClient.invalidateQueries(['user']);
                  setIsBurning(false);
                })
                .finally(() => {
                  router.reload(window.location.pathname);
                  router.replace(router.asPath);
                })
              })()
            }

              //saving transaction in sanity
              // const transactionData = {
              //   _type: 'activities',
              //   _id: tx.receipt.transactionHash,
              //   transactionHash: tx.receipt.transactionHash,
              //   from: tx.receipt.from,
              //   tokenid: nftContractData.metadata.id.toString(),
              //   contractAddress: nftContractData.contract,
              //   to: tx.receipt.to,
              //   event: 'Burn',
              //   nftItems: [{ _ref: nftContractData.metadata.properties.tokenid, _type: 'reference', _key: nftContractData.metadata.properties.tokenid }],
              //   price: '-',
              //   chainId: chainid,
              //   dateStamp: new Date(),
              // }

            // await sanityClient
            //   .createIfNotExists(transactionData)
            //   .then(() => {
            //     queryClient.invalidateQueries(['marketplace']);
            //     queryClient.invalidateQueries(['activities']);
            //     queryClient.invalidateQueries(['user']);
                
                
            //   })
            //   .catch((err) => {
            //   console.log(err);
            //   toastHandler.error('Error saving Transaction Activity. Contact administrator.', errorToastStyle);
            //   return
            // })
          })();
      } catch (error) {
      toastHandler.error('NFT not burnt.', errorToastStyle)
      // console.error(error)
      setIsBurning(false);
      }
    }

    const transfer = (e, sanityClient = config, toastHandler = toast) => {
      // if (!Boolean(listingData?.message == 'NFT data not found')) {
      //   toastHandler.error('Cannot burn a listed NFT. Delist this NFT first.', errorToastStyle);
      //   setBurnModal(false);
      //   return
      // }
      
      if (Boolean(listingData)) {
        toastHandler.error('Cannot transfer a listed NFT. Delist this NFT first.', errorToastStyle);
        setTransferModal(false);
        return
      }
      
      if(!nftCollection) {
        toast.error("Collection not found.", errorToastStyle);
        return;
      }

      if(!signer){
        toast.error("Wallet not connected.", errorToastStyle);
        return;
      }
      if(transferAddress == ''){
        toast.error("Enter wallet address to transfer to", errorToastStyle);
        return;
      }

      if(chainid != nftCollection?.chainId){
        toast.error("Wallet is connected to wrong chain. Switching to correct chain.", errorToastStyle);
        switchChain(Number(nftCollection?.chainId)).catch((err) => {
          toast.error('Error in changing chain. Please change chain manually', errorToastStyle);
        })
        return;
      }

      try{
        setTransferModal(false);
        setIsTransfer(true);
        ;(async() => {
          const sdk = new ThirdwebSDK(signer);
          const contract = await sdk.getContract(nftContractData.contract, "nft-collection");
          const tx = await contract.erc721.transfer(transferAddress, nftContractData?.tokenId)
                                          .catch(err => {
                                            if(err.reason == 'user rejected transaction'){
                                              toast.error('The transaction is rejection via wallet', errorToastStyle);
                                            }
                                          });
          
          if(tx){
            if(referralAllowedCollections.map(coll => coll._ref).includes(nftCollection._id)){
              //if the nft is from rewarding collection then change the changebought nft, add in receiver and remove from transferer
              const payObj =  {
                walletAddress: transferAddress,
                chainId: nftCollection.chainId,
                contractAddress: nftCollection.contractAddress,
                tokenId: nftContractData.tokenId,
                payablelevel: Boolean(nftCollection.payablelevel) ? nftCollection.payablelevel : 1,
                type: 'buy'
              }
              changeBoughtNFTs(payObj);
    
              const sellObj = {
                ...payObj,
                walletAddress: address,
                type: 'sell',
              }
              changeBoughtNFTs(sellObj); // this will change seller's bought NFT field -> remove NFT
            }
            toast.success("The NFT has been transferred to the designated wallet", successToastStyle);
            // window.location.reload(true);
          }
          
          setIsTransfer(false);
          
          // console.log(tx);
            //saving transaction in sanity
          // const transactionData = {
          //   _type: 'activities',
          //   _id: tx.receipt.transactionHash,
          //   transactionHash: tx.receipt.transactionHash,
          //   from: tx.receipt.from,
          //   tokenid: nftContractData.metadata.id.toString(),
          //   contractAddress: nftContractData.contract,
          //   to: tx.receipt.to,
          //   event: 'Transfer',
          //   nftItems: [{ _ref: nftContractData.metadata.properties.tokenid, _type: 'reference', _key: nftContractData.metadata.properties.tokenid }],
          //   price: '-',
          //   chainId: chainid,
          //   dateStamp: new Date(),
          // }

          // await sanityClient
          //   .createIfNotExists(transactionData)
          //   .catch((err) => {
          //   toastHandler.error('Error saving Transaction Activity.', errorToastStyle);
          //   return
          // })
          
        })()
      }catch (error){
        console.log(error)
        setIsTransfer(false);
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
                        className="bg-red-500 w-full text-center hover:bg-red-600 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors "
                        onClick={() => cancelListing()}>
                        <FiCheck className="inline-block text-lg" /> <span className="inline-block ml-1"> Yes, I am sure.</span>
                    </div>
                    <div 
                        className="bg-neutral-300 text-slate-700 w-full text-center hover:bg-neutral-400 hover:text-slate-50 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm transition-colors"
                        onClick={() => setCancelModal(false)}>
                        <MdAdd className="inline-block text-xl -mt-1 rotate-45" /> <span className="inline-block"> Cancel</span>
                    </div>
                </div>
            </div>
        </div>
    )}
    {transferModal && (
        <div className="fixed w-full h-full bg-slate-700 bg-opacity-75 top-0 left-0 z-30 backdrop-blur-sm flex align-items-center justify-center">
            <div className={`relative w-[500px] rounded-xl py-[2em] px-[3em] ${dark ? 'bg-slate-800' : 'bg-slate-50'} m-auto`}>
                <p className="fw-700 mb-3">Transfer NFT</p>
                <p className="text-sm">Enter wallet address to transfer this NFT to</p>
                <div className='flex flex-wrap items-center gap-3'>
                  <div>
                    <IconWallet />
                  </div>
                  <input 
                    type="text" 
                    className={`m-2 flex-grow outline-none p-3 rounded-lg border transition linear' + ${dark ? ' border-slate-600 bg-slate-700 hover:bg-slate-600 ' : ' border border-neutral-200 bg-neutral-100 hover:bg-neutral-200'}`}
                    value={transferAddress} 
                    onChange={(e) => setTransferAddress(e.target.value)}/>
                </div>
                <div className="flex gap-4 mt-4">
                    <div 
                        className="bg-red-500 w-full text-center hover:bg-red-600 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm text-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                        onClick={() => transfer()}>
                        <FiCheck className="inline-block text-lg" /> <span className="inline-block ml-1"> Transfer</span>
                    </div>
                    <div 
                        className="bg-neutral-300 text-slate-700 w-full text-center hover:bg-neutral-400 hover:text-slate-50 mt-3 w-xl relative h-auto cursor-pointer rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6"
                        onClick={() => setTransferModal(false)}>
                        <MdAdd className="inline-block text-xl -mt-1 rotate-45" /> <span className="inline-block"> Cancel</span>
                    </div>
                </div>
            </div>
        </div>
    )}

    {Boolean(address) && (String(address).toLowerCase() == String(ownerData).toLowerCase() || String(address).toLowerCase() == String(listingData?.sellerAddress).toLowerCase()) &&  (
        <div className={`flex items-center flex-1 justify-center p-4 flex-wrap lg:flex-nowrap gap-0 rounded-xl mt-4  ${dark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
          {Boolean(listingData) && String(address).toLowerCase() == String(listingData?.sellerAddress).toLowerCase() && (
            <>
              {isCanceling ? (
                <div className="w-full md:w-1/3 p-2">
                  <button
                      className="flex gap-2 justify-center pointer-events-none bg-slate-500 hover:bg-slate-600 text-center w-lg relative h-auto cursor-pointer rounded-lg px-3 py-3 text-sm text-neutral-50 transition-colors"
                      disabled>
                        <IconLoading dark="inbutton" /><span className="inline-block ml-1">Cancelling</span>
                  </button>
                </div>
              ) : (
                <div className="w-full md:w-1/3 p-2">
                  <button
                      className="bg-slate-500 hover:bg-slate-600 w-full text-center w-lg relative h-auto cursor-pointer rounded-lg px-3 py-3 text-sm text-neutral-50 transition-colors"
                      onClick={() => setCancelModal(true)}>
                          <RiCloseCircleLine className="inline-block text-lg -mt-1" /><span className="inline-block ml-1">Cancel Listing</span>
                  </button>
                </div>
              )}
            </>
          )}

          {isTransfer ? (
            <div className="w-full md:w-1/3 p-2">
              <button className="bg-amber-500 w-full flex justify-center items-center pointer-events-none text-center hover:bg-amber-600 w-lg relative h-auto cursor-pointer rounded-lg px-3 py-3 text-sm text-neutral-50 transition-colors opacity-80">
                      <IconLoading dark="inbutton" /><span className="inline-block ml-1">Transferring</span>
                </button>
            </div>
          ) : (
            <div className="w-full md:w-1/3 p-2">
              <button 
                    className="bg-amber-500 w-full text-center hover:bg-amber-600 w-lg relative h-auto cursor-pointer rounded-lg px-3 py-3 text-sm text-neutral-50 transition-colors"
                    onClick={() => setTransferModal(true)}>
                      <BiTransferAlt className="inline-block text-lg -mt-1" /><span className="inline-block ml-1">Transfer</span>
                </button>
            </div>
          )}
          {isBurning ? (
            <div className="w-full md:w-1/3 p-2">
              <button 
                  className="flex gap-2 justify-center bg-red-500 w-full text-center pointer-events-none hover:bg-red-600 w-lg relative h-auto cursor-pointer rounded-lg px-3 py-3 text-sm text-neutral-50 transition-colors"
                  disabled>
                  <IconLoading dark="inbutton" /><span className="inline-block ml-1">Burning</span>
              </button>
            </div>
          ):(
            <div className="w-full md:w-1/3 p-2">
              <button 
                  className="bg-red-500 w-full text-center hover:bg-red-600 w-lg relative h-auto cursor-pointer rounded-lg px-3 py-3 text-sm text-neutral-50 transition-colors"
                  onClick={() => setBurnModal(true)}>
                  <AiOutlineFire className="inline-block text-lg -mt-1" /><span className="inline-block ml-1">Burn</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default BurnCancel