import Image from 'next/image';
import Moment from 'react-moment'
import { useQuery } from 'react-query';
import { CgClose } from 'react-icons/cg';
import { FaInfoCircle } from 'react-icons/fa';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { Dialog, Transition } from '@headlessui/react'
import { getAirDrops } from '../fetchers/SanityFetchers';
import nuvatokenlogo from '../public/assets/nuvatoken.png'
import React, { Fragment, useEffect, useState } from 'react'
import { useSettingsContext } from '../contexts/SettingsContext';
import { MdOutlineDownloading, MdOutlineOpenInNew } from 'react-icons/md';
import { allbenefits } from '../constants/benefits';

const Airdrop = ({visible, setShowAirdrop, selectedAirdropCollection}) => {

    const [selectedCollectionFamily, setSelectedCollectionFamily] = useState();
    const [selectedCollection, setSelectedCollection] = useState();
    const [allAirdrops, setAllAirdrops] = useState();
    const [filteredAirdrops, setFilteredAirdrops] = useState();
    const [phase, setPhase] = useState(1);

    const { chainExplorer, chainIcon, blockchainIdFromName, currencyByChainName } = useSettingsContext();
    const [searchAddress, setSearchAddress] = useState('');
    const [unclaimed, setUnclaimed] = useState();
    const [claimLoading, setClaimLoading] = useState(false);

    const style = {
        collectionImage: 'rounded-full h-[30px] w-[30px] inline mr-2',
        selected : ' ring-2 bg-sky-300/30 outline-none ring-offset-0',
        checkMark : 'absolute top-4 right-2 text-sky-700',
        selectionCollection : 'relative border border-neutral-100/80 hover:shadow-md bg-neutral-100/50 p-3 rounded-xl text-sm text-left cursor-pointer transition ',
    };

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
        if(!selectedCollection) return
        ;(async() => {
            setClaimLoading(true);

            const sdk = new ThirdwebSDK(selectedCollection.chain);
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

        // return () => {}
    }, [selectedCollection, phase]);

    useEffect (() => {
        const selectedCollectionFamily = allbenefits.filter(c => c.collection === selectedAirdropCollection);
        setSelectedCollectionFamily(selectedCollectionFamily);
        setSelectedCollection(selectedCollectionFamily[0]);
        return() => {
            
        }
    }, [selectedAirdropCollection])
    

  return (
    <>
        <Transition appear show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowAirdrop(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-60" /></Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full h-[600px] md:h-[564px] max-w-[1000px] transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                {selectedCollection?.chain == 'binance' || selectedCollection?.chain == 'ethereum' || selectedCollection?.chain == 'polygon' ? (
                                    <>
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 pt-6 text-gray-900 text-center">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">

                                                {selectedCollectionFamily.map(coll => 
                                                    <div
                                                        key={coll.name}
                                                        className={style.selectionCollection + `${selectedCollection.name == coll.name && ' ring-2 bg-sky-300/40 outline-none ring-offset-0'}`}
                                                        onClick={() => setSelectedCollection({...coll})}>
                                                        <img src={coll.profileImage} className={style.collectionImage} alt={coll.name}/>
                                                        {coll.name}
                                                        {selectedCollection.name == coll.name ? <TbCircleCheckFilled fontSize={22} className={style.checkMark} /> : ''}
                                                    </div>

                                                )}

                                            </div>
                                            {selectedCollection.chainIcon}{selectedCollection.currency} Airdrops from <span className="font-bold">{selectedCollection.name}</span>
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