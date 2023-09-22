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
    const sdk = new ThirdwebSDK("ethereum", { clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY});
    const [remainingCrypto, setRemainingCrypto] = useState(0);
    const [remainingNeon, setRemainingNeon] = useState(0);
    const [remainingCelestial, setRemainingCelestial] = useState(0);
    const [remainingArtifacts, setRemainingArtifacts] = useState(0);

    const cryptoContract = "0x05e9d0Fa11eFF24F3c2fB0AcD381B6866CeF2a1C";
    const neonContract = "0x50Fb365F7B1c5CfaF3a0a9341029ABD0ce8e4f80";
    const celestialContract = "0x023803f52a5DD566AC1E6a3B06bCE8CD0d27a8a7";
    const futureContract = "0xa98d96E636123dFB35AB037d1E5a7B76a6e7e95B";

    const style = {
        collectionH2: 'text--3d-mk text-[3rem] md:text-[4.25rem] leading-normal text-center',
        collectionname : 'mushroom-kingdom-gradient font-hennypenny',
        description: 'text-center mt-3 text-2xl md:text-3xl',
        statsTitle: 'text-xs md:text-lg mushroom-kingdom-gradient',
        statsNumber: 'text-lg md:text-4xl mushroom-kingdom-gradient',
        statsFooter: 'text-sm md:text-xl text-uppercase mushroom-kingdom-gradient',
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
        className=" bg-cover font-oregano text-3xl py-[70px] pt-0 bg-[#23162c]">
        <div className="container mx-auto px-8  pb-[4rem] shadow-2xl rounded-xl">
            <div className="mint__wrapper">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <a name="nomin">
                            <h2 className={style.collectionH2}> 
                            <span className={style.collectionname}>Nomin</span></h2>
                        </a>
                        <p className={style.description}>Hardworking Nomins of Mushroom Kingdom work very hard to earn their livelihood. They are non-aggressive and can hardly defend themselves. There are only a few of them who can fight to protect their people from the likes of evil Grutzis. Fighter Nomins generally carry a white flag. During the fight, they are generally protected by Hidois. They are very loyal and obedient to their Kaioji.</p>
                        <div className="flex gap-2 mt-[2rem] mb-2 justify-center">
                            <Image src={creature1} alt="Nomin" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature2} alt="Nomin" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature3} alt="Nomin" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={creature4} alt="Nomin" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className={style.description}>NFTs from this collection will let you earn from upto <u>Uni Level 2</u> from your referrals network.</p>
                        <p className={style.description}>You can earn 10% from your direct referrals and 8% from your referrals' referral.</p>
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
                                            All Airdrops from <span className="font-bold">NOMIN Collection</span>
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
                    <div className="w-full alfaslab">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Project Size</h6>
                                            <h2 className={style.statsNumber}>5000</h2>
                                            <h4 className={style.statsFooter}>NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Mint Price</h6>
                                            <h2 className={style.statsNumber}>0.041 ETH</h2>
                                            <h4 className={style.statsFooter}> ${(0.041 * Number(coins?.ethprice)).toFixed(2)}</h4>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Minting starts</h6>
                                            <h2 className={style.statsNumber}>1st*</h2>
                                            <h4 className={style.statsFooter}>August</h4>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Remaining</h6>
                                            <h2 className={style.statsNumber}>{remainingCrypto.toString()}</h2>
                                            <h4 className={style.statsFooter}>NFTs</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/ethereum/nomin`} passHref>
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
                        <a name="grutzi">
                            <h2 className={style.collectionH2}> 
                            <span className={style.collectionname}>Grutzi</span></h2>
                        </a>
                        <p className={style.description}>The primary objective of Grutzi is to amass wealth and power through robbery and theft. They prey upon defenseless and unsuspecting Nomins, ambushing them with deadly precision. They possess an uncanny ability to strike fear into their victims, utilizing their malevolent gaze and weaponry to paralyze, weaken, and even kill the bravest and strongest of Nomins. Grutzi flag bearers are cunning thieves, agile assassins, and treacherous spies, while others serve as their minions.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={neon1} alt="Grutzi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon2} alt="Grutzi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon3} alt="Grutzi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={neon4} alt="Grutzi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className={style.description}>NFTs from this collection will let you earn from upto <u>Uni Level 3</u> from your referrals network.</p>
                        <p className={style.description}>You can earn 10% from your direct referrals, 8% from your referrals' referral and 6% from the next subsequent referral level.</p>
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
                                            All Airdrops from <span className="font-bold">GRUTZI Collection</span>
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
                    <div className="w-full alfaslab">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Project Size</h6>
                                        <h2 className={style.statsNumber}>5000</h2>
                                        <h4 className={style.statsFooter}>NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Mint Price</h6>
                                        <h2 className={style.statsNumber}>0.082 ETH</h2>
                                        <h4 className={style.statsFooter}> ${(0.082* Number(coins?.ethprice)).toFixed(2)}</h4>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Minting starts</h6>
                                        <h2 className={style.statsNumber}>1st*</h2>
                                        <h4 className={style.statsFooter}>August</h4>
                                    </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Remaining</h6>
                                        <h2 className={style.statsNumber}>{remainingNeon.toString()}</h2>
                                        <h4 className={style.statsFooter}>NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/ethereum/grutzi`} passHref>
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
                        <h2 className={style.collectionH2}> 
                        <span className={style.collectionname}>Hidoi</span></h2>
                        <p className={style.description}>The Hidois come from diverse backgrounds, united by a common purpose: to bring an end to the oppressive rule of the Grutzis and restore peace and prosperity to the Mushroom Kingdom. Some are born into noble families, inheriting a legacy of knighthood, while others rise from humble origins, proving their worth through acts of bravery and selflessness. Their loyalty lies with Kaioji - The King, and their only objective is to protect Nomins and the Mushroom Kingdom from Grutzis.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={celestial1} alt="Hidoi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial2} alt="Hidoi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial3} alt="Hidoi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={celestial4} alt="Hidoi" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className={style.description}>NFTs from this collection will let you earn from upto <u>Uni Level 4</u> from your referrals network.</p>
                        <p className={style.description}>You can earn 10% from your direct referrals, 8% from your referrals' referral, then 6% and 5% from the subsequent referral levels.</p>
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
                                            All Airdrops from <span className="font-bold">HIDOI Collection</span>
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
                    <div className="w-full alfaslab">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Project Size</h6>
                                            <h2 className={style.statsNumber}>10000</h2>
                                            <h4 className={style.statsFooter}>NFT's</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Mint Price</h6>
                                            <h2 className={style.statsNumber}>0.14 ETH</h2>
                                            <h4 className={style.statsFooter}> ${(0.14 * Number(coins?.ethprice)).toFixed(2)}</h4>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Minting starts</h6>
                                            <h2 className={style.statsNumber}>1st*</h2>
                                            <h4 className={style.statsFooter}>August</h4>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                        <div className="text-center">
                                            <h6 className={style.statsTitle}>Remaining</h6>
                                            <h2 className={style.statsNumber}>{remainingCelestial.toString()}</h2>
                                            <h4 className={style.statsFooter}>NFTs</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/ethereum/hidoi`} passHref>
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
                        <h2 className={style.collectionH2}> 
                            <span className={style.collectionname}>Kaioji</span>
                        </h2>
                        <p className={style.description}>In the heart of the Mushroom Kingdom, there stands a resolute and compassionate king, determined to protect his realm from the malevolent Grutzis. This regal figure exudes wisdom, strength, and a deep love for his Nomins and Hidois, embodying the true essence of a noble ruler. Kaioji is not only a skilled military strategist but also a wise statesman. He understands that victory does not lie solely in wielding a sword but in winning the hearts and minds of his subjects. He listens to their grievances, empathizes with their struggles, and takes every measure to alleviate their suffering by keeping Grutzis at bay.</p>
                        <div className="flex gap-2 mt-[2rem] justify-center">
                            <Image src={artifacts1} alt="Kaioji" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts2} alt="Kaioji" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts3} alt="Kaioji" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                            <Image src={artifacts4} alt="Kaioji" height="100px" width="100px" objectFit='cover' className="rounded-md"/>
                        </div>
                        <p className={style.description}>NFTs from this collection will let you earn from upto <u>Uni Level 5</u> from your referrals network.</p>
                        <p className={style.description}>You can earn 10% from your direct referrals, 8% from your referrals' referral, then 6%, 5% and another 5% from the subsequent referral levels.</p>
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
                                            All Airdrops from <span className="font-bold">KAIOJI Collection</span>
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
                    <div className="w-full alfaslab">
                        <div className=" mint__content aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000">
                            <div className="grid grid-cols-3 md:grid-cols-3">
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Project Size</h6>
                                        <h2 className={style.statsNumber}>20000</h2>
                                        <h4 className={style.statsFooter}>NFT's</h4>
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Mint Price</h6>
                                        <h2 className={style.statsNumber}>0.192 ETH</h2>
                                        <h4 className={style.statsFooter}> ${(0.192 * Number(coins?.ethprice)).toFixed(2)}</h4>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Minting starts</h6>
                                        <h2 className={style.statsNumber}>1st*</h2>
                                        <h4 className={style.statsFooter}>August</h4>
                                    </div>
                                    </div>
                                </div> */}
                                <div className="mt-[3rem]">
                                    <div className="mint__item">
                                    <div className="text-center">
                                        <h6 className={style.statsTitle}>Remaining</h6>
                                        <h2 className={style.statsNumber}>{remainingArtifacts.toString()}</h2>
                                        <h4 className={style.statsFooter}>NFTs</h4>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mt-[3rem] justify-center">
                        <div className="text-center w-full md:w-fit default-btn !leading-normal">
                            <Link href={`${HOST}/collection/ethereum/kaioji`} passHref>
                                <a className="">Mint Now</a>
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