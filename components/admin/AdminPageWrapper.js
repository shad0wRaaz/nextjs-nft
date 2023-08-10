import Head from 'next/head'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from '../../components/Header'
import { config } from '../../lib/sanityClient'
import Sidebar from '../../components/admin/Sidebar'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useAdminContext } from '../../contexts/AdminContext'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'

const AdminPageWrapper = ({children, title}) => {
  const address = useAddress();
  const { referralModal, setReferralModal, loggedIn, setLoggedIn, selectedUser, setSelectedUser, selectedChain, setSelectedChain} = useAdminContext();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();

  const getAllAdminUsers = async () => {
    const query = '*[_type == "settings"]{adminusers}';
    const res = await config.fetch(query);
    return res[0].adminusers;
}

  useEffect(() => {
    if(!address) return
    ;(async() => {
        const adminList = await getAllAdminUsers();
        const isThisUserAdmin = adminList.filter(user => user._ref == address);
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
        <title>{title}: Nuva NFT</title>
      </Head>
      {!loggedIn ? (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center">
                <ConnectWallet accentColor="#0053f2" className=" ml-4" style={{ borderRadius: '50% !important'}} />
            </div>

        ) : (
          <div className="relative">
            <div className="bg-slate-700">
                <Header />
                <Toaster position="bottom-right" reverseOrder={false} />
            </div>

            <div className="grid grid-cols-6 pt-[5rem]">
                <div>
                    <Sidebar selectedChain={selectedChain} setSelectedChain={setSelectedChain} setReferralModal={setReferralModal} />
                </div>
                <main className="col-span-5 p-4">
                    <div className="pt-10">
                        <div className="container mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default AdminPageWrapper