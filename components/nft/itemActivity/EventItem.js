import Moment from 'react-moment'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import { useThemeContext } from '../../../contexts/ThemeContext'
import { useSettingsContext } from '../../../contexts/SettingsContext'
import { IconPolygon, IconEthereum, IconBNB, IconAvalanche } from '../../icons/CustomIcons'

const style = {
  event: `p-2 py-4 text-sm text-center whitespace-nowrap`,
  eventIcon: `mr-2 text-sm flex justify-center items-center`,
  eventName: `p-3 min-w-[72px] text-[12px] py-0 rounded-md text-sm cursor-pointer bg-neutral-300`,
  eventPrice: `flex items-center justify-center`,
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
  'Bid': ' bg-amber-200 text-amber-600',
  'Offer': ' bg-amber-200 text-amber-600',
}

const EventItem = ({ event }) => {
  const { dark } = useThemeContext()
  const { chainExplorer } = useSettingsContext();

  return (
    <tr
      className={
        dark ? ' text-neutral-100 hover:bg-slate-700' : ' hover:bg-neutral-200'
      }
    >
      <td className={style.event}>
        <div className={style.eventIcon}>
          <div className={style.eventName + pillcolor[event.event]}>
            <a href={`${chainExplorer[event.chainId]}${event.transactionHash}`} target="_blank">
              <div className="flex items-center justify-center gap-1">
                <RiCheckboxCircleFill fontSize={14} />{event.event}
              </div>
            </a>
          </div>
        </div>
      </td>
      <td className={style.event}>
        <div className={`${style.eventPrice} flex-[2]`}>
          {event.event !== 'Mint' &&
            event.event != 'Delist' &&
            event.event != 'Burn' &&
            (event.chainId == '80001' || event.chainId == '137' ? (
              <IconPolygon width={'15'} height={'15'} />
            ) : event.chainId == '1' || event.chainId == '5' ? (
              <IconEthereum />
            ) : event.chainId == '56' || event.chainId == '97' ? (
              <IconBNB />
            ) : event.chainId == '43113' || event.chainId == '43114' ?
            (<IconAvalanche />) : ''
            )}
          <div className={style.eventPriceValue}> { !isNaN(Number(event.price)) ? Number(event.price).toFixed(5) : '-'}</div>
        </div>
      </td>
      <td className={style.event}>
        {event.from.slice(0, 6)}...{event.from.slice(-4)}
      </td>
      <td className={style.event}>
        {event.to.slice(0, 6)}...{event.to.slice(-4)}
      </td>
      <td className={style.event}>
        <Moment fromNow>{event._createdAt}</Moment>
      </td>
    </tr>
  )
}

export default EventItem
