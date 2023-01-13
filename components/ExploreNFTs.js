import Link from 'next/link'
import NFTItem from './NFTItem'
import bsclogo from '../assets/bsc.png'
import maticlogo from '../assets/matic.png'
import ethereumlogo from '../assets/ethereum.png'
import avalancelogo from '../assets/avalance.png'
import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { useAddress } from '@thirdweb-dev/react'


const style = {
  wrapper: 'container text-center mx-auto lg:p-[8rem] p-[2rem]',
  title: 'font-bold text-[2rem] mb-[2rem]',
  collectionWrapper: 'flex justify-center flex-row flex-wrap gap-[40px]',
  collection:
    'cursor-pointer py-4 px-[1rem] md:w-1/6 sm:w-[40%] flex items-center justify-start rounded-xl border bg-white hover:bg-[#ffffffcc] transition duration-300',
  imageContainer:
    'bg-[#eeeeee] mr-[1rem] rounded-full max-w-[80px] h-[60px] w-[60px] overflow-hidden',
  collectionDescriptionContainer: 'flex flex-col',
  collectionTitle: 'font-bold text-medium text-left',
  itemTitle: 'text-black text-sm text-left',
  coinLogo: 'inline mr-[3px] ml-[5px]',
  nftwrapper: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`,
  button:
    'text-md rounded-full cursor-pointer gradBlue py-4 px-8 text-neutral-100',
}

const ExploreNFTs = () => {
  const address = useAddress();
  const { dark } = useThemeContext();
  const { latestNfts, selectedBlockchain, setSelectedBlockchain } = useMarketplaceContext();

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}><span className="textGradCyan">Explore Latest NFTs</span></h2>
      {!address && (
        <div className="container mx-auto mb-[4rem] flex justify-center">
          <div
            className={`border ${
              dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
            } flex justify-between gap-2 overflow-hidden rounded-full p-1 shadow`}
          >
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-4 ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                selectedBlockchain == 'goerli' &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => setSelectedBlockchain('goerli')}
            >
              <img src={ethereumlogo.src} width="20px" className="inline-block" />
              <span className="inline-block pl-2">Ethereum</span>
            </div>
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-4 ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                selectedBlockchain == 'binance-testnet' &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => setSelectedBlockchain('binance-testnet')}
            >
              <img src={bsclogo.src} width="20px" className="inline-block" />
              <span className="inline-block pl-2">Binance</span>
            </div>
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-4 ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                selectedBlockchain == 'mumbai' &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => setSelectedBlockchain('mumbai')}
            >
              <img src={maticlogo.src} width="18px" className="inline-block" />
              <span className="inline-block pl-2">Polygon</span>
            </div>
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-4 ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                selectedBlockchain == 'avalanche-fuji' &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => setSelectedBlockchain('avalanche-fuji')}
            >
              <img src={avalancelogo.src} width="18px" className="inline-block" />
              <span className="inline-block pl-1">Avalance</span>
            </div>
          </div>
        </div>
      )}

      {latestNfts?.length == 0 && (
        <div>
          <span>No NFTs are available.</span>
        </div>
      )}

      {latestNfts?.length > 0 && (
        <div className={style.nftwrapper}>
          {latestNfts?.map((nftItem, id) => (
            <React.Fragment key={id}>
              {nftItem.asset.properties?.tokenid && (
                <NFTItem key={id} nftItem={nftItem} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center pt-8">
        <Link href="/search?n=&i=true&v=true&a=true&d=true&ac=true&h=true&_r=0&r_=10000">
          <div className={style.button}>Browse All NFTs</div>
        </Link>
      </div>
    </div>
  )
}

export default ExploreNFTs
