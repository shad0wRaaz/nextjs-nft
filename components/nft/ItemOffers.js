import React, { useEffect, useState } from 'react'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import { useMarketplace } from '@thirdweb-dev/react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { FiTag } from 'react-icons/fi'
import { BiChevronUp } from 'react-icons/bi'
import { BigNumber } from 'ethers'
import { getUnsignedImagePath } from '../../fetchers/s3'
import { getUser } from '../../fetchers/SanityFetchers'
import { useQuery } from 'react-query'
import { getMarketOffers } from '../../fetchers/Web3Fetchers'
import { IconPolygon } from '../icons/CustomIcons'

const errorToastStyle = {
    style: { background: '#ef4444', padding: '16px', color: '#fff' },
    iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
  }
const successToastStyle = {
style: { background: '#10B981', padding: '16px', color: '#fff' },
iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}
const currency = {
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : <IconPolygon />
 }

const style = {
  wrapper: `w-full mt-8 border rounded-xl overflow-hidden`,
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
  const [toggle, setToggle] = useState(true)
  const { dark } = useThemeContext()
  const [itemEvents, setItemEvents] = useState()
  // console.log(selectedNft)
  // console.log(listingData)
  const { marketplaceAddress } = useMarketplaceContext()
  const marketModule = useMarketplace(marketplaceAddress)
  const { data: eventData } = useQuery(
    ['eventData', listingData?.id],
    getMarketOffers(marketModule),
    {
      onError: (err) => {
        console.log(err)
      },
      onSuccess: async (res) => {
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
          console.log(obj)
          const userImg = await getUnsignedImagePath('profileImage-' + e.data.offeror)
          console.log(userImg)
          obj['profileImage'] = userImg?.data.url
          return obj
        })
        const itemDatawithUserProfile = await Promise.all(unres)  
        
        setItemEvents(itemDatawithUserProfile)
      }
    }
  )
useEffect(() => {
  console.log(itemEvents)
}, [itemEvents])
  

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
        <table className="w-full sm:overflow-scroll pb-8">
          <tbody>
            {!listingData || itemEvents.length == 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <span className="text-md">No Offers found.</span>
                </td>
              </tr>
            )}

            {listingData && itemEvents?.length > 0 && itemEvents?.map((event, id) => (
              <tr key={id}>
                <td className="p-4 pl-8 border-t border-slate-200 w-0">
                  <div className="rounded-full w-[48px] h-[48px] mr-0 border border-1 border-white overflow-hidden">
                    <img src={event?.profileImage} alt={event?.offeredBy?.userName} className="object-cover h-full w-full"/>
                  </div>
                </td>
                <td className="p-4 border-t pl-0 border-slate-200">
                  <p className="text-sm">New Offer by <a className="text-slate-800 font-bold" href={`/user/${event.data.offeror}`}>{event?.offeredBy.userName}</a></p>
                  <p className="text-sm">
                    {currency[event?.data?.currency]}
                    <span className="-ml-1">{BigNumber.from(event?.data?.totalOfferAmount)/(BigNumber.from(10).pow(18))}</span>
                    <span></span>
                  </p>
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