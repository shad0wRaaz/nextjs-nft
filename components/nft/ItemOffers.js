import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast from 'react-hot-toast'
import { FiTag } from 'react-icons/fi'
import { BiChevronUp } from 'react-icons/bi'
import { TbZoomCheck } from 'react-icons/tb'
import { BsCheck2Circle } from 'react-icons/bs'
import { useAddress, useChainId } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUser } from '../../fetchers/SanityFetchers'
import { getUnsignedImagePath } from '../../fetchers/s3'
import { useThemeContext } from '../../contexts/ThemeContext'
import { getMarketOffers } from '../../fetchers/Web3Fetchers'
import { IconLoading, IconPolygon } from '../icons/CustomIcons'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { saveTransaction, addVolumeTraded } from '../../mutators/SanityMutators'
import { useSettingsContext } from '../../contexts/SettingsContext'
import axios from 'axios'
import { useRouter } from 'next/router'

const errorToastStyle = {
    style: { background: '#ef4444', padding: '16px', color: '#fff' },
    iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
  }
const successToastStyle = {
style: { background: '#10B981', padding: '16px', color: '#fff' },
iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}
const currency = {
  "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" : <IconPolygon />
 }

const chainExplorer = {
  '97': process.env.NEXT_PUBLIC_EXPLORER_TBNB,
  '80001': process.env.NEXT_PUBLIC_EXPLORER_MUMBAI,
  '5': process.env.NEXT_PUBLIC_EXPLORER_GOERLI,
  '4': process.env.NEXT_PUBLIC_EXPLORER_RINKEBY,
  '1': process.env.NEXT_PUBLIC_EXPLORER_MAINNET,
}

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
const ItemOffers = ({selectedNft, metaDataFromSanity, listingData}) => {
  const [toggle, setToggle] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const { dark } = useThemeContext();
  const address = useAddress();
  const { coinPrices, setLoadingNewPrice } = useSettingsContext();
  const [coinMultiplier, setCoinMultiplier] = useState();
  const [itemEvents, setItemEvents] = useState([]);
  const queryClient = useQueryClient();
  const chainId = useChainId();
  const router = useRouter();
  const { marketContract } = useMarketplaceContext();

  const { data: eventData, status: eventDataLoading } = useQuery(
    ['eventData', listingData?.id],
    getMarketOffers(marketContract),
    {
      onError: (err) => {
        console.log(err)
      },
      onSuccess: async (res) => {
        if(res) {
          //get offeror and get their profile pictures and name 
          const unresolved = res.map(async (e) => {
            const obj = { ...e }
            const userData = await getUser(e.data.offeror)
            obj['offeredBy'] = userData
            return obj
          })
          const updatedItemEvents = await Promise.all(unresolved)
  
          const unres = updatedItemEvents.map(async (e) => {
            const obj = { ...e }
  
            const userImg = await getUnsignedImagePath('profileImage-' + e.data.offeror)
  
            obj['profileImage'] = userImg?.data.url
            return obj
          })
          const itemDatawithUserProfile = await Promise.all(unres);
          setItemEvents(itemDatawithUserProfile);
        }
      }
    }
  )
// console.log(eventData, eventDataLoading)
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

  // console.log(listingData)
const acceptOffer = async (listingId, offeror, totalOfferAmount) => {
  try {
    setIsAccepting(true);
    const previousOwner = selectedNft?.owner;
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

    console.log(tx);
    toast.success("NFT offer accepted.", successToastStyle);

    //update listing data
    ;(async() => {
      setLoadingNewPrice(true);
      await axios.get(process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080/api/updateListings' : 'http://localhost:8080/api/updateListings').then(() => {
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
          ? style.title + ' bg-slate-800 hover:bg-slate-700'
          : style.title + ' bg-neutral-100 hover:bg-neutral-200 '
        }
        onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
            <span className={style.titleIcon}>
              <FiTag fontSize={20}/>
            </span>
            Item Offers
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
        <table className="w-full max-h-[28rem] overflow-scroll pb-8">
          <tbody>
            {!listingData || itemEvents?.length == 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <span className="text-md">
                    {(eventDataLoading == "success" && eventData?.length == 0 ) ? 'No offers found' : '' } 
                    {(eventDataLoading == "loading" || !eventData) && (
                      <div className="flex gap-1 justify-center items-center">
                        <IconLoading /> Loading
                      </div>
                    )}
                    </span>
                </td>
              </tr>
            )}

            {listingData && itemEvents?.length > 0 && itemEvents?.map((event, id) => (
              <tr key={id}>
                <td className={`p-4 pl-8 border-t ${dark ? 'border-slate-700' : 'border-slate-200'} w-0`}>
                  <div className="rounded-full w-[48px] h-[48px] mr-0 border border-1 border-white overflow-hidden">
                    <img src={event?.profileImage} alt={event?.offeredBy?.userName} className="object-cover h-full w-full"/>
                  </div>
                </td>
                <td className={`p-4 border-t pl-0 ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex justify-between">
                    <div>
                        <p className="text-sm">
                          <a className="" href={`/user/${event.data.offeror}`}>{event?.offeredBy.userName}</a>
                        </p>
                        <p className="text-sm">
                          {currency[event?.data?.currency]}
                          <span className="-ml-1">{BigNumber.from(event?.data?.totalOfferAmount)/(BigNumber.from(10).pow(18))}</span>
                          <span></span>
                        </p>
                    </div> 
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`${chainExplorer["80001"]}${event.transaction.transactionHash}`}>
                        <a target="_blank">
                          <div className={`transition rounded-lg p-2 text-md shadow-sm border ${dark ? 'bg-slate-600 border-slate-500/70 hover:bg-slate-500/70' : 'border bg-white hover:bg-blue-600 hover:text-white'} text-sm flex gap-1 items-center`} title='View on Explorer'><TbZoomCheck /> View</div>
                        </a>
                      </Link>
                      {listingData?.sellerAddress == address ? (
                        <button 
                          onClick={() => acceptOffer(event.data.listingId, event.data.offeror, event?.data?.totalOfferAmount)} 
                          className={`transition rounded-lg p-2 cursor-pointer ${isAccepting ? 'pointer-events-none opacity-80' : ''} text-md shadow-sm border ${dark ? 'bg-slate-600 border-slate-500/70 hover:bg-slate-500/70' : 'border bg-white hover:bg-blue-600 hover:text-white'} text-sm flex gap-1 items-center`} 
                          title='Accept this offer'
                          >
                            {isAccepting ? (
                              <>
                                <IconLoading dark={dark ? 'inbutton' : ''}/> 
                              </>
                            ) : (
                              <>
                                <BsCheck2Circle /> Accept
                              </>
                            )}
                        </button>
                      ) : ('')}
                    </div>
                  </div>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ItemOffers