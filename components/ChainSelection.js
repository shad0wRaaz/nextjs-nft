import toast from 'react-hot-toast'
import React, { Fragment } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { Menu, Transition } from '@headlessui/react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'

const ChainSelection = () => {
    const { selectedBlockchain, setSelectedBlockchain } = useMarketplaceContext();
    const { chainIconByName, chainName, liveNetworks, testNetworks } = useSettingsContext();
    const { successToastStyle } = useThemeContext();
    
    const changeBlockchain = (selectedChainName) => {
        setSelectedBlockchain(selectedChainName);
        toast.success(`You are in ${selectedChainName} chain.`, successToastStyle);
    }
    
  return (
    <div className="md:mr-3">
      <Menu as="div" className="relative inline-block text-left z-30 w-full">
        {({open}) => (
          <>
            <div>
              <Menu.Button className="inline-flex w-full md:w-max justify-between items-center rounded-[10px] bg-black bg-opacity-20 shadow-md transition px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <div>
                  {chainIconByName[selectedBlockchain]}
                  {chainName[selectedBlockchain]}
                </div>
                <BiChevronDown className={`ml-2 -mr-1 transition duration-800 h-5 w-5 ${open && 'rotate-180'}`}/>
              </Menu.Button>
            </div>
            <Transition 
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right border border-slate-800 divide-y p-4 divide-slate-700 rounded-lg bg-slate-800  backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 pb-3">
                    <p className="w-full px-2 text-xs mb-2 text-neutral-100">MAINNETS</p>
                    {liveNetworks.map(chain => (
                      <Menu.Item key={chain.name}>
                        {({ active }) => (
                            <button
                                className={`${
                                active || selectedBlockchain == chain.key ? 'bg-slate-500/60 text-white' : 'text-slate-200'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition`}
                                onClick={() => changeBlockchain(chain.key)}> {chain.icon}
                                {chain.name}
                            </button>
                        )}
                      </Menu.Item>

                    ))}
                </div>
                <div className="px-1 py-5 pb-0">
                    <p className="w-full px-2 text-xs mb-2 text-neutral-100">TESTNETS</p>
                    {testNetworks.map(chain => (
                      <Menu.Item key={chain.name}>
                        {({ active }) => (
                            <button
                                className={`${
                                active || selectedBlockchain == chain.key ? 'bg-slate-500/60 text-white' : 'text-slate-200'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition`}
                                onClick={() => changeBlockchain(chain.key)}> {chain.icon}
                                {chain.name}
                            </button>
                        )}
                      </Menu.Item>

                    ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

export default ChainSelection