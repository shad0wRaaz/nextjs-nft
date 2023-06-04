import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import bannerbg from '../assets/images/banner-bg.png'
import creature1  from '../assets/cryptocreatures/creature01.jpeg'
import creature2  from '../assets/cryptocreatures/creature02.jpeg'
import creature3  from '../assets/cryptocreatures/creature03.jpeg'
import creature4  from '../assets/cryptocreatures/creature04.jpeg'
import neon1  from '../assets/neondreams/neon1.jpeg'
import neon2  from '../assets/neondreams/neon2.jpeg'
import neon3  from '../assets/neondreams/neon3.jpeg'
import neon4  from '../assets/neondreams/neon4.jpeg'
import celestial1  from '../assets/celestialbeings/celestial1.jpeg'
import celestial2  from '../assets/celestialbeings/celestial2.jpeg'
import celestial3  from '../assets/celestialbeings/celestial3.jpeg'
import celestial4  from '../assets/celestialbeings/celestial4.jpeg'
import artifacts1  from '../assets/artifacts/artifacts1.jpeg'
import artifacts2  from '../assets/artifacts/artifacts2.jpeg'
import artifacts3  from '../assets/artifacts/artifacts3.jpeg'
import artifacts4  from '../assets/artifacts/artifacts4.jpeg'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { CgClose } from 'react-icons/cg'
import { useQuery } from 'react-query'
import { getAirDrops } from '../../../fetchers/SanityFetchers'
import Moment from 'react-moment'
import { useSettingsContext } from '../../../contexts/SettingsContext'
import { MdOutlineOpenInNew } from 'react-icons/md'

