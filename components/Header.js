import Link from 'next/link'
import SearchBar from './SearchBar'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { BiUser } from 'react-icons/bi'
import { HiMenu } from 'react-icons/hi'
import Notifications from './Notifications'
import ThemeSwitcher from './ThemeSwitcher'
import { config } from '../lib/sanityClient'
import { GoDashboard } from 'react-icons/go'
import ChainSelection from './ChainSelection'
import nuvanftLogo from '../assets/nuvanft.png'
import { Menu, Transition } from '@headlessui/react'
import { useState, useEffect, Fragment } from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { useUserContext } from '../contexts/UserContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useMarketplaceContext } from '../contexts/MarketPlaceContext'
import { MdOutlineCollections, MdOutlineWidgets } from 'react-icons/md'
import { useAddress, ConnectWallet, useChainId } from '@thirdweb-dev/react'
import { getActiveListings, getLatestNfts } from '../fetchers/Web3Fetchers'
import { IconImage, IconMagnifier, IconProfile } from './icons/CustomIcons'
import { getMyCollections, getCoinPrices, getBlockedItems, checkReferralUser } from '../fetchers/SanityFetchers'




const Header = () => {
  
  const router = useRouter();
  const { w } = router.query;
  const address = useAddress();
  const chainid = useChainId();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext()
  const { setCoinPrices, blockchainIdFromName, blockchainName, setBlockedNfts, setBlockedCollections, setReferralAllowedCollections, setReferralCommission } = useSettingsContext();
  const [isLogged, setIsLogged] = useState(false)
  const { setMyUser, setMyCollections } = useUserContext()
  const { setActiveListings, setLatestNfts, selectedBlockchain, setSelectedBlockchain } = useMarketplaceContext();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const style = {
    wrapper: ` mx-auto fixed top-0 w-full px-[1.2rem] lg:px-[8rem] py-[0.8rem] backdrop-blur-md border border-b-[#ffffff22] border-t-0 border-l-0 border-r-0 z-50 flex justify-center`,
    logoContainer: `flex items-center cursor-pointer m-0`,
    logoText: ` ml-[0.8rem] font-base text-2xl logoText`,
    searchBar: ` relative backdrop-blur-sm flex mx-[0.8rem] h-[50px] w-full items-center border rounded-lg transition-all linear`,
    searchIcon: `text-[#000000] mx-3 font-bold text-lg absolute`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-black placeholder:text-[#8a939b]`,
    headerItems: `flex items-center justify-end nonMobileMenu`,
    headerItem: `px-4 cursor-pointer font-bold`,
    headerIcon: `text-white flex justify-between gap-[5px] items-center rounded-full text-[17px] font-normal p-3 px-6 bg-blue-500 hover:opacity-80 cursor-pointer`,
    menuWrapper: 'relative',
    menu: 'absolute',
    menuText: `${dark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-neutral-100 text-white hover:text-black'} rounded-xl p-2 cursor-pointer`,
    walletAddress:
      'cursor-pointer font-bold text-center text-base flex justify-center items-center text-black mr-4',
    balance:
      'cursor-pointer flex text-center text-white rounded-full hover:bg-opacity-90 justify-center items-center py-2 px-4 fs-14 gradBlue hover:bg-200',
  }

  const getAllAdminUsers = async () => {
    const query = '*[_type == "settings"]{adminusers, referralcollections, referralrate_one, referralrate_two, referralrate_three, referralrate_four, referralrate_five}';
    const res = await config.fetch(query);
    //this object will hold commission values for non company collections i.e for sharing of platform fee
    const referralCommission = {
      referralrate_one: res[0].referralrate_one,
      referralrate_two: res[0].referralrate_two,
      referralrate_three: res[0].referralrate_three,
      referralrate_four: res[0].referralrate_four,
      referralrate_five: res[0].referralrate_five,
    }
    setReferralCommission(referralCommission);
    setReferralAllowedCollections(res[0].referralcollections); //save all collections that are allowed to have referral commission settings
    return res[0].adminusers;
  }

  const { data: collectionData, status: collectionStatus } = useQuery(
    ['mycollections', address, blockchainIdFromName[selectedBlockchain]],
    getMyCollections(),
    {
      enabled: Boolean(address), //only run this query if address is provided
      onError: () => {
        toast.error('Error fetching collection data. Refresh and try again', errorToastStyle);
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
        setCoinPrices(res);
      }
    }
    ) 

    const { data: latestNfts, status: latestNftsStatus } = useQuery(
    ['latestNfts', selectedBlockchain],
    getLatestNfts(24),
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
        );
      },
      onSuccess: (res) => {
        setActiveListings(res);
      },
    }
  )

  const { data:blockedItems, status:blockedItemStatus } = useQuery(
      ["blockedItems"], 
      getBlockedItems(), {
          onSuccess: (res) => {
            if(res){
              setBlockedCollections(res[0]?.blockedcollections);
              setBlockedNfts(res[0]?.blockednfts);
            }
          }
      }
  );

  useEffect(() => {
    if(!w) return
    localStorage.setItem('refWallet', w)
  }, [w])

  useEffect(() => {
    if (!address) {
      setIsLogged(false);
      setIsAdmin(false);
      setMyUser();
      return
    }
    //check referrer exists or not
    ;(async () => {
      const referrer = localStorage.getItem('refWallet');
      let refExists;
      let userExists;
      if(referrer){
        refExists = await checkReferralUser(referrer);
        userExists = await checkReferralUser(address);
      }



      let userDoc;
      if(!Boolean(refExists?.length > 0)){
        userDoc = {
          _type: 'users',
          _id: address,
          userName: 'Unnamed',
          walletAddress: address,
          volumeTraded: 0,
          verified: false,
          refactivation: true,
          tokensent: false,
          payablelevel: 1,
        }
      }else{
        userDoc = {
          _type: 'users',
          _id: address,
          userName: 'Unnamed',
          walletAddress: address,
          volumeTraded: 0,
          verified: false,
          refactivation: true,
          tokensent: false,
          payablelevel: 1,
          referrer: { _type: 'reference', _ref: referrer}
        }
        //delete the referal info from storage as it is not needed anymore
        // localStorage.removeItem('refWallet');
      }
      //if user already exists and refWallet is present save the referrer
      if(Boolean(userExists?.length > 0)){
        await config
              .patch(address)
              .set({ referrer: { _type: 'reference', _ref: referrer } })
              .commit()
              .finally(() => localStorage.removeItem('refWallet'))
              .catch(err => console.log(err));
        setMyUser(userExists[0]);
      }else{
        //saves new user if not present otherwise returns the w data
        const user = await config.createIfNotExists(userDoc);
        setMyUser(user);

      }


      if(Boolean(refExists?.length > 0)){
        await config.getDocument(referrer)
              .then(async (document) => {
                const directs = document.directs;

                let uniqueDirects = [...directs];
                const isDuplicate = directs.some(reference => String(reference._ref).toLowerCase() == String(address).toLowerCase());
                if(!isDuplicate){
                  uniqueDirects = [
                    ...uniqueDirects,
                    {
                      _type: 'reference',
                      _ref: address,
                      _key: address,
                    }
                  ]

                  //add this user in sponsor's direct referrals , only after checking if the referral does not have it already
        
                if(directs.length != uniqueDirects.length) {

                  await config
                    .patch(referrer)
                    .setIfMissing({ directs: [] })
                    .set({ directs: uniqueDirects})
                    .commit()
                    .finally(() => { localStorage.removeItem('refWallet')})
                    .catch(err => console.log(err));
                  }
                }
              });
      }
      
      setIsLogged(true);
    })();

    ;(async() => {
      const adminList = await getAllAdminUsers();
      const isThisUserAdmin = adminList.filter(user => user._ref == address);
      if(isThisUserAdmin.length > 0){
          setIsAdmin(true);
      }
    })();
  
    return() => {
        //do nothing//clean up function

    }
  }, [address]);

  useEffect(() => {
    if(!chainid) return
      setSelectedBlockchain(blockchainName[chainid]);
    
      return(() => {
        //do nothing , just clean up function
      })

  }, [chainid]);

  return (
    <div className={style.wrapper}>
      <div className="container flex items-center justify-between">
        <Link href="/">
          <div className={style.logoContainer} style={{ marginLeft: 0 }}>
            <img src={nuvanftLogo.src} height={55} width={90} />
          </div>
        </Link>

        <div className=" relative justify-center flex transition-all flex-grow max-w-xl">
          <div
            className={ 'shadow-md' + 
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
                } rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-3`}
              >
                <div className="px-1 py-1 ">

                  {!isLogged && (
                    <div className="p-4">
                      <ChainSelection />
                    </div>
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
                              Create
                            </a>
                          </div>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/collections/myCollection">
                            <div
                              className={`${
                                active ? 'bg-blue-500 ' : ''
                              } group rounded-md px-2 py-2 text-sm flex items-center`}
                            >
                                <IconImage />{' '}
                                <span className="pl-2">NFTs and Collections</span>
                            </div>

                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={`${
                              active ? 'bg-blue-500 ' : ''
                            } group rounded-md px-2 py-2 text-sm`}
                          >
                            <Link href="/user/referrals">
                              <div className="flex w-full items-center "><AiOutlineUsergroupAdd fontSize={23}/> <span className="pl-2">Referrals</span></div>
                            </Link>
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
                              <IconProfile/> <span className="pl-2">Profile</span>
                            </a>
                          </div>
                        )}
                      </Menu.Item>
                      
                      {isAdmin ? (
                        <Menu.Item>
                          <a href="/admin/dashboard">
                            <div className={`${dark ? 'hover:bg-slate-800' : 'hover:bg-neutral-100 text-white hover:text-black'} flex gap-2 text-sm p-2 -mr-2 rounded-xl cursor-pointer`}>
                              <GoDashboard fontSize={23}/> Dashboard
                            </div>
                          </a>
                        </Menu.Item>
                       ) : ''}
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
          }>
          {!isLogged && (
            <ChainSelection />
          )}

          {address && isLogged && (
            <>
              <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className={`py-3 px-2 flex items-center gap-1 ${dark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-neutral-100 text-white hover:text-black'} rounded-xl`}>
                    <IconImage />  <span className="hidden lg:block text-sm">My Account</span>
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
                                <IconImage/> NFTs and Collections
                              </div>
                            </Link>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className={`p-3 py-2 text-left hover:bg-${dark ? 'slate-600' : 'neutral-100'} cursor-pointer rounded-md`}>
                            <Link href="/user/referrals" >
                              <div className="flex gap-1 items-center">
                                <AiOutlineUsergroupAdd fontSize={23}/> Referrals
                              </div>
                            </Link>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className={`p-3 py-2 text-left hover:bg-${dark ? 'slate-600' : 'neutral-100'} cursor-pointer rounded-md`}>
                            <Link href="/profile" >
                              <div className="flex gap-1 items-center">
                                <IconProfile/> Profile
                              </div>
                            </Link>
                          </div>
                        </Menu.Item>
                      </div>
                        
                    </Menu.Items>
                </Transition>
              </Menu>
              <div className="flex flex-row items-center gap-4 pl-2 pr-5">
                {isAdmin ? (
                  <a href="/admin/dashboard">
                    <div className={`${dark ? 'hover:bg-slate-800' : 'hover:bg-neutral-100 text-white hover:text-black'} p-2 -mr-2 rounded-xl cursor-pointer`}>
                      <GoDashboard fontSize={23}/>
                    </div>
                  </a>
                ) : ''}
                <ThemeSwitcher />
                <Notifications />
              </div>
              <div className={`rounded-lg cursor-pointer px-5 py-4 text-black border-0 bg-white mr-3`}>
                <Link href="/contracts">
                  <div className={style.headerItem + " inline-flex gap-1 items-center"}><div className="animate-pulse"><MdOutlineWidgets /></div> Create</div>
                </Link>
              </div>
            </>
          )}
          <ConnectWallet accentColor="#0053f2" colorMode={dark ? "dark": "light"} className=" ml-4" />

        </div>
      </div>
    </div>
  )
}

export default Header

