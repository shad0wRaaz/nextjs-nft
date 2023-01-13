import { Fragment, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { config } from '../lib/sanityClient'
import { Combobox, Transition } from '@headlessui/react'
import { RiSearchLine } from 'react-icons/ri'
import { useSearchContext } from '../contexts/SearchContext'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  comboMenu: `absolute mt-1 max-h-xl w-full overflow-auto rounded-3xl p-4 text-base shadow-lg ring-0 focus:outline-none sm:text-sm sm:w-[300px] searchOutputBox`,
}

const SearchBar = () => {
  const [selected, setSelected] = useState('Search Collections')
  const [query, setQuery] = useState('')
  const [collectionArray, setCollectionArray] = useState([])
  const router = useRouter()
  const { dark } = useThemeContext()

  //get all collection names from sanity
  useMemo(() => {
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftCollection"] {
        name,
        _id,
        contractAddress,
        
      }`
      const collectionData = await sanityClient.fetch(query)
      setCollectionArray(collectionData)
    })()
  }, [])

  const filteredCollection =
    query === ''
      ? ''
      : collectionArray.filter(
          (collection) =>
            collection.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, '')) ||
            collection.contractAddress
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')) ||
            collection._id
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div
      className={`z-20 h-[2.6rem] w-full border-0 bg-transparent px-4 pl-5 outline-0 ring-0 ${
        dark
          ? 'text-black placeholder:text-neutral-200'
          : 'text-black placeholder:text-neutral-100'
      }`}
    >
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left  sm:text-sm">
            <Combobox.Input data-headlessui-state=""
              className={`w-full rounded-full border-transparent bg-transparent bg-none py-2 pl-[1.4rem] pr-10 text-sm leading-5 outline-none ${
                dark
                  ? ' placeholder:text-neutral-500'
                  : 'placeholder:text-neutral-100'
              } focus-within:bg-transparent focus:ring-0 focus-visible:ring-opacity-0`}
              displayValue=""
              onChange={(event) => setQuery(event.target.value)}
              onFocus={(event) => (event.target.value = '')}
              onBlur={(event) =>
                event.target.value == ''
                  ? (event.target.value = 'Search Collections')
                  : ''
              }
            />
            <Combobox.Button className="absolute  right-0 flex items-center pr-2" data-headlessui-state="" aria-haspopup="true">
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
              {filteredCollection.length === 0 && query !== '' ? (
                <div
                  className={`relative cursor-default select-none bg-transparent bg-none py-2 px-4 ${
                    dark ? ' text-neutral-100' : ' text-gray-700'
                  } `}
                >
                  <span>Nothing found.</span>
                  <button
                    onClick={() => router.push('/search')}
                    className={`mt-3 block rounded-md border ${
                      dark
                        ? ' border-slate-500 bg-slate-600 hover:bg-slate-500'
                        : ' border-sky-200 bg-sky-100 hover:bg-sky-200'
                    } p-1 px-2 text-[12px] `}
                  >
                    Use Advanced Search
                  </button>
                </div>
              ) : (
                filteredCollection.length > 0 &&
                filteredCollection?.map((collectionArray) => (
                  <Combobox.Option
                    id={collectionArray.contractAddress}
                    aria-haspopup="true"
                    data-headlessui-state=""
                    key={collectionArray.contractAddress}
                    className={({ active }) =>
                      `relative select-none rounded-xl py-2 pl-4 pr-4 ${
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
                      <a
                        href={`/collections/${collectionArray._id}`}
                        className="cursor-pointer"
                      >
                        {/* <img
                          src={collectionArray.profileImage}
                          className="inline-block h-[30px] w-[30px] rounded-full ring-2"
                        /> */}
                        <span
                          className={`truncate pl-2 ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {collectionArray.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-gray-900' : 'text-blue-100'
                            }`}
                          >
                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                          </span>
                        ) : null}
                      </a>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default SearchBar
