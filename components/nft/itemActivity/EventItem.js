import Moment from 'react-moment'
import { useEffect, useState } from 'react'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import { useThemeContext } from '../../../contexts/ThemeContext'
import { useSettingsContext } from '../../../contexts/SettingsContext'

const style = {
  event: `p-2 py-4 text-sm text-center whitespace-nowrap`,
  eventIcon: `mr-2 text-sm flex justify-center items-center`,
  eventName: `p-0 min-w-[72px]  py-0.5 rounded-md text-sm cursor-pointer text-xs`,
  eventPrice: `flex items-center justify-start`,
  eventPriceValue: `text-sm -ml-1`,
  ethLogo: `h-5 mr-2`,
  accent: `text-neutral-900`,
}

const pillcolor = {
  'Mint' : ' bg-lime-200 text-lime-600',
  'List' : ' bg-indigo-200 text-indigo-600',
  'Auction' : ' bg-pink-200 text-pink-600',
  'Buy': ' bg-green-200 text-green-600',
  'Delist': ' bg-slate-300 text-slate-700',
  'Burn': ' bg-red-200 text-red-600',
  'Bid': ' bg-cyan-200 text-cyan-600',
  'Offer': ' bg-teal-200 text-teal-600',
  'Transfer': ' bg-amber-200 text-amber-600',
}

const EventItem = ({ event, thisNFTblockchain }) => {
  const { dark } = useThemeContext()
  const { chainExplorer, chainIcon, blockchainIdFromName } = useSettingsContext();
  const [eventName, setEventName] = useState();
  const marketplaces = [
    process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
    process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
    process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
    process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
    process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
    process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
    process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
    process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
  ];
  useEffect(() => {
    if(event.fromAddress === "0x0000000000000000000000000000000000000000"){ setEventName('Mint')}
    else if(event.toAddress === "0x0000000000000000000000000000000000000000"){ setEventName('Burn')}
    else if(marketplaces.includes(event.fromAddress)){ setEventName('Buy')}
    else if(marketplaces.includes(event.toAddress)){ setEventName('List')}
    else { setEventName('Transfer')}

    return () => {
      //clean up function, do nothing
    }
  }, [])

  return (
    <tr
      className={
        dark ? ' text-neutral-100 hover:bg-slate-700' : ' hover:bg-neutral-200'
      }
    >
      <td className={style.event}>
        <div className={style.eventIcon}>
          <div className={style.eventName + pillcolor[eventName]}>
            <a href={`${chainExplorer[blockchainIdFromName[thisNFTblockchain]]}tx/${event.transactionHash}`} target="_blank">
              <div className="flex items-center justify-center gap-1">
                <RiCheckboxCircleFill fontSize={14} />{eventName}
              </div>
            </a>
          </div>
        </div>
      </td>
      <td className={style.event}>
        <div className={`${style.eventPrice} flex-[2]`}>
          {chainIcon[blockchainIdFromName[thisNFTblockchain]]}
          {/* {event.event !== 'Mint' &&
            event.event != 'Delist' &&
            event.event != 'Burn' && !isNaN(Number(event.price)) &&
            (event.chainId == '80001' || event.chainId == '137' ? (
              <IconPolygon width={'15'} height={'15'} />
            ) : event.chainId == '1' || event.chainId == '5' ? (
              <IconEthereum />
            ) : event.chainId == '56' || event.chainId == '97' ? (
              <IconBNB />
            ) : event.chainId == '43113' || event.chainId == '43114' ?
            (<IconAvalanche />) : ''
            )} */}
          <div className={style.eventPriceValue}> { !isNaN(Number(event.price)) ? (Number(event.price).toFixed(3) / (10**18)) : '-'}</div>
        </div>
      </td>
      <td className={style.event}>
        {event.fromAddress.slice(0, 6)}...{event.fromAddress.slice(-4)}
      </td>
      <td className={style.event}>
        {event.toAddress.slice(0, 6)}...{event.toAddress.slice(-4)}
      </td>
      <td className={style.event}>
        <Moment fromNow>{event.blockTimestamp}</Moment>
      </td>
    </tr>
  )
}

export default EventItem
