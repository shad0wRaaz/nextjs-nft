import NFTItem from './NFTItem'
import Link from 'next/link'
import bsclogo from '../assets/bsc.png'
import maticlogo from '../assets/matic.png'
import ethereumlogo from '../assets/ethereum.png'
import avalancelogo from '../assets/avalance.png'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { BigNumber } from 'ethers'

const style = {
  wrapper: 'container p-[20px] mx-auto py-[100px] text-center exploreWrapper',
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
  const { dark } = useThemeContext()
  const { activeListings, selectedChain, setSelectedChain } =
    useMarketplaceContext()

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}>Explore NFTs</h2>

      <div className="container mx-auto mb-[4rem] flex justify-center">
        <div
          className={`border ${
            dark ? ' border-slate-600 bg-slate-700' : ' border-neutral-50'
          } flex justify-between gap-2 overflow-hidden rounded-full p-1 shadow`}
        >
          <div
            className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              selectedChain == 'Ethereum' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setSelectedChain('Ethereum')}
          >
            <img src={ethereumlogo.src} width="20px" className="inline-block" />
            <span className="inline-block pl-2">Ethereum</span>
          </div>
          <div
            className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              selectedChain == 'Binance' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setSelectedChain('Binance')}
          >
            <img src={bsclogo.src} width="20px" className="inline-block" />
            <span className="inline-block pl-2">Binance</span>
          </div>
          <div
            className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              selectedChain == 'Polygon' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setSelectedChain('Polygon')}
          >
            <img src={maticlogo.src} width="18px" className="inline-block" />
            <span className="inline-block pl-2">Polygon</span>
          </div>
          <div
            className={`flex cursor-pointer flex-row items-center rounded-full p-3 px-8 ${
              dark
                ? ' hover:bg-slate-600 hover:text-neutral-100'
                : ' hover:bg-sky-100 hover:text-black'
            } ${
              selectedChain == 'Avalance' &&
              (dark ? ' bg-slate-600 text-white' : ' bg-sky-500 text-white')
            }`}
            onClick={() => setSelectedChain('Avalance')}
          >
            <img src={avalancelogo.src} width="18px" className="inline-block" />
            <span className="inline-block pl-1">Avalance</span>
          </div>
        </div>
      </div>

      {activeListings?.length == 0 && (
        <div>
          <span>No NFTs are available.</span>
        </div>
      )}

      {activeListings?.length > 0 && (
        <div className={style.nftwrapper}>
          {activeListings?.map((nftItem, id) => (
            <NFTItem key={id} nftItem={nftItem} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center pt-8">
        <Link href="/browse">
          <div className={style.button}>Browse</div>
        </Link>
      </div>
    </div>
  )
}

export default ExploreNFTs
