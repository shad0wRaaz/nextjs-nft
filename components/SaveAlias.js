import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { checkReferralUser, checkUsername } from '../fetchers/SanityFetchers';
import { toast } from 'react-hot-toast';
import { useAddress } from '@thirdweb-dev/react';
import { useMutation } from 'react-query';
import { IconCopy, IconLoading } from './icons/CustomIcons';
import { saveAlias } from '../mutators/SanityMutators';
import { useRouter } from 'next/router';

const SaveAlias = ({setReferralModal, userData}) => {

    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const address = useAddress();
    const [username, setUsername] = useState('');
    const router = useRouter();
    const [sponsor, setSponsor] = useState('');

    const style = {
        input: `my-2 w-full outline-none p-3 border rounded-xl transition linear ${dark ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'}`,
        buttonContainer : 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-8',
        profileLink: `relative text-sm p-3 pr-8 rounded-xl border break-all mt-2 ${dark ? 'border-slate-700' : ''}`,
        copyicon : 'absolute cursor-pointer top-2.5 right-2 transition hover:rotate-12 origin-bottom',
        button: 'w-full flex justify-center gap-2 ml-0 accentBackground rounded-xl gradBlue text-center text-white cursor-pointer p-4 font-bold ease-linear transition duration-500',
        secbutton: `w-full flex justify-center gap-2 ml-0 rounded-xl  text-center text-white cursor-pointer p-4 font-bold ease-linear transition duration-500 border ${dark ? 'border-slate-700 bg-slate-700/50' : ''}`,
    }
    
    const doitlater = () => {
        localStorage.setItem('referral', true);
        setReferralModal(false);
    }

    const handleSave = async (toastHandler = toast) => {
        if(username == '') {
            return;
        }
        // if(sponsor == address){
        //     toastHandler.error('Cannot put yourself as your own referral.', errorToastStyle);
        // return;
        // }
        //check if referrer already exist in the system
        // const userExist = await checkReferralUser(sponsor);
        // if(!userExist || userExist.length == 0){
        //     toastHandler.error('Unknown referral wallet address.', errorToastStyle);
        //     return;
        // }

        //check for duplicate username
        const res =  await checkUsername(username, address);
        if(res) {
            toastHandler.error('Username is already taken.', errorToastStyle);
            return
        }
          saveData();
    }

    const {mutate: saveData, status} = useMutation(
        async () => saveAlias(username, address),
        {
            onError:(err) => {
                toast.error('Error in saving', errorToastStyle);
            },
            onSuccess: (res) => {
                toast.success('Save successful', successToastStyle);
                setReferralModal(false); //close the referral modal
            }
        }
    );

    useEffect(() => {
        if(!userData) return;
        setUsername(userData.userName);
    }, [userData]);


  return (
    <div className="mt-8">
        <p>Your Display Name (Alias) <span className="text-xs text-slate-400 italic">(optional)</span></p>
        <input 
            type="text" className={style.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>

        <p className="mt-3">Referral Link</p>
        <div className={style.profileLink}>
            https://nuvanft.io?w={address}
            <div className={style.copyicon}
                onClick={() => {
                          navigator.clipboard.writeText(`https://nuvanft.io/?w=${address}`);
                          toast.success('Referral link copied', successToastStyle);
                        }}>
                        <IconCopy />
            </div>
        </div>
        <h2 className="text-center text-xl mt-2 mb-8 font-bold">Refer friends and GET REWARDED</h2>

        <div className={style.buttonContainer}>
            {status == "loading" ? (
                <button 
                    className={style.button + ' flex gap-2'}
                    disabled>
                    <IconLoading dark="inbutton"/> Saving
                </button>
            ) : (
                <button 
                    className={style.button}
                    onClick={() => handleSave()}>
                    Save
                </button>
            )}
            <button 
                className={style.secbutton}
                onClick={() => doitlater()}>
                Don't show anymore
            </button>
        </div>
    </div>
  )
}

export default SaveAlias