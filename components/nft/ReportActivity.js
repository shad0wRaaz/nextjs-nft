import moment from 'moment'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import React, { useState } from 'react'
import { BiChevronUp } from 'react-icons/bi'
import { RiTimerLine } from 'react-icons/ri'
import { TiWarningOutline } from 'react-icons/ti'
import { useThemeContext } from '../../contexts/ThemeContext'
import { getReportActivities } from '../../fetchers/SanityFetchers'


const style = {
    wrapper: `w-full mt-3 border rounded-xl overflow-hidden`,
    title: `px-6 py-4 flex items-center cursor-pointer`,
    titleLeft: `flex-1 flex items-center text-md font-bold`,
    titleIcon: `text-2xl mr-2`,
    titleRight: `text-xl transition`,
    reportWrapper: 'p-4 px-6 flex flex-col gap-3 max-h-96 overflow-y-scroll',
}

const ReportActivity = ({ selectedNft, metaDataFromSanity }) => {
    const [toggle, setToggle] = useState(true)
    const { dark, errorToastStyle } = useThemeContext();
    const { data:reportActivities, status } = useQuery(
        ['reportactivities', metaDataFromSanity?._id],
        getReportActivities(metaDataFromSanity?._id),
        {
            enabled: Boolean(metaDataFromSanity?._id),
            onError: (error) => {
                console.log(error)
                toast.error('Error fetching report activities.', errorToastStyle)
            },
            onSuccess: (res) => {
              //  console.log(res)
            }            
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
            <TiWarningOutline />
          </span>
          Report Activity {status == "success" && reportActivities.length > 0 && (`(${reportActivities.length})`)}
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
        <div className={style.reportWrapper}>
            {status == "success" && reportActivities.length == 0 && (<div className="text-center text-sm">No Reported Activities</div>)}
            {status == "success" && reportActivities.length > 0 && reportActivities?.map((report, index) => (
                <div className={`flex flex-row gap-3 py-2 border border-t-0 border-l-0 border-r-0 ${dark ? 'border-b-sky-700/30' : 'border-b-neutral-200'}`} key={index}>
                    <div className="text-sm py-1">{index + 1}.</div>
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <p className="rounded-lg py-1 text-sm px-3 w-fit bg-red-100 border-red-200 text-red-500">{report.eventTitle}</p>
                            <p className="py-1 px-3 text-sm text-neutral-400"><RiTimerLine className="inline-block" /> <span className="inline-block">{moment(report._createdAt).fromNow()}</span></p>
                        </div>
                        <p className="pb-3 px-3 text-sm">{report.description}</p>
                        <p className="text-sm opacity-80 italic">Reported By: <Link href={`/user/${report.from.walletAddress}`}>{report.from.userName != 'Unnamed' ? report.from.userName : report.from.walletAddress}</Link></p>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ReportActivity