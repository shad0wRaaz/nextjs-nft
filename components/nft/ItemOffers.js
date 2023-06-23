import { useQuery } from 'react-query'
import { FiTag } from 'react-icons/fi'
import OfferSingle from './OfferSingle'
import { BiChevronUp } from 'react-icons/bi'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { useSigner } from '@thirdweb-dev/react'
import { IconLoading } from '../icons/CustomIcons'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../fetchers/SanityFetchers'
import { useThemeContext } from '../../contexts/ThemeContext'
import { getMarketOffers } from '../../fetchers/Web3Fetchers'
import { useSettingsContext } from '../../contexts/SettingsContext'

const style = {
  wrapper: `w-full mt-3 border rounded-xl overflow-hidden`,
  title: `px-6 py-4 flex items-center cursor-pointer`,
  titleLeft: `flex-1 flex items-center text-md font-bold`,
  titleIcon: `text-2xl mr-2`,
  titleRight: `text-xl transition`,
  filter: `flex items-center border border-[#151b22] mx-4 my-6 px-3 py-4 rounded-xl bg-[#363840]`,
  filterTitle: `flex-1`,
  tableHeader: `flex w-full text-sm border-y mt-2 px-4 py-1`,
  eventItem: `flex px-4`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2]`,
  transactionTable: 'ttable max-h-[500px] overflow-y-auto',
}
const ItemOffers = ({ selectedNft, metaDataFromSanity, listingData, thisNFTMarketAddress, thisNFTblockchain, isAuctionItem }) => {
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [toggle, setToggle] = useState(true);
  const [marketOffer, setMarketOffer] = useState([]);
  const [coinMultiplier, setCoinMultiplier] = useState();
  const { coinPrices } = useSettingsContext();
  const signer = useSigner();

  const [winningBid, setWinningBid] = useState();
  
  useEffect(() => {
    if(!marketOffer) return
    // const marketArray = [
    //   process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE, 
    //   process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
    // ];


    if(isAuctionItem) {
      //get winning bid and send to offer array
      ;(async() => {
        let sdk = '';
        if(signer){
          sdk = new ThirdwebSDK(signer);
        }
        else {
          sdk = new ThirdwebSDK(thisNFTblockchain);
        }
        const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace-v3");
        const winningBid = await contract.englishAuctions.getWinningBid(listingData?.id);
        setWinningBid(winningBid);
      })();
    }

    // if (marketArray.includes(selectedNft?.owner)) {
    //   // mark this item as Auctioned Item
    //   setIsAuctionItem(true);
      
    //   return;
    // }

    return() => {
      //do nothing, just clean up function
    }
  }, [marketOffer])

  const { data: eventData, status: eventDataLoading } = useQuery(
    ['eventData', listingData?.id],
    getMarketOffers(thisNFTMarketAddress, thisNFTblockchain, listingData),
    {
      enabled: Boolean(listingData?.id),
      onError: (err) => {
        // console.log(err)
      },
      onSuccess: async(res) => {

        // console.log('listings', listingData)
        // console.log('bids', res)
        // const unresolved = res?.map(async(offer) => {
        //   const user = await getUser(offer.buyerAddress);
        //   return {...offer, offeredBy: {...user}}
        // });
        // if(unresolved){
        //   const events = await Promise.all(unresolved);
        //   setMarketOffer(events);
        // }
      }
    }
  )

useEffect(() => {
  if (!listingData) return

  //get currency symbol from market(listed) nft item
  if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'MATIC') {
    setCoinMultiplier(coinPrices?.maticprice);
  } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'ETH') {
    setCoinMultiplier(coinPrices?.ethprice);
  } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'AVAX') {
    setCoinMultiplier(coinPrices?.avaxprice);
  } else if (listingData?.buyoutCurrencyValuePerToken?.symbol == 'BNB' || listingData?.buyoutCurrencyValuePerToken?.symbol == 'TBNB') {
    setCoinMultiplier(coinPrices?.bnbprice);
  }else {
    setCoinMultiplier(undefined);
  }

  return() => {
    //do nothing, just cleanup function
  }
}, [listingData, coinPrices])


  return (
    <div
      className={
        dark
          ? style.wrapper + ' border-slate-800 bg-slate-800'
          : style.wrapper + ' border-neutral-100 bg-neutral-100 '
      }
    >
      <div 
        className={
        dark
          ? style.title + ' bg-slate-800 hover:bg-slate-700 border-b border-slate-700'
          : style.title + ' bg-neutral-100 hover:bg-neutral-200 '
        }
        onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
            <span className={style.titleIcon}>
              <FiTag fontSize={20}/>
            </span>
            {isAuctionItem ? 'Items Bids' : 'Item Offers'}
        </div>
        <div className={style.titleRight}>
            <BiChevronUp
              className={
                toggle
                  ? 'cursor-pointer transition'
                  : 'rotate-180 cursor-pointer transition'
              }
            />
          </div>
      </div>
      {!toggle && (
        <table className="w-full max-h-[28rem] overflow-auto pb-8">
          <tbody>
            {!listingData || eventData?.length == 0 || !eventData && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <span className="text-sm">
                    {((eventDataLoading == "success" || eventDataLoading == "error") && !eventData) ? Boolean(listingData?.type == 0) ? 'No offers yet' : 'No bids yet' : '' } 
                    {(eventDataLoading == "loading") && (
                      <div className="flex gap-1 justify-center items-center">
                        {dark? <IconLoading dark="inbutton"/> : <IconLoading/>} Loading
                      </div>
                    )}
                    </span>
                </td>
              </tr>
            )}

            {listingData && eventData?.length > 0 && eventData?.map((offer, id) => (
              <OfferSingle 
                key={id} 
                offer={offer} 
                isAuctionItem={isAuctionItem} 
                selectedNft={selectedNft} 
                listingData={listingData} 
                coinMultiplier={coinMultiplier} 
                metaDataFromSanity={metaDataFromSanity}
                thisNFTMarketAddress={thisNFTMarketAddress} 
                thisNFTblockchain={thisNFTblockchain} 
                winningBid={winningBid}/>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ItemOffers