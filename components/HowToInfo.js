import React from 'react'
import Link from 'next/link'
import { ImFilePicture } from 'react-icons/im'
import { BsCollection, BsTags } from 'react-icons/bs'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper:
    'container mx-auto p-[20px] py-[100px] text-center text-white howToWrapper',
  title: `font-bold text-[2rem] mb-[2.2rem] px-[3rem]`,
  contentWrapper:
    'howToContentContainer relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4',
  content:
    'cursor-pointer z-10 bg-white p-[50px] rounded-3xl flex  justify-center flex-col w-full items-start hover:opacity-80',
  contentTitle: 'text-lg text-left font-bold mb-2 mt-4',
  contentDescription: 'text-left text-md ',
}

const HowToInfo = () => {
  const { dark } = useThemeContext()

  return (
    <div className={`${dark ? ' darkGray' : ' bg-[#F5F6F8]'}`}>
      <div className={style.wrapper}>
        <h2
          className={
            dark
              ? style.title + ' text-neutral-100'
              : style.title + ' text-black'
          }
        >
          Create and Sell your NFTs
        </h2>
        <div className={style.contentWrapper}>
          <div
            className={style.content}
            style={{
              background:
                'linear-gradient(145deg, #4f5ceb33 0%, #4f5ceb00 100%)',
            }}
          >
            <div className="mb-3 -mt-[25px] h-[60px] w-[60px] rounded-2xl bg-[#4F5CEB] p-4">
              <MdOutlineAccountBalanceWallet fontSize="30px" color="#ffffff" />
            </div>
            <span className="nc-Badge relative inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
              Step 1
            </span>
            <h2
              className={
                dark ? style.contentTitle : style.contentTitle + ' text-black'
              }
            >
              Create your wallet
            </h2>
            <p
              className={
                dark
                  ? style.contentDescription + ' text-neutral-100'
                  : style.contentDescription + ' text-black'
              }
            >
              Once you've set up your wallet of choice, connect it to Nuva NFT
              by clicking the wallet icon in the top right corner. Learn about
              the wallets we support.
            </p>
          </div>

          <Link href="/contracts">
            <div
              className={style.content}
              style={{
                background:
                  'linear-gradient(145deg, #ff6d3d33 0%, #ff6d3d00 100%)',
              }}
            >
              <div className="-mt-[25px] mb-3 h-[60px] w-[60px] rounded-2xl bg-[#FF6D3D] p-4">
                <BsCollection fontSize="30px" color="#ffffff" />
              </div>
              <span className="nc-Badge relative inline-flex rounded-full bg-pink-100 px-2.5 py-1 text-xs font-medium text-pink-800 ">
                Step 2
              </span>
              <h2
                className={
                  dark
                    ? style.contentTitle + ' text-neutral-100'
                    : style.contentTitle + ' text-black'
                }
              >
                Create your collection
              </h2>
              <p
                className={
                  dark
                    ? style.contentDescription + ' text-neutral-100'
                    : style.contentDescription + ' text-black'
                }
              >
                Click My Collections and set up your collection. Add social
                links, a description, profile & banner images, and set a
                secondary sales fee.
              </p>
            </div>
          </Link>

          <Link href="/contracts">
            <div
              className={style.content}
              style={{
                background:
                  'linear-gradient(145deg, #25cfaa33 0%, #25cfaa00 100%)',
              }}
            >
              <div className="mb-3 h-[60px] w-[60px] rounded-2xl bg-[#25CFAA] p-4">
                <ImFilePicture fontSize="30px" color="#ffffff" />
              </div>
              <span className="nc-Badge relative rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                Step 3
              </span>
              <h2
                className={
                  dark
                    ? style.contentTitle + ' text-neutral-100'
                    : style.contentTitle + ' text-black'
                }
              >
                Add your NFTs
              </h2>
              <p
                className={
                  dark
                    ? style.contentDescription + ' text-neutral-100'
                    : style.contentDescription + ' text-black'
                }
              >
                Upload your work (image, video, audio, or 3D art), add a title
                and description, and customize your NFTs with properties, stats,
                and unlockable content.
              </p>
            </div>
          </Link>

          <Link href="/contracts">
            <div
              className={style.content}
              style={{
                background:
                  'linear-gradient(145deg, #ffca4033 0%, #ffca4000 100%)',
              }}
            >
              <div className="mb-3 h-[60px] w-[60px] rounded-2xl bg-[#FFCA40] p-4">
                <BsTags fontSize="30px" color="#ffffff" />
              </div>
              <span className="nc-Badge relative inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                Step 4
              </span>
              <h2
                className={
                  dark
                    ? style.contentTitle + ' text-neutral-100'
                    : style.contentTitle + ' text-black'
                }
              >
                List them for sale
              </h2>
              <p
                className={
                  dark
                    ? style.contentDescription + ' text-neutral-100'
                    : style.contentDescription + ' text-black'
                }
              >
                Choose between auctions, fixed-price listings, and
                declining-price listings. You choose how you want to sell your
                NFTs, and we help you sell them!
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HowToInfo
