import axios from 'axios';
import { BigNumber } from 'ethers';
import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { IconLoading } from '../icons/CustomIcons';
import { getImagefromWeb3 } from '../../fetchers/s3';
import { createAwatar } from '../../utils/utilities';
import { useMutation, useQueryClient } from 'react-query';
import { FaCrown, FaRegCheckCircle } from 'react-icons/fa';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { TbFlag3, TbTrendingDown, TbTrendingUp } from 'react-icons/tb';
import { useAddress, useChainId, useSigner } from '@thirdweb-dev/react';
import { addVolumeTraded, saveTransaction } from '../../mutators/SanityMutators';


const OfferSingle = ({
  offer, 
  isAuctionItem, 
  listingData, 
  coinMultiplier, 
  metaDataFromSanity, 
  selectedNft, 
  thisNFTMarketAddress, 
  thisNFTblockchain, 
  winningBid }) => {
    const signer = useSigner();
    const router = useRouter();
    const address = useAddress();
    const chainId = useChainId();
    const queryClient = useQueryClient();
    const { setLoadingNewPrice, HOST } = useSettingsContext();
    const [isAccepting, setIsAccepting] = useState(false);
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();

    const isThisWinningBid = (isAuctionItem && winningBid && offer) ? offer?.buyerAddress == winningBid?.buyerAddress ? true : false : false;

    const acceptOffer = async (listingId, offeror, totalOfferAmount) => {
        try {
          if(!signer) {
            toast.error("Wallet not connected. Wallet is required for this action.", errorToastStyle);
            return;
          }
      
          setIsAccepting(true);
          const previousOwner = selectedNft?.owners[0]?.ownerOf;
          

          const sdk = new ThirdwebSDK(signer);
          const marketContract = await sdk.getContract(thisNFTMarketAddress, "marketplace");

          const tx = await marketContract.direct.acceptOffer(listingId.toString(), offeror);
          //convert hex BigNumber in Decimal
          const offeredAmountInDollar = parseFloat(BigNumber.from(totalOfferAmount)/(BigNumber.from(10).pow(18)) * coinMultiplier);


      
          // mutateSaveTransaction({
          //   transaction: tx,
          //   id: selectedNft.metadata.id.toString(),
          //   eventName: 'Buy',
          //   itemid: selectedNft?.metadata?.properties?.tokenid,
          //   price: offeredAmountInDollar.toString(),
          //   chainid: chainId,
          // });
            
          //adding volume to Collection
          addVolume({
            id: metaDataFromSanity?._id,
            volume: offeredAmountInDollar,
          });
      
          //adding volume to the new owner
          addVolume({
            id: offeror,
            volume: offeredAmountInDollar
          });
      
          //adding volume to the previous owner
          addVolume({
            id: previousOwner,
            volume: offeredAmountInDollar
          });
      
          
          // update listing data
          ;(async() => {
            setLoadingNewPrice(true);
            await axios.get(`${HOST}/api/updateListings/${thisNFTblockchain}`).then(() => {
              router.reload(window.location.pathname);
              router.replace(router.asPath);
              setIsAccepting(false);
              setLoadingNewPrice(false);
              toast.success("Offer acceptance request is in the queue. Page will automatically refresh once the request goes through.", successToastStyle);
            })
          })()
          
        }catch(err){
          console.log(err);
          toast.success("Offer could not be accepted.", errorToastStyle);
        }
        setLoadingNewPrice(false);
        setIsAccepting(false);
    }

    // const { mutate: mutateSaveTransaction } = useMutation(
    //     ({ transaction, id, eventName, price, chainid, itemid }) =>
    //       saveTransaction({
    //         transaction,
    //         id,
    //         eventName,
    //         price,
    //         chainid,
    //         itemid,
    //       }),
    //     {
    //       onError: () => {
    //         toast.error(
    //           'Error saving transaction. Contact administrator.',
    //           errorToastStyle
    //         )
    //       },
    //       onSuccess: () => {
    //         queryClient.invalidateQueries(['user']);
    //         queryClient.invalidateQueries(['eventData']);
    //         queryClient.invalidateQueries(['activities']);
    //         queryClient.invalidateQueries(['marketplace']);
    //       },
    //     }
    //   )
    
      const { mutate: addVolume } = useMutation(
        ({ id, volume }) =>
          addVolumeTraded({ id, volume }),
        {
          onError: () => {
            toast.error('Error in adding Volume Traded.', errorToastStyle)
          },
        }
      )

  return (
    <tr>
        <td className={`relative p-4 pl-10 border-t ${dark ? 'border-slate-700' : 'border-slate-200'} w-0`}>
            <div className="rounded-full w-[30px] h-[30px] mr-0 border border-1 border-white overflow-hidden">
              <img src={createAwatar(offer?.buyerAddress)} alt={offer?.buyerAddress} className="object-cover h-full w-full"/>
            </div>
            {isThisWinningBid ? (
              <div className="absolute top-5 left-2">
                <TbFlag3 className="text-green-500" fontSize={20} />
              </div>
            ) : null}
        </td>
        <td className={`p-4 border-t pl-0 ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
              <div className="flex items-center w-full flex-grow justify-center">
                <div className="flex-grow">
                  <p className="text-sm">
                      <a className="" href={`/user/${offer?.buyerAddress}`}>{offer?.buyerAddress?.slice(0,7)}...{offer?.buyerAddress?.slice(-7)}</a>
                  </p>
                  <p className="text-sm">
                      <span className="">{offer?.currencyValue?.displayValue} {offer?.currencyValue?.symbol}</span>
                  </p>
                </div>
                <div className="flex-grow text-right flex justify-end items-center text-sm gap-1">
                    {(parseFloat(listingData?.buyoutCurrencyValuePerToken.displayValue) - parseFloat(offer?.currencyValue.displayValue)) > 0 
                    ? <TbTrendingDown color='#f43f5e' fontSize={20}/> : <TbTrendingUp color='#22c55e' fontSize={20}/> }
                    {parseFloat((parseFloat(listingData?.buyoutCurrencyValuePerToken.displayValue) - parseFloat(offer?.currencyValue.displayValue)) / parseFloat(listingData?.buyoutCurrencyValuePerToken.displayValue).toFixed(4) * 100).toFixed(2)}%
                </div>
              </div>
              {!isAuctionItem && (
                  <div className="flex items-center justify-between gap-2">
                  {listingData?.sellerAddress == address ? (
                    <button
                    onClick={() => acceptOffer(offer?.listingId.toString(), offer?.buyerAddress, offer?.currencyValue.value)} 
                    className={`transition rounded-lg p-2 px-3 gradBlue cursor-pointer md:ml-5 ${isAccepting ? 'pointer-events-none opacity-80' : ''} text-md shadow-sm text-sm flex gap-1 items-center`} 
                    title='Accept this offer'>
                        {isAccepting ? (
                        <>
                          <IconLoading dark={dark ? 'inbutton' : ''}/> Processing
                        </>
                        ) : (
                        <>
                          <FaRegCheckCircle fontSize={15} /> Accept
                        </>
                        )}
                    </button>
                  ) : ('')}
                  </div>
              )}
            </div>
        </td>
    </tr>
  )
}

export default OfferSingle