import axios from 'axios'
import { useRouter } from 'next/router'
import { useDebounce } from "use-debounce";
import { RiSearchLine } from 'react-icons/ri'
import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { useThemeContext } from '../contexts/ThemeContext'
import { getSearchValue } from '../fetchers/SanityFetchers'
import { useSettingsContext } from '../contexts/SettingsContext'

const style = {
  comboMenu: `absolute max-h-[300px] md:max-h-[500px] lg:left-[-22px] lg:top-[40px] overflow-hidden mt-1 rounded-xl p-4 text-base shadow-lg ring-0 focus:outline-none sm:text-sm w-[360px] md:w-[500px] lg:w-[550px] searchOutputBox`,
}

const SearchBar = () => {
  const [selected, setSelected] = useState('Search NFTs and Collections')
  const [query, setQuery] = useState('')
  const [filteredCollection, setFilteredCollection] = useState([])
  const router = useRouter()
  const { dark } = useThemeContext()
  const [loading, setLoading] = useState(false);
  const { HOST, chainIcon, blockchainName } = useSettingsContext();
  const [debouncedText] = useDebounce(query, 700);

  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    if (debouncedText) {
      ;(async() => {
        await getSearchValue(debouncedText, source.token)
          .then(res => setFilteredCollection(res?.data))
          .catch((e) => {
            if (axios.isCancel(source)) {
              return;
            }
            setFilteredCollection([]);
          });
      })() 
    } else {
      setFilteredCollection([]);
    }
    setLoading(false);
    return () => {
      source.cancel(
        "Canceled because of component unmounted or debounce Text changed"
      );
    };
  }, [debouncedText]);


  //get all collection names from sanity
  // useEffect(() => {
  //   return
  //   let searchData = [];
  //   ;(async () => {

  //     //get collection details
  //     await axios.get(`${HOST}/api/getallcollections`).then(collections => {
  //       collections = JSON.parse(collections.data)
  //       // console.log(collections)
  //       // setCollectionArray(collections);
  //       searchData.push(...collections);
  //     }).catch(err => {
  //       console.error(err);
  //     });
  //   })();

  //   ;(async () => {
  //     //get nft details
  //     await axios.get(`${HOST}/api/getAllNfts`).then(nfts => {
  //       nfts = JSON.parse(nfts.data)

  //       searchData.push(...nfts)
  //     }).catch(err => {
  //       console.error(err);
  //     });
  //   })()

  //   setCollectionArray(searchData);

  //   return() => {
  //     //do nothing
  //   }
  // }, []);
  
  // let filteredCollection = '';
  // if(collectionArray){
  //   filteredCollection =
  //     query === ''
  //       ? ''
  //       : collectionArray.filter(
  //           (collection) =>
  //             collection.name
  //               ?.toLowerCase()
  //               .replace(/\s+/g, '')
  //               .includes(query.toLowerCase().replace(/\s+/g, '')) ||
  //             collection.contractAddress
  //             ?.toLowerCase()
  //             ?.replace(/\s+/g, '')
  //             ?.includes(query.toLowerCase().replace(/\s+/g, '')) ||
  //             collection._id
  //               ?.toLowerCase()
  //               ?.replace(/\s+/g, '')
  //               ?.includes(query.toLowerCase().replace(/\s+/g, ''))
  //         )
  // }

  return (
    <div
      className={`z-20 h-[2.6rem] w-full border-0 bg-transparent px-4 pl-5 outline-0 ring-0 ${
        dark
          ? 'text-black placeholder:text-neutral-200'
          : 'text-black placeholder:text-neutral-100'
      }`}>
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left  sm:text-sm">
            <Combobox.Input data-headlessui-state="" aria-label='Search NFTs and Collections'
              className={`w-full rounded-full border-transparent bg-transparent bg-none py-2 px-[1.4rem] text-sm leading-5 outline-none ${
                dark
                  ? ' placeholder:text-neutral-500'
                  : 'placeholder:text-neutral-100'
              } focus-within:bg-transparent focus:ring-0 focus-visible:ring-opacity-0`}
              displayValue=""
              onChange={(event) => setQuery(event.target.value)}
              onFocus={(event) => (event.target.value = '')}
              onBlur={(event) =>
                event.target.value == ''
                  ? (event.target.value = 'Search NFTs and Collections')
                  : ''
              }
            />
            <Combobox.Button className="absolute  right-0 flex items-center pr-2" data-headlessui-state="" aria-haspopup="true" aria-label='Search'>
              <RiSearchLine color='#000000' className="h-5 w-5 text-black" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className={
                dark
                  ? style.comboMenu + ' bg-slate-700 text-neutral-100'
                  : style.comboMenu + ' bg-white text-black'
              }
            >
              <div className="max-h-[300px] md:max-h-[500px] overflow-scroll">
                {loading && 'Loading..'}
                {!loading && filteredCollection.length === 0 && query !== '' ? (
                  <div
                    className={`relative cursor-default text-center select-none bg-transparent bg-none p-4 ${
                      dark ? ' text-neutral-100' : ' text-gray-700'
                    } `}
                  >
                    <span>Nothing found.</span>
                    {/* <button
                      onClick={() => router.push('/search')}
                      className={`mt-3 block rounded-lg w-full border ${
                        dark
                          ? ' border-slate-500 bg-slate-600 hover:bg-slate-500'
                          : ' border-sky-200 bg-sky-100 hover:bg-sky-200'
                      } p-2 text-[12px] `}
                    >
                      Use Advanced Search
                    </button> */}
                  </div>
                ) : (
                  filteredCollection.length > 0 &&
                  filteredCollection?.map((collectionArray,index) => (
                      <a
                        key={index}
                        href={
                          collectionArray.item == "collection" ? 
                          `/collection/${blockchainName[collectionArray.chainId]}/${collectionArray.contractAddress}` : 
                          `/nft/${blockchainName[collectionArray.chainId]}/${collectionArray.contractAddress}/${collectionArray.id}`}
                        className="cursor-pointer"
                      >

                    {/* <a
                      key={collectionArray._id}
                      href={`/${collectionArray.contractAddress ? 'collections' : 'nfts'}/${collectionArray._id}`}
                      className="cursor-pointer"
                    > */}
                      <Combobox.Option
                        id={collectionArray._id}
                        aria-haspopup="true"
                        data-headlessui-state=""
                        key={collectionArray._id}
                        className={({ active }) =>
                          `relative select-none rounded-lg py-2 pl-4 pr-4 ${
                            active
                              ? dark
                                ? ' bg-slate-600 text-neutral-100'
                                : 'bg-blue-100 text-gray-900'
                              : dark
                              ? ' text-neutral-100'
                              : 'text-gray-900'
                          }`
                        }
                        value={collectionArray ? collectionArray : ''}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="rounded-md pr-0 inline-block -mr-1">
                              {chainIcon[collectionArray.chainId]}
                            </div>
                            <span
                              className={`truncate pl-2 ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {collectionArray.name}
                            </span>

                            <span className={`absolute top-2 right-3 items-center rounded-md ${dark ? 'bg-slate-500' : 'bg-indigo-50 text-sky-700'} px-2 py-0 text-[10px] font-bold  ring-1 ring-inset ring-indigo-700/10`}>
                              {collectionArray.item == "collection" ? 'COLLECTION' : 'NFT'}
                            </span>
                            {/* {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-gray-900' : 'text-blue-100'
                                }`}
                              >
                                N
                              </span>
                            ) : null} */}
                          </>
                            

                        )}
                      </Combobox.Option>
                    </a>
                  ))
                )}
              </div>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
    
  )
}

export default SearchBar
