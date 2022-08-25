import React, { useState } from 'react'
import { BiChevronUp } from 'react-icons/bi'
import { TiWarningOutline } from 'react-icons/ti'
import { useThemeContext } from '../../contexts/ThemeContext'

const style = {
    wrapper: `w-full mt-8 border rounded-xl overflow-hidden`,
    title: `px-6 py-4 flex items-center cursor-pointer`,
    titleLeft: `flex-1 flex items-center text-md font-bold`,
    titleIcon: `text-2xl mr-2`,
    titleRight: `text-xl transition`,
}

const ReportActivity = ({ collectionAddress, selectedNft }) => {
    const [toggle, setToggle] = useState(false)
    const { dark } = useThemeContext()

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
          Report Activity
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
        <div>Report data</div>
      )}
    </div>
  )
}

export default ReportActivity