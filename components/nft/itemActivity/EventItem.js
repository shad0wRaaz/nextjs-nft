import Moment from 'react-moment'
import Link from 'next/link'
import { useThemeContext } from '../../../contexts/ThemeContext'
import { IconPolygon, IconEthereum } from '../../icons/CustomIcons'

const style = {
  event: `p-2 py-4 text-sm text-center`,
  eventIcon: `mr-2 text-sm flex justify-center items-center`,
  eventName: `p-3 min-w-[72px] text-[12px] font-bold py-0 rounded-full text-sm bg-neutral-300`,
  eventPrice: `flex items-center justify-center`,
  eventPriceValue: `text-sm pl-1`,
  ethLogo: `h-5 mr-2`,
  accent: `text-neutral-900`,
}

const EventItem = ({ event }) => {
  const { dark } = useThemeContext()
  let pillColor
  if (event.event == 'Mint') {
    pillColor = ' bg-amber-300 text-amber-700'
  }
  if (event.event == 'List' || event.event == 'Auction') {
    pillColor = ' bg-indigo-300 text-indigo-700'
  }
  if (event.event == 'Buy') {
    pillColor = ' bg-green-300 text-green-700'
  }
  if (event.event == 'Delist') {
    pillColor = ' bg-indigo-300 text-indigo-700'
  }
  if (event.event == 'Burn') {
    pillColor = ' bg-red-300 text-red-700'
  }
  let explorerLink
  if (!event.transactionHash) {
    explorerLink = '#'
  } else {
    explorerLink = `https://mumbai.polygonscan.com/tx/${event.transactionHash}`
  }

  return (
    <tr
      className={
        dark ? ' text-neutral-100 hover:bg-slate-700' : ' hover:bg-neutral-200'
      }
    >
      <td className={style.event}>
        <div className={style.eventIcon}>
          <div className={style.eventName + pillColor}>
            <Link href={explorerLink}>
              <a target="_blank">{event.event}</a>
            </Link>
          </div>
        </div>
      </td>
      <td className={style.event}>
        <div className={`${style.eventPrice} flex-[2]`}>
          {event.event !== 'Mint' &&
            event.event != 'Delist' &&
            event.event != 'Burn' &&
            (event.chainId == '800001' || event.chainId == '137' ? (
              <IconPolygon width={'10'} height={'10'} />
            ) : event.chainId == '1' || event.chainId == '4' ? (
              <IconEthereum />
            ) : (
              <IconPolygon />
            ))}
          <div className={style.eventPriceValue}> {event.price}</div>
        </div>
      </td>
      <td className={style.event}>
        {event.from.slice(0, 6)}..{event.from.slice(-4)}
      </td>
      <td className={style.event}>
        {event.to.slice(0, 6)}..{event.to.slice(-4)}
      </td>
      <td className={style.event}>
        <Moment fromNow>{event._createdAt}</Moment>
      </td>
    </tr>
  )
}

export default EventItem