const Buy = ({ setShowMenu }) => {
    const HOST = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io' : 'http://localhost:3000'
    const [cryptoDrop, setCryptoDrop] = useState(false);
    const [neonDrop, setNeonDrop] = useState(false);
    const [celestialDrop, setCelestialDrop] = useState(false);
    const [futureDrop, setFutureDrop] = useState(false);
    const [phase, setPhase] = useState(1);
    const [cryptoAir, setCryptoAir] = useState([]);
    const [selectedCryptoAir, setSelectedCryptoAir] = useState([]);
    const [neonAir, setNeonAir] = useState([]);
    const [selectedNeonAir, setSelectedNeonAir] = useState([]);
    const [celestialAir, setCelestialAir] = useState([]);
    const [selectedCelestialAir, setSelectedCelestialAir] = useState([]);
    const [futureAir, setFutureAir] = useState([]);
    const [selectedFutureAir, setSelectedFutureAir] = useState([]);
    const { chainExplorer, chainIcon } = useSettingsContext();
    const [searchAddress, setSearchAddress] = useState();
    
    const cryptoContract = "0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923";
    const neonContract = "0x5cb763F5954fDeeF7F5c97Cc330EfD60e8EcB5D1";
    const celestialContract = "0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE924";
    const futureContract = "0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE925";
    // Airdrop
    // const newAirdrop = [{
    //     chainId: 97,
    //     transactionHash: '0xbc64af636e0204094e40dce1c587115b1452080f8ba16dd5e83856590f59fd6c',
    //     phase: 1,
    //     amount: 0.3,
    //     contractAddress: '0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923',
    //     walletAddress: '0x9D2036BAfd465bAFaCFeEb6A4a97659D9f2a8A30',
    //     createdTime: new Date()
    // }]

    const {data, status} = useQuery(
        ["airdrops"],
        getAirDrops(),
        {
            onSuccess: (res) => {
                const wholeArray = []
                const updatedData = res.map(drops => {
                    const drop = JSON.parse(drops.airdrops);
                    console.log(drop)
                    drop.map(d => wholeArray.push(d));
                });

                //segregate the whole array into correct collections
                const cc = wholeArray.filter(drop => drop.contractAddress == cryptoContract);
                setCryptoAir(cc);
                setSelectedCryptoAir(cc);
                const nd = wholeArray.filter(drop => drop.contractAddress == neonContract);
                setNeonAir(nd);
                setSelectedNeonAir(cc);
                const cb = wholeArray.filter(drop => drop.contractAddress == celestialContract);
                setCelestialAir(cb);
                setSelectedCelestialAir(cc);
                const af = wholeArray.filter(drop => drop.contractAddress == futureContract);
                setFutureAir(af);
                setSelectedFutureAir(cc);
            }
        }
    );

    const handleSearchCrypto = () => {
        if(!searchAddress){
            setSelectedCryptoAir(cryptoAir);
            return
        }
        const selectedCrypto = cryptoAir.filter(drop => drop.walletAddress.toLowerCase().includes(searchAddress.toLowerCase()) || drop.transactionHash.toLowerCase().includes(searchAddress.toLowerCase()));
        setSelectedCryptoAir(selectedCrypto);
    }
    const handleSearchNeon = () => {
        if(!searchAddress){
            setSelectedNeonAir(neonAir);
            return
        }
        const selectedNeon = neonAir.filter(drop => drop.walletAddress.toLowerCase().includes(searchAddress.toLowerCase()) || drop.transactionHash.toLowerCase().includes(searchAddress.toLowerCase()));
        setSelectedNeonAir(selectedNeon);
    }
    const handleSearchCelestial = () => {
        if(!searchAddress){
            setSelectedCelestialAir(celestialAir);
            return
        }
        const selectedCelestial = celestialAir.filter(drop => drop.walletAddress.toLowerCase().includes(searchAddress.toLowerCase()) || drop.transactionHash.toLowerCase().includes(searchAddress.toLowerCase()));
        setSelectedCelestialAir(selectedCelestial);
    }
    const handleSearchFuture = () => {
        if(!searchAddress){
            setSelectedFutureAir(futureAir);
            return
        }
        const selectedFuture = futureAir.filter(drop => drop.walletAddress.toLowerCase().includes(searchAddress.toLowerCase()) || drop.transactionHash.toLowerCase().includes(searchAddress.toLowerCase()));
        setSelectedFutureAir(selectedFuture);
    }

    const handleClearCrypto = () => {
        setSelectedCryptoAir(cryptoAir);
        setSearchAddress('')
    }
    const handleClearNeon = () => {
        setSelectedNeonAir(neonAir);
        setSearchAddress('')
    }
    const handleClearCelestial = () => {
        setSelectedCelestialAir(celestialAir);
        setSearchAddress('')
    }
    const handleClearFuture = () => {
        setSelectedFutureAir(futureAir);
        setSearchAddress('')
    }


  return (
    <section 
        onClick={() => setShowMenu(false)}
        id="buy" 
        className="mint bg-cover alfaslab py-[70px] md:py-[100px]" 
        style={{backgroundImage: `url(${bannerbg.src})`}}>
        <div className="container mx-auto px-8">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full md:w-1/2">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal"> 
                        <span className="color--gradient-y d-block">1. Crypto</span> Creatures</h2>
                        <div className="flex gap-2 mt-[2rem]">
                            <Image src={creature1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-[3rem]">
                            <div className="text-center w-full md:w-fit default-btn !leading-normal">
                                <Link href={`${HOST}/collection/binance-testnet/0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923`} passHref>
                                    <a className="">Buy Now</a>
                                </Link>
                            </div>
                            <div
                                className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                                onClick={() => setCryptoDrop(true)}>
                                View Airdrops
                            </div>
                        </div>
                        <Transition appear show={cryptoDrop} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setCryptoDrop(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full h-[564px] max-w-4xl transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">CRYPTO CREATURES</span>
                                        </Dialog.Title>
                                        <div className="flex gap-2 justify-center my-5">
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 1 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(1)}>Phase 1</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 2 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(2)}>Phase 2</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 3 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(3)}>Phase 3</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 4 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(4)}>Phase 4</div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-96 text-sm rounded-md bg-neutral-200 p-2"
                                                type="text"/>
                                            <div className="flex gap-2 ml-2">
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-lime-200 hover:bg-lime-300 text-lime-700 cursor-pointer"
                                                    onClick={() => handleSearchCrypto()}> 
                                                    Search
                                                </div>
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-neutral-200 hover:bg-neutral-300 text-neutral-700 cursor-pointer"
                                                    onClick={() => handleClearCrypto()}> 
                                                    Clear
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 max-h-[282px] md:max-h-[400px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tr className="">
                                                    <td className="text-sm font-bold p-2">Tx Hash</td>
                                                    <td className="text-sm font-bold p-2">User</td>
                                                    <td className="text-sm font-bold p-2">Time</td>
                                                    <td className="text-sm font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedCryptoAir?.length) || !Boolean(cryptoAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ): (
                                                    <>
                                                        {selectedCryptoAir.filter(drops => drops.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank">
                                                                        {drop.transactionHash.slice(0,3)}...{drop.transactionHash.slice(-3)}
                                                                        <MdOutlineOpenInNew />
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,3)}...{drop.walletAddress.slice(-3)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        {chainIcon[drop.chainId.toString()]}
                                                                        {drop.amount}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tr className="">
                                                    <td className="text-base font-bold p-2">Tx Hash</td>
                                                    <td className="text-base font-bold p-2">Receiver</td>
                                                    <td className="text-base font-bold p-2">Time</td>
                                                    <td className="text-base font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedCryptoAir?.length) || !Boolean(cryptoAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        {selectedCryptoAir.filter(filteredDrop => filteredDrop.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank" className="flex items-center gap-1">
                                                                        <MdOutlineOpenInNew />
                                                                        {drop.transactionHash.slice(0,10)}...{drop.transactionHash.slice(-10)}
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,10)}...{drop.walletAddress.slice(-10)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        <div className="rounded-md p-1 bg-neutral-200 px-2 flex justify-center items-center">
                                                                            {chainIcon[drop.chainId.toString()]}
                                                                            {drop.amount}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                            type="button"
                                            className="absolute top-3 right-3 justify-center rounded-md border border-transparent bg-red-600 px-1 py-1 text-sm font-medium text-neutral-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => setCryptoDrop(false)}
                                            >
                                            <CgClose fontSize={20}/>
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                            </Dialog>
                        </Transition>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Project Size</h6>
                                        <h2 className="mint__numbers">5,000</h2>
                                        <h4 className="mint__name text-uppercase text-[#abff87]">NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Price</h6>
                                        <h2 className="mint__numbers">$75<span className="text-xs"> (worth of)</span></h2>
                                        <h4 className="mint__name text-uppercase">BNB</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Date</h6>
                                        <h2 className="mint__numbers">30th*</h2>
                                        <h4 className="mint__name text-uppercase">June</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Remaining</h6>
                                        <h2 className="mint__numbers">5,000</h2>
                                        <h4 className="mint__name text-uppercase">NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-8 mt-[5rem]">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center md:flex-row-reverse">
                    <div className="w-full md:w-1/2">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal"> 
                        <span className="color--gradient-y d-block">2. Neon</span> Dreams</h2>
                        <div className="flex gap-2 mt-[2rem]">
                            <Image src={neon1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-[3rem]">
                            <div className="text-center w-full md:w-fit default-btn !leading-normal">
                                <Link href={`${HOST}/collection/binance-testnet/0x5cb763F5954fDeeF7F5c97Cc330EfD60e8EcB5D1`} passHref>
                                    <a className="">Buy Now</a>
                                </Link>
                            </div>
                            <div 
                                className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                                onClick={() => setNeonDrop(true)}>
                                <a className="">View Airdrops</a>
                            </div>
                        </div>
                        <Transition appear show={neonDrop} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setNeonDrop(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full h-[564px] max-w-4xl transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">NEON DREAMS</span>
                                        </Dialog.Title>
                                        <div className="flex gap-2 justify-center my-5">
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 1 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(1)}>Phase 1</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 2 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(2)}>Phase 2</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 3 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(3)}>Phase 3</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 4 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(4)}>Phase 4</div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-96 text-sm rounded-md bg-neutral-200 p-2"
                                                type="text"/>
                                            <div className="flex gap-2 ml-2">
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-lime-200 hover:bg-lime-300 text-lime-700 cursor-pointer"
                                                    onClick={() => handleSearchNeon()}> 
                                                    Search
                                                </div>
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-neutral-200 hover:bg-neutral-300 text-neutral-700 cursor-pointer"
                                                    onClick={() => handleClearNeon()}> 
                                                    Clear
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 max-h-[282px] md:max-h-[400px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tr className="">
                                                    <td className="text-sm font-bold p-2">Tx Hash</td>
                                                    <td className="text-sm font-bold p-2">User</td>
                                                    <td className="text-sm font-bold p-2">Time</td>
                                                    <td className="text-sm font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedNeonAir?.length) || !Boolean(neonAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ): (
                                                    <>
                                                        {selectedNeonAir.filter(drops => drops.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank">
                                                                        {drop.transactionHash.slice(0,3)}...{drop.transactionHash.slice(-3)}
                                                                        <MdOutlineOpenInNew />
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,3)}...{drop.walletAddress.slice(-3)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        {chainIcon[drop.chainId.toString()]}
                                                                        {drop.amount}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tr className="">
                                                    <td className="text-base font-bold p-2">Tx Hash</td>
                                                    <td className="text-base font-bold p-2">Receiver</td>
                                                    <td className="text-base font-bold p-2">Time</td>
                                                    <td className="text-base font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedNeonAir?.length) || !Boolean(neonAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        {selectedNeonAir.filter(filteredDrop => filteredDrop.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank" className="flex items-center gap-1">
                                                                        <MdOutlineOpenInNew />
                                                                        {drop.transactionHash.slice(0,10)}...{drop.transactionHash.slice(-10)}
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,10)}...{drop.walletAddress.slice(-10)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        <div className="rounded-md p-1 bg-neutral-200 px-2 flex justify-center items-center">
                                                                            {chainIcon[drop.chainId.toString()]}
                                                                            {drop.amount}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                            type="button"
                                            className="absolute top-3 right-3 justify-center rounded-md border border-transparent bg-red-600 px-1 py-1 text-sm font-medium text-neutral-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => setNeonDrop(false)}
                                            >
                                            <CgClose fontSize={20}/>
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                            </Dialog>
                        </Transition>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Project Size</h6>
                                        <h2 className="mint__numbers">5,000</h2>
                                        <h4 className="mint__name text-uppercase text-[#abff87]">NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Price</h6>
                                        <h2 className="mint__numbers">$150<span className="text-xs"> (worth of)</span></h2>
                                        <h4 className="mint__name text-uppercase">BNB</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Date</h6>
                                        <h2 className="mint__numbers">30th*</h2>
                                        <h4 className="mint__name text-uppercase">June</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Remaining</h6>
                                        <h2 className="mint__numbers">5,000</h2>
                                        <h4 className="mint__name text-uppercase">NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                    
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-8 mt-[5rem]">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full md:w-1/2">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal"> 
                        <span className="color--gradient-y d-block">3. Celestial</span> Beings</h2>
                        <div className="flex gap-2 mt-[2rem]">
                            <Image src={celestial1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-[3rem]">
                            <div className="text-center w-full md:w-fit default-btn !leading-normal">
                                <Link href={`${HOST}/collection/binance-testnet/0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923`} passHref>
                                    <a className="">Buy Now</a>
                                </Link>
                            </div>
                            <div 
                                className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                                onClick={() => setCelestialDrop(true)}>
                                    View Airdrops
                            </div>
                        </div>
                        <Transition appear show={celestialDrop} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setCelestialDrop(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full h-[564px] max-w-4xl transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">CELESTIAL BEINGS</span>
                                        </Dialog.Title>
                                        <div className="flex gap-2 justify-center my-5">
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 1 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(1)}>Phase 1</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 2 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(2)}>Phase 2</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 3 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(3)}>Phase 3</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 4 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(4)}>Phase 4</div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-96 text-sm rounded-md bg-neutral-200 p-2"
                                                type="text"/>
                                            <div className="flex gap-2 ml-2">
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-lime-200 hover:bg-lime-300 text-lime-700 cursor-pointer"
                                                    onClick={() => handleSearchCelestial()}> 
                                                    Search
                                                </div>
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-neutral-200 hover:bg-neutral-300 text-neutral-700 cursor-pointer"
                                                    onClick={() => handleClearCelestial()}> 
                                                    Clear
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 max-h-[282px] md:max-h-[400px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tr className="">
                                                    <td className="text-sm font-bold p-2">Tx Hash</td>
                                                    <td className="text-sm font-bold p-2">User</td>
                                                    <td className="text-sm font-bold p-2">Time</td>
                                                    <td className="text-sm font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedCelestialAir?.length) || !Boolean(celestialAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ): (
                                                    <>
                                                        {selectedCelestialAir.filter(drops => drops.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank">
                                                                        {drop.transactionHash.slice(0,3)}...{drop.transactionHash.slice(-3)}
                                                                        <MdOutlineOpenInNew />
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,3)}...{drop.walletAddress.slice(-3)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        {chainIcon[drop.chainId.toString()]}
                                                                        {drop.amount}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tr className="">
                                                    <td className="text-base font-bold p-2">Tx Hash</td>
                                                    <td className="text-base font-bold p-2">Receiver</td>
                                                    <td className="text-base font-bold p-2">Time</td>
                                                    <td className="text-base font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedCelestialAir?.length) || !Boolean(celestialAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        {selectedCelestialAir.filter(filteredDrop => filteredDrop.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank" className="flex items-center gap-1">
                                                                        <MdOutlineOpenInNew />
                                                                        {drop.transactionHash.slice(0,10)}...{drop.transactionHash.slice(-10)}
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,10)}...{drop.walletAddress.slice(-10)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        <div className="rounded-md p-1 bg-neutral-200 px-2 flex justify-center items-center">
                                                                            {chainIcon[drop.chainId.toString()]}
                                                                            {drop.amount}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                            type="button"
                                            className="absolute top-3 right-3 justify-center rounded-md border border-transparent bg-red-600 px-1 py-1 text-sm font-medium text-neutral-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => setCelestialDrop(false)}
                                            >
                                            <CgClose fontSize={20}/>
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                            </Dialog>
                        </Transition>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Project Size</h6>
                                            <h2 className="mint__numbers">10,000</h2>
                                            <h4 className="mint__name text-uppercase text-[#abff87]">NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Buy Price</h6>
                                            <h2 className="mint__numbers">$250<span className="text-xs"> (worth of)</span></h2>
                                            <h4 className="mint__name text-uppercase">BNB</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Buy Date</h6>
                                            <h2 className="mint__numbers">30th*</h2>
                                            <h4 className="mint__name text-uppercase">June</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Remaining</h6>
                                            <h2 className="mint__numbers">10,000</h2>
                                            <h4 className="mint__name text-uppercase">NFTs</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-8 mt-[5rem]">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center md:flex-row-reverse">
                    <div className="w-full md:w-1/2">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal"> 
                        <span className="color--gradient-y d-block">4. Artifacts of</span> The Future</h2>
                        <div className="flex gap-2 mt-[2rem]">
                            <Image src={artifacts1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-[3rem]">
                            <div className="text-center w-full md:w-fit default-btn !leading-normal">
                                <Link href={`${HOST}/collection/binance-testnet/0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923`} passHref>
                                    <a className="">Buy Now</a>
                                </Link>
                            </div>
                            <div 
                                className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                                onClick={() => setFutureDrop(true)}>
                                View Airdrops
                            </div>
                        </div>
                        <Transition appear show={futureDrop} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setFutureDrop(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full h-[564px] max-w-4xl transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">ARTIFACTS OF THE FUTURE</span>
                                        </Dialog.Title>
                                        <div className="flex gap-2 justify-center my-5">
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 1 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(1)}>Phase 1</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 2 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(2)}>Phase 2</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 3 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(3)}>Phase 3</div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:bg-sky-300 cursor-pointer text-sm ${phase == 4 ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
                                                onClick={() => setPhase(4)}>Phase 4</div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-96 text-sm rounded-md bg-neutral-200 p-2"
                                                type="text"/>
                                            <div className="flex gap-2 ml-2">
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-lime-200 hover:bg-lime-300 text-lime-700 cursor-pointer"
                                                    onClick={() => handleSearchFuture()}> 
                                                    Search
                                                </div>
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-neutral-200 hover:bg-neutral-300 text-neutral-700 cursor-pointer"
                                                    onClick={() => handleClearFuture()}> 
                                                    Clear
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 max-h-[282px] md:max-h-[400px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tr className="">
                                                    <td className="text-sm font-bold p-2">Tx Hash</td>
                                                    <td className="text-sm font-bold p-2">User</td>
                                                    <td className="text-sm font-bold p-2">Time</td>
                                                    <td className="text-sm font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedFutureAir?.length) || !Boolean(futureAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ): (
                                                    <>
                                                        {selectedFutureAir.filter(drops => drops.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank">
                                                                        {drop.transactionHash.slice(0,3)}...{drop.transactionHash.slice(-3)}
                                                                        <MdOutlineOpenInNew />
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,3)}...{drop.walletAddress.slice(-3)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        {chainIcon[drop.chainId.toString()]}
                                                                        {drop.amount}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tr className="">
                                                    <td className="text-base font-bold p-2">Tx Hash</td>
                                                    <td className="text-base font-bold p-2">Receiver</td>
                                                    <td className="text-base font-bold p-2">Time</td>
                                                    <td className="text-base font-bold p-2">Token</td>
                                                </tr>
                                                {!Boolean(selectedFutureAir?.length) || !Boolean(futureAir?.length) ? (
                                                    <tr>
                                                        <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        {selectedFutureAir.filter(filteredDrop => filteredDrop.phase == phase).map((drop, index) => (
                                                            <tr key={index}>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank" className="flex items-center gap-1">
                                                                        <MdOutlineOpenInNew />
                                                                        {drop.transactionHash.slice(0,10)}...{drop.transactionHash.slice(-10)}
                                                                    </a>
                                                                </td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,10)}...{drop.walletAddress.slice(-10)}</td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                    <div className="flex items-center">
                                                                        <div className="rounded-md p-1 bg-neutral-200 px-2 flex justify-center items-center">
                                                                            {chainIcon[drop.chainId.toString()]}
                                                                            {drop.amount}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </table>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                            type="button"
                                            className="absolute top-3 right-3 justify-center rounded-md border border-transparent bg-red-600 px-1 py-1 text-sm font-medium text-neutral-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => setFutureDrop(false)}
                                            >
                                            <CgClose fontSize={20}/>
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                            </Dialog>
                        </Transition>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Project Size</h6>
                                        <h2 className="mint__numbers">20,000</h2>
                                        <h4 className="mint__name text-uppercase text-[#abff87]">NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Price</h6>
                                        <h2 className="mint__numbers">$350<span className="text-xs"> (worth of)</span></h2>
                                        <h4 className="mint__name text-uppercase">BNB</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Date</h6>
                                        <h2 className="mint__numbers">30th*</h2>
                                        <h4 className="mint__name text-uppercase">June</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Remaining</h6>
                                        <h2 className="mint__numbers">20,000</h2>
                                        <h4 className="mint__name text-uppercase">NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                    
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        {/* <div className="monkey-icon">
            <img src="http://bored.labartisan.net/assets/images/mint/monkey.png" alt="Monkey Icon"/>
        </div> */}
    </section>
  )
}

export default Buy