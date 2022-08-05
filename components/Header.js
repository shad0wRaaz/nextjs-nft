import Link from 'next/link'
import Image from 'next/image'
import { CgProfile } from 'react-icons/cg'
import { HiChevronDown } from 'react-icons/hi'
import { TiLink } from 'react-icons/ti'
import nuvanftLogo from '../assets/nuvanft.png'
import toast, { Toaster } from 'react-hot-toast'
import { BsEye } from 'react-icons/bs'
import { MdOutlineCollections, MdOutlineWallpaper } from 'react-icons/md'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { BiUser } from 'react-icons/bi'
import { Menu, Transition } from '@headlessui/react'
import { useState, useEffect, Fragment } from 'react'
import SearchBar from './SearchBar'
import { HiMenu } from 'react-icons/hi'
import MetaMask from '../assets/metamask.svg'
import Coinbase from '../assets/coinbase.svg'
import Walletconnect from '../assets/walletconnect.svg'
import Emailwallet from '../assets/emailwallet.svg'
import { useRouter } from 'next/router'
import Notifications from './Notifications'
import ThemeSwitcher from './ThemeSwitcher'
import { useThemeContext } from '../contexts/ThemeContext'
import { useUserContext } from '../contexts/UserContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { getMyCollections } from '../fetchers/SanityFetchers'
import noProfileImage from '../assets/noProfileImage.png'
import {
  useChainId,
  useAddress,
  useNetwork,
  useMetamask,
  useDisconnect,
  useCoinbaseWallet,
  useWalletConnect,
} from '@thirdweb-dev/react'
import ethereumlogo from '../assets/ethereum.png'
import maticlogo from '../assets/matic.png'
import bsclogo from '../assets/bsc.png'
import avalancelogo from '../assets/avalance.png'
import { QueryClient, useQuery, useQueryClient } from 'react-query'
import { getActiveListings, getAuctionItems } from '../fetchers/Web3Fetchers'
import { getUser } from '../fetchers/SanityFetchers'
import {
  IconDisconnect,
  IconHelp,
  IconMagnifier,
  IconProfile,
} from './icons/CustomIcons'
import { getUnsignedImagePath } from '../fetchers/s3'

