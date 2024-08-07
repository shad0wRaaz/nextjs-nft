import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import Moment from 'react-moment'
import { CgClose } from 'react-icons/cg'
import { useQuery } from 'react-query'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { MdOutlineOpenInNew } from 'react-icons/md'
import { Dialog, Transition } from '@headlessui/react'
import bannerbg from '../assets/images/banner-bg.webp'
import creature1  from '../assets/cryptocreatures/1.png'
import creature2  from '../assets/cryptocreatures/2.png'
import creature3  from '../assets/cryptocreatures/3.png'
import creature4  from '../assets/cryptocreatures/4.png'
import neon1  from '../assets/neondreams/1.png'
import neon2  from '../assets/neondreams/2.png'
import neon3  from '../assets/neondreams/3.png'
import neon4  from '../assets/neondreams/4.png'
import celestial1  from '../assets/celestialbeings/1.png'
import celestial2  from '../assets/celestialbeings/2.png'
import celestial3  from '../assets/celestialbeings/3.png'
import celestial4  from '../assets/celestialbeings/4.png'
import celestial5  from '../assets/celestialbeings/5.png'
import celestial6  from '../assets/celestialbeings/6.png'
import celestial7  from '../assets/celestialbeings/7.png'
import celestial8  from '../assets/celestialbeings/8.png'
import artifacts1  from '../assets/artifacts/1.png'
import artifacts2  from '../assets/artifacts/2.png'
import artifacts3  from '../assets/artifacts/3.png'
import artifacts4  from '../assets/artifacts/4.png'
import React, { Fragment, useEffect, useState } from 'react'
import { getAirDrops } from '../../../fetchers/SanityFetchers'
import { useSettingsContext } from '../../../contexts/SettingsContext'
import { TbSquareRoundedNumber2, TbSquareRoundedNumber3, TbSquareRoundedNumber4, TbSquareRoundedNumber5 } from 'react-icons/tb'

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
    const sdk = new ThirdwebSDK("binance", { clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY});
    const [remainingCrypto, setRemainingCrypto] = useState(5000);
    const [remainingNeon, setRemainingNeon] = useState(5000);
    const [remainingCelestial, setRemainingCelestial] = useState(10000);
    const [remainingArtifacts, setRemainingArtifacts] = useState(20000);

    const cryptoContract = "0x9809AbFc4319271259a340775eC03E9746B76068";
    const neonContract = "0x2945db324Ec216a5D5cEcE8B4D76f042553a213f";
    const celestialContract = "0x54265672B480fF8893389F2c68caeF29C95c7BE2";
    const futureContract = "0x9BDa42900556fCce5927C1905084C4b3CffB23b0";

    const style = {
        collectionH2: 'text--3d-mk text-[3rem] md:text-[4.25rem] leading-normal text-center',
        collectionname : 'mushroom-kingdom-gradient font-hennypenny',
        description: 'text-center mt-3 text-2xl md:text-3xl',
        statsTitle: 'text-xs md:text-lg rewarding-renditions-gradient',
        statsNumber: 'text-xl md:text-4xl rewarding-renditions-gradient',
        statsFooter: 'text-sm md:text-xl rewarding-renditions-gradient',
    }

    useEffect(() => {
        ;(async()=>{
            const contractCrypto = await sdk.getContract(cryptoContract);
            const contractNeon = await sdk.getContract(neonContract);
            const contractCelestial = await sdk.getContract(celestialContract);
            const contractArtifacts = await sdk.getContract(futureContract);

            setRemainingCrypto(await contractCrypto.erc721.totalUnclaimedSupply());
            setRemainingNeon(await contractNeon.erc721.totalUnclaimedSupply());
            setRemainingCelestial(await contractCelestial.erc721.totalUnclaimedSupply());
            setRemainingArtifacts(await contractArtifacts.erc721.totalUnclaimedSupply());

        })()
    }, []);
    
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
        className="mints bg-cover alfaslab py-[70px] pt-0 bg-[#23162c]">
        <div className="container mx-auto px-8  pb-[4rem] shadow-2xl rounded-xl">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal text-center"> 
                        <span className="color--gradient-y d-block">Crypto Creatures</span></h2>
                        <p className="text-center mt-3">A collection of unique digital creatures that live on the Binance Blockchain.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={creature1} alt="Crypto Creatures" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature2} alt="Crypto Creatures" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature3} alt="Crypto Creatures" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature4} alt="Crypto Creatures" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">NFTs from this collection will let you earn from upto <u>Uni Level 2</u> from your referrals network.</p>
                        <p className="text-center text-lg">Earn 10% from your direct referrals and 8% from your referrals' referral.</p>
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
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle + " mint__sub-title"}>Project Size</h6>
                                            <h2 className={style.statsNumber + " mint__numbers"}>5000</h2>
                                            <h4 className={style.statsFooter + " mint__name"}>NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle + " mint__sub-title"}>Mint Price</h6>
                                            <h2 className={style.statsNumber + " mint__numbers"}>0.32 BNB</h2>
                                            <h4 className={style.statsFooter + " mint__name"}> ${(0.32 * Number(coins?.bnbprice)).toFixed(2)}</h4>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className="mint__sub-title">Minting starts</h6>
                                            <h2 className="mint__numbers">30th*</h2>
                                            <h4 className="mint__name text-uppercase">June</h4>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle + " mint__sub-title"}>Remaining</h6>
                                            <h2 className={style.statsNumber + " mint__numbers"}>{remainingCrypto.toString()}</h2>
                                            <h4 className={style.statsFooter + " mint__name"}>NFTs</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/crypto_creatures`} passHref>
                                <a className="">Mint Now</a>
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
                        <span className="color--gradient-y d-block">Neon Dreams</span></h2>
                        <p className="text-center mt-3">A series of bright and colourful and NFTs that capture the surreal nature of our dreams.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={neon1} alt="Neon Dreams" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon2} alt="Neon Dreams" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon3} alt="Neon Dreams" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon4} alt="Neon Dreams" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">NFTs from this collection will let you earn from upto <u>Uni Level 3</u> from your referrals network.</p>
                        <p className="text-center text-lg">Earn 10% from your direct referrals, 8% from your referrals' referral and 6% from the next subsequent referral level.</p>
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
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle + " mint__sub-title"}>Project Size</h6>
                                        <h2 className={style.statsNumber + " mint__numbers"}>5000</h2>
                                        <h4 className={style.statsFooter + " mint__name"}>NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle + " mint__sub-title"}>Mint Price</h6>
                                        <h2 className={style.statsNumber + " mint__numbers"}>0.64 BNB</h2>
                                        <h4 className={style.statsFooter + " mint__name"}> ${(0.64 * Number(coins?.bnbprice)).toFixed(2)}</h4>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className="mint__sub-title">Minting starts</h6>
                                        <h2 className="mint__numbers">30th*</h2>
                                        <h4 className="mint__name text-uppercase">June</h4>
                                    </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle + " mint__sub-title"}>Remaining</h6>
                                        <h2 className={style.statsNumber + " mint__numbers"}>{remainingNeon.toString()}</h2>
                                        <h4 className={style.statsFooter + " mint__name"}>NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/neon_dreams`} passHref>
                                <a className="">Mint Now</a>
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
                        <span className="color--gradient-y d-block">Celestial Beings</span></h2>
                        <p className="text-center mt-3">A series of NFTs that feature mythical creatures and dieties from different cultures.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={celestial1} alt="Celestial Beings" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial2} alt="Celestial Beings" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial3} alt="Celestial Beings" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial4} alt="Celestial Beings" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">NFTs from this collection will let you earn from upto <u>Uni Level 4</u> from your referrals network.</p>
                        <p className="text-center text-lg">Earn 10% from your direct referrals, 8% from your referrals' referral, then 6% and 5% from the subsequent referral levels.</p>
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
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle + " mint__sub-title"}>Project Size</h6>
                                            <h2 className={style.statsNumber + " mint__numbers"}>10000</h2>
                                            <h4 className={style.statsFooter + " mint__name"}>NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle + " mint__sub-title"}>Mint Price</h6>
                                            <h2 className={style.statsNumber + " mint__numbers"}>1.04 BNB</h2>
                                            <h4 className={style.statsFooter + " mint__name"}> ${(1.04 * Number(coins?.bnbprice)).toFixed(2)}</h4>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className="mint__sub-title">Minting starts</h6>
                                            <h2 className="mint__numbers">30th*</h2>
                                            <h4 className="mint__name text-uppercase">June</h4>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle + " mint__sub-title"}>Remaining</h6>
                                            <h2 className={style.statsNumber + " mint__numbers"}>{remainingCelestial.toString()}</h2>
                                            <h4 className={style.statsFooter + " mint__name"}>NFTs</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/celestial_beings`} passHref>
                                <a className="">Mint Now</a>
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
                        <span className="color--gradient-y d-block">Artifacts of The Future</span></h2>
                        <p className="text-center mt-3">A collection of NFTs that showcase futuristic technology and inventions.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={artifacts1} alt="Artifacts of the Future" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts2} alt="Artifacts of the Future" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts3} alt="Artifacts of the Future" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts4} alt="Artifacts of the Future" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className="text-center text-lg mt-4 mb-2">NFTs from this collection will let you earn from upto <u>Uni Level 5</u> from your referrals network.</p>
                        <p className="text-center text-lg">Earn 10% from your direct referrals, 8% from your referrals' referral, then 6%, 5% and another 5% from the subsequent referral levels.</p>
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
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle + " mint__sub-title"}>Project Size</h6>
                                        <h2 className={style.statsNumber + " mint__numbers"}>20000</h2>
                                        <h4 className={style.statsFooter + " mint__name"}>NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle + " mint__sub-title"}>Mint Price</h6>
                                        <h2 className={style.statsNumber + " mint__numbers"}>1.49 BNB</h2>
                                        <h4 className={style.statsFooter + " mint__name"}> ${(1.49 * Number(coins?.bnbprice)).toFixed(5)}</h4>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className="mint__sub-title">Minting starts</h6>
                                        <h2 className="mint__numbers">30th*</h2>
                                        <h4 className="mint__name text-uppercase">June</h4>
                                    </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle + " mint__sub-title"}>Remaining</h6>
                                        <h2 className={style.statsNumber + " mint__numbers"}>{remainingArtifacts.toString()}</h2>
                                        <h4 className={style.statsFooter + " mint__name"}>NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/binance/artifacts_of_the_future`} passHref>
                                <a className="">Mint Now</a>
                            </Link>
                        </div>
                        <div 
                            className="text-center w-full md:w-fit default-btn !leading-normal cursor-pointer"
                            onClick={() => setFutureDrop(true)}>
                            View Airdrops
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Buy