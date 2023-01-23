import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect } from 'react'
import toast from 'react-hot-toast'
import { BiChevronDown } from 'react-icons/bi'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconAvalanche, IconBNB, IconEthereum, IconPolygon } from './icons/CustomIcons'

const ChainSelection = ({}) => {
    const { selectedBlockchain, setSelectedBlockchain } = useMarketplaceContext();
    const { successToastStyle } = useThemeContext();
    const changeBlockchain = (selectedChainName) => {
        setSelectedBlockchain(selectedChainName);
        toast.success(`You are in ${selectedChainName} chain.`, successToastStyle);
    }
    const chainName = {
        'mainnet' : 'Ethereum',
        'polygon': 'Polygon',
        'binance': 'Binance Smart Chain',
        'avalanche': 'Avalanche',
        'goerli': 'Ethereum Goerli',
        'mumbai': 'Polygon Mumbai',
        'binance-testnet': 'Binance Smart Chain Testnet',
        'avalanche-fuji': 'Avalanche Fuji'
    }
    const chainIcon = {
        'mainnet' : <IconEthereum/>,
        'polygon': <IconPolygon/>,
        'binance': <IconBNB/>,
        'avalanche': <IconAvalanche/>,
        'goerli': <IconEthereum/>,
        'mumbai': <IconPolygon/>,
        'binance-testnet': <IconBNB/>,
        'avalanche-fuji': <IconAvalanche/>
    }

    useEffect(() => {
        if(!selectedBlockchain) return;
    }, [selectedBlockchain])

  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center items-center rounded-lg bg-black bg-opacity-20 border-slate-600/70 border px-4 py-4 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {chainIcon[selectedBlockchain]}
            {chainName[selectedBlockchain]}
            <BiChevronDown
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y p-4 divide-slate-600 rounded-lg bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 pb-3">
                <p className="w-full px-2 text-xs mb-2">MAINNETS</p>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active || selectedBlockchain == "mainnet" ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('mainnet')}> <IconEthereum/>
                        Ethereum
                    </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('polygon')}> <IconPolygon/>
                        Polygon
                    </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('binance')}> <IconBNB/>
                        Binance Smart Chain
                    </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('avalanche')}> <IconAvalanche/>
                        Avalanche
                    </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-5 pb-0">
                <p className="w-full px-2 text-xs mb-2">TESTNETS</p>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('goerli')}> <IconEthereum/>
                        Goerli
                    </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('mumbai')}> <IconPolygon/>
                        Mumbai
                    </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('binance-testnet')}> <IconBNB/>
                        Binance Testnet
                    </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-slate-500 text-white' : 'text-slate-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => changeBlockchain('avalanche-fuji')}> <IconAvalanche/>
                        Avalanche Fuji
                    </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ChainSelection