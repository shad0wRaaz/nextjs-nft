import Image from 'next/image';
import Moment from 'react-moment'
import { useQuery } from 'react-query';
import { CgClose } from 'react-icons/cg';
import { MdOutlineDownloading, MdOutlineOpenInNew } from 'react-icons/md';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { Dialog, Transition } from '@headlessui/react'
import { getAirDrops } from '../fetchers/SanityFetchers';
import nuvatokenlogo from '../public/assets/nuvatoken.png'
import React, { Fragment, useEffect, useState } from 'react'
import { useSettingsContext } from '../contexts/SettingsContext';
import neon1  from '../pages/rewarding-renditions/assets/neondreams/1.png'
import artifacts1  from '../pages/rewarding-renditions/assets/artifacts/1.png'
import creature1  from '../pages/rewarding-renditions/assets/cryptocreatures/1.png'
import celestial1  from '../pages/rewarding-renditions/assets/celestialbeings/1.png'
import { FaInfoCircle } from 'react-icons/fa';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import Loader from './Loader';

const Airdrop = ({visible, setShowAirdrop, selectedAirdropChain}) => {
    const [selectedCollection, setSelectedCollection] = useState(
        {name: 'Crypto Creatures', key: 'crypto', contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068', phaseDelimiter: 
            { 
                phase1 : 625, 
                phase2: 1250,
                phase3: 2250,
                phase4: 5000,
                phase5: 5000,
            },
    }
    );
    const [allAirdrops, setAllAirdrops] = useState();
    const [filteredAirdrops, setFilteredAirdrops] = useState();
    const [phase, setPhase] = useState(1);
    const sdk = new ThirdwebSDK(selectedAirdropChain);
    const { chainExplorer, chainIcon, blockchainIdFromName, currencyByChainName } = useSettingsContext();
    const [searchAddress, setSearchAddress] = useState('');
    const [unclaimed, setUnclaimed] = useState();
    const [claimLoading, setClaimLoading] = useState(false);
    const style = {
        collectionImage: 'rounded-full h-[30px] w-[30px] inline mr-2',
        selected : ' ring-2 bg-sky-300/30 outline-none ring-offset-0',
        checkMark : 'absolute top-4 right-2 text-sky-700',
        selectionCollection : 'relative border border-neutral-100/80 hover:shadow-md bg-neutral-100/50 p-3 rounded-xl text-sm text-left cursor-pointer transition ',
    }
    const collectionLibrary = {
        ethereum : [
            {
                name: 'Nomin', 
                key: 'nomin', 
                icon: creature1.src, 
                contractAddress: '0x05e9d0Fa11eFF24F3c2fB0AcD381B6866CeF2a1C', 
            }, 
            {
                name: 'Grutzi', 
                key: 'grutzi', 
                icon: neon1.src, 
                contractAddress: '0x50Fb365F7B1c5CfaF3a0a9341029ABD0ce8e4f80'
            }, 
            {
                name: 'Hidoi', 
                key: 'hidoi', 
                icon: celestial1.src, 
                contractAddress: '0x023803f52a5DD566AC1E6a3B06bCE8CD0d27a8a7'
            }, 
            {
                name: 'Kaioji', 
                key: 'kaioji', 
                icon: artifacts1.src, 
                contractAddress: '0xa98d96E636123dFB35AB037d1E5a7B76a6e7e95B'
            },
        ],
        binance : [
            {
                name: 'Crypto Creatures', 
                key: 'crypto', 
                icon: creature1.src, 
                contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068',
                phaseDelimiter: 
                    { 
                        phase1 : 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
            }, 
            {
                name: 'Neon Dreams', 
                key: 'neon', 
                icon: neon1.src, 
                contractAddress: '0x2945db324Ec216a5D5cEcE8B4D76f042553a213f',
                phaseDelimiter: 
                    { 
                        phase1 : 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
            }, 
            {
                name: 'Celestial Beings', 
                key: 'celestial', 
                icon: celestial1.src, 
                contractAddress: '0x54265672B480fF8893389F2c68caeF29C95c7BE2',
                phaseDelimiter: 
                    { 
                        phase1: 1250, 
                        phase2: 2500,
                        phase3: 5000,
                        phase4: 10000,
                        phase5: 10000,
                    },
            }, 
            {
                name: 'Artifacts of the Future', 
                key: 'artifacts', 
                icon: artifacts1.src, 
                contractAddress: '0x9BDa42900556fCce5927C1905084C4b3CffB23b0',
                phaseDelimiter: 
                    { 
                        phase1: 2500, 
                        phase2: 5000,
                        phase3: 10000,
                        phase4: 20000,
                        phase5: 20000,
                    },
            },
        ],
        polygon : [
            {name: 'polCrypto Creatures', key: 'polcrypto', icon: creature1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'polhNeon Dreams', key: 'polneon', icon: neon1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'polCelestial Beings', key: 'polcelestial', icon: celestial1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'polArtifacts of the Future', key: 'polartifacts', icon: artifacts1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'},
        ],
        avalanche : [
            {name: 'avaCrypto Creatures', key: 'avacrypto', icon: creature1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'avaNeon Dreams', key: 'avaneon', icon: neon1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'avaCelestial Beings', key: 'avacelestial', icon: celestial1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'avaArtifacts of the Future', key: 'avaartifacts', icon: artifacts1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'},
        ],
        arbitrum : [
            {name: 'arbCrypto Creatures', key: 'arbcrypto', icon: creature1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'arbNeon Dreams', key: 'arbneon', icon: neon1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'arbCelestial Beings', key: 'arbcelestial', icon: celestial1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'}, {name: 'arbrtifacts of the Future', key: 'arbartifacts', icon: artifacts1.src, contractAddress: '0x9809AbFc4319271259a340775eC03E9746B76068'},
        ],
    }
    let collectionName = '';
    switch (selectedAirdropChain) {
        case 'mainnet':
            collectionName = collectionLibrary.ethereum;
            break;
        case 'binance':
            collectionName = collectionLibrary.binance;
            break;
        case 'polygon':
            collectionName = collectionLibrary.polygon;
            break;
        case 'avalanche':
            collectionName = collectionLibrary.avalanche;
            break;
        case 'arbitrum':
            collectionName = collectionLibrary.arbitrum;
            break;
    }

    const {data, status} = useQuery(
        ["airdrop"],
        getAirDrops(),
        {
          onSuccess: (res) => {

            const wholeArray = []
            res.map(drops => {
                const drop = JSON.parse(drops.airdrops);
                // console.log(drop)
                drop.map(d => wholeArray.push(d));
            });

            setAllAirdrops(wholeArray);
            setFilteredAirdrops(wholeArray);
          }
        }
      );
    const handleSearch = () =>{
        if(!searchAddress){
            setFilteredAirdrops(allAirdrops);
            return;
        }
        const selectedAirdrops = allAirdrops.filter(drop => drop.walletAddress.toLowerCase().includes(searchAddress.toLowerCase()) || drop.transactionHash.toLowerCase().includes(searchAddress.toLowerCase()));
        setFilteredAirdrops(selectedAirdrops)
    }
    const handleClear = () => {
        setFilteredAirdrops(allAirdrops);
        setSearchAddress('')
    }
    useEffect(() => {
        handleSearch();

    }, [searchAddress])

    useEffect(() => {
        if(!selectedCollection.contractAddress) return
        ;(async() => {
            setClaimLoading(true);
            const contract = await sdk.getContract(selectedCollection.contractAddress);
            const claimed = await contract.erc721.totalClaimedSupply();
            const totalSize = await contract.erc721.totalCount();

            let phaseLimiter = 0;
            
            if(phase == 1) { phaseLimiter = selectedCollection.phaseDelimiter.phase1; }
            else if(phase == 2) { phaseLimiter = selectedCollection.phaseDelimiter.phase2; }
            else if(phase == 3) { phaseLimiter = selectedCollection.phaseDelimiter.phase3; }
            else if(phase == 4) { phaseLimiter = selectedCollection.phaseDelimiter.phase4; }
            else if(phase == 5) { phaseLimiter = selectedCollection.phaseDelimiter.phase5; }

            setUnclaimed(phaseLimiter - parseInt(claimed._hex, 16));
            
            setClaimLoading(false);
        })()

        return () => {}
    }, [selectedCollection, phase])
    

  return (
    <>
        <Transition appear show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowAirdrop(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-60" /></Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full h-[600px] md:h-[564px] max-w-[1000px] transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                {selectedAirdropChain == 'binance' ? (
                                    <>
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 pt-6 text-gray-900 text-center">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">

                                                {collectionName.map(coll => (
                                                    <div
                                                        key={coll.name}
                                                        className={style.selectionCollection + `${selectedCollection.key == coll.key && ' ring-2 bg-sky-300/40 outline-none ring-offset-0'}`}
                                                        onClick={() => setSelectedCollection({ ...coll })}>
                                                        <img src={coll.icon} className={style.collectionImage} alt={coll.name}/>
                                                        {coll.name}
                                                        {selectedCollection.key == coll.key && <TbCircleCheckFilled fontSize={22} className={style.checkMark} />}
                                                    </div>

                                                ))}

                                            </div>
                                            {chainIcon[blockchainIdFromName[selectedAirdropChain]]}{currencyByChainName[selectedAirdropChain]} Airdrops from <span className="font-bold">{selectedCollection.name}</span>
                                        </Dialog.Title>
                                        <div className="flex gap-2 justify-center mt-5 mb-3">
                                            <div 
                                                className={`relative rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 1 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                                onClick={() => setPhase(1)}>Phase 1 </div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 2 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                                onClick={() => setPhase(2)}>Phase 2 </div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 3 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                                onClick={() => setPhase(3)}>Phase 3 </div>
                                            <div 
                                                className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 4 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                                onClick={() => setPhase(4)}>Phase 4 </div>
                                            <div 
                                                className={`relative rounded-md text-center p-3 pl-4 pr-8 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 5 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                                onClick={() => setPhase(5)}>Phase 5 (Nuva Token) <div className="w-[15px] absolute overflow-hidden inline-block top-3.5 right-3"><Image src={nuvatokenlogo.src} height="15px"  width="15px" /></div></div>
                                        </div>
                                        <p className="text-center text-xs mb-3 bg-amber-300 text-amber-700 font-bold w-fit p-2 rounded-lg m-auto">
                                            <FaInfoCircle fontSize={15} className="inline opacity-90 mr-1" />
                                            {claimLoading ? '.. ' : (
                                                <b>{unclaimed} </b>
                                            )}
                                             NFT Sales remaining to release PHASE {phase} AIRDROP
                                        </p>
                                        <div className="flex justify-center items-center gap-0 md:gap-1">
                                            <input
                                                value={searchAddress}
                                                onChange={(e) => setSearchAddress(e.target.value)}
                                                placeholder='Search by Transaction Hash or Wallet Address'
                                                className="border-neutral-200 text-sm rounded-md bg-neutral-200 p-2 w-full md:w-fit flex-grow"
                                                type="text"/>
                                            <div className="flex gap-2 ml-2">
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-lime-200 hover:bg-lime-300 text-lime-700 cursor-pointer"
                                                    onClick={() => handleSearch()}> 
                                                    Search
                                                </div>
                                                <div 
                                                    className=" p-2 text-sm px-4 rounded-md transition bg-neutral-200 hover:bg-neutral-300 text-neutral-700 cursor-pointer"
                                                    onClick={() => handleClear()}> 
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
                                                    {!Boolean(filteredAirdrops?.length) ? (
                                                        <tr>
                                                            <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No Airdrop data</p></td>
                                                        </tr>
                                                    ):(
                                                        <>
                                                            {filteredAirdrops.filter(drop => drop.phase == phase && drop.contractAddress == selectedCollection.contractAddress && String(drop.chainId) == blockchainIdFromName[selectedAirdropChain]).map((drop, index) => (
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
                                                    {!Boolean(filteredAirdrops?.length) ? (
                                                        <tr>
                                                            <td colSpan={4}><p className="text-neutral-500 text-center mt-6">No records found.</p></td>
                                                        </tr>
                                                    ) : (
                                                        <>
                                                            {filteredAirdrops.filter(drop => drop.phase == phase && drop.contractAddress == selectedCollection.contractAddress && String(drop.chainId) == blockchainIdFromName[selectedAirdropChain]).map((drop, index) => (
                                                                <tr key={index}>
                                                                    <td className="group p-2 border-0 border-slate-600/30 border-t">
                                                                        <a href={`${chainExplorer[drop.chainId.toString()]}tx/${drop.transactionHash}`} target="_blank" className="flex items-center gap-1">
                                                                            <MdOutlineOpenInNew className="group-hover:scale-125 transition"/>
                                                                            {drop.transactionHash.slice(0,10)}...{drop.transactionHash.slice(-10)}
                                                                        </a>
                                                                    </td>
                                                                    <td className="p-2 border-0 border-slate-600/30 border-t">{drop.walletAddress.slice(0,10)}...{drop.walletAddress.slice(-10)}</td>
                                                                    <td className="p-2 border-0 border-slate-600/30 border-t"><Moment fromNow>{drop.createdTime}</Moment></td>
                                                                    <td className="p-2 border-0 border-slate-600/30 border-t">
                                                                        <div className="flex items-center">
                                                                            <div className="rounded-md p-1 bg-neutral-200 px-2 flex justify-center items-center">
                                                                                {chainIcon[drop.chainId.toString()]}
                                                                                {drop.amount.toFixed(4)}
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
                                            onClick={() => setShowAirdrop(false)}
                                            >
                                            <CgClose fontSize={20}/>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center flex-col justify-center gap-4">
                                        <p className="text-2xl md:text-3xl text-center font-bold">
                                            <MdOutlineDownloading className="inline mr-2" fontSize={40}/>
                                            We are building the collection. <br/>Coming soon..
                                        </p>
                                        <button className="rounded-lg gradBlue text-white p-2 px-4" onClick={() => setShowAirdrop(false)}>
                                            Close
                                        </button>
                                    </div>
                                )}

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default Airdrop