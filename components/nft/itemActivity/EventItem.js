import Moment from 'react-moment'
import Link from 'next/link'
import { useThemeContext } from '../../../contexts/ThemeContext'
import { IconPolygon, IconEthereum, IconBNB } from '../../icons/CustomIcons'

const style = {
  event: `p-2 py-4 text-sm text-center whitespace-nowrap`,
  eventIcon: `mr-2 text-sm flex justify-center items-center`,
  eventName: `p-3 min-w-[72px] text-[12px] font-bold py-0 rounded-md text-sm bg-neutral-300`,
  eventPrice: `flex items-center justify-center`,
  eventPriceValue: `text-sm -ml-1`,
  ethLogo: `h-5 mr-2`,
  accent: `text-neutral-900`,
}

const chainIcon = {
  '97': <IconBNB width="1.3rem" height="1.3rem" />,
  '80001': <IconPolygon width="1.3rem" height="1.3rem" />,
  '5': <IconEthereum width="1.3rem" height="1.3rem" />,
  '4': <IconEthereum width="1.3rem" height="1.3rem" />
}
const chainExplorer = {
  '97': process.env.NEXT_PUBLIC_EXPLORER_TBNB,
  '80001': process.env.NEXT_PUBLIC_EXPLORER_MUMBAI,
  '5': process.env.NEXT_PUBLIC_EXPLORER_GOERLI,
  '4': process.env.NEXT_PUBLIC_EXPLORER_RINKEBY,
  '1': process.env.NEXT_PUBLIC_EXPLORER_MAINNET,
}
const pillcolor = {
  'Mint' : ' bg-lime-300 text-lime-700',
  'List' : ' bg-indigo-300 text-indigo-700',
  'Auction' : ' bg-pink-300 text-pink-700',
  'Buy': ' bg-green-300 text-green-700',
  'Delist': ' bg-grey-300 text-grey-700',
  'Burn': ' bg-red-300 text-red-700',
  'Bid': ' bg-amber-300 text-amber-700',
  'Offer': ' bg-amber-400 text-amber-800',
}

const EventItem = ({ event }) => {
  const { dark } = useThemeContext()

  return (
    <tr
      className={
        dark ? ' text-neutral-100 hover:bg-slate-700' : ' hover:bg-neutral-200'
      }
    >
      <td className={style.event}>
        <div className={style.eventIcon}>
          <div className={style.eventName + pillcolor[event.event]}>
            <Link href={`${chainExplorer[event.chainId]}${event.transactionHash}`}>
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
          <div className={style.eventPriceValue}> { !isNaN(Number(event.price)) ? Number(event.price).toFixed(5) : '-'}</div>
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
