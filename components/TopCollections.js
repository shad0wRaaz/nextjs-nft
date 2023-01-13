import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import CollectionCard from './CollectionCard'
import background from '../assets/nftworlds.jpg'
import { IconLoading } from './icons/CustomIcons'
import { RiArrowUpDownLine } from 'react-icons/ri'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { getTopTradedNFTCollections } from '../fetchers/SanityFetchers'

const style = {
  wrapperContainer: 'topCollectionWrapper text-center bg-center bg-top md:bg-center md:bg-cover z-1 relative',
  wrapper: 'container mx-auto lg:p-[8rem] p-[2rem]',
  title: 'font-bold mb-[2rem] grow text-center flex flex-col md:flex-row justify-center items-center gap-2 text-white text-[3rem]',
  collectionWrapper:
    'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  collection:
    'cursor-pointer py-4 px-[1rem] md:w-1/6 sm:w-[40%] flex items-center justify-start rounded-xl border bg-white hover:bg-[#ffffffcc] transition duration-300',
  imageContainer:
    'bg-[#eeeeee] mr-[1rem] rounded-full relative h-[60px] w-[60px] overflow-hidden',
  collectionDescriptionContainer: 'flex flex-col',
  collectionTitle: 'font-bold text-medium text-left',
  itemTitle: 'text-black text-sm text-left',
  coinLogo: 'inline mr-[3px] ml-[5px] h-[15px] w-auto',
}

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}

const people = [
  { name: '24hr' },
  { name: 'Weekly' },
  { name: 'Monthly' },
  { name: 'Yearly' },
  { name: 'All Time' },
]

const TopCollections = () => {
  const { dark } = useThemeContext();
  const [showTop, setShowTop] = useState(true);
  const [allCollections, setAllCollections] = useState();
  const { topTradedCollections, setTopTradedCollections, selectedBlockchain } = useMarketplaceContext();

  const { data, status, isFetching } = useQuery(
    ['topcollection', selectedBlockchain],
    getTopTradedNFTCollections(),
    {
      enabled: true,
      onError: () => {
        toast.error(
          'Error fetching data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: async (res) => {
        setAllCollections(res)

        // const unresolved = res.map(async (item) => {
        //   const obj = { ...item }
        //   const profilePath = await getUnsignedImagePath(item.profileImage)
        //   const bannerPath = await getUnsignedImagePath(item.bannerImage)
        //   obj['profileImage'] = profilePath?.data.url
        //   obj['bannerImage'] = bannerPath?.data.url
        //   return obj
        // })

        // const resolvedPaths = await Promise.all(unresolved)

        // setAllCollections(resolvedPaths)
      },
    }
  )

  useEffect(() => {
    if(!allCollections) return
    if(showTop){
      var latestCollection = allCollections.sort((a,b) => {return (b.volumeTraded - a.volumeTraded)})
      latestCollection = latestCollection.slice(0, 8)

      setTopTradedCollections(latestCollection)
    }
    else {
      var latestCollection = allCollections.sort((a,b) => {return (new Date(b._createdAt) - new Date(a._createdAt))})
      latestCollection = latestCollection.slice(0, 8)
      setTopTradedCollections(latestCollection)
    }

    return() => {
      //do nothing
    }
  }, [showTop, allCollections])

  return (
    <div className={style.wrapperContainer} style={{ backgroundImage: `url(${background.src})`}}>
      <div className={style.wrapper}>
        <div className="flex-between flex flex-col md:flex-row items-center relative z-10">
          <h2 className={style.title}><span className="textGradGreen">{showTop ? 'Top Traded' : 'Latest'}</span> Collections</h2>
          <div>
            <div className={`z-20  w-[3rem] h-[3rem] border flex justify-center items-center mb-[2rem] py-1 px-2 rounded-xl items-center ${dark ? ' bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : ' bg-slate-100 hover:bg-slate-200'} cursor-pointer`}  onClick={() => setShowTop(current => !current)}>
              <RiArrowUpDownLine className="cursor-pointer text-lg" />
            </div>
          </div>
        </div>
        {topTradedCollections && (
          <div className={style.collectionWrapper}>
            {topTradedCollections.length > 0 &&
              topTradedCollections.map((coll, id) => (
                <CollectionCard
                  key={id}
                  id={coll.id}
                  name={coll.name}
                  contractAddress={coll.contractAddress}
                  profileImage={coll.web3imageprofile}
                  bannerImage={coll.web3imagebanner}
                  description={coll.description}
                  floorPrice={coll.floorPrice}
                  volumeTraded={coll.volumeTraded}
                  allOwners={coll.allOwners}
                  chainId={coll.chainId}
                  creator={coll.creator}
                  creatorAddress={coll.creatorAddress}
                />
              ))}
          </div>
        )}
        {status === 'loading' && (
          <div className="flex items-center justify-center gap-2">
            <IconLoading dark={dark} /> Loading{' '}
          </div>
        )}
      </div>
    </div>
  )
}

export default TopCollections