const style = {
  wrapper: `container mx-auto w-full px-[1.2rem] py-[0.8rem] flex space-x-4 xl:space-x-[6rem]`,
  logoContainer: `flex items-center cursor-pointer m-0`,
  logoText: ` ml-[0.8rem] font-base text-2xl logoText`,
  searchBar: `relative flex flex-1 mx-[0.8rem] w-max-[520px] items-center border rounded-3xl transition linear focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`,
  searchIcon: `text-[#8a939b] mx-3 font-bold text-lg absolute`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-black placeholder:text-[#8a939b]`,
  headerItems: `flex items-center justify-end nonMobileMenu`,
  headerItem: `px-4 hover:opacity-80 cursor-pointer font-bold`,
  headerIcon: `text-white flex justify-between gap-[5px] items-center rounded-full text-[17px] font-normal p-3 px-6 bg-blue-500 hover:opacity-80 cursor-pointer`,
  menuWrapper: 'relative',
  menu: 'absolute',
  walletAddress:
    'cursor-pointer font-bold text-center text-base flex justify-center items-center text-black mr-4',
  balance:
    'cursor-pointer flex text-center text-white rounded-full hover:bg-opacity-90 justify-center items-center py-2 px-4 font-bold gradBlue hover:bg-200',
}

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const Header = () => {
  const {
    setMarketplaceAddress,
    marketplaceAddress,
    setRpcUrl,
    rpcUrl,
    selectedChain,
    setSelectedChain,
    activeListings,
    setActiveListings,
  } = useMarketplaceContext()
  const connectWithMetamask = useMetamask()
  const connectWithCoinbase = useCoinbaseWallet()
  const connectWithWalletConnect = useWalletConnect()
  const address = useAddress()
  const disconnectWallet = useDisconnect()
  const router = useRouter()
  const activeChainId = useChainId()

  const [
    {
      data: { chain, chains },
      loading,
      error,
    },
    switchNetwork,
  ] = useNetwork()
  const queryclient = useQueryClient()
  const [isLogged, setIsLogged] = useState(false)
  const { dark } = useThemeContext()
  const {
    myUser,
    setMyUser,
    queryStaleTime,
    queryCacheTime,
    myProfileImage,
    setMyProfileImage,
    setMyCollections,
    myBannerImage,
    setMyBannerImage,
  } = useUserContext()
  const [allowMarketRefetch, setAllowMarketRefetch] = useState()
  //getCollection Name from Sanity

  // const {
  //   data: ownerData,
  //   refetch: refetchUser,
  //   status: ownerStatus,
  // } = useQuery(['user', address], getUser(), {
  //   staleTime: queryStaleTime,
  //   enabled: false,
  //   onError: () => {
  //     toast.error('Error in getting Owner info.', errorToastStyle)
  //   },
  //   onSuccess: (data) => {
  //     setMyUser(data)
  //     setIsLogged(true)

  //     try {
  //       localStorage.setItem(`${data.walletAddress}`, JSON.stringify(data))
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  // })

  const { data: collectionData, status: collectionStatus } = useQuery(
    ['mycollections', address],
    getMyCollections(),
    {
      enabled: Boolean(address), //only run this query if address is provided
      onError: () => {
        toast.error(
          'Error fetching collection data. Refresh and try again',
          errorToastStyle
        )
      },
      onSuccess: async (res) => {
        const unresolved = res.map(async (item) => {
          const obj = { ...item }
          const imgPath = await getUnsignedImagePath(item.profileImage)
          const bannerPath = await getUnsignedImagePath(item.bannerImage)
          obj['profileImage'] = imgPath?.data.url
          obj['bannerImage'] = bannerPath?.data.url
          return obj
        })

        const resolvedPaths = await Promise.all(unresolved)
        setMyCollections(resolvedPaths)
      },
    }
  )

  const { data: marketData, status: marketStatus } = useQuery(
    ['marketplace', marketplaceAddress],
    getActiveListings(rpcUrl),
    {
      enabled: Boolean(marketplaceAddress),
      onError: () => {
        toast.error(
          'Error fetching marketplace data. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        setActiveListings(res)
        //save in local storage too
        try {
          // localStorage.setItem('activeListings', JSON.stringify(res))
        } catch (error) {
          console.log(error)
          // localStorage.setItem('activeListings', false)
        }
        //disable market refetching
        setAllowMarketRefetch(false)
        // console.log(res)
      },
    }
  )

  //show error if any error during wallet connection
  useEffect(
    (toastHandler = toast) => {
      if (!error) return
      toastHandler.error(error.message, errorToastStyle)
    },
    [error]
  )

  useEffect(async () => {
    if (!address) {
      setIsLogged(false)
      return
    }
    // console.log(myUser)

    if (address) {
      const user = await getUser(address)
      setMyUser(user)
      // console.log(user.profileImage)
      if (user?.profileImage) {
        setMyProfileImage(await getUnsignedImagePath(user.profileImage))
      }
      if (user?.bannerImage) {
        setMyBannerImage(await getUnsignedImagePath(user.bannerImage))
      }
      queryclient.invalidateQueries('notification')
      setIsLogged(true)
    }
  }, [address])

  // useEffect(() => {
  //   console.log(myProfileImage)
  // }, [myProfileImage])

  useEffect(() => {
    if (activeChainId) {
      if (chain.id == '80001') {
        setRpcUrl(process.env.NEXT_PUBLIC_INFURA_POLYGON_URL)
        // setMarketplaceAddress('0x75c169b13A35e1424EC22E099e30cE9E01cF4E3D----')
        setMarketplaceAddress('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4')
      } else if (chain.id == '4') {
        setRpcUrl(process.env.NEXT_PUBLIC_INFURA_RINKEBY_URL)
        setMarketplaceAddress('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4')
      }
      // console.log('connected')
    } else {
      // console.log('not connected')
      if (selectedChain in ['Polygon', 'Mumbai']) {
        setRpcUrl(process.env.NEXT_PUBLIC_INFURA_POLYGON_URL)
        // setMarketplaceAddress('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4')
        setMarketplaceAddress('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4')
      } else if (selectedChain in ['Ethereum', 'Rinkeby']) {
        setRpcUrl(process.env.NEXT_PUBLIC_INFURA_RINKEBY_URL)
        setMarketplaceAddress('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4')
      }
    }
  }, [activeChainId])

  useEffect(() => {
    try {
      // const localMarketData = JSON.parse(localStorage.getItem('activeListings'))
      if (!activeListings) {
        setAllowMarketRefetch(true)
      } else {
        setAllowMarketRefetch(false)
      }
    } catch (error) {
      console.log(error)
    }
  }, [marketplaceAddress])

  const handleDisconnect = () => {
    setIsLogged(false)
    localStorage.removeItem(`${address}`)
    disconnectWallet()
    setMyUser()
    disconnectNotification()
  }

  const disconnectNotification = (toastHandler = toast) => {
    toastHandler.success(`You have been disconnected !`, successToastStyle)
  }

  return (
    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      <Link href="/">
        <div className={style.logoContainer} style={{ marginLeft: 0 }}>
          <img src={nuvanftLogo.src} height={55} width={90} />
          <div className={style.logoText}>
            <p className={dark ? 'text-neutral-100' : ''}>NUVA NFT</p>
          </div>
        </div>
      </Link>
      <div
        className={
          dark
            ? style.searchBar + ' border-sky-400/20'
            : style.searchBar + ' border-neutral-200'
        }
      >
        <div className={style.searchIcon}>
          <IconMagnifier />
        </div>
        <SearchBar />
      </div>

      {/* Mobile View Menu */}
      <div className="mobileMenu z-30 px-4 text-right">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="absolute -right-9 -top-3 p-3">
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
              className={`absolute right-0 mt-2 w-64 origin-top-right divide-y ${
                dark
                  ? ' divide-slate-600 bg-slate-700 text-neutral-100'
                  : ' divide-gray-100 bg-white'
              } rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? 'bg-blue-500 ' : ''
                      } group rounded-md px-2 py-2 text-sm`}
                    >
                      <a href="/browse" className="flex w-full items-center ">
                        <BsEye className="mr-2" fontSize="20px" /> Browse
                      </a>
                    </div>
                  )}
                </Menu.Item>
                {!isLogged && (
                  <>
                    <div className="mb-2 border-t border-neutral-200 pt-3 pl-2 text-sm font-bold">
                      CONNECT WALLET WITH
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={connectWithMetamask}
                          className={`${
                            active ? 'bg-blue-500 ' : ''
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
                          onClick={() => connectWithCoinbase}
                          className={`${
                            active ? 'bg-blue-500 ' : ''
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
                          onClick={() => connectWithWalletConnect}
                          className={`${
                            active ? 'bg-blue-500 ' : ''
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
                            active ? 'bg-blue-500 ' : ''
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
                            My Collections
                          </a>
                        </div>
                      )}
                    </Menu.Item>
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
                            <MdOutlineWallpaper
                              className="mr-2"
                              fontSize="20px"
                            />{' '}
                            Create
                          </a>
                        </div>
                      )}
                    </Menu.Item>

                    <div
                      className={`h-2 border-t ${
                        dark ? ' border-slate-600' : ' border-neutral-200'
                      } text-sm font-bold`}
                    >
                      &nbsp;
                    </div>

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

                    <Menu.Item>
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
                    </Menu.Item>

                    <Menu.Item>
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
                    </Menu.Item>
                  </>
                )}
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
          <div
            className={`flex items-center justify-between gap-1 rounded-full border ${
              dark ? ' border-sky-400/20' : ' border-neutral-200'
            } p-1`}
          >
            <div className={style.headerItem}>
              <BsEye className="mr-2 inline-block" fontSize="20px" />
              <span className="inline-block">Browse</span>
            </div>

            <div
              className="cursor-pointer rounded-full p-2 px-3 hover:bg-sky-100"
              onClick={() => {
                setSelectedChain('Ethereum')
                router.push('/browse')
              }}
            >
              <img
                src={ethereumlogo.src}
                width="20px"
                className="inline-block"
              />{' '}
              <span className="inline-block">Ethereum</span>
            </div>

            <div
              className="cursor-pointer rounded-full p-2 px-3 hover:bg-sky-100"
              onClick={() => {
                setSelectedChain('Binance')
                router.push('/browse')
              }}
            >
              <img src={bsclogo.src} width="20px" className="inline-block" />{' '}
              <span className="inline-block">Binance</span>
            </div>

            <div
              className="cursor-pointer rounded-full p-2 px-3 hover:bg-sky-100"
              onClick={() => {
                setSelectedChain('Polygon')
                router.push('/browse')
              }}
            >
              <img src={maticlogo.src} width="20px" className="inline-block" />{' '}
              <span className="inline-block">Polygon</span>
            </div>

            <div
              className="cursor-pointer rounded-full p-2 px-3 hover:bg-sky-100"
              onClick={() => {
                setSelectedChain('Avalance')
                router.push('/browse')
              }}
            >
              <img
                src={avalancelogo.src}
                width="20px"
                className="inline-block"
              />{' '}
              <span className="inline-block">Avalance</span>
            </div>
          </div>
        )}

        {address && isLogged && (
          <>
            <Link href="/collections/myCollection">
              <div className={style.headerItem}>My Collections</div>
            </Link>
            <Link href="/contracts">
              <div className={style.headerItem}>Create</div>
            </Link>
            <div className="flex flex-row items-center gap-4 px-3">
              <ThemeSwitcher />
              <Notifications />
            </div>
          </>
        )}

        <div className="z-10 px-4 text-right">
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
                  <>
                    Connect Wallet <HiChevronDown className="ml-2" />
                  </>
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
                                src={myProfileImage.data.url}
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
        </div>
      </div>
    </div>
  )
}

export default Header
