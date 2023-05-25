import axios from 'axios'
import Head from 'next/head'
import millify from 'millify'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { TiHeart } from 'react-icons/ti'
import { CgClose } from 'react-icons/cg'
import Header from '../../components/Header'
import { GoPackage } from 'react-icons/go'
import { config } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import toast, { Toaster } from 'react-hot-toast'
import { createAwatar } from '../../utils/utilities'
import { getImagefromWeb3 } from '../../fetchers/s3'
import React, { useEffect, useState } from 'react'
import { BsArrowRightShort } from 'react-icons/bs'
import { getTotals } from '../../fetchers/SanityFetchers'
import BlockedNFTs from '../../components/admin/BlockedNFTs'
import AddCategory from '../../components/admin/AddCategory'
import { useThemeContext } from '../../contexts/ThemeContext'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import { BiCollection, BiDollarCircle, BiUser } from 'react-icons/bi'
import BlockedCollections from '../../components/admin/BlockedCollections'
import { getTotalsforAdmin, updateListings } from '../../fetchers/Web3Fetchers'
import { IconAvalanche, IconBNB, IconEthereum, IconLoading, IconPolygon } from '../../components/icons/CustomIcons'
import { RiCloseFill } from 'react-icons/ri'
import ReferralSettings from '../../components/admin/ReferralSettings'

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
    const [loggedIn, setLoggedIn] = useState(false);
    const [popularNfts, setPopularNfts] = useState();
    const [ethloading, setethloading] = useState(false);
    const [totalNftSale, setTotalNftSale] = useState(0);
    const [bnbloading, setbnbloading] = useState(false);
    const [selectedChain, setSelectedChain] = useState();
    const [avaxloading, setavaxloading] = useState(false);
    const [maticloading, setmaticloading] = useState(false);
    const [totalPlatformFees, setTotalPlatformFees] = useState(0);
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const [referralModal, setReferralModal] = useState(false);

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

    const {data: totalData, status: totalDataStatus} = useQuery(
        ['totalnft', selectedChain], getTotals(blockchain[selectedChain]), {
            onSuccess: async (res) => {
                const popularnfts = res.popularNfts;

                const unresolved = popularnfts?.map(async nft => {
                    const sdk = new ThirdwebSDK(chainnum[nft.chainId]);
                    const contract = await sdk.getContract(nft.collection.contractAddress, "nft-collection");
                    const itemContractdata = await contract.get(nft.id);
                    return {...nft, itemContractdata};
                })

                const resolveddata = await Promise.all(unresolved);
                setPopularNfts(resolveddata);
            }
        }
    )

    const {data: totalNFTData, status: totalNFTDataStatus} = useQuery(
        ['totalNFTs'], 
        getTotalsforAdmin("testnet"), 
    )

    const refreshListings = async (blockchain) => {
        // selection for loading icon
        if(blockchain == "mumbai" || blockchain == "polygon") {setmaticloading(true);}
        else if(blockchain == "goerli" || blockchain == "mainnet") {setethloading(true);}
        else if(blockchain == "binance-testnet" || blockchain == "binance") {setbnbloading(true);}
        else if(blockchain == "avalanche-fuji" || blockchain == "avalanche") {setavaxloading(true);}
        
        await axios.get(process.env.NODE_ENV == 'production' ? `https://nuvanft.io:8080/api/updateListings/${blockchain}` : `http://localhost:8080/api/updateListings/${blockchain}`)
            .then(() => {
                toast.success(`Listings in ${blockchain} chain has been refreshed.`, successToastStyle);
            }).catch((err) => {
                toast.error("Error in refreshing active listings.", errorToastStyle);
            });
        
        if(blockchain == "mumbai" || blockchain == "polygon") {setmaticloading(false);}
        else if(blockchain == "goerli" || blockchain == "mainnet") {setethloading(false);}
        else if(blockchain == "binance-testnet" || blockchain == "binance") {setbnbloading(false);}
        else if(blockchain == "avalanche-fuji" || blockchain == "avalanche") {setavaxloading(false);}
        
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
                <div className="flex pt-[5rem]">
                    <div className={`sidebar w-64 border ${dark ? 'border-slate-700' : ''} border-l-0 hidden md:block p-4 text-sm`}>
                         <div className="mx-2 p-2 px-4 flex justify-between items-center hidden">
                            <span className="">Select Chain</span> 
                            {selectedChain && (
                                <div className="transition hover:scale-125 cursor-pointer"
                                    onClick={() => setSelectedChain(undefined)}>
                                    <CgClose fontSize={14}/>
                                </div>
                            )}
                        </div>
                        <div className="chainHolder flex flex-col hidden">
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md rounded-lg mx-2 p-4 mb-1 cursor-pointer ${selectedChain == "goerli" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("goerli")}>
                                <IconEthereum/> Ethereum
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md rounded-lg mx-2 p-4 mb-1 cursor-pointer ${selectedChain == "mumbai" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("mumbai")}>
                                <IconPolygon/> Polygon 
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md rounded-lg mx-2 p-4 mb-1 cursor-pointer ${selectedChain == "binance-test" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("binance-test")}>
                                <IconBNB/> Binance
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md rounded-lg mx-2 flex gap-1 items-center p-4 mb-1 cursor-pointer ${selectedChain == "avalanche-fuji" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("avalanche-fuji")}>
                                <IconAvalanche/>  Avalanche
                            </div>
                        </div>
                        <h2 className="mt-5 mb-3 font-semibold">Refresh Active Listings</h2>
                        <div className="flex flex-col flex-wrap">
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 mb-1 p-2 cursor-pointer`}
                                onClick={() => refreshListings("goerli")}>
                                <div>
                                    <IconEthereum/>Goerli 
                                </div>
                                {ethloading && <IconLoading />}
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 mb-1 p-2 cursor-pointer`}
                                onClick={() => refreshListings("mumbai")}>
                                <div>
                                    <IconPolygon/> Mumbai
                                </div> 
                                {maticloading && <IconLoading />}
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 mb-1 p-2 cursor-pointer`}
                                onClick={() => refreshListings("binance-testnet")}>
                                <div>
                                    <IconBNB/> Binance Test Chain
                                </div> 
                                {bnbloading && <IconLoading />}
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 gap-1 p-2 items-center mb-1 cursor-pointer`}
                                onClick={() => refreshListings("avalanche-fuji")}>
                                <div>
                                    <IconAvalanche/> Avalanche Fuji
                                </div>
                                    {avaxloading && <IconLoading />}
                            </div>
                        </div>
                        <h2 
                            className={`mt-5 mb-3 font-semibold  rounded-lg p-2 cursor-pointer ${dark ? 'hover:bg-slate-800': 'hover:bg-neutral-200'}`}
                            onClick={() => setReferralModal(true)}>
                                Referral Settings
                        </h2>
                    </div>
                    <main className="flex-grow p-4">
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
                                                Total Platform Fees
                                            </div>
                                            <div className="card-body">
                                                <h5 className={` ${dark ? '!text-white' : ''}`}>${totalData?.platformfee?.platformfee}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiDollarCircle fontSize={20}/>
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
                                                <AddCategory/>
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
                                        </div>
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