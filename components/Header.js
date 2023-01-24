import Link from 'next/link'
import SearchBar from './SearchBar'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { BiUser } from 'react-icons/bi'
import { HiMenu } from 'react-icons/hi'
import Notifications from './Notifications'
import ThemeSwitcher from './ThemeSwitcher'
import { config } from '../lib/sanityClient'
import { GoDashboard } from 'react-icons/go'
import ChainSelection from './ChainSelection'
import nuvanftLogo from '../assets/nuvanft.png'
import { Menu, Transition } from '@headlessui/react'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { useState, useEffect, Fragment } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { MdOutlineCollections, MdOutlineWidgets } from 'react-icons/md'
import { getActiveListings, getLatestNfts } from '../fetchers/Web3Fetchers'
import { IconImage, IconMagnifier, IconProfile } from './icons/CustomIcons'
import { getMyCollections, getCoinPrices } from '../fetchers/SanityFetchers'
import { useAddress, useNetwork, useDisconnect, ConnectWallet, useChainId } from '@thirdweb-dev/react'

const style = {
  wrapper: ` mx-auto absolute top-0 w-full px-[1.2rem] lg:px-[8rem] py-[0.8rem] backdrop-blur-md border border-b-[#ffffff22] border-t-0 border-l-0 border-r-0 z-10 flex justify-center`,
  logoContainer: `flex items-center cursor-pointer m-0`,
  logoText: ` ml-[0.8rem] font-base text-2xl logoText`,
  searchBar: ` relative backdrop-blur-sm flex mx-[0.8rem] w-max-[520px] h-[50px] items-center border rounded-full transition linear focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`,
  searchIcon: `text-[#000000] mx-3 font-bold text-lg absolute`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-black placeholder:text-[#8a939b]`,
  headerItems: `flex items-center justify-end nonMobileMenu`,
  headerItem: `px-4 cursor-pointer font-bold`,
  headerIcon: `text-white flex justify-between gap-[5px] items-center rounded-full text-[17px] font-normal p-3 px-6 bg-blue-500 hover:opacity-80 cursor-pointer`,
  menuWrapper: 'relative',
  menu: 'absolute',
  walletAddress:
    'cursor-pointer font-bold text-center text-base flex justify-center items-center text-black mr-4',
  balance:
    'cursor-pointer flex text-center text-white rounded-full hover:bg-opacity-90 justify-center items-center py-2 px-4 fs-14 gradBlue hover:bg-200',
}

const Header = () => {
  
  const address = useAddress();
  const chainid = useChainId();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext()
  const disconnectWallet = useDisconnect();
  const { setCoinPrices, blockchainName } = useSettingsContext();
  const [isLogged, setIsLogged] = useState(false)
  const { setMyUser,setMyCollections } = useUserContext()
  const [{ data: { chain, chains }, loading, error }, switchNetwork] = useNetwork();
  const { setActiveListings, setLatestNfts, selectedBlockchain, setSelectedBlockchain } = useMarketplaceContext();
  const [isAdmin, setIsAdmin] = useState(false);

  const getAllAdminUsers = async () => {
    const query = '*[_type == "settings"]{adminusers}';
    const res = await config.fetch(query)
    return res[0].adminusers
  }

  const { data: collectionData, status: collectionStatus } = useQuery(
    ['mycollections', address],
    getMyCollections(),
    {
      enabled: Boolean(address), //only run this query if address is provided
      onError: () => {
        toast.error('Error fetching collection data. Refresh and try again', errorToastStyle)
      },
      onSuccess: async (res) => {
        setMyCollections(res);
      },
    }
  )

  const { data: coinData, status: coinStatus } = useQuery(
    ['coinPrices'],
    getCoinPrices(),
    {
      enabled: true,
      onError : () => {
        toast.error('Error getting latest price from cypto market.', errorToastStyle)
      },
      onSuccess: (res) => {
        setCoinPrices(res[0])
      }
    }
   ) 

   const { data: latestNfts, status: latestNftsStatus } = useQuery(
    ['latestNfts', selectedBlockchain],
    getLatestNfts(8),
    {
      onError: () => {
        toast.error('Error fetching latest NFT data. Refresh and try again.',errorToastStyle);
      },
      onSuccess: (res) => {
        setLatestNfts(res);
      },
    }
   )

  const { data: marketData, status: marketStatus } = useQuery(
    ['marketplace', selectedBlockchain],
    getActiveListings(),
    {
      enabled: false,
      onError: () => {
        toast.error(
          'Error fetching marketplace data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        setActiveListings(res)
      },
    }
  )

  //show error if any error during wallet connection
  useEffect(
    (toastHandler = toast) => {
      if (!error) return
      toastHandler.error("Error in connecting wallet", errorToastStyle)

      return() => {
        //do nothing
      }
    },[error])

  useEffect(() => {
    if (!address) {
      setIsLogged(false);
      setIsAdmin(false);
      setMyUser();
      return
    }
    ;(async () => {
      const userDoc = {
        _type: 'users',
        _id: address,
        userName: 'Unnamed',
        walletAddress: address,
        volumeTraded: 0,
      }

      //saves new user if not present otherwise returns the user data
      const user = await config.createIfNotExists(userDoc);
      setMyUser(user)
      setIsLogged(true)
    })();

    ;(async() => {
      const adminList = await getAllAdminUsers();
      const isThisUserAdmin = adminList.filter(user => user._ref == address)
      if(isThisUserAdmin.length > 0){
          setIsAdmin(true);
      }
    })();
  
    return() => {
        //do nothing//clean up function

    }
  }, [address])

  useEffect(() => {
    if(!chainid) return
        (blockchainName[chainid]);
  }, [chainid])

  // const handleDisconnect = () => {
  //   setIsLogged(false)
  //   localStorage.removeItem(`${address}`)
  //   disconnectWallet()
  //   setMyUser()
  //   disconnectNotification()
  // }

  // const disconnectNotification = (toastHandler = toast) => {
  //   toastHandler.success(`You have been disconnected !`, successToastStyle)
  // }

  // const changeBlockchain = (selectedChainName) => {
  //   setSelectedBlockchain(selectedChainName);
  //   toast.success(`You are in ${selectedChainName} chain.`, successToastStyle);
  // }

  return (
    <div className={style.wrapper}>
      <div className="container flex items-center justify-between">
      <Link href="/">
        <div className={style.logoContainer} style={{ marginLeft: 0 }}>
          <img src={nuvanftLogo.src} height={55} width={90} />
          {/* <div className={style.logoText}>
            <p className={dark ? 'text-neutral-100' : ''}>NUVA NFT</p>
          </div> */}
        </div>
      </Link>
      
      <div
        className={
          dark
            ? style.searchBar + ' border-sky-400/20 bg-[#ffffff99] text-black'
            : style.searchBar + ' border-neutral-200 bg-[#ffffff99] text-black'
        }
      >
        <div className={style.searchIcon}>
          <IconMagnifier />
        </div>
        <SearchBar />
      </div>

      {/* Mobile View Menu */}
      <div className="mobileMenu z-30 text-right">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="p-1">
              <HiMenu fontSize="25px" />
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
            <Menu.Items
              className={`absolute right-0 mt-2 w-72 origin-top-right divide-y ${
                dark
                  ? ' divide-slate-600 bg-slate-700 text-neutral-100'
                  : ' divide-gray-100 bg-white'
              } rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              <div className="px-1 py-1 ">
                {!isLogged && (
                  <div className="p-4">
                    <ChainSelection />
                  </div>
                  // <Menu.Item>
                  //   {({ active }) => (
                  //     <>
                  //       <div
                  //         className={`${
                  //           active ? 'bg-blue-500 ' : ''
                  //         } group rounded-md px-4 py-2 text-sm pt-4`}
                  //       >
                  //         <span className="flex w-full items-center ">
                  //           Select Chain
                  //         </span>
                  //       </div>
                  //       <div className="flex flex-col">
                  //       <div
                  //           className={`cursor-pointer flex gap-2 items-center rounded-full p-2 px-4 ${dark ? 'hover:bg-slate-700' : ''} ${(selectedBlockchain == "goerli" || selectedBlockchain == "mainnet") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
                  //           onClick={() => {
                  //             changeBlockchain('goerli')
                  //           }}
                  //         >
                  //           <IconEthereum />
                  //           <span className="inline-block text-sm">Ethereum</span>
                  //         </div>

                  //         <div
                  //           className={`cursor-pointer flex gap-2 items-center rounded-full p-2 px-4 ${dark ? 'hover:bg-slate-700' : ''} ${(selectedBlockchain == "binance-testnet" || selectedBlockchain == "binance") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
                  //           onClick={() => {
                  //             changeBlockchain('binance-testnet')
                  //           }}
                  //         >
                  //           <IconBNB />
                  //           <span className="inline-block text-sm">Binance</span>
                  //         </div>

                  //         <div
                  //           className={`cursor-pointer flex gap-2 items-center rounded-full p-2 px-4 ${dark ? 'hover:bg-slate-700' : ''}  ${(selectedBlockchain == "Polygon" || selectedBlockchain == "mumbai") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
                  //           onClick={() => {
                  //             changeBlockchain('mumbai')
                  //           }}
                  //         >
                  //           <IconPolygon />
                  //           <span className="inline-block text-sm">Polygon</span>
                  //         </div>

                  //         <div
                  //           className={`cursor-pointer flex gap-2 items-center rounded-full p-2 px-4 ${dark ? 'hover:bg-slate-700' : ''} ${(selectedBlockchain == "avalanche-fuji" || selectedBlockchain == "avalanche") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
                  //           onClick={() => {
                  //             changeBlockchain('avalanche-fuji')
                  //           }}
                  //         >
                  //           <IconAvalanche/>
                  //           <span className="inline-block text-sm">Avalance</span>
                  //         </div>
                  //       </div>
                  //     </>
                  //   )}
                  // </Menu.Item>
                )}

                {isLogged && (
                  <>
                   <Menu.Item>
                      {({ active }) => (
                        <div
                          className={`${
                            active ? 'bg-blue-500 ' : ''
                          } group rounded-md px-2 pt-2 pb-3 text-sm`}
                        >
                          <a
                            href="/contracts"
                            className="flex w-full items-center "
                          >
                            <MdOutlineWidgets 
                              className="mr-2"
                              fontSize="20px"
                            />{' '}
                            Mint
                          </a>
                        </div>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <div
                          className={`${
                            active ? 'bg-blue-500 ' : ''
                          } group rounded-md px-2 py-2 text-sm`}
                        >
                          <a
                            href="/collections/myCollection"
                            className="flex w-full items-center "
                          >
                            <MdOutlineCollections
                              className="mr-2"
                              fontSize="20px"
                            />{' '}
                            My NFTs/Collections
                          </a>
                        </div>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <div
                          className={`${
                            active ? 'bg-blue-500 ' : ''
                          } group rounded-md px-2 py-2 text-sm`}
                        >
                          <a
                            href="/profile"
                            className="flex w-full items-center "
                          >
                            <BiUser className="mr-2" fontSize="20px" /> Profile
                          </a>
                        </div>
                      )}
                    </Menu.Item>

                    {/* <Menu.Item>
                      {({ active }) => (
                        <div className="flex w-full items-center p-2">
                          <TiLink className="mr-2" fontSize="20px" />
                          <Menu
                            as="div"
                            className="relative inline-block grow text-left"
                          >
                            <div>
                              <Menu.Button
                                className={`w-full rounded-md border ${
                                  dark
                                    ? ' border-slate-500 bg-slate-600 hover:bg-slate-500'
                                    : ' border-neutral-200 bg-neutral-100 hover:bg-neutral-200'
                                }  flex items-center justify-between p-2 text-left  text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                              >
                                <span>
                                  {loading
                                    ? 'Connecting'
                                    : chain
                                    ? chain.name
                                    : ''}
                                </span>
                                <HiChevronDown className="ml-2" />
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
                              <Menu.Items
                                className={`absolute right-0 mt-2 w-56 origin-top-right divide-y ${
                                  dark
                                    ? ' divide-slate-600 bg-slate-600 text-neutral-100'
                                    : ' divide-gray-100 bg-white'
                                } rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                              >
                                <div className="px-1 py-1">
                                  {chains?.map((ch) => (
                                    <Menu.Item key={ch.id}>
                                      {({ active }) => (
                                        <button
                                          disabled={
                                            !switchNetwork ||
                                            ch.id === chain?.id
                                          }
                                          className={`${
                                            active ? 'bg-blue-500' : ''
                                          } group flex w-full items-center rounded-md px-2 py-2 text-left text-sm`}
                                          onClick={() => {
                                            if (switchNetwork) {
                                              switchNetwork(cId.id)
                                            }
                                          }}
                                        >
                                          {ch.name}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      )}
                    </Menu.Item> */}

                    {/* <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleDisconnect}
                          className={`${
                            active ? 'bg-blue-500' : ''
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <VscDebugDisconnect
                            className="mr-2"
                            fontSize="20px"
                          />{' '}
                          Disconnect
                        </button>
                      )}
                    </Menu.Item> */}
                  </>
                )}
                <div className="w-64 mx-auto mb-4 mt-4 pt-4 border-t border-slate-600">
                  <ConnectWallet accentColor="#0053f2" colorMode="light" className="rounded-xxl" />
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* End of Mobile View Menu */}

      <div
        className={
          dark
            ? style.headerItems + ' text-neutral-100'
            : style.headerItems + ' text-black'
        }
      >
        {!isLogged && (
          <ChainSelection />
          // <div
          //   className={`flex items-center backdrop-blur-md justify-between gap-1 rounded-md text-xs border ${
          //     dark ? ' border-sky-400/20' : ' border-neutral-200/40 bg-[#ffffff99]'
          //   } p-[0.37rem]`}
          // >
          //   <div className={style.headerItem}>
          //     <span className="inline-block">Select Chain</span>
          //   </div>

          //   <div
          //     className={`cursor-pointer flex rounded-full p-2 px-2 ${dark ? 'hover:bg-slate-700' : ''} ${(selectedBlockchain == "goerli" || selectedBlockchain == "mainnet") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
          //     onClick={() => {
          //       changeBlockchain('goerli')
          //     }}
          //   >
          //     <IconEthereum/>
          //     <span className="inline-block">Ethereum</span>
          //   </div>

          //   <div
          //     className={`cursor-pointer flex rounded-full p-2 px-2 ${dark ? 'hover:bg-slate-700' : ''} ${(selectedBlockchain == "binance-testnet" || selectedBlockchain == "binance") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
          //     onClick={() => {
          //       changeBlockchain('binance-testnet')
          //     }}
          //   >
          //     <IconBNB/>
          //     <span className="inline-block">Binance</span>
          //   </div>

          //   <div
          //     className={`cursor-pointer flex rounded-full p-2 px-2 ${dark ? 'hover:bg-slate-700' : ''}  ${(selectedBlockchain == "Polygon" || selectedBlockchain == "mumbai") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
          //     onClick={() => {
          //       changeBlockchain('mumbai')
          //     }}
          //   >
          //     <IconPolygon/>
          //     <span className="inline-block">Polygon</span>
          //   </div>

          //   <div
          //     className={`cursor-pointer flex gap-2 rounded-full p-2 px-2 ${dark ? 'hover:bg-slate-700' : ''} ${(selectedBlockchain == "avalanche-fuji" || selectedBlockchain == "avalanche") ? (dark ? 'bg-slate-700': 'bg-sky-100 hover:bg-sky-100') : ''}`}
          //     onClick={() => {
          //       changeBlockchain('avalanche-fuji')
          //     }}
          //   >
          //     <IconAvalanche/>
          //     <span className="inline-block">Avalance</span>
          //   </div>
          // </div>
        )}

        {address && isLogged && (
          <>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className={`px-5 py-3 flex text-white hover:text-black items-center gap-1 ${dark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-neutral-100'} rounded-xl`}>
                  <HiOutlineUserCircle fontSize={22}/> My Account
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className={` ${
                    dark
                      ? 'divide-sky-400/20 bg-slate-700 text-white'
                      : ' divide-gray-100 bg-white'
                  } absolute right-0 mt-2 w-72 origin-top-right divide-y  rounded-xl py-4 px-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30`}>
                    <div className="px-1 py-1 flex flex-col text-left">
                      <Menu.Item>
                        <div className={`p-3 py-2 text-left hover:bg-${dark ? 'slate-600' : 'neutral-100'} cursor-pointer rounded-md`}>
                          <Link href="/collections/myCollection">
                            <div className="flex gap-2 items-center">
                              <IconImage/> My NFTs and Collections
                            </div>
                          </Link>
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div className={`p-3 py-2 text-left hover:bg-${dark ? 'slate-600' : 'neutral-100'} cursor-pointer rounded-md`}>
                          <Link href="/profile" >
                            <div className="flex gap-1 items-center">
                              <IconProfile/> My Profile
                            </div>
                          </Link>
                        </div>
                      </Menu.Item>
                    </div>
                      
                  </Menu.Items>
              </Transition>
            </Menu>
            <div className="flex flex-row items-center gap-4 px-5">
              <a href="/dashboard">
                <div className={`${dark ? 'hover:bg-slate-800' : 'hover:bg-neutral-100 text-white hover:text-black'} p-2 -mr-2 rounded-xl cursor-pointer`}>
                  <GoDashboard fontSize={23}/>
                </div>
              </a>
              <ThemeSwitcher />
              <Notifications />
            </div>
            <div className={`rounded-md cursor-pointer px-5 py-3 text-black shadow-md bg-white `}>
              <Link href="/contracts">
                <div className={style.headerItem + " inline-flex gap-1 items-center"}><div className="animate-pulse"><MdOutlineWidgets /></div> Mint</div>
              </Link>
            </div>
          </>
        )}
        <ConnectWallet accentColor="#0053f2" colorMode={dark ? "dark": "light"} className=" ml-4" style={{ borderRadius: '50% !important'}} />
        {/* <div className="z-10 px-4 text-right">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className={style.balance}>
                {isLogged ? (
                  <>
                    <CgProfile fontSize="25px" style={{ marginRight: '5px' }} />
                    <span className={style.walletAddressText}>
                      {address?.slice(0, 4)}...{address?.slice(-4)}
                    </span>
                    <HiChevronDown className="ml-2" />
                  </>
                ) : (
                  <ConnectWallet accentColor="#f213a4" colorMode="dark" />
                  // <>
                  //   Connect Wallet <HiChevronDown className="ml-2" />
                  // </>
                )}
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
              <Menu.Items
                className={` ${
                  dark
                    ? 'divide-sky-400/20 bg-slate-700 text-white'
                    : ' divide-gray-100 bg-white'
                } absolute right-0 mt-2 w-64 origin-top-right divide-y  rounded-3xl py-4 px-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
              >
                <div className="px-1 py-1 ">
                  {!isLogged && (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={connectWithMetamask}
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <img src={MetaMask.src} className="mr-2 h-[25px]" />
                            Metamask
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <img src={Coinbase.src} className="mr-2 h-[25px]" />
                            Coinbase Wallet
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <img
                              src={Walletconnect.src}
                              className="mr-2 w-[23px]"
                            />
                            Wallet Connect
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <img
                              src={Emailwallet.src}
                              className="mr-2 w-[23px]"
                            />
                            Email Wallet
                          </button>
                        )}
                      </Menu.Item>
                    </>
                  )}
                  {isLogged && (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={`mb-4 flex  items-center justify-start gap-3 border-b ${
                              dark ? 'border-slate-600' : 'border-neutral-200'
                            } py-4 px-2`}
                          >
                            <div className="relative h-[50px] w-[50px] rounded-full">
                              <img
                                className="h-[50px] w-[50px] rounded-full object-cover "
                                src={myProfileImage?.data.url}
                              />
                            </div>
                            <div>
                              <p className="font-bold">{myUser?.userName}</p>
                              <p className="text-sm">
                                {address?.slice(0, 9)}...{address?.slice(-4)}
                              </p>
                            </div>
                          </div>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <div className="flex w-full items-center p-2">
                            <Menu
                              as="div"
                              className="relative inline-block grow text-left"
                            >
                              <div>
                                <Menu.Button
                                  className={`flex w-full items-center justify-between rounded-md border ${
                                    dark
                                      ? ' border-slate-500 bg-slate-600 text-neutral-100 hover:bg-slate-500'
                                      : ' border-neutral-200 bg-neutral-100 text-black hover:bg-neutral-200'
                                  } p-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                  <span>
                                    {loading
                                      ? 'Connecting'
                                      : chain
                                      ? chain.name
                                      : ''}
                                  </span>
                                  <HiChevronDown className="ml-2 inline" />
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
                                <Menu.Items
                                  className={`absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md ${
                                    dark ? ' bg-slate-600' : ' bg-white'
                                  } shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                >
                                  <div className="px-1 py-1">
                                    {chains?.map((ch) => (
                                      <Menu.Item key={ch.id}>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active
                                                ? dark
                                                  ? ' bg-slate-600 text-neutral-200 hover:bg-slate-500'
                                                  : 'bg-neutral-100 text-black'
                                                : dark
                                                ? ' text-neutral-100'
                                                : 'text-black'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-left text-sm`}
                                            onClick={() => {
                                              if (switchNetwork) {
                                                switchNetwork(ch.id)
                                              }
                                            }}
                                          >
                                            {ch.name}
                                          </button>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group rounded-md px-2 py-2 text-sm`}
                          >
                            <a
                              href="/profile"
                              className="flex w-full items-center "
                            >
                              <IconProfile />
                              <span className="pl-2">Profile</span>
                            </a>
                          </div>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick=""
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <IconHelp />
                            <span className="pl-2">Help</span>
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleDisconnect}
                            className={`${
                              active
                                ? dark
                                  ? ' bg-slate-600 text-neutral-200'
                                  : 'bg-neutral-100 text-black'
                                : dark
                                ? ' text-neutral-100'
                                : 'text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <IconDisconnect />
                            <span className="pl-2">Disconnect</span>
                          </button>
                        )}
                      </Menu.Item>
                    </>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div> */}
      </div>
      </div>
    </div>
  )
}

export default Header

