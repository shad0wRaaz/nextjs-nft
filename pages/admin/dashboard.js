import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import millify from 'millify'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { TiHeart } from 'react-icons/ti'
import { CgClose } from 'react-icons/cg'
import { GoPackage } from 'react-icons/go'
import Header from '../../components/Header'
import { RiCloseFill } from 'react-icons/ri'
import { HiChevronDown } from 'react-icons/hi'
import { Disclosure } from '@headlessui/react'
import { config } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import toast, { Toaster } from 'react-hot-toast'
import { BsArrowRightShort } from 'react-icons/bs'
import React, { useEffect, useState } from 'react'
import { createAwatar, updateUserDataToFindMaxPayLevel } from '../../utils/utilities'
import { getImagefromWeb3 } from '../../fetchers/s3'
import Sidebar from '../../components/admin/Sidebar'
import BlockedNFTs from '../../components/admin/BlockedNFTs'
import AddCategory from '../../components/admin/AddCategory'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useAdminContext } from '../../contexts/AdminContext'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import { getAllUsers, getTotals } from '../../fetchers/SanityFetchers'
import ReferralSettings from '../../components/admin/ReferralSettings'
import BlockedCollections from '../../components/admin/BlockedCollections'
import { getTotalsforAdmin, updateListings } from '../../fetchers/Web3Fetchers'
import { BiCategory, BiCollection, BiDollarCircle, BiUser } from 'react-icons/bi'
import { IconAvalanche, IconBNB, IconCopy, IconEthereum, IconLoading, IconPolygon } from '../../components/icons/CustomIcons'

const chainnum = {
    "80001": "mumbai",
    "97": "binance-testnet",
    "56": "binance",
    "137": "polygon",
    "5": "goerli",
    "1": "mainnet",
    "43114": "avalanche",
    "43113": "avalanche-fuji"
  }

const blockchain = {
    "mumbai": "80001",
    "binance-testnet": "97",
    "binance": "56",
    "polygon": "137",
    "goerli": "5",
    "mainnet": "1",
    "avalanche": "43114",
    "avalanche-fuji": "43113"
}

