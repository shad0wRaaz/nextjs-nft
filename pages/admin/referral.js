import Head from 'next/head';
import { config } from '../../lib/sanityClient'
import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import Header from '../../components/Header';
import { Toaster } from 'react-hot-toast';

const referral = () => {
    const { dark } = useThemeContext();
    const [loggedIn, setLoggedIn] = useState(false);
    const address = useAddress();

    const getAllAdminUsers = async () => {
        const query = '*[_type == "settings"]{adminusers}';
        const res = await config.fetch(query)
        return res[0].adminusers
    }

    useEffect(() => {
        if(!address) return
        ;(async() => {
            const adminList = await getAllAdminUsers();
            const isThisUserAdmin = adminList.filter(user => user._ref == address)
            if(isThisUserAdmin.length > 0){
                setLoggedIn(true);
            }
        })();
        
        return() => {
            //do nothing//clean up function
            setLoggedIn(false);
        }
    },[address]);

  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-gray'}`}>
        <Head>
            <title>Dashboard: Nuva NFT</title>
        </Head>
        {!loggedIn ? (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center">
                <ConnectWallet accentColor="#0053f2" className=" ml-4" style={{ borderRadius: '50% !important'}} />
            </div>

        ):(
            <>
                <div className="bg-slate-700">
                    <Header />
                    <Toaster position="bottom-right" reverseOrder={false} />
                </div>
            </>
        )}
    </div>
  )
}

export default referral