import React from 'react'

const SkeletonLoader = (props) => {
    
  return (
    <div className={`absolute inset-0 h-full w-full rounded-${props.roundness} object-cover animate-pulse bg-gray-300`}>

    </div>
  )
}

export default SkeletonLoader