const dashboard = () => {
    const router = useRouter();
    const address = useAddress();
    const [popularNfts, setPopularNfts] = useState();
    const [totalNftSale, setTotalNftSale] = useState(0);
    const [totalPlatformFees, setTotalPlatformFees] = useState(0);
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const { referralModal, setReferralModal, loggedIn, setLoggedIn, selectedUser, setSelectedUser, selectedChain, setSelectedChain} = useAdminContext();
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [searchquery, setSearchquery] = useState();
    const [categoryCount, setCategoryCount] = useState();

    const style={
        userdetailrow : 'border-b border-slate-500 py-2'
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

    const { data: users, status: userStatus  } = useQuery(
        ['allusers'],
        getAllUsers(),
        {
            enabled: true,
            onSuccess: (res) => {
                const allUsers = updateUserDataToFindMaxPayLevel(res);
                setSelectedUser(allUsers);
                setUpdatedUsers(allUsers);
            }
        }
    )

    const {data: totalData, status: totalDataStatus} = useQuery(
        ['totalnft', selectedChain], getTotals(blockchain[selectedChain]), {
            onSuccess: async (res) => {
                // const popularnfts = res.popularNfts;

                // const unresolved = popularnfts?.map(async nft => {
                //     const sdk = new ThirdwebSDK(chainnum[nft.chainId]);
                //     const contract = await sdk.getContract(nft.collection.contractAddress, "nft-collection");
                //     const itemContractdata = await contract.get(nft.id);
                //     return {...nft, itemContractdata};
                // })

                // const resolveddata = await Promise.all(unresolved);
                // setPopularNfts(resolveddata);
            }
        }
    )

    const {data: totalNFTData, status: totalNFTDataStatus} = useQuery(
        ['totalNFTs'], 
        getTotalsforAdmin("testnet"), 
    )

    const findUser = (walletaddress) => {
        if(!users) return;
        if(!walletaddress || walletaddress == '') { 
            setSelectedUser([...updatedUsers]); 
            return;
        }
        const allusers = updatedUsers.filter(user => user.walletAddress == walletaddress || user.userName.toLowerCase().includes(walletaddress.toLowerCase()));
        setSelectedUser([...allusers]);
    }

  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-gray'}`}>
        <Head>
            <title>Dashboard: Nuva NFT</title>
        </Head>
        {!loggedIn ? (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center">
                <ConnectWallet accentColor="#0053f2" className=" ml-4" style={{ borderRadius: '50% !important'}} />
            </div>

        ): (
            <div className="relative">
                <div className="bg-slate-700">
                    <Header />
                    <Toaster position="bottom-right" reverseOrder={false} />
                </div>
                {referralModal && (
                    <div className="fixed top-0 flex items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-50">
                        <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[40rem] overflow-y-scroll z-50 relative`}>
                            <div
                                className="absolute top-5 right-6 md:right-12  transition duration-[300] z-60 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
                                onClick={() => setReferralModal(false)}
                                >
                                    <RiCloseFill fontSize={25}/>
                            </div>
                            <ReferralSettings/>
                        </div>
                    </div>

                )}
                <div className="grid grid-cols-6 pt-[5rem]">
                    <div>
                        <Sidebar selectedChain={selectedChain} setSelectedChain={setSelectedChain} setReferralModal={setReferralModal} />
                    </div>
                    <main className="col-span-5 p-4">
                        <div className="pt-10">
                            <div className="container mx-auto">
                                <div className="cards-container">
                                    <div className={`card flex justify-between items-center flex-row ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header ${dark ? '!text-white' : ''}`}>
                                                Total NFTs
                                            </div>
                                            <div className="card-body">
                                                <h5 className={` ${dark ? '!text-white' : ''}`}>{totalData?.totalNfts}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <GoPackage fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className={`card flex justify-between items-center flex-row ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header ${dark ? '!text-white' : ''}`}>
                                                Total NFTs on Sale
                                            </div>
                                            <div className="card-body">
                                                <h5 className={` ${dark ? '!text-white' : ''}`}>{totalNFTData?.totalNFTs}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <GoPackage fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className={`card flex justify-between items-center flex-row ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header ${dark ? '!text-white' : ''}`}>
                                                Total Collections
                                            </div>
                                            <div className="card-body">
                                                <h5 className={` ${dark ? '!text-white' : ''}`}>{totalData?.totalCollections}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiCollection fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className={`card flex justify-between items-center flex-row ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header ${dark ? '!text-white' : ''}`}>
                                                Total Wallets
                                            </div>
                                            <div className="card-body">
                                                <h5 className={` ${dark ? '!text-white' : ''}`}>{totalData?.totalUsers}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiUser fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className={`card flex justify-between items-center flex-row ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header ${dark ? '!text-white' : ''}`}>
                                                Total Categories
                                            </div>
                                            <div className="card-body">
                                                <h5 className={` ${dark ? '!text-white' : ''}`}>{Boolean(categoryCount) ? categoryCount : 0}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiCategory fontSize={20}/>
                                        </div>
                                    </div>
                                </div>
                                {/* End of first row */}

                                {/* Start of second row*/}
                                <div className="cards-container">
                                    <div className={`card !overflow-visible z-20 ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                Add New Category
                                            </div>
                                            <div className="card-body text-sm pt-4">
                                                <AddCategory setCategoryCount={setCategoryCount}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`card !overflow-visible z-20 ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                Block NFTs from Display
                                            </div>
                                            <div className="card-body text-sm pt-4">
                                                <BlockedNFTs />

                                            </div>
                                        </div>
                                    </div>
                                    <div className={`card !overflow-visible z-20 ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                Block Collections from Display
                                            </div>
                                            <div className="card-body text-sm pt-4">
                                                <BlockedCollections />
                                            </div>
                                        </div>
                                    </div>

                                    
                                </div>
                                {/* End of second row*/}

                                <div className="cards-container">
                                    <div className={`card !overflow-visible z-20 ${dark ? '!bg-slate-700' : ''}`}>
                                    <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                All Users
                                            </div>
                                            <div className="card-body pt-4">
                                                <div className="bg-slate-600 p-3 rounded-lg mb-2">
                                                    <p className="text-neutral-100 mb-2 text-sm">Search Wallet Address</p>
                                                    <input 
                                                        className="flex-grow text-sm rounded-md outline-0 p-2 bg-slate-700 w-full text-neutral-100"
                                                        type="text" 
                                                        value={searchquery}
                                                        onChange={(e) => findUser(e.target.value)}/>

                                                </div>
                                                <div className="flex flex-col max-h-[450px] overflow-scroll">
                                                    {userStatus == 'loading' && <div className="flex justify-center items-center gap-1"> <IconLoading /> Loading</div>}
                                                    {userStatus == 'success' && selectedUser?.map((user, index) => (
                                                        <div key={index}>
                                                            <Disclosure as="div" className="mt-2">
                                                            {({ open }) => (
                                                            <>
                                                                <Disclosure.Button 
                                                                    className="flex w-full justify-between rounded-lg items-center p-4 py-2 text-left">
                                                                        <div className="flex-grow flex flex-row gap-2 items-center">
                                                                            <div className="w-[30px] h-[30px] rounded-full overflow-hidden border border-neutral-200">
                                                                                 <img src={Boolean(user.web3imageprofile) ? getImagefromWeb3(user.web3imageprofile) : createAwatar(user?.walletAddress)} className="h-full w-full object-cover" />    
                                                                            </div>
                                                                            <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                                                                                <span>{user.userName}</span>
                                                                                <span>{user.walletAddress.slice(0,10)}...{user.walletAddress.slice(-10)}</span>
                                                                            </div>
                                                                        </div>

                                                                        <HiChevronDown
                                                                            className={`${
                                                                            open ? 'rotate-180 transform' : ''
                                                                            } h-5 w-5 text-slate-300 transition`}
                                                                        />
                                                                </Disclosure.Button>
                                                                <Disclosure.Panel className="px-4 pt-0 pb-2 text-sm relative">
                                                                    <div className={`absolute right-6 top-2 ${dark ? 'text-neutral-100': ''}`}>
                                                                        <a href={`/user/${user?._id}`} target="_blank">
                                                                            <div className={`viewer rounded-md border ${dark ? ' border-slate-500 hover:bg-slate-400' : 'border-neutral-200 hover:bg-neutral-300'} cursor-pointer p-1`}>
                                                                                {dark ? 
                                                                                <div className="flex pr-1.5"><BsArrowRightShort fontSize={20} className="-rotate-45" color='#ffffff'/>View</div>
                                                                                :
                                                                                <div className="flex pr-1.5"><BsArrowRightShort fontSize={20} className="-rotate-45" />View</div>
                                                                                }
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                    <div className={`flex p-6 rounded-lg bg-slate-600 flex-col gap-1 ${dark ? 'text-neutral-100': ''}`}>
                                                                        <div className={style.userdetailrow}>
                                                                            <span className="font-bold">Referred By</span>
                                                                            {Boolean(user?.referrer) && (
                                                                                <div className="flex-grow flex flex-row gap-2 items-center pl-4">
                                                                                    <div className="w-[20px] h-[20px] rounded-full overflow-hidden border border-neutral-200">
                                                                                        <img src={Boolean(user?.referrer?.web3imageprofile) ? getImagefromWeb3(user?.referrer?.web3imageprofile) : createAwatar(user?.referrer?.walletAddress)} className="h-full w-full object-cover" />    
                                                                                    </div>
                                                                                    <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                                                                                        <span>{user?.referrer?.userName}</span>
                                                                                        <div className="flex gap-1">
                                                                                            <span>{user?.referrer?.walletAddress.slice(0,10)}...{user?.referrer?.walletAddress.slice(-10)}</span>
                                                                                            <span
                                                                                                className="relative inline cursor-pointer top-0"
                                                                                                onClick={() => {
                                                                                                navigator.clipboard.writeText(user?.referrer?.walletAddress)
                                                                                                toast.success('User address copied !', successToastStyle)
                                                                                                }}
                                                                                            >
                                                                                                <IconCopy />
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className={style.userdetailrow}>
                                                                            <span className="font-bold">Direct Referrals: </span><span className="inline">{user?.directs?.length ? user?.directs?.length : 0}</span>
                                                                            <div className="flex flex-col gap-1 pl-4">
                                                                                {user?.directs?.length > 0 && 
                                                                                    user?.directs?.map((directuser,index) => (
                                                                                        <div className="py-2 flex-grow flex flex-row gap-2 items-center" key={index}>
                                                                                            <div className="w-[20px] h-[20px] rounded-full overflow-hidden border border-neutral-200">
                                                                                                <img src={Boolean(directuser?.web3imageprofile) ? getImagefromWeb3(directuser?.web3imageprofile) : createAwatar(directuser?.walletAddress)} className="h-full w-full object-cover" />    
                                                                                            </div>
                                                                                            <div>
                                                                                                <p>{directuser?.userName}</p>
                                                                                                <div className="flex gap-1">
                                                                                                    <p>{directuser?.walletAddress.slice(0,10)}...{directuser?.walletAddress.slice(-10)}</p>
                                                                                                    <span
                                                                                                        className="relative inline cursor-pointer top-0"
                                                                                                        onClick={() => {
                                                                                                        navigator.clipboard.writeText(directuser?.walletAddress)
                                                                                                        toast.success('User address copied !', successToastStyle)
                                                                                                        }}
                                                                                                    >
                                                                                                        <IconCopy />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}

                                                                            </div>
                                                                        </div>

                                                                        <div className={style.userdetailrow}>
                                                                            <span className="font-bold">Uni Level: </span>
                                                                            <span> {user.paylevel}</span>
                                                                        </div>

                                                                        <div className={style.userdetailrow}>
                                                                            <span className="font-bold">Joined Date: </span>
                                                                            <span> {moment(user?._createdAt).format('YYYY MMM DD')}</span>
                                                                        </div>

                                                                    </div>
                                                                </Disclosure.Panel>
                                                            </>
                                                            )}
                                                        </Disclosure>
                                                      </div>
                                                    //    <div className="flex flex-col justify-between items-center gap-2" key={index}>
                                                    //         <div className="userinfo w-full flex flex-row items-center gap-2">
                                                    //             <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
                                                    //                     <div className="w-[30px] h-[30px] rounded-full overflow-hidden border border-neutral-200">
                                                    //                         <img src={Boolean(user.web3imageprofile) ? getImagefromWeb3(user.web3imageprofile) : createAwatar(user?.walletAddress)} className="h-full w-full object-cover" />    
                                                    //                     </div>
                                                    //                     <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                                                    //                         <span>{user.userName}</span>
                                                    //                         <span>{user.walletAddress.slice(0,10)}...{user.walletAddress.slice(-10)}</span>
                                                    //                     </div>
                                                    //                 </div>
                                                    //                 <div 
                                                    //                     className={`viewer rounded-xl border ${dark ? ' border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer p-2`}
                                                    //                     onClick={() => showMore(index)}>
                                                    //                     <HiChevronDown fontSize={20} color={dark ? "#ffffff" : "#000000"}/>
                                                    //                 </div>
                                                    //                 <a href={`/user/${user?._id}`} target="_blank">
                                                    //                     <div className={`viewer rounded-xl border ${dark ? ' border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer p-2`}>
                                                    //                         {dark ? 
                                                    //                         <BsArrowRightShort fontSize={20} className="-rotate-45" color='#ffffff'/>
                                                    //                         :
                                                    //                         <BsArrowRightShort fontSize={20} className="-rotate-45" />
                                                    //                         }
                                                    //                     </div>
                                                    //                 </a>
                                                    //         </div>
                                                    //         <div className={`hidden userdetails-${index}`}>
                                                    //             info
                                                    //         </div>
                                                            
                                                    //     </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                Most Popular NFTs
                                            </div>
                                            <div className="card-body pt-4">
                                                <div className="flex flex-col">
                                                    {!popularNfts && <div className="flex justify-center items-center gap-1"> <IconLoading /> Loading</div>}
                                                    {popularNfts && popularNfts?.map(item => (
                                                        <div className="flex flex-row justify-between items-center" key={item?._id}>
                                                            <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
                                                                {Boolean(item.itemContractdata?.metadata.image) && (
                                                                    <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border border-neutral-200">
                                                                        <img src={item.itemContractdata?.metadata.image} className="h-full w-full object-cover" />
                                                                    </div>
                                                                )}
                                                                <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                                                                    <span>{item.itemContractdata?.metadata.name}</span>
                                                                    <div className="flex gap-1"><TiHeart fill='#ff0000' fontSize={20}/> {item.likers}</div>
                                                                </div>
                                                            </div>
                                                            <a href={`/nfts/${item?.itemContractdata?.metadata?.properties?.tokenid}`} target="_blank">
                                                                <div className={`viewer rounded-xl border ${dark ? ' border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer p-2`}>
                                                                    {dark ? 
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45" color='#ffffff'/>
                                                                    :
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45" />
                                                                    }
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className={`card !overflow-visible z-20 ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                Top Collections
                                            </div>
                                            <div className="card-body pt-4">
                                                <div className="flex flex-col">
                                                    {totalDataStatus == "loading" && <div className="flex justify-center items-center gap-1"> <IconLoading /> Loading</div>}
                                                    {totalData?.topCollections && totalData?.topCollections?.map(collection => (
                                                        <div className="flex flex-row justify-between items-center" key={collection?._id}>
                                                            <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
                                                                {Boolean(collection.web3imageprofile) && (
                                                                    <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border border-neutral-200">
                                                                        <img src={getImagefromWeb3(collection.web3imageprofile)} className="h-full w-full object-cover" />
                                                                    </div>
                                                                )}
                                                                <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                                                                    <span>{collection.name}</span>
                                                                    <span>${millify(collection.volumeTraded)}</span>
                                                                </div>
                                                            </div>
                                                            <a href={`/collections/${collection?._id}`} target="_blank">
                                                                <div className={`viewer rounded-xl border ${dark ? ' border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer p-2`}>
                                                                    {dark ? 
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45" color='#ffffff'/>
                                                                    :
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45" />
                                                                    }
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`card !overflow-visible z-20 ${dark ? '!bg-slate-700' : ''}`}>
                                        <div className="card-content">
                                            <div className={`card-header font-semibold ${dark ? '!text-white' : ''}`}>
                                                Top Active Users
                                            </div>
                                            <div className="card-body pt-4">
                                                <div className="flex flex-col">
                                                {totalDataStatus == "loading" && <div className="flex justify-center items-center gap-1"> <IconLoading /> Loading</div>}
                                                    {totalData?.topActiveUsers && totalData?.topActiveUsers?.map(user => (
                                                        <div className="flex flex-row justify-between items-center" key={user?.walletAddress}>
                                                            <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
                                                                <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border border-neutral-200">
                                                                    <img src={Boolean(user.web3imageprofile) ? getImagefromWeb3(user.web3imageprofile) : createAwatar(user?.walletAddress)} className="h-full w-full object-cover" />    
                                                                </div>
                                                                <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                                                                    <span>{user.userName}</span>
                                                                    <span>${millify(user.volumeTraded)}</span>
                                                                </div>
                                                            </div>
                                                            <a href={`/user/${user?._id}`} target="_blank">
                                                                <div className={`viewer rounded-xl border ${dark ? ' border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer p-2`}>
                                                                    {dark ? 
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45" color='#ffffff'/>
                                                                    :
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45" />
                                                                    }
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="p-4 text-sm">&copy; 2023 Meta Nuva</p>
                    </main>
                </div>
            </div>
        )}
    </div>
  )
}

export default dashboard