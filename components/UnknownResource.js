import React from 'react'
import NoImage from '../assets/noimgcat.png'

const style= {
    wrapper: 'rounded-xl p-[4rem] flex justify-center items-center bg-white',
    title: 'text-5xl text-black text-center font-bold',
    description: 'font-bold text-sm text-black mt-4'
}
const UnknownResource = () => {
  return (
    <div className={style.wrapper}>
        <img src={NoImage.src} />
        <div>
            <p className={style.title}>
                Unknown Resource
            </p>
            <p className={style.description}>
                This resource might have been permanently moved to different place.
            </p>
        </div>
    </div>
  )
}

export default UnknownResource