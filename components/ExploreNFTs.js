import Link from 'next/link'
import NFTItem from './NFTItem'
import toast from 'react-hot-toast'
import React, { useState } from 'react'
import bsclogo from '../assets/bsc.png'
import maticlogo from '../assets/matic.png'
import { useAddress } from '@thirdweb-dev/react'
import ethereumlogo from '../assets/ethereum.png'
import avalancelogo from '../assets/avalance.png'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'




const ExploreNFTs = () => {
  const address = useAddress();
  const { dark, successToastStyle } = useThemeContext();
  const { latestNfts, selectedBlockchain, setSelectedBlockchain } = useMarketplaceContext();
  const [compact, setCompact] = useState(true);

  const style = {
    wrapper: 'container text-center mx-auto lg:p-[8rem] p-[2rem] relative z-0',
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
    nftwrapper: `grid grid-cols-1 ${compact ? 'md:grid-cols-4 lg:grid-cols-6' : 'md:grid-cols-2 lg:grid-cols-4'}  gap-8`,
    button:
      'text-md rounded-full cursor-pointer gradBlue py-4 px-8 text-neutral-100',
  }

  const changeBlockchain = (selectedChainName) => {
    setSelectedBlockchain(selectedChainName);
    toast.success(`You are in ${selectedChainName} chain.`, successToastStyle);
  }

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}><span className="textGradCyan">Freshly Listed NFTs</span></h2>
      {!address && (
        <div className="container mx-auto mb-[4rem] flex justify-center">
          <div
            className={`border ${
              dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
            } flex justify-between gap-2 overflow-auto rounded-full p-1 shadow text-sm`}
          >
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-2 px-4 transition ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                (selectedBlockchain == 'goerli' || selectedBlockchain == 'mainnet') &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => changeBlockchain('mainnet')}
              >
              <img src={ethereumlogo.src} width="20px" />
              <span className="pl-2">Ethereum</span>
            </div>
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-2 px-4 transition ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                (selectedBlockchain == 'binance' || selectedBlockchain == 'binance-testnet') &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => changeBlockchain('binance')}
            >
              <img src={bsclogo.src} width="20px" />
              <span className="pl-2">Binance</span>
            </div>
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-2 px-4 transition ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                (selectedBlockchain == 'mumbai' || selectedBlockchain == 'polygon') &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => changeBlockchain('polygon')}
            >
              <img src={maticlogo.src} width="18px" />
              <span className="pl-2">Polygon</span>
            </div>
            <div
              className={`flex cursor-pointer flex-row items-center rounded-full p-2 px-4 transition ${
                dark
                  ? ' hover:bg-slate-600 hover:text-neutral-100'
                  : ' hover:bg-sky-100 hover:text-black'
              } ${
                (selectedBlockchain == 'avalanche-fuji' || selectedBlockchain == 'avalanche') &&
                (dark ? ' bg-slate-600 text-white' : ' bg-sky-100')
              }`}
              onClick={() => changeBlockchain('avalanche')}
            >
              <img src={avalancelogo.src} width="18px" />
              <span className="pl-1">Avalance</span>
            </div>
          </div>
        </div>
      )}

      {latestNfts?.length == 0 && (
        <div>
          <span>No NFTs are available in the connected chain.</span>
        </div>
      )}

      {latestNfts?.length > 0 && (
        <div className={style.nftwrapper}>
          {latestNfts?.map((nftItem, id) => (
            <React.Fragment key={id}>
                <NFTItem key={id} nftItem={nftItem} chain={selectedBlockchain} compact={compact}/>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center pt-8">
        <Link href="/search?c=all&n=&i=true&v=true&a=true&d=true&ac=true&h=true&_r=0&r_=10000">
          <div className={style.button}>Browse All NFTs</div>
        </Link>
      </div>
    </div>
  )
}

export default ExploreNFTs
