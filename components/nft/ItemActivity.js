import Loader from '../Loader'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { BiChevronUp } from 'react-icons/bi'
import EventItem from './itemActivity/EventItem'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { useUserContext } from '../../contexts/UserContext'
import { useThemeContext } from '../../contexts/ThemeContext'
import { getActivities } from '../../fetchers/SanityFetchers'
import toast from 'react-hot-toast'

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


const ItemActivity = ({ collectionAddress, selectedNft, metaDataFromSanity }) => {
  
  const [toggle, setToggle] = useState(false)
  const { dark, errorToastStyle, successToastStyle } = useThemeContext()

  const { data: activityData, status } = useQuery(
    ['activities', metaDataFromSanity?._id],
    getActivities(metaDataFromSanity?._id),
    {
      enabled: Boolean(metaDataFromSanity?._id),
      onError: () => {
        toast.error('Cannot fetch Item activities', errorToastStyle)
      },
      onSuccess: (res) => {
        //  console.log(res)
      },
    }
  )

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
        onClick={() => setToggle(!toggle)}
      >
        <div className={style.titleLeft}>
          <span className={style.titleIcon}>
            <HiOutlineLightningBolt />
          </span>
          Item Activity
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
        <div className="w-full overflow-auto max-h-[28rem]">
          <table className="w-full sm:overflow-scroll">
            <thead>
              <tr>
                <th
                  className={`border-y ${
                    dark ? 'border-slate-700' : 'border-neutral-200'
                  } p-4 text-sm font-normal`}
                >
                  Event
                </th>
                <th
                  className={`border-y ${
                    dark ? 'border-slate-700' : 'border-neutral-200'
                  } p-4 text-sm font-normal`}
                >
                  Price
                </th>
                <th
                  className={`border-y ${
                    dark ? 'border-slate-700' : 'border-neutral-200'
                  } p-4 text-sm font-normal`}
                >
                  From
                </th>
                <th
                  className={`border-y ${
                    dark ? 'border-slate-700' : 'border-neutral-200'
                  } p-4 text-sm font-normal`}
                >
                  To
                </th>
                <th
                  className={`border-y ${
                    dark ? 'border-slate-700' : 'border-neutral-200'
                  } p-4 text-sm font-normal`}
                >
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {status == 'loading' && (
                <tr>
                  <td colSpan="5">{<Loader />}</td>
                </tr>
              )}

              {status == 'success' && activityData.length == 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    <span className="text-sm">No activities recorded.</span>
                  </td>
                </tr>
              )}

              {status == 'success' && activityData.length > 0 && (
                <>
                  {activityData?.map((event, id) => (
                    <EventItem key={id} event={event} />
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ItemActivity
