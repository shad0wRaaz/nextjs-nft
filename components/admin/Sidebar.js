import React, { useState } from 'react'
import { IconAvalanche, IconBNB, IconEthereum, IconLoading, IconPolygon } from '../icons/CustomIcons'
import { useThemeContext } from '../../contexts/ThemeContext'
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Sidebar = ({ selectedChain, setSelectedChain, setReferralModal}) => {
    const { dark, errorToastStyle, successToastStyle  } = useThemeContext();
    const [ethloading, setethloading] = useState(false);
    const [bnbloading, setbnbloading] = useState(false);
    const [avaxloading, setavaxloading] = useState(false);
    const [maticloading, setmaticloading] = useState(false);

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
                console.log(err)
                toast.error("Error in refreshing active listings.", errorToastStyle);
            });
        
        if(blockchain == "mumbai" || blockchain == "polygon") {setmaticloading(false);}
        else if(blockchain == "goerli" || blockchain == "mainnet") {setethloading(false);}
        else if(blockchain == "binance-testnet" || blockchain == "binance") {setbnbloading(false);}
        else if(blockchain == "avalanche-fuji" || blockchain == "avalanche") {setavaxloading(false);}
        
    }

  return (
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
                                    <IconEthereum/> Goerli 
                                </div>
                                {ethloading && (dark ? <IconLoading dark="inbutton" /> : <IconLoading />)}
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 mb-1 p-2 cursor-pointer`}
                                onClick={() => refreshListings("mumbai")}>
                                <div>
                                    <IconPolygon/> Mumbai
                                </div> 
                                {maticloading && (dark ? <IconLoading dark="inbutton" /> : <IconLoading />)}
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 mb-1 p-2 cursor-pointer`}
                                onClick={() => refreshListings("binance-testnet")}>
                                <div>
                                    <IconBNB/> Binance Test Chain
                                </div> 
                                {bnbloading && (dark ? <IconLoading dark="inbutton" /> : <IconLoading />)}
                            </div>
                            <div className={`${dark ? 'hover:bg-slate-700': 'hover:bg-white'} hover:shadow-md flex justify-between rounded-lg mx-2 gap-1 p-2 items-center mb-1 cursor-pointer`}
                                onClick={() => refreshListings("avalanche-fuji")}>
                                <div>
                                    <IconAvalanche/> Avalanche Fuji
                                </div>
                                    {avaxloading && (dark ? <IconLoading dark="inbutton" /> : <IconLoading />)}
                            </div>
                        </div>
                        <h2 
                            className={`mt-5 mb-3 font-semibold  rounded-lg p-2 cursor-pointer ${dark ? 'hover:bg-slate-800': 'hover:bg-neutral-200'}`}
                            onClick={() => setReferralModal(true)}>
                                Referral Settings
                        </h2>
                    </div>
  )
}

export default Sidebar