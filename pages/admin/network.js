import Head from 'next/head'
import Moment from 'react-moment'
import { useQuery } from 'react-query'
import { Toaster } from 'react-hot-toast'
import Header from '../../components/Header'
import { config } from '../../lib/sanityClient'
import Sidebar from '../../components/admin/Sidebar'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { createAwatar } from '../../utils/utilities';
import { getUser } from '../../fetchers/SanityFetchers'
import { BiNetworkChart, BiWallet } from 'react-icons/bi'
import React, { useEffect, useRef, useState } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import { IconBNB } from '../../components/icons/CustomIcons'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useAdminContext } from '../../contexts/AdminContext'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import { getUserContinuously } from '../../fetchers/SanityFetchers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getMyNetwork, getReferralPayment } from '../../fetchers/SanityFetchers'
import { TbSquareRoundedNumber1Filled, TbSquareRoundedNumber2Filled, TbSquareRoundedNumber3Filled, TbSquareRoundedNumber4Filled, TbSquareRoundedNumber5Filled,  } from 'react-icons/tb'

const networks = () => {
    const address = useAddress();
    const { dark } = useThemeContext();
    const { myUser } = useUserContext();
    const { loggedIn, setLoggedIn, showUserTree, setShowUserTree, selectedChain, setSelectedChain, setReferralModal} = useAdminContext();
    const leveltwoRef = useRef(0);
    const levelthreeRef = useRef(0);
    const levelfourRef = useRef(0);
    const levelfiveRef = useRef(0);
    const [totalBonus, setTotalBonus] = useState(0);
    const { chainExplorer, HOST } = useSettingsContext();
    const [search, setSearch] = useState(false);

    // 0x9D2036BAfd465bAFaCFeEb6A4a97659D9f2a8A30
    // 0x9cB0b5Ba3873b4E4860A8469d66998059Af79eA6

    const addteam = () => {
        teamcountRef.current += 1;
    }
    const style = {
        wrapper: '',
        userprofile: 'w-[40px] mx-auto mb-1 h-[40px] rounded-full object-cover outline outline-2 outline-slate-300 mt-3',
        tablewrapper: `max-h-[500px] overflow-auto rounded-lg border ${dark ? 'border-slate-700' : 'border-neutral-200'}`,
        userul: dark ? 'before:border-l before:border-slate-700' :'before:border-l before:border-neutral-200',
        userli: dark ? 'before:border-t before:border-slate-700 after:border-t after:border-slate-700 last:before:border-r last:before:border-border-slate-700 after:border-l after:border-slate-700' :'before:border-t before:border-neutral-200 after:border-t after:border-neutral-200 last:before:border-r last:before:border-border-slate-200 after:border-l after:border-neutral-200',
        userbox: `relative ${dark ? 'border border-slate-700': 'border border-neutral-200'} bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/50 to-blue-500/50`,
        table: `text-sm w-full text-base`,
        tableheader: `font-normal py-4 ${dark ? 'bg-slate-600' : ' bg-neutral-100'} text-left pl-2`,
        tablecell: 'py-3 pl-2',
        networklabel: 'mr-2 opacity-10 absolute top-3 left-2',
        pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
        container: 'my-[3rem] container mx-auto p-1 pt-0 max-w-5xl',
        formWrapper: 'flex flex-wrap flex-col ',
        pageTitle: 'text-4xl font-bold text-center text-white',
        smallText: 'text-xs m-2 mt-0 mb-0',
        subHeading:
          'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
        input:
          `m-2 outline-none p-3 rounded-[0.4rem]  transition linear' + ${dark ? ' bg-[#1e293b] hover:bg-[#334155] ' : ' border border-neutral-200 bg-neutral-100 hover:bg-neutral-200'}`,
        label: 'text-small m-2 mt-4',
        button:
          'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
        previewImage:
          'relative mr-[1rem] h-[220px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-500 flex items-center justify-center',
        notConnectedWrapper: 'flex justify-center items-start h-screen pt-[4rem]',
        traitsButtons:
          'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-2 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
        secondaryButton:
          'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
        imageInput:
          'w-[350px] h-[350px] border border-slate-100 border-dashed border-lg flex items-center justify-content-center text-grey mb-4 cursor-pointer rounded-xl',
        imagePreview: 'max-h-[450px] rounded-xl cursor-pointer mb-4 max-w-[350px]'
      }
    
    const getAllAdminUsers = async () => {
        const query = '*[_type == "settings"]{adminusers}';
        const res = await config.fetch(query);
        return res[0].adminusers;
    }

    useEffect(() => {
    if(!address) return
    ;(async() => {
        const adminList = await getAllAdminUsers();
        const isThisUserAdmin = adminList.filter(user => user._ref == address);
        if(isThisUserAdmin.length > 0){
            setLoggedIn(true);
        }
    })();
    
    return() => {
        //do nothing//clean up function
        setLoggedIn(false);
    }
    },[address]);

    // useEffect(() => {
    //     if(!search && (showUserTree == '' || !showUserTree)) return;
    //     ;(async() => {
    //         const userData = await getUser(showUserTree);
    //         console.log(userData)
    //     })()
    // }, [search])

    const {data: userData, status: userStatus} = useQuery(
        ["userdata", showUserTree],
        getUserContinuously(showUserTree),
        {
            enabled: Boolean(search) && Boolean(showUserTree),
            onSuccess: (res) => {
                setSearch(false);
            },
            onError: (err) => {},
        }
    );
    
    const {data: networkData, status: networkStatus} = useQuery(
        ["network"],
        getMyNetwork(showUserTree),
        {
            enabled: Boolean(search) && Boolean(showUserTree),
            onSuccess: (res) => {
                console.log(res);
                setSearch(false);
            },
            onError: (err) => {},
        }
    );

    const {data: referralPaymentData, status: referralPaymentStatus } = useQuery(
        ['referralpayment'],
        getReferralPayment(showUserTree),
        {
            enabled: Boolean(search) && Boolean(showUserTree),
            onSuccess: (res) => 
            { 
                const totals = res.map(r => r.amount);
                const sum = totals.reduce((a,b) => a + b, 0);
                setTotalBonus(sum);
                setSearch(false);
            }
        }
    )


  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white text-slate-900'}`}>
        <Head>
            <title>Dashboard: Nuva NFT</title>
        </Head>
        {!loggedIn ? (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center">
                <ConnectWallet accentColor="#0053f2" className=" ml-4" style={{ borderRadius: '50% !important'}} />
            </div>

        ) : (
            <div className="relative">
                <div className="bg-slate-700">
                    <Header />
                    <Toaster position="bottom-right" reverseOrder={false} />
                </div>

                <div className="grid grid-cols-6 pt-[5rem]">
                    <div>
                        <Sidebar selectedChain={selectedChain} setSelectedChain={setSelectedChain} setReferralModal={setReferralModal} />
                    </div>
                    <main className="col-span-5 p-4 overflow-x-auto">
                        <div className={style.wrapper}>

                        {Boolean(address) ? (
                            <>
                                <div className={style.container}>
                                    <div className={`flex gap-1 justify-center items-center p-2 border flex-wrap ${dark ? 'border-slate-800' : 'border-neutral-200'} rounded-xl mb-10`}>
                                        <input 
                                            className={`flex-grow h-[56px] text-center m-2 outline-none p-3 ${dark ? 'bg-[#1e293b] hover:bg-[#334155]' : 'bg-neutral-200 : hover:bg-neutral-300'} rounded-[0.4rem]  transition linear`}
                                            value={showUserTree}
                                            onChange={(e) => setShowUserTree(e.target.value)}/>
                                        <button
                                            className="gradBlue rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white"
                                            onClick={(e) => setSearch(true)}>
                                                Search
                                        </button>
                                    </div>
                                    <p className="font-semibold text-center">Network Levels</p>
                                    <div className="flex flex-wrap mb-10 items-center">
                                        <div className="p-3 w-full md:w-1/5">
                                            <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                                <TbSquareRoundedNumber1Filled fontSize={50} className={style.networklabel} />
                                                <p className="font-bold text-3xl">{networkStatus == "loading" ? 'Loading...' : networkData?.length ? networkData.length : 0}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 w-1/2 md:w-1/5">
                                            <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                                <TbSquareRoundedNumber2Filled fontSize={50} className={style.networklabel} />
                                                <p className="font-bold text-3xl">{leveltwoRef.current}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 w-1/2 md:w-1/5">
                                            <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                                <TbSquareRoundedNumber3Filled fontSize={50} className={style.networklabel} />
                                                <p className="font-bold text-3xl">{levelthreeRef.current}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 w-1/2 md:w-1/5">
                                            <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                                <TbSquareRoundedNumber4Filled fontSize={50} className={style.networklabel} />
                                                <p className="font-bold text-3xl">{levelfourRef.current}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 w-1/2 md:w-1/5">
                                            <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                                <TbSquareRoundedNumber5Filled fontSize={50} className={style.networklabel} />
                                                <p className="font-bold text-3xl">{levelfiveRef.current}</p>
                                            </div>
                                        </div>
                                        {/* <div className="p-3 w-full md:w-1/6">
                                            <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center`}>
                                                <p className="">Referral Bonus</p>
                                                <p className="font-semibold text-3xl"><IconBNB/>{totalBonus}</p>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <p className="font-semibold text-center">Network Tree</p>

                                <div className="flex flex-col">
                                    <div className="mb-10 overflow-scroll">
                                        <div className="tree w-max mx-auto"><span className="hidden">{leveltwoRef.current = 0 }{levelthreeRef.current = 0 }{levelfourRef.current = 0 }{levelfiveRef.current = 0 }</span>
                                            <ul className="flex w-[2000px] lg:w-auto justify-start lg:justify-center">
                                                <li>
                                                    {Boolean(userData) && (
                                                        <a href="#" className={style.userbox + ' outline-2 outline-sky-700  outline-double'}>
                                                            {userStatus == 'success' && Boolean(userData) && (
                                                                <>
                                                                    <img src={Boolean(userData.web3imageprofile) ? getImagefromWeb3(userData.web3imageprofile) : createAwatar(userData.walletAddress)} alt={userData.userName} className={style.userprofile} /> 
                                                                    {userData.userName != "Unnamed" && <>{userData.userName}</>}
                                                                    <p>
                                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                                        <span className="text-sm pl-1">
                                                                            {userData.walletAddress.slice(0,4)}...{userData.walletAddress.slice(-4)}
                                                                        </span>
                                                                    </p>
                                                                    <div className="flex gap-1 p-1 items-center justify-center">
                                                                        {/* <BiNetworkChart className="rotate-45"/> <span className="text-xs">Level {userData?.payablelevel? userData?.payablelevel : 1}</span> */}
                                                                    </div>
                                                                </>
                                                            )}
                                                            
                                                        </a>
                                                    )}
                                                    <ul className={style.userul}>
                                                        {networkStatus == "success" && networkData.map((person) => (
                                                            <li 
                                                                key={person.walletAddress} 
                                                                className={style.userli + ' first:before:!hidden'}
                                                                >
                                                                <a 
                                                                    href="#" 
                                                                    className={style.userbox}
                                                                    onClick={() => {setShowUserTree(person.walletAddress); setSearch(true);}}>
                                                                    <img 
                                                                        src={Boolean(person.web3imageprofile) ? getImagefromWeb3(person.web3imageprofile) : createAwatar(person.walletAddress)} 
                                                                        alt={person.userName} className={style.userprofile} 
                                                                    />
                                                                    {/* <span className="hidden">{teamcountRef.current += 1}</span> */}
                                                                    {person.userName != "Unnamed" && <>{person.userName}</>}
                                                                    <p>
                                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                                        <span className="text-sm pl-1">
                                                                            {person.walletAddress.slice(0,4)}...{person.walletAddress.slice(-4)}
                                                                        </span>
                                                                    </p>
                                                                    <div className="flex gap-1 p-1 items-center justify-center">
                                                                        {/* <BiNetworkChart className="rotate-45"/> <span className="text-xs">Level {person?.payablelevel ? person?.payablelevel : 1}</span> */}
                                                                    </div>
                                                                </a>
                                                                
                                                                {Boolean(person.level1Friends) && (
                                                                    <ul className={style.userul}>
                                                                        {person.level1Friends?.map((level1Friend) => (
                                                                        <li 
                                                                            key={level1Friend.walletAddress} 
                                                                            className={style.userli}
                                                                            >
                                                                            <a 
                                                                                href="#" 
                                                                                className={style.userbox}
                                                                                onClick={() => {setShowUserTree(level1Friend.walletAddress); setSearch(true);}}>
                                                                                <img 
                                                                                    src={
                                                                                        Boolean(level1Friend.web3imageprofile) ? 
                                                                                            getImagefromWeb3(level1Friend.web3imageprofile) : 
                                                                                            createAwatar(level1Friend.walletAddress)
                                                                                        } 
                                                                                    alt={level1Friend.userName} 
                                                                                    className={style.userprofile} />
                                                                                <span className="hidden">{leveltwoRef.current += 1}</span>
                                                                                {level1Friend.userName != "Unnamed" && <>{level1Friend.userName}</>}
                                                                                <p>
                                                                                    <BiWallet className="inline-block" fontSize={14}/> 
                                                                                    <span className="text-sm pl-1">
                                                                                        {level1Friend.walletAddress.slice(0,4)}...{level1Friend.walletAddress.slice(-4)}
                                                                                    </span>
                                                                                </p>
                                                                                <div className="flex gap-1 p-1 items-center justify-center">
                                                                                    {/* <BiNetworkChart className="rotate-45"/> <span className="text-xs">Level {level1Friend?.payablelevel ? level1Friend?.payablelevel : 1}</span> */}
                                                                                </div>
                                                                            </a>
                                                                            {Boolean(level1Friend.level2Friends) && (
                                                                                <ul className={style.userul}>
                                                                                    {level1Friend.level2Friends?.map((level2Friend) => (
                                                                                        <li 
                                                                                            key={level2Friend.walletAddress} 
                                                                                            className={style.userli}
                                                                                            >
                                                                                            <a 
                                                                                                href="#" 
                                                                                                className={style.userbox}
                                                                                                onClick={() => { setShowUserTree(level2Friend.walletAddress); setSearch(true);}}>
                                                                                                <img 
                                                                                                    src={
                                                                                                        Boolean(level2Friend.web3imageprofile) ? 
                                                                                                        getImagefromWeb3(level2Friend.web3imageprofile) : 
                                                                                                        createAwatar(level2Friend.walletAddress)
                                                                                                    }
                                                                                                    alt={level2Friend.userName}
                                                                                                    className={style.userprofile} />
                                                                                                <span className="hidden">{levelthreeRef.current += 1}</span>
                                                                                                {level2Friend.userName != "Unnamed" && <>{level2Friend.userName}</>}
                                                                                                <p>
                                                                                                    <BiWallet className="inline-block" fontSize={14}/> 
                                                                                                    <span className="text-sm pl-1">
                                                                                                        {level2Friend.walletAddress.slice(0,4)}...{level2Friend.walletAddress.slice(-4)}
                                                                                                    </span>
                                                                                                </p>
                                                                                                <div className="flex gap-1 p-1 items-center justify-center">
                                                                                                    {/* <BiNetworkChart className="rotate-45"/> <span className="text-xs">Level {level2Friend?.payablelevel ? level2Friend?.payablelevel : 1}</span> */}
                                                                                                </div>
                                                                                            </a>
                                                                                            {Boolean(level2Friend.level3Friends) && (
                                                                                                <ul className={style.userul}>
                                                                                                    {level2Friend.level3Friends?.map((level3Friend) => (
                                                                                                        <li 
                                                                                                            key={level3Friend.walletAddress} 
                                                                                                            className={style.userli}
                                                                                                            >
                                                                                                            <a 
                                                                                                                href="#" 
                                                                                                                className={style.userbox}
                                                                                                                onClick={() => {setShowUserTree(level3Friend.walletAddress); setSearch(true);}}>
                                                                                                                <img 
                                                                                                                    src={
                                                                                                                        Boolean(level3Friend.web3imageprofile) ? 
                                                                                                                        getImagefromWeb3(level3Friend.web3imageprofile) : 
                                                                                                                        createAwatar(level3Friend.walletAddress)
                                                                                                                    } 
                                                                                                                    alt={level3Friend.userName} 
                                                                                                                    className={style.userprofile} />
                                                                                                                <span className="hidden">{levelfourRef.current += 1}</span>
                                                                                                                {level3Friend.userName != "Unnamed" && <>{level3Friend.userName}</>}
                                                                                                                <p>
                                                                                                                    <BiWallet className="inline-block" fontSize={14}/> 
                                                                                                                    <span className="text-sm pl-1">
                                                                                                                        {level3Friend.walletAddress.slice(0,4)}...{level3Friend.walletAddress.slice(-4)}
                                                                                                                    </span>
                                                                                                                </p>
                                                                                                                <div className="flex gap-1 p-1 items-center justify-center">
                                                                                                                    {/* <BiNetworkChart className="rotate-45"/> <span className="text-xs">Level {level3Friend?.payablelevel ? level3Friend?.payablelevel : 1}</span> */}
                                                                                                                </div>
                                                                                                            </a>
                                                                                                            {Boolean(level3Friend.level4Friends) && (
                                                                                                                <ul className={style.userul}>
                                                                                                                    {level3Friend.level4Friends?.map((level4Friend) => (
                                                                                                                        <li 
                                                                                                                            key={level4Friend.walletAddress} 
                                                                                                                            className={style.userli}
                                                                                                                            >
                                                                                                                            <a 
                                                                                                                                href="#" 
                                                                                                                                className={style.userbox}
                                                                                                                                onClick={() => {setShowUserTree(level4Friend.walletAddress); setSearch(true);}}>
                                                                                                                                <img 
                                                                                                                                    src={
                                                                                                                                        Boolean(level4Friend.web3imageprofile) ? 
                                                                                                                                        getImagefromWeb3(level4Friend.web3imageprofile) : 
                                                                                                                                        createAwatar(level4Friend.walletAddress)
                                                                                                                                    } 
                                                                                                                                    alt={level4Friend.userName} 
                                                                                                                                    className={style.userprofile} />
                                                                                                                                <span className="hidden">{levelfiveRef.current += 1}</span>
                                                                                                                                {level4Friend.userName != "Unnamed" && <>{level4Friend.userName}</>}
                                                                                                                                <p>
                                                                                                                                    <BiWallet className="inline-block" fontSize={14}/> 
                                                                                                                                    <span className="text-sm pl-1">
                                                                                                                                        {level4Friend.walletAddress.slice(0,4)}...{level4Friend.walletAddress.slice(-4)}
                                                                                                                                    </span>
                                                                                                                                </p>
                                                                                                                                <div className="flex gap-1 p-1 items-center justify-center">
                                                                                                                                    {/* <BiNetworkChart className="rotate-45"/> <span className="text-xs">Level {level4Friend?.payablelevel ? level4Friend?.payablelevel : 1}</span> */}
                                                                                                                                </div>
                                                                                                                            </a>
                                                                                                                            {/* {Boolean(level4Friend.level5Friends) && (
                                                                                                                                <ul className={style.userul}>
                                                                                                                                    {level4Friend.level5Friends?.map((level5Friend) => (
                                                                                                                                    <li key={level5Friend.walletAddress}>
                                                                                                                                            <a href={`/user/${level5Friend.walletAddress}`} className={style.userbox}>
                                                                                                                                                {level5Friend.userName != "Unnamed" ? level5Friend.userName : (<>{level5Friend.walletAddress.slice(0,4)}...{level5Friend.walletAddress.slice(-4)}</>)}
                                                                                                                                            <span>test</span>
                                                                                                                                            </a>
                                                                                                                                            
                                                                                                                                    </li>
                                                                                                                                    ))}
                                                                                                                                </ul>
                                                                                                                            )} */}
                                                                                                                        </li>
                                                                                                                    ))}
                                                                                                                </ul>
                                                                                                            )}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            )}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                        </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-sm">Commissions from Grayed out networks will get unlocked once high value NFTs are purchased from any of Nuva NFT's collections. <a href="/user/0x9cB0b5Ba3873b4E4860A8469d66998059Af79eA6">Click here to check the collections.</a></p>
                                <div className={style.container}>
                                    <div className="relative">
                                        <p className="font-semibold text-center mb-5">Referral Bonuses</p>
                                        <div className={style.tablewrapper}>
                                            <table className={style.table}>
                                                <thead className="relative">
                                                    <tr className="sticky top-0">
                                                        <th className={style.tableheader}>SNo</th>
                                                        <th className={style.tableheader}>Date</th>
                                                        <th className={style.tableheader}>Transaction Id</th>
                                                        <th className={style.tableheader}>Amount</th>
                                                        <th className={style.tableheader}>From User</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {referralPaymentStatus == "success" && referralPaymentData.map((refdata, index) => (
                                                        <tr key={refdata._id}>
                                                            <td className={style.tablecell}>{index + 1}</td>
                                                            <td className={style.tablecell}><Moment fromNow>{refdata._createdAt}</Moment></td>
                                                            <td className={style.tablecell}>
                                                                <a href={`${chainExplorer[97]}tx/${refdata.txid}`} target="_blank" className="p-2 hover:bg-slate-600/20 rounded-lg">
                                                                    {refdata.txid.slice(0,5)}...{refdata.txid.slice(-5)}
                                                                </a>
                                                            </td>
                                                            <td className={style.tablecell}><IconBNB/>{refdata.amount}</td>
                                                            <td className={style.tablecell}>{refdata.referee._ref}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ): ''}
                    </div>
                    </main>
                </div>
            </div>
        )}
    </div>
  )
}

export default networks