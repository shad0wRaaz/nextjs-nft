import Link from 'next/link'
import Image from 'next/image'
import Moment from 'react-moment'
import { CgClose } from 'react-icons/cg'
import { useQuery } from 'react-query'
import { MdOutlineOpenInNew } from 'react-icons/md'
import { Dialog, Transition } from '@headlessui/react'
import bannerbg from '../assets/images/banner-bg.webp'
import React, { Fragment, useEffect, useState } from 'react'
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
import { getAirDrops } from '../../../fetchers/SanityFetchers'
import { useSettingsContext } from '../../../contexts/SettingsContext'
import { TbSquareRoundedNumber2, TbSquareRoundedNumber3, TbSquareRoundedNumber4, TbSquareRoundedNumber5 } from 'react-icons/tb'
import axios from 'axios'

const Buy = ({ setShowMenu }) => {
    const HOST = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io' : 'http://localhost:3000'
    const SERVER = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io:8080' : 'http://localhost:8080'
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
    
    const cryptoContract = "0x9809AbFc4319271259a340775eC03E9746B76068";
    const neonContract = "0x2945db324Ec216a5D5cEcE8B4D76f042553a213f";
    const celestialContract = "0x54265672B480fF8893389F2c68caeF29C95c7BE2";
    const futureContract = "0x9BDa42900556fCce5927C1905084C4b3CffB23b0";

    const {data, status} = useQuery(
        ["airdrops"],
        getAirDrops(),
        {
            onSuccess: (res) => {
                const wholeArray = []
                const updatedData = res.map(drops => {
                    const drop = JSON.parse(drops.airdrops);
                    // console.log(drop)
                    drop.map(d => wholeArray.push(d));
                });
                

                //segregate the whole array into correct collections
                const cc = wholeArray.filter(drop => drop.contractAddress == cryptoContract);
                setCryptoAir(cc);
                setSelectedCryptoAir(cc);
                const nd = wholeArray.filter(drop => drop.contractAddress == neonContract);
                setNeonAir(nd);
                setSelectedNeonAir(nd);
                const cb = wholeArray.filter(drop => drop.contractAddress == celestialContract);
                setCelestialAir(cb);
                setSelectedCelestialAir(cb);
                const af = wholeArray.filter(drop => drop.contractAddress == futureContract);
                setFutureAir(af);
                setSelectedFutureAir(af);
            }
        }
    );
    const getCoinPrice = async() => {
        const {data} = await axios.get(`${SERVER}/api/getcoinsprice`);
        return data;
    }

    const {data: coins, status: coinpricestatus} = useQuery(
        ['coinprice'],
        () => getCoinPrice(),{
            onSuccess: (res) =>{ },
            onerror:(err) => {}
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
        className="mint bg-cover alfaslab py-[70px] pt-0">
        <div className="container mx-auto px-8  pb-[4rem] shadow-2xl rounded-xl">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal text-center"> 
                        <span className="color--gradient-ad d-block">1. Galactic Gems</span></h2>
                        <p className="text-center mt-3">Step into a cosmic realm of breathtaking beauty with the "GalacticGems" NFT collection. Prepare to be dazzled by a celestial tapestry of rare and exquisite gemstones that originate from distant galaxies and otherworldly dimensions.</p>
                        <p className="text-center mt-3">The "GalacticGems" collection offers a mesmerizing array of digital artworks that depict stunning gemstone formations, each infused with cosmic energy and ethereal luminescence. These radiant gems possess an otherworldly allure, reflecting the mysteries and wonders of the universe.</p>
                        <p className="text-center mt-3">Immerse yourself in a celestial kaleidoscope of colors, as the "GalacticGems" collection showcases a wide spectrum of gemstones, ranging from fiery rubies and shimmering sapphires to luminescent opals and mystical diamonds. Each gemstone is intricately crafted, capturing the mesmerizing play of light and the unique characteristics that make it truly one-of-a-kind.</p>
                        <p className="text-center mt-3">Owning an NFT from the "GalacticGems" collection grants you an exclusive invitation to the cosmic treasure trove. As a collector, you become the guardian of these celestial jewels, their digital presence forever etched in the blockchain. Share in the delight of owning rare and valuable gems that transcend the physical realm.</p>
                        <p className="text-center mt-3">Indulge your senses and embark on a journey through the cosmos with "GalacticGems." Discover the timeless beauty and unearthly radiance of gemstones that capture the essence of distant galaxies, bringing a touch of the heavens to your digital collection.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={creature1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">Unilevel Access: <TbSquareRoundedNumber2 fontSize={25} className="inline"/></p>
                        <p className="text-center text-lg">Earn from 10% Direct + 8% Indirect</p>
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
                                            className="text-lg font-medium leading-6 pt-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">Galactic Gems</span>
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
                                        <div className="flex justify-center items-center flex-wrap gap-3">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 text-sm rounded-md bg-neutral-200 p-2 w-full md:w-fit flex-grow"
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
                                        <div className="mt-2 max-h-[282px] md:max-h-[350px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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

                                                </tbody>
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                </tbody>
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
                    <div className="w-full">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2 md:grid-cols-4">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Project Size</h6>
                                            <h2 className="mint__numbers">5,000</h2>
                                            <h4 className="mint__name text-uppercase">NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Buy Price</h6>
                                            <h2 className="mint__numbers">$50<span className="text-xs"> (worth of)</span></h2>
                                            <h4 className="mint__name text-uppercase">{(50 / Number(coins?.maticprice)).toFixed(5)} MATIC</h4>
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
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/0x9809AbFc4319271259a340775eC03E9746B76068`} passHref>
                                <a className="">Buy Now</a>
                            </Link>
                        </div>
                        <div
                            className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                            onClick={() => setCryptoDrop(true)}>
                            View Airdrops
                        </div>
                    </div>
                    
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-8 mt-[4rem]  pb-[4rem] shadow-2xl rounded-xl">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal text-center"> 
                        <span className="color--gradient-ad d-block">2. Cyber Canvas</span></h2>
                        <p className="text-center mt-3">Welcome to the cutting-edge world of "Cyber Canvas," where art and technology converge to redefine the boundaries of creativity. This groundbreaking NFT collection takes you on a journey through a virtual gallery of mesmerizing digital artworks that push the limits of imagination.</p>
                        <p className="text-center mt-3">"Cyber Canvas" brings together visionary artists and digital pioneers who have harnessed the power of blockchain and augmented reality to transform traditional art forms into captivating digital experiences. Each NFT within the collection is a testament to the fusion of artistic expression and technological innovation.</p>
                        <p className="text-center mt-3">Step into a realm where brushstrokes transcend physical limitations, and pixels come alive with vibrant colors and dynamic movements. From abstract masterpieces to hyper-realistic renderings, the "Cyber Canvas" collection showcases a diverse range of artistic styles and techniques, catering to art enthusiasts and collectors with discerning tastes.</p>
                        <p className="text-center mt-3">By owning an NFT from the "Cyber Canvas" collection, you become the custodian of a unique digital artwork, forever etching your name in the annals of digital art history. Immerse yourself in the intricate details, uncover hidden layers, and witness the evolution of art in the digital age.</p>
                        <p className="text-center mt-3">Embrace the future of art with "Cyber Canvas" and unlock a world where the canvas knows no bounds, and creativity knows no limits.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={neon1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">Unilevel Access: <TbSquareRoundedNumber3 fontSize={25} className="inline"/></p>
                        <p className="text-center text-lg">Earn from 10% Direct + (8% + 6%) Indirect</p>
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
                                            className="text-lg font-medium pt-6 leading-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">Cyber Canvas</span>
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
                                        <div className="flex justify-center items-center flex-wrap gap-3">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-full md:w-fit flex-grow text-sm rounded-md bg-neutral-200 p-2"
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
                                        <div className="mt-2 max-h-[282px] md:max-h-[350px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tbody>
                                                    <tr className="">
                                                    <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                                            {drop.amount.toFixed(5)}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                                                {drop.amount.toFixed(5)}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    )}
                                                </tbody>
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
                    <div className="w-full">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2 md:grid-cols-4">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Project Size</h6>
                                        <h2 className="mint__numbers">5,000</h2>
                                        <h4 className="mint__name text-uppercase">NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Price</h6>
                                        <h2 className="mint__numbers">$125<span className="text-xs"> (worth of)</span></h2>
                                        <h4 className="mint__name text-uppercase">{(125 / Number(coins?.maticprice)).toFixed(5)} MATIC</h4>
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
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/0x2945db324Ec216a5D5cEcE8B4D76f042553a213f`} passHref>
                                <a className="">Buy Now</a>
                            </Link>
                        </div>
                        <div 
                            className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                            onClick={() => setNeonDrop(true)}>
                            <a className="">View Airdrops</a>
                        </div>
                    </div>
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-8 mt-[4rem]  pb-[4rem] shadow-2xl rounded-xl">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal text-center"> 
                        <span className="color--gradient-ad d-block">3. Robo Revolution</span> </h2>
                        <p className="text-center mt-3">Step into a futuristic world where robots rule the realm. The "RoboRevolution" NFT collection showcases a stunning assortment of digital artworks that depict an uprising of sentient machines, each with their own unique personality and purpose. From sleek and agile androids to towering mechanical giants, these NFTs offer a glimpse into a world where technology and artificial intelligence intertwine.</p>
                        <p className="text-center mt-3">Immerse yourself in the intricately detailed designs and mesmerizing animations of these robotic marvels. Each artwork tells a story, capturing the essence of a robotic character's journey, their triumphs, and struggles in a world on the brink of transformation. The collection features a diverse range of styles, from cyberpunk-inspired aesthetics to sleek and minimalist designs, appealing to art enthusiasts and tech aficionados alike.</p>
                        <p className="text-center mt-3">Join the Robo Revolution and secure your place in this digital uprising. Each NFT in this collection is a unique and limited edition, ensuring its rarity and value within the growing world of digital art and blockchain technology.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={celestial1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">Unilevel Access: <TbSquareRoundedNumber4 fontSize={25} className="inline"/></p>
                        <p className="text-center text-lg">Earn from 10% Direct + (8% + 6% + 5%) Indirect</p>
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
                                            className="text-lg font-medium leading-6 pt-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">Robo Revolution</span>
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
                                        <div className="flex justify-center items-center flex-wrap gap-3">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-full md:w-fit flex-grow text-sm rounded-md bg-neutral-200 p-2"
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
                                        <div className="mt-2 max-h-[282px] md:max-h-[350px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                                            {drop.amount.toFixed(5)}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                                                {drop.amount.toFixed(5)}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    )}
                                                </tbody>
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
                    <div className="w-full">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2 md:grid-cols-4">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Project Size</h6>
                                            <h2 className="mint__numbers">10,000</h2>
                                            <h4 className="mint__name text-uppercase">NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="mint__inner">
                                            <h6 className="mint__sub-title">Buy Price</h6>
                                            <h2 className="mint__numbers">$200<span className="text-xs"> (worth of)</span></h2>
                                            <h4 className="mint__name text-uppercase">{(200 / Number(coins?.maticprice)).toFixed(5)} MATIC</h4>
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
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/0x54265672B480fF8893389F2c68caeF29C95c7BE2`} passHref>
                                <a className="">Buy Now</a>
                            </Link>
                        </div>
                        <div 
                            className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                            onClick={() => setCelestialDrop(true)}>
                                View Airdrops
                        </div>
                    </div>
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-8 mt-[4rem]  pb-[4rem] shadow-2xl rounded-xl">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal text-center"> 
                        <span className="color--gradient-ad d-block">4. Quantum Quest</span></h2>
                        <p className="text-center mt-3">Embark on an extraordinary expedition through the realms of the unknown with the "Quantum Quest" NFT collection. Prepare to be immersed in a captivating fusion of quantum physics, mysticism, and futuristic landscapes that defy the boundaries of reality.</p>
                        <p className="text-center mt-3">The "Quantum Quest" collection invites you to explore a multiverse of infinite possibilities, where time bends, dimensions collide, and the fabric of the universe unravels. Each digital artwork within this collection serves as a portal to alternate realities, where science and imagination intertwine to create a mind-bending visual experience.</p>
                        <p className="text-center mt-3">Journey through mesmerizing landscapes, adorned with surreal architecture, pulsating energy fields, and cosmic phenomena. Discover intricate details and hidden symbolism that unveil the secrets of quantum mechanics and the mysteries of existence. From intricate fractal patterns to intricate quantum entanglements, each piece in the "Quantum Quest" collection is a testament to the power of human imagination and scientific wonder.</p>
                        <p className="text-center mt-3">As a proud owner of an NFT from the "Quantum Quest" collection, you become a cosmic voyager, transcending the boundaries of space and time. With each acquisition, you acquire a unique artifact, capturing a glimpse of the unexplored territories of the multiverse.</p>
                        <p className="text-center mt-3">Prepare to push the boundaries of your perception and embark on an awe-inspiring "Quantum Quest" where the frontiers of knowledge and imagination merge in breathtaking harmony.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={artifacts1} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts2} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts3} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts4} alt="" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">Unilevel Access: <TbSquareRoundedNumber5 fontSize={25} className="inline"/></p>
                        <p className="text-center text-lg">Earn from 10% Direct + (8% + 6% + 5% + 5%) Indirect</p>
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
                                            className="text-lg font-medium leading-6 pt-6 text-gray-900 text-center"
                                        >
                                            All Airdrops from <span className="font-bold">Quamtum Quest</span>
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
                                        <div className="flex justify-center items-center flex-wrap gap-3">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 w-full md:w-fit flex-grow text-sm rounded-md bg-neutral-200 p-2"
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
                                        <div className="mt-2 max-h-[282px] md:max-h-[350px] overflow-y-scroll">
                                            <table className="table md:hidden w-max md:w-full text-xs">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-xs font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                </tbody>
                                            </table>
                                            <table className="hidden md:table text-sm w-max md:w-full">
                                                <tbody>
                                                    <tr className="">
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Tx Hash</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Receiver</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Time</th>
                                                        <th className="text-base font-bold p-2 sticky top-0 bg-neutral-300">Token</th>
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
                                                </tbody>
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
                    <div className="w-full">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-2 md:grid-cols-4">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Project Size</h6>
                                        <h2 className="mint__numbers">20,000</h2>
                                        <h4 className="mint__name text-uppercase">NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="mint__inner">
                                        <h6 className="mint__sub-title">Buy Price</h6>
                                        <h2 className="mint__numbers">$250<span className="text-xs"> (worth of)</span></h2>
                                        <h4 className="mint__name text-uppercase">{(250 / Number(coins?.maticprice)).toFixed(5)} MATIC</h4>
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
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/0x9BDa42900556fCce5927C1905084C4b3CffB23b0`} passHref>
                                <a className="">Buy Now</a>
                            </Link>
                        </div>
                        <div 
                            className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                            onClick={() => setFutureDrop(true)}>
                            View Airdrops
                        </div>
                    </div>
                   
                    
                    {/* <div className="w-full md:w-1/2">
                        <div className="mint__thumb aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000"> */}
                        {/* </div>
                    </div> */}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Buy