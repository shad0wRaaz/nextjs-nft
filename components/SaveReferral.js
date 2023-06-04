import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { checkReferralUser, checkUsername } from '../fetchers/SanityFetchers';
import { toast } from 'react-hot-toast';
import { useAddress } from '@thirdweb-dev/react';
import { useMutation } from 'react-query';
import { IconLoading } from './icons/CustomIcons';
import { saveReferrer } from '../mutators/SanityMutators';
import { useRouter } from 'next/router';

const SaveReferral = ({setReferralModal, userData}) => {

    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const address = useAddress();
    const [username, setUsername] = useState('');
    const router = useRouter();
    const { w } = router.query;
    const [sponsor, setSponsor] = useState('');

    const style = {
        input: `my-2 w-full outline-none p-3 border rounded-xl transition linear ${dark ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'}`,
        button: 'w-[200px] flex justify-center gap-2 ml-0 mt-8 accentBackground rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold max-w-[12rem] ease-linear transition duration-500',
        secbutton: `w-[200px] flex justify-center gap-2 ml-0 mt-8  rounded-xl  text-center text-white cursor-pointer p-4 m-3 font-bold max-w-[12rem] ease-linear transition duration-500 border ${dark ? 'border-slate-700 bg-slate-700/50' : ''}`,
        note: 'text-xs text-center'
    }
    
    const doitlater = () => {
        localStorage.setItem('referral', true);
        setReferralModal(false);
    }

    const handleSave = async (toastHandler = toast) => {
        if(username == '' && sponsor == '') {
            return;
        }
        if(sponsor == address){
            toastHandler.error('Cannot put yourself as your own referral.', errorToastStyle);
        return;
        }
        //check if referrer already exist in the system
        const userExist = await checkReferralUser(sponsor);
        if(!userExist || userExist.length == 0){
            toastHandler.error('Unknown referral wallet address.', errorToastStyle);
            return;
        }

        //check for duplicate username
        const res =  await checkUsername(username, address);
        if(res) {
            toastHandler.error('Username is already taken.', errorToastStyle);
            return
        }
          saveData();
    }

    const {mutate: saveData, status} = useMutation(
        async () => saveReferrer(username, sponsor, address),
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

    useEffect(() => {
        if(!w) return;
        setSponsor(w);
    }, [w]);

    //this is for saving referring wallet address if wallet is not connected
    useEffect(() => {
        //if there is not connected wallet, save the referral address in storage
        if(!address) {
            localStorage.setItem("refWallet", w)
        }
    }, [address])
  return (
    <div className="mt-8">
        <p>Your Name (Alias):</p>
        <input 
            type="text" className={style.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>

        <p className="mt-3">Referred By (Wallet Address only)</p>
        <input 
            type="text" className={style.input}
            value={sponsor}
            onChange={(e) => setSponsor(e.target.value)}/>

        <div className="flex justify-center gap-2">
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
                I will do it later
            </button>
        </div>
        <p className={style.note}>If you choose to do it later, you can do it from your profile page.</p>
    </div>
  )
}

export default SaveReferral