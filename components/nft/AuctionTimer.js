import { CgSandClock } from 'react-icons/cg'
import Countdown from 'react-countdown'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'

const AuctionTimer = ({ selectedNft, listingData, auctionItem }) => {
  const { dark } = useThemeContext()
  const { activeListings } = useMarketplaceContext()
  const [localListingData, setLocalListingData] = useState()
  // console.log(listingData)
  // console.log(
  //   new Date(BigNumber.from(listingData?.endTimeInEpochSeconds).toNumber())
  // )
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      //do something
    } else {
      return (
        <div className="flex space-x-5 sm:space-x-10">
          <div className="flex flex-col ">
            <span className="text-2xl font-semibold sm:text-2xl">{days}</span>
            <span className="sm:text-lg">Days</span>
          </div>

          <div className="flex flex-col ">
            <span className="text-2xl font-semibold sm:text-2xl">{hours}</span>
            <span className="sm:text-lg">hours</span>
          </div>

          <div className="flex flex-col ">
            <span className="text-2xl font-semibold sm:text-2xl">
              {minutes}
            </span>
            <span className="sm:text-lg">minutes</span>
          </div>

          <div className="flex flex-col ">
            <span className="text-2xl font-semibold sm:text-2xl">
              {seconds}
            </span>
            <span className="sm:text-lg">seconds</span>
          </div>
        </div>
      )
    }
  }
  return (
    <div
      className={`border-b py-9 ${
        dark ? ' text-neutral-100' : ' text-neutral-800'
      }`}
    >
      {(Boolean(listingData) || Boolean(localListingData)) &&
        Boolean(selectedNft) && (
          <div className="space-y-5">
            <div className="flex items-center space-x-2 ">
              <CgSandClock
                className="animate-pulse duration-1000"
                fontSize="20px"
              />
              <span className="mt-1 leading-none">
                {auctionItem ? 'Aution' : 'Listing'} ends in:
              </span>
            </div>
            <div className="flex space-x-5 sm:space-x-10">
              {!auctionItem && Boolean(listingData.secondsUntilEnd) && (
                <Countdown
                  date={
                    Date.now() +
                    (BigNumber.from(
                      listingData
                        ? listingData.secondsUntilEnd
                        : localListingData.secondsUntilEnd
                    ).toNumber() -
                      BigNumber.from(
                        listingData
                          ? listingData.startTimeInSeconds
                          : localListingData.startTimeInSeconds
                      ).toNumber()) *
                      1000
                  }
                  renderer={renderer}
                />
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
