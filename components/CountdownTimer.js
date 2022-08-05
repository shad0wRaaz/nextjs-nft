import React from 'react';
import { CgSandClock } from 'react-icons/cg'
import { useCountdown } from '../hooks/useCountdown'

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
   
  }

    return (
        <div className="py-9 border-b">
        <div className="space-y-5">
          <div className="text-neutral-500 flex items-center space-x-2 ">
            <CgSandClock className="animate-spin duration-700"/>
            <span className="leading-none mt-1">Auction ending in:</span>
          </div>
            
          <div className="flex space-x-5 sm:space-x-10">
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-2xl font-semibold">{days}</span>
              <span className="sm:text-lg text-neutral-500">Days</span>
            </div>
            
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-2xl font-semibold">{hours}</span>
              <span className="sm:text-lg text-neutral-500">hours</span>
            </div>
            
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-2xl font-semibold">{minutes}</span>
              <span className="sm:text-lg text-neutral-500">minutes</span>
            </div>
            
            <div className="flex flex-col ">
              <span className="text-2xl sm:text-2xl font-semibold">{seconds}</span>
              <span className="sm:text-lg text-neutral-500">seconds</span>
            </div>
          </div>
        </div>
      </div>
    )
};