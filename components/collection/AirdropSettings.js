import React, { useState } from 'react'

import { useThemeContext } from '../../contexts/ThemeContext';
import Link from 'next/link';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { TbParachute } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import { saveAirdropData, sendAirdrop } from '../../mutators/SanityMutators';
import { useMutation } from 'react-query';
import { IconLoading } from '../icons/CustomIcons';
import { useAddress } from '@thirdweb-dev/react';
import { RiCloseFill } from 'react-icons/ri';
import millify from 'millify';

const AirdropSettings = ({ chain, nftHolders, contractAddress, setShowAirdrop, totalnfts, totalremaining }) => {
    const address = useAddress();
    const [airdropAmount, setAirdropAmount] = useState(0);
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const { chainIcon, blockchainIdFromName, currencyByChainId } = useSettingsContext();
    const [phase, setPhase] = useState();


    const style = {
        formRow: 'flex flex-wrap w-full md:w-auto flex-row md:gap-3 items-center mt-3 w-full justify-center',
        input: 'm-2 outline-none p-3 border rounded-xl transition linear',
        label: 'm-2 w-fit',
        smallText: 'text-sm m-2 text-slate-400 mt-0',
        button: 'accentBackground flex gap-1 justify-center items-center rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold w-[9rem] ease-linear transition ',
        cancel: `${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-neutral-300 text-slate-700 hover:bg-neutral-400'}  flex gap-1 justify-center items-center rounded-xl  text-center cursor-pointer p-4 m-3 font-bold w-[9rem] ease-linear transition `,
        phaseButton : `rounded-md cursor-pointer p-2 px-3 transition ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-neutral-200 hover:bg-neutral-300'}`,
    }

    const { mutate: sendBNBAirdrop, status: airdropStatus} = useMutation(
        (airdropObj) => sendAirdrop(airdropObj),
        {
            onSuccess:(res) => {
                try{
                    //save airdrop data in all receiving owners
                    const tokenShare = airdropAmount / nftHolders.length
                    saveAirdropData(res?.data, blockchainIdFromName[chain], contractAddress, tokenShare, phase);
                    setAirdropAmount(0);
                    setPhase();
                    toast.success('Airdrop completed', successToastStyle);
                }catch(err){

                }
            },
            onError:(err) => {
                toast.error('Error in Airdropping', errorToastStyle);
                console.log(err);
            }
        }
    )

    const handleSendBNB = async(e) => {
        e.preventDefault();
        if(!airdropAmount || airdropAmount == 0){
            toast.error('Airdrop amount is not valid', errorToastStyle);
            return
        }
        if(!phase){
            toast.error('Airdrop Phase is not selected', errorToastStyle);
            return;
        }

        //create airdrop object with all holders and amount of bnb they will get
        const tokenShare = airdropAmount / nftHolders.length;
        const airdropObj = nftHolders.map(holder => {
            const obj = {
                receiver: holder,
                token:tokenShare,
            }
            return obj;
        });

        //as company is also an owner, so no need to airdrop to company wallet address
        const filteredAirdropObj = airdropObj.filter(obj => String(obj.receiver).toLowerCase() != String(address).toLowerCase());

        //call the mutation function to send airdrops to the owners
        sendBNBAirdrop(filteredAirdropObj);

    }
  return (
    <div>
        <div className={`grid grid-cols-3 mb-5 gap-3 text-sm md:text-md border border-dashed ${dark ? 'border-slate-700' : 'border-neutral-200'} rounded-xl py-4`}>
            <div>
                <p className="text-center">Total NFTs</p>
                <p className="text-xl md:text-3xl text-center font-bold">{totalnfts}</p>
            </div>
            <div>
                <p className="text-center">Total Sold</p>
                <p className="text-xl md:text-3xl text-center font-bold">{parseInt(totalnfts) - parseInt(totalremaining)}</p>
            </div>
            <div>
                <p className="text-center">Total Owners</p>
                <p className="text-xl md:text-3xl text-center font-bold">{nftHolders.length}</p>
            </div>
        </div>

        <p className="text-center">All Owners from this Collections</p>
        <div className="flex gap-2 mt-2 max-h-[400px] overflow-auto justify-center flex-wrap">
            {nftHolders.map((holder, index) => (
                <div className={`text-sm py-1 p-2 transition rounded-md border border-dashed ${dark ? 'border-slate-600 hover:bg-slate-00': 'border-neutral-200 hover:bg-neutral-200'}`} key={index}>
                    <Link href={`/user/${holder}`}>
                        <a> 
                            <div className="flex items-center justify-center gap-2">
                                <div className={`p-1 rounded-full ${dark ? 'bg-slate-700' :'bg-neutral-200'} px-2 w-5 h-5 text-xs flex justify-center items-center`}> {index + 1}</div>
                                <div className="">{holder.slice(0,5)}...{holder.slice(-5)}</div>
                            </div>
                        </a>
                    </Link>
                </div>
            ))}
        </div>
        <div className={`mt-8 rounded-xl p-8 ${dark ? 'bg-slate-700/30' : 'bg-neutral-100'}`}>
            <h2 className="text-center font-bold text-xl mb-3 mt-0">Airdrop Setting</h2>
            <div className="flex gap-3 justify-center items-center">
                <p className="text-center text-sm">Choose Phase: </p>
                <div className="flex my-3 flex-wrap gap-2 items-center justify-center">
                    <div className={`${phase == 1 ? style.phaseButton + ' outline-0 ring-2 !bg-sky-700/30' : style.phaseButton}`} onClick={() => setPhase(1)}>Phase 1</div>
                    <div className={`${phase == 2 ? style.phaseButton + ' outline-0 ring-2 !bg-sky-700/30' : style.phaseButton}`} onClick={() => setPhase(2)}>Phase 2</div>
                    <div className={`${phase == 3 ? style.phaseButton + ' outline-0 ring-2 !bg-sky-700/30' : style.phaseButton}`} onClick={() => setPhase(3)}>Phase 3</div>
                    <div className={`${phase == 4 ? style.phaseButton + ' outline-0 ring-2 !bg-sky-700/30' : style.phaseButton}`} onClick={() => setPhase(4)}>Phase 4</div>
                </div>
            </div>
            <form name="FormAirdrop" onSubmit={handleSendBNB}>
                <div className="flex justify-center mt-0 flex-wrap">
                    <div className={style.formRow}>
                        <p className={style.label}>Enter {currencyByChainId[blockchainIdFromName[chain]]} to Airdrop</p>
                        <div className="relative w-max-content">
                            <input
                                type="number"
                                className={
                                dark
                                    ? style.input +
                                    ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow  pl-8'
                                    : style.input +
                                    ' border-neutral-200 hover:bg-neutral-100 flex-grow  pl-8'
                                }
                                value={airdropAmount}
                                onChange={(e) => setAirdropAmount(e.target.value)}
                            />
                            <div className="absolute top-5 left-5">
                                {chainIcon[blockchainIdFromName[chain]]}
                            </div>

                        </div>
                    </div>
                    <p className="text-xs w-full text-center">
                        *Entered {currencyByChainId[blockchainIdFromName[chain]]} will be distributed among all the owners. Each owner will receive 
                        <span className="text-md font-bold pl-1">
                            {millify(airdropAmount / Number(nftHolders.length), { precision: 5 })}</span> {chainIcon[blockchainIdFromName[chain]]}
                    </p>
                    <div className="flex items-center justify-center mt-4">
                        {airdropStatus == 'loading' ? (
                            <button className={style.button + ' disabled pointer-events-none opacity-80 !w-fit'}>
                                <IconLoading dark="in-button" /> Sending Airdrop
                            </button>
                        ) : (
                            <button className={style.button}>
                                <TbParachute /> Airdrop
                            </button>
                        )}

                        <button className={style.cancel} onClick={() => setShowAirdrop(false)}>
                            <RiCloseFill /> Cancel
                        </button>

                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AirdropSettings