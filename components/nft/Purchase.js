import axios from 'axios'
import Sell from './Sell'
import { BigNumber } from 'ethers'
import toast from 'react-hot-toast'
import { Bars } from 'svg-loaders-react'
import { useEffect, useState } from 'react'
import { useChainId } from '@thirdweb-dev/react'
import { ChainId, NATIVE_TOKENS } from '@thirdweb-dev/sdk'
import { useAddress, useMarketplace } from '@thirdweb-dev/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { IconLoading, IconOffer, IconWallet } from '../icons/CustomIcons'
import { saveTransaction, addVolumeTraded } from '../../mutators/SanityMutators'
import { updateActiveListings } from '../../fetchers/Web3Fetchers'

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
  selectedNft,
  nftCollection,
  listingData,
  auctionItem,
}) => {
  const { marketplaceAddress } = useMarketplaceContext()
  const { coinPrices } = useSettingsContext()
  const marketPlaceModule = useMarketplace(marketplaceAddress)
  const chainId = useChainId()
  const address = useAddress()
  const queryClient = useQueryClient()
  const [buyLoading, setBuyLoading] = useState(false)
  const [bidLoading, setBidLoading] = useState(false)
  const [offerLoading, setOfferLoading] = useState(false)
  const collectionAddress = nftCollection?.contractAddress
  const [coinMultiplier, setCoinMultiplier] = useState()

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
        queryClient.invalidateQueries(['user'])
        queryClient.invalidateQueries(['activities'])
        queryClient.invalidateQueries(['marketplace'])
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
    if (listingData?.buyoutCurrencyValuePerToken.symbol == 'MATIC') {
      setCoinMultiplier(coinPrices.maticprice)
    } else if (listingData?.buyoutCurrencyValuePerToken.symbol == 'ETH') {
      setCoinMultiplier(coinPrices.ethprice)
    } else if (listingData?.buyoutCurrencyValuePerToken.symbol == 'FTX') {
      setCoinMultiplier(coinPrices.ftxprice)
    } else if (listingData?.buyoutCurrencyValuePerToken.symbol == 'AVAX') {
      setCoinMultiplier(coinPrices.avaxprice)
    } else if (listingData?.buyoutCurrencyValuePerToken.symbol == 'BNB') {
      setCoinMultiplier(coinPrices.bnbprice)
    }
  }, [listingData])


  //function to make offer for nfts
  const makeAnOffer = async (
    listingId = listingData.id.toString(),
    quantityDesired = 1,
    module = marketPlaceModule,
    toastHandler = toast
  ) => {
    if (!address) {
      toastHandler.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
      )
      return
    }
    if(!listingData) return
    try {
      // const offer = {
      //   listingId: listingId,
      //   quantityDesired: 1,
      //   currencyContractAddress:
      //     NATIVE_TOKENS[ChainId.Mumbai].wrapped.address,
      //   pricePerToken: '0.0001',  
      // }
      console.log(listingId)
      console.log(NATIVE_TOKENS[ChainId.Mumbai].wrapped.address,)
      setOfferLoading(true)
      const tx = await module.direct.makeOffer(
        listingId,
        1,
        NATIVE_TOKENS[ChainId.Mumbai].wrapped.address,
        '1'
      )
      console.log(tx)
      setOfferLoading(false)
    } catch (error) {
      console.error(error)
      toastHandler.error('Error in placing an offer..', errorToastStyle)
      setOfferLoading(false)
    }
  }
  const bidItem = async (
    listingId = listingData.id.toString(),
    module = marketPlaceModule,
    toastHandler = toast,
    qc = queryClient
  ) => {
    console.log(listingId)

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

      const biddingPrice = 0.4
      const tx = await module.auction.makeBid(listingId, biddingPrice)
      toastHandler.success('Bid successful.', successToastStyle)
      
      //save transaction
      mutateSaveTransaction({
        transaction: tx,
        id: selectedNft.metadata.id.toString(),
        eventName: 'Bid',
        itemid: selectedNft.metadata.properties.tokenid,
        price: biddingPrice.toString(),
        chainid: chainId,
      })
      setBidLoading(false)
      qc.invalidateQueries(['activities'])
      qc.invalidateQueries(['marketplace'])

      console.log(tx)
    } catch (error) {
      // console.log(error)
      toastHandler.error(error.message, errorToastStyle)
      setBidLoading(false)
    }
  }
  const buyItem = async (
    listingId = listingData.id.toString(),
    quantityDesired = 1,
    module = marketPlaceModule,
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
      console.log(listingId)
      setBuyLoading(true)

      const bigNumberPrice = parseInt(listingData.buyoutPrice?.hex, 16)
      const divider = BigNumber.from(10).pow(18)
      const buyOutPrice = bigNumberPrice / divider
    
      const tx = await module.direct.buyoutListing(listingId, quantityDesired)
      toastHandler.success('NFT purchase successful.', successToastStyle)

      mutateSaveTransaction({
        transaction: tx,
        id: selectedNft.metadata.id.toString(),
        eventName: 'Buy',
        itemid: selectedNft.metadata.properties.tokenid,
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


      setBuyLoading(false)
      qc.invalidateQueries(['activities'])
      qc.invalidateQueries(['marketplace'])

      //update listing data
      ;(async() => {
        await axios.get(process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080/api/updateListings' : 'http://localhost:8080/api/updateListings')
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


  // console.log(listingData)
  return (
    <div className="pb-9 pt-14">
      {Boolean(listingData) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="relative flex flex-1 flex-col items-baseline rounded-xl border-2 border-green-500 p-6 sm:flex-row">
            <span className="absolute bottom-full translate-y-3 rounded-lg bg-green-500 py-1 px-1.5 text-sm text-white">
              Current Price
            </span>
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
          </div>

          {/* <span className="ml-5 mt-2 text-sm text-neutral-500 sm:mt-0 sm:ml-10">
            [96 in stock]
          </span> */}
        </div>
      )}

      {!Boolean(listingData) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center">
          <div className="relative flex flex-1 flex-col items-baseline justify-center rounded-xl border-2 border-red-500 p-6 sm:flex-row">
            <span className="text-xl font-semibold text-red-500 xl:text-xl">
              Not in Sale
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
        {!Boolean(listingData) && address == selectedNft?.owner && (
          <Sell
            selectedNft={selectedNft}
            collectionAddress={collectionAddress}
            nftCollection={nftCollection}
          />
        )}

        {Boolean(listingData) && address != selectedNft?.owner && !auctionItem && (
          <>
            {buyLoading ? (
              <div className="gradBlue relative inline-flex h-auto flex-1 cursor-wait items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base">
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
              <div className="relative inline-flex h-auto flex-1 cursor-wait items-center justify-center rounded-xl border border-neutral-2000 bg-white px-4 py-3 text-sm font-medium text-neutral-700  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base">
                <IconLoading />
                <span className="ml-2.5">Processing...</span>
              </div>
              ):(
              <div
                className="relative inline-flex h-auto flex-1 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base "
                onClick={() => makeAnOffer()}
              >
                <IconOffer />
  
                <span className="ml-2.5"> Make offer</span>
              </div>  
            )}
          </>
        )}

        {Boolean(listingData) &&
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
                  onClick={() => bidItem()}
                >
                  <IconWallet />
                  <span className="ml-2.5">Make a Bid</span>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  )
}

export default MakeOffer
