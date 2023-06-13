import { CgSandClock } from 'react-icons/cg'
import Countdown from 'react-countdown'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useState } from 'react'

const AuctionTimer = ({ selectedNft, listingData, auctionItem }) => {
  const { dark } = useThemeContext()
  const [localListingData, setLocalListingData] = useState()

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if(completed){
      window.location.reload(false);
    }
    return (
      <div className="py-4">
          <div className="space-y-5">
            <div className="flex space-x-5 sm:space-x-10">
              <div className="flex flex-col ">
                <span className="text-2xl sm:text-4xl font-semibold">{days}</span>
                <span className="sm:text-lg">Days</span>
              </div>
              
              <div className="flex flex-col ">
                <span className="text-2xl sm:text-4xl font-semibold">{hours}</span>
                <span className="sm:text-lg">hours</span>
              </div>
              
              <div className="flex flex-col ">
                <span className="text-2xl sm:text-4xl font-semibold">{minutes}</span>
                <span className="sm:text-lg ">minutes</span>
              </div>
              
              <div className="flex flex-col ">
                <span className="text-2xl sm:text-4xl font-semibold">{seconds}</span>
                <span className="sm:text-lg">seconds</span>
              </div>
            </div>
          </div>
        </div>
    )
  }
 
  return (
    <div
      className={`py-9 text-center ${
        dark ? ' text-neutral-100' : ' text-neutral-800'
      }`}
    >
      {(Boolean(listingData) || Boolean(localListingData)) &&
        Boolean(selectedNft) && (
          <div className="space-y-5">
            <div className="flex items-center justify-center relative">
              <div className="relative">

              <CgSandClock
                className="animate-bounce duration-1000 absolute top-1 left-[-20px]"
                fontSize="20px"
              />
              <span className="mt-1 leading-none">
                {auctionItem ? 'Auction' : 'Listing'} ends in:
              </span>
              </div>
            </div>
            <div className="flex space-x-5 sm:space-x-10 justify-center">
              {auctionItem && (
                <Countdown date={new Date(parseInt(listingData.endTimeInEpochSeconds.hex, 16) * 1000)} renderer={renderer} />
                // <Countdown
                //   date={
                //     Date.now() +
                //     (BigNumber.from(
                //       listingData
                //         ? listingData.secondsUntilEnd
                //         : localListingData.secondsUntilEnd
                //     ).toNumber() -
                //       BigNumber.from(
                //         listingData
                //           ? listingData.startTimeInSeconds
                //           : localListingData.startTimeInSeconds
                //       ).toNumber()) *
                //       1000
                //   }
                //   renderer={renderer}
                // />
              )}

              {/* {auctionItem && Boolean(listingData.endTimeInEpochSeconds) && (
                <Countdown
                  date={
                    new Date(
                      BigNumber.from(
                        listingData.endTimeInEpochSeconds
                      ).toNumber()
                    )
                  }
                  renderer={renderer}
                />
              )} */}
            </div>
          </div>
        )}
    </div>
  )
}

export default AuctionTimer
