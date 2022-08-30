import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import CollectionCard from './CollectionCard'
import { getTopTradedNFTCollections } from '../fetchers/SanityFetchers'
import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { RiArrowDropDownLine, RiCheckLine } from 'react-icons/ri'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconLoading } from './icons/CustomIcons'
import { useUserContext } from '../contexts/UserContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { getUnsignedImagePath } from '../fetchers/s3'

const style = {
  wrapper: 'container text-center mx-auto lg:p-[8rem] p-[2rem]',
  title: 'font-bold text-[2rem] mb-[2rem] grow text-center',
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
  const [selected, setSelected] = useState(people[0])
  const { dark } = useThemeContext()
  const { queryCacheTime, queryStaleTime } = useUserContext()
  const { topTradedCollections, setTopTradedCollections } =
    useMarketplaceContext()
  const { data, status, isFetching } = useQuery(
    'topcollection',
    getTopTradedNFTCollections(),
    {
      staleTime: queryCacheTime,
      cacheTime: queryStaleTime,
      enabled: !Boolean(topTradedCollections),
      onError: () => {
        toast.error(
          'Error fetching data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: async (res) => {
        const unresolved = res.map(async (item) => {
          const obj = { ...item }
          const profilePath = await getUnsignedImagePath(item.profileImage)
          const bannerPath = await getUnsignedImagePath(item.bannerImage)
          obj['profileImage'] = profilePath?.data.url
          obj['bannerImage'] = bannerPath?.data.url
          return obj
        })

        const resolvedPaths = await Promise.all(unresolved)
        setTopTradedCollections(resolvedPaths)
      },
    }
  )

  return (
    <div className={style.wrapper}>
      <div className="flex-between flex">
        <h2 className={style.title}>Top Traded Collections</h2>
        <div className="z-20 min-w-[140px]">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-1">
              <Listbox.Button
                className={`relative w-full cursor-pointer rounded-xl border ${
                  dark ? ' border-sky-400/20' : ' border-neutral-100'
                } py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm`}
              >
                <span className="block truncate">{selected.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <RiArrowDropDownLine
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-xl p-2 ${
                    dark ? ' bg-slate-700' : ' bg-white'
                  } text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
                >
                  {people.map((person, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-pointer select-none rounded-md py-2 pl-4 pr-4 ${
                          active
                            ? dark
                              ? ' bg-slate-600 text-neutral-100'
                              : 'bg-sky-100 text-neutral-900'
                            : dark
                            ? 'text-neutral-100'
                            : 'text-gray-900'
                        }`
                      }
                      value={person}
                    >
                      {({ selected }) => (
                        <div className="flex justify-between">
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {person.name}
                          </span>
                          {selected ? (
                            <span className="flex items-center pl-3 text-sky-600">
                              <RiCheckLine
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      {topTradedCollections && (
        <div className={style.collectionWrapper}>
          {topTradedCollections.length > 0 &&
            topTradedCollections.map((coll, id) => (
              <CollectionCard
                key={id}
                name={coll.name}
                contractAddress={coll.contractAddress}
                profileImage={coll.profileImage}
                bannerImage={coll.bannerImage}
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
      {/* {status === 'success' && (
        <div className={style.collectionWrapper}>
          {data.length > 0 &&
            data.map((coll, id) => (
              <CollectionCard
                key={id}
                name={coll.name}
                contractAddress={coll.contractAddress}
                profileImage={coll.profileImage}
                bannerImage={coll.bannerImage}
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
      )} */}
    </div>
  )
}

export default TopCollections
