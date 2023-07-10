import Moment from 'react-moment'
import { useQuery } from 'react-query';
import { CgClose } from 'react-icons/cg';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { Dialog, Transition } from '@headlessui/react'
import { getAirDrops } from '../fetchers/SanityFetchers';
import React, { Fragment, useEffect, useState } from 'react'
import { useSettingsContext } from '../contexts/SettingsContext';
import neon1  from '../pages/rewarding-renditions/assets/neondreams/1.png'
import artifacts1  from '../pages/rewarding-renditions/assets/artifacts/1.png'
import creature1  from '../pages/rewarding-renditions/assets/cryptocreatures/1.png'
import celestial1  from '../pages/rewarding-renditions/assets/celestialbeings/1.png'

const Airdrop = ({visible, setShowAirdrop}) => {
    const [selectedCollection, setSelectedCollection] = useState('crypto');
    const [allAirdrops, setAllAirdrops] = useState();
    const [filteredAirdrops, setFilteredAirdrops] = useState();
    const [cryptoDrop, setCryptoDrop] = useState(false);
    const [phase, setPhase] = useState(1);
    
    const { chainExplorer, chainIcon } = useSettingsContext();
    const [searchAddress, setSearchAddress] = useState('');

    const style = {
        collectionImage: 'rounded-full h-[30px] w-[30px] inline mr-2',
        selected : ' ring-2 bg-sky-300/30 outline-none ring-offset-0',
        checkMark : 'absolute top-4 right-2 text-sky-700',
        selectionCollection : 'relative border border-neutral-100/80 hover:shadow-md bg-neutral-100/50 p-3 rounded-xl text-sm text-left cursor-pointer transition ',
    }
    const collectionName = {
        'crypto': 'Crypto Creatures', 'neon': 'Neon Dreams', 'celestial': 'Celestial Beings', 'artifacts': 'Artifacts of the Future'
    }
    const selectedContractAddress = {
        'crypto': '0x9809AbFc4319271259a340775eC03E9746B76068', 'neon': '0x2945db324Ec216a5D5cEcE8B4D76f042553a213f', 'celestial': '0x54265672B480fF8893389F2c68caeF29C95c7BE2', 'artifacts': '0x9BDa42900556fCce5927C1905084C4b3CffB23b0'
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
    

  return (
    <>
        <Transition appear show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowAirdrop(false)}>
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
                            <Dialog.Panel className="w-full h-[600px] md:h-[564px] max-w-[1000px] transform overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 pt-6 text-gray-900 text-center">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                                        <div 
                                            className={style.selectionCollection + `${selectedCollection == 'crypto' && ' ring-2 bg-sky-300/40 outline-none ring-offset-0'}`}
                                            onClick={() => setSelectedCollection('crypto')}>
                                            <img src={creature1.src} className={style.collectionImage} alt="Crypto Creatures"/>
                                            Crypto Creatures
                                            {selectedCollection == 'crypto' && <TbCircleCheckFilled fontSize={22} className={style.checkMark} />}
                                        </div>
                                        <div 
                                            className={style.selectionCollection + `${selectedCollection == 'neon' && ' ring-2 bg-sky-300/40 outline-none ring-offset-0'}`}
                                            onClick={() => setSelectedCollection('neon')}>
                                            <img src={neon1.src} className={style.collectionImage} alt="Neon Dreams"/>
                                            Neon Dreams
                                            {selectedCollection == 'neon' && <TbCircleCheckFilled fontSize={22} className={style.checkMark} />}
                                        </div>
                                        <div 
                                            className={style.selectionCollection + `${selectedCollection == 'celestial' && ' ring-2 bg-sky-300/40 outline-none ring-offset-0'}`}
                                            onClick={() => setSelectedCollection('celestial')}>
                                            <img src={celestial1.src} className={style.collectionImage} alt="Celestial Beings"/>
                                            Celestial Beings
                                            {selectedCollection == 'celestial' && <TbCircleCheckFilled fontSize={22} className={style.checkMark} />}
                                        </div>
                                        <div 
                                            className={style.selectionCollection + `${selectedCollection == 'artifacts' && ' ring-2 bg-sky-300/40 outline-none ring-offset-0'}`}
                                            onClick={() => setSelectedCollection('artifacts')}>
                                            <img src={artifacts1.src} className={style.collectionImage} alt="Artifacts of the Future"/>
                                            Artifacts of the Future
                                            {selectedCollection == 'artifacts' && <TbCircleCheckFilled fontSize={22} className={style.checkMark} />}
                                        </div>
                                    </div>


                                    Airdrops from <span className="font-bold">{collectionName[selectedCollection]}</span>
                                </Dialog.Title>
                                <div className="flex gap-2 justify-center my-5">
                                    <div 
                                        className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 1 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                        onClick={() => setPhase(1)}>Phase 1</div>
                                    <div 
                                        className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 2 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                        onClick={() => setPhase(2)}>Phase 2</div>
                                    <div 
                                        className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 3 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                        onClick={() => setPhase(3)}>Phase 3</div>
                                    <div 
                                        className={`rounded-md text-center p-3 px-4 bg-sky-200 transition hover:shadow-md cursor-pointer text-sm ${phase == 4 ? 'ring-2 ring-offset-1 ring-sky-500 bg-sky-300' : ''}`}
                                        onClick={() => setPhase(4)}>Phase 4</div>
                                </div>
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
                                            ): (
                                                <>
                                                    {filteredAirdrops.filter(drop => drop.phase == phase && drop.contractAddress == selectedContractAddress[selectedCollection]).map((drop, index) => (
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
                                                    {filteredAirdrops.filter(drop => drop.phase == phase && drop.contractAddress == selectedContractAddress[selectedCollection]).map((drop, index) => (
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