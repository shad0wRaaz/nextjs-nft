import axios from 'axios';
import { BigNumber } from 'ethers';
import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { FaRegCheckCircle } from 'react-icons/fa';
import { IconLoading } from '../icons/CustomIcons';
import { getImagefromWeb3 } from '../../fetchers/s3';
import { useMutation, useQueryClient } from 'react-query';
import { TbTrendingDown, TbTrendingUp } from 'react-icons/tb';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useAddress, useChainId, useSigner } from '@thirdweb-dev/react';
import { addVolumeTraded, saveTransaction } from '../../mutators/SanityMutators';


const OfferSingle = ({offer, isAuctionItem, listingData, coinMultiplier, metaDataFromSanity, selectedNft, thisNFTMarketAddress, thisNFTblockchain }) => {
    const signer = useSigner();
    const router = useRouter();
    const address = useAddress();
    const chainId = useChainId();
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const queryClient = useQueryClient();
    const { setLoadingNewPrice } = useSettingsContext();
    const [isAccepting, setIsAccepting] = useState(false);

    const acceptOffer = async (listingId, offeror, totalOfferAmount) => {
        try {
          if(!signer) {
            toast.error("Wallet not connected. Wallet is required for this action.", errorToastStyle);
            return;
          }
      
          setIsAccepting(true);
          const previousOwner = selectedNft?.owner;
          const sdk = new ThirdwebSDK(signer);
          const marketContract = await sdk.getContract(thisNFTMarketAddress, "marketplace");
          const tx = await marketContract.direct.acceptOffer(listingId.toString(), offeror);
          
          //convert hex BigNumber in Decimal
          const offeredAmountInDollar = parseFloat(BigNumber.from(totalOfferAmount)/(BigNumber.from(10).pow(18)) * coinMultiplier);
      
          mutateSaveTransaction({
            transaction: tx,
            id: selectedNft.metadata.id.toString(),
            eventName: 'Buy',
            itemid: selectedNft?.metadata?.properties?.tokenid,
            price: offeredAmountInDollar.toString(),
            chainid: chainId,
          });
            
          //adding volume to Collection
          addVolume({
            id: metaDataFromSanity?.collection?._id,
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
      
          toast.success("NFT offer accepted.", successToastStyle);
      
          //update listing data
          ;(async() => {
            setLoadingNewPrice(true);
            await axios.get(process.env.NODE_ENV == 'production' ? `https://nuvanft.io:8080/api/updateListings/${thisNFTblockchain}` : `http://localhost:8080/api/updateListings/${thisNFTblockchain}`).then(() => {
              router.reload(window.location.pathname);
              router.replace(router.asPath);
              setIsAccepting(false);
              setLoadingNewPrice(false);
            })
          })()
          
        }catch(err){
          console.log(err);
          toast.success("Offer could not be accepted.", errorToastStyle);
        }
        setLoadingNewPrice(false);
        setIsAccepting(false);
    }

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

  return (
    <tr>
        <td className={`p-4 pl-8 border-t ${dark ? 'border-slate-700' : 'border-slate-200'} w-0`}>
            <div className="rounded-full w-[48px] h-[48px] mr-0 border border-1 border-white overflow-hidden">
            <img src={getImagefromWeb3(offer?.offeredBy?.web3imageprofile)} alt={offer?.offeredBy?.userName} className="object-cover h-full w-full"/>
            </div>
        </td>
        <td className={`p-4 border-t pl-0 ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
              <div className="flex items-center w-full flex-grow justify-center">
                <div className="flex-grow">
                  <p className="text-sm">
                      <a className="" href={`/user/${offer?.offeredBy.walletAddress}`}>{offer?.offeredBy.userName}</a>
                  </p>
                  <p className="text-sm">
                      <span className="">{offer?.currencyValue?.displayValue} {offer?.currencyValue?.symbol}</span>
                  </p>
                </div>
                <div className="flex-grow text-right flex justify-end items-center gap-1">
                    {(parseFloat(listingData?.buyoutCurrencyValuePerToken.displayValue) - parseFloat(offer?.currencyValue.displayValue)) > 0 
                    ? <TbTrendingDown color='#f43f5e' fontSize={20}/> : <TbTrendingUp color='#22c55e' fontSize={20}/> }
                    {parseFloat((parseFloat(listingData?.buyoutCurrencyValuePerToken.displayValue) - parseFloat(offer?.currencyValue.displayValue)) / parseFloat(listingData?.buyoutCurrencyValuePerToken.displayValue).toFixed(4) * 100).toFixed(4)}%
                </div>
              </div>
              {!isAuctionItem && (
                  <div className="flex items-center justify-between gap-2">
                  {listingData?.sellerAddress == address ? (
                    <button
                    onClick={() => acceptOffer(offer?.listingId.toString(), offer?.buyerAddress, offer?.currencyValue.displayValue)} 
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