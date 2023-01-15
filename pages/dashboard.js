import axios from 'axios'
import Head from 'next/head'
import millify from 'millify'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { TiHeart } from 'react-icons/ti'
import { CgClose } from 'react-icons/cg'
import Header from '../components/Header'
import { GoPackage } from 'react-icons/go'
import { config } from '../lib/sanityClient'
import * as style from '@dicebear/pixel-art';
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { createAvatar } from '@dicebear/avatars';
import { getImagefromWeb3 } from '../fetchers/s3'
import React, { useEffect, useState } from 'react'
import { BsArrowRightShort } from 'react-icons/bs'
import { getTotals } from '../fetchers/SanityFetchers'
import { useThemeContext } from '../contexts/ThemeContext'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import { BiCollection, BiDollarCircle, BiUser } from 'react-icons/bi'
import { getTotalsforAdmin, updateListings } from '../fetchers/Web3Fetchers'
import { IconAvalanche, IconBNB, IconEthereum, IconLoading, IconPolygon } from '../components/icons/CustomIcons'

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
    const { errorToastStyle, successToastStyle } = useThemeContext();

    const getAllAdminUsers = async () => {
        const query = '*[_type == "settings"]{adminusers}';
        const res = await config.fetch(query)
        return res[0].adminusers
    }

    useEffect(() => {
        if(!address) return
        ;(async() => {
            const adminList = await getAllAdminUsers();
            const isThisUserAdmin = adminList.filter(user => user._ref == address)
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
                toast.error(err, errorToastStyle);
            });
        
        if(blockchain == "mumbai" || blockchain == "polygon") {setmaticloading(false);}
        else if(blockchain == "goerli" || blockchain == "mainnet") {setethloading(false);}
        else if(blockchain == "binance-testnet" || blockchain == "binance") {setbnbloading(false);}
        else if(blockchain == "avalanche-fuji" || blockchain == "avalanche") {setavaxloading(false);}
        
    }
    

  return (
    <div className="">
        <Head>
            <title>Dashboard: Nuva NFT</title>
        </Head>
        {!loggedIn ? (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center">
                <ConnectWallet accentColor="#0053f2" className=" ml-4" style={{ borderRadius: '50% !important'}} />
            </div>

        ): (
            <>  
                <div className="bg-slate-700">
                    <Header />
                </div>
                <div className="flex pt-[5rem]" style={{ backgroundColor: "rgb(248, 249, 250)" }}>
                    <div className="sidebar w-64 border hidden md:block p-4 text-sm">
                         <div className="mx-2 p-2 px-4 flex justify-between items-center">
                            <span className="">Select Chain</span> 
                            {selectedChain && (
                                <div className="transition hover:scale-125 cursor-pointer"
                                    onClick={() => setSelectedChain(undefined)}>
                                    <CgClose fontSize={14}/>
                                </div>
                            )}
                        </div>
                        <div className="chainHolder flex flex-col">
                            <div className={`hover:bg-white hover:shadow-md rounded-lg mx-2 p-4 mb-1 cursor-pointer ${selectedChain == "goerli" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("goerli")}>
                                <IconEthereum/> Ethereum
                            </div>
                            <div className={`hover:bg-white hover:shadow-md rounded-lg mx-2 p-4 mb-1 cursor-pointer ${selectedChain == "mumbai" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("mumbai")}>
                                <IconPolygon/> Polygon 
                            </div>
                            <div className={`hover:bg-white hover:shadow-md rounded-lg mx-2 p-4 mb-1 cursor-pointer ${selectedChain == "binance-test" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("binance-test")}>
                                <IconBNB/> Binance
                            </div>
                            <div className={`hover:bg-white hover:shadow-md rounded-lg mx-2 flex gap-1 items-center p-4 mb-1 cursor-pointer ${selectedChain == "avalanche-fuji" ? ' bg-white shadow-md' : ''}`}
                                onClick={() => setSelectedChain("avalanche-fuji")}>
                                <IconAvalanche/>  Avalanche
                            </div>
                        </div>
                        <h2 className="mt-5">Refresh Active Listings</h2>
                        <div className="flex flex-col flex-wrap">
                            <div className={`hover:bg-white hover:shadow-md flex justify-between rounded-lg mx-2 p-4 mb-1 cursor-pointer`}
                                onClick={() => refreshListings("goerli")}>
                                <div>
                                    <IconEthereum/> Ethereum 
                                </div>
                                {ethloading && <IconLoading />}
                            </div>
                            <div className={`hover:bg-white hover:shadow-md flex justify-between rounded-lg mx-2 p-4 mb-1 cursor-pointer`}
                                onClick={() => refreshListings("mumbai")}>
                                <div>
                                    <IconPolygon/> Polygon
                                </div> 
                                {maticloading && <IconLoading />}
                            </div>
                            <div className={`hover:bg-white hover:shadow-md flex justify-between rounded-lg mx-2 p-4 mb-1 cursor-pointer`}
                                onClick={() => refreshListings("binance-testnet")}>
                                <div>
                                    <IconBNB/> Binance
                                </div> 
                                {bnbloading && <IconLoading />}
                            </div>
                            <div className={`hover:bg-white hover:shadow-md flex justify-between rounded-lg mx-2 gap-1 items-center p-4 mb-1 cursor-pointer`}
                                onClick={() => refreshListings("avalanche-fuji")}>
                                <div>
                                    <IconAvalanche/> Avalanche
                                </div>
                                    {avaxloading && <IconLoading />}
                            </div>
                        </div>
                    </div>
                    <main className="flex-grow p-4">
                        <div className="pt-10 h-[100vh]">
                            <div className="container mx-auto">
                                <div className="cards-container">
                                    <div className="card flex justify-between items-center flex-row">
                                        <div className="card-content">
                                            <div className="card-header">
                                                Total NFTs
                                            </div>
                                            <div className="card-body">
                                                <h5>{totalData?.totalNfts}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <GoPackage fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className="card flex justify-between items-center flex-row">
                                        <div className="card-content">
                                            <div className="card-header">
                                                Total NFTs on Sale
                                            </div>
                                            <div className="card-body">
                                                <h5>{totalNFTData?.totalNFTs}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <GoPackage fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className="card flex justify-between items-center flex-row">
                                        <div className="card-content">
                                            <div className="card-header">
                                                Total Collections
                                            </div>
                                            <div className="card-body">
                                                <h5>{totalData?.totalCollections}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiCollection fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className="card flex justify-between items-center flex-row">
                                        <div className="card-content">
                                            <div className="card-header">
                                                Total Users
                                            </div>
                                            <div className="card-body">
                                                <h5>{totalData?.totalUsers}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiUser fontSize={20}/>
                                        </div>
                                    </div>
                                    <div className="card flex justify-between items-center flex-row">
                                        <div className="card-content">
                                            <div className="card-header">
                                                Total Platform Fees
                                            </div>
                                            <div className="card-body">
                                                <h5>${totalData?.platformfee?.platformfee}</h5>
                                            </div>
                                        </div>
                                        <div className="card-icon">
                                            <BiDollarCircle fontSize={20}/>
                                        </div>
                                    </div>
                                </div>
                                {/* End of first row */}

                                <div className="cards-container">
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="card-header font-semibold">
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
                                                                        <img src={item.itemContractdata?.metadata.image} />
                                                                    </div>
                                                                )}
                                                                <div className="user-text flex flex-col text-sm">
                                                                    <span>{item.itemContractdata?.metadata.name}</span>
                                                                    <div className="flex gap-1"><TiHeart fill='#ff0000' fontSize={20}/> {item.likers}</div>
                                                                </div>
                                                            </div>
                                                            <a href={`/nfts/${item?.itemContractdata?.metadata?.properties.tokenid}`} target="_blank">
                                                                <div className="viewer rounded-xl border border-neutral-200 cursor-pointer p-2 hover:bg-neutral-100">
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45"/>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="card-header font-semibold">
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
                                                                        <img src={getImagefromWeb3(collection.web3imageprofile)} />
                                                                    </div>
                                                                )}
                                                                <div className="user-text flex flex-col text-sm">
                                                                    <span>{collection.name}</span>
                                                                    <span>${millify(collection.volumeTraded)}</span>
                                                                </div>
                                                            </div>
                                                            <a href={`/collections/${collection?._id}`} target="_blank">
                                                                <div className="viewer rounded-xl border border-neutral-200 cursor-pointer p-2 hover:bg-neutral-100">
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45"/>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="card-header font-semibold">
                                                Top Active Users
                                            </div>
                                            <div className="card-body pt-4">
                                                <div className="flex flex-col">
                                                {totalDataStatus == "loading" && <div className="flex justify-center items-center gap-1"> <IconLoading /> Loading</div>}
                                                    {totalData?.topActiveUsers && totalData?.topActiveUsers?.map(user => (
                                                        <div className="flex flex-row justify-between items-center" key={user?.walletAddress}>
                                                            <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
                                                                <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border border-neutral-200">
                                                                    {Boolean(user.web3imageprofile) ? (
                                                                        <img src={getImagefromWeb3(user.web3imageprofile)} />    
                                                                    ): (
                                                                        <div dangerouslySetInnerHTML={{ __html: createAvatar(style,  {seed: user?.walletAddress}) }} />
                                                                    )}
                                                                </div>
                                                                <div className="user-text flex flex-col text-sm">
                                                                    <span>{user.userName}</span>
                                                                    <span>${millify(user.volumeTraded)}</span>
                                                                </div>
                                                            </div>
                                                            <a href={`/user/${user?._id}`} target="_blank">
                                                                <div className="viewer rounded-xl border border-neutral-200 cursor-pointer p-2 hover:bg-neutral-100">
                                                                    <BsArrowRightShort fontSize={20} className="-rotate-45"/>
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
            </>
        )}
    </div>
  )
}

export default dashboard