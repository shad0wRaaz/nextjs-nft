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
  eventPriceValue: `text-sm -ml-1 pl-1`,
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
  const { chainExplorer, chainIcon, blockchainIdFromName, marketplaces } = useSettingsContext();
  let eventName = '';
  const price = ((Number(event?.value)) / (10**18)).toString().replace(/(\.\d*?[1-9])0+$/, '$1')

  if(event.from_address === "0x0000000000000000000000000000000000000000"){ eventName = 'Mint'}
  else if(event.to_address === "0x0000000000000000000000000000000000000000"){ eventName = 'Burn'}
  else if(marketplaces.includes(event.from_address)){ eventName = 'Buy'}
  else if(marketplaces.includes(event.to_address)){ eventName = 'List'}
  else { eventName = 'Transfer'}

  return (
    <tr
      className={
        dark ? ' text-neutral-100 hover:bg-slate-700' : ' hover:bg-neutral-200'
      }
    >
      <td className={style.event}>
        <div className={style.eventIcon}>
          <div className={style.eventName + pillcolor[eventName]}>
            <a href={`${chainExplorer[blockchainIdFromName[thisNFTblockchain]]}tx/${event.transaction_hash}`} target="_blank">
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
          <div className={style.eventPriceValue}>
            { !isNaN(Number(price)) ? 
                (
                  (price > 1) ? (price / (10**18)).toFixed(3).replace(/[.,]0+$/, "") : price 
                ) : '-'}
          </div>
        </div>
      </td>
      <td className={style.event}>
        {event.from_address.slice(0, 6)}...{event.from_address.slice(-4)}
      </td>
      <td className={style.event}>
        {event.to_address.slice(0, 6)}...{event.to_address.slice(-4)}
      </td>
      <td className={style.event}>
        <Moment fromNow>{event.block_timestamp}</Moment>
      </td>
    </tr>
  )
}

export default EventItem
