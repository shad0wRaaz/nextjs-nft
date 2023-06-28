import React from 'react'
import Header from '../../components/Header';
import SEO from '../../components/SEO';
import { useAddress } from '@thirdweb-dev/react';
import { Toaster } from 'react-hot-toast';
import CreateAVNFT from '../../components/createNew/CreateAVNFT';
import { useThemeContext } from '../../contexts/ThemeContext';

const mintav = () => {
    const { dark } = useThemeContext();
    const address = useAddress();

    const style = {
        wrapper: '',
        pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
        container: 'my-[3rem] container mx-auto p-1 pt-0  max-w-5xl',
        formWrapper: 'flex flex-wrap flex-col ',
        pageTitle: 'text-4xl font-bold text-center text-white',
        smallText: 'text-sm m-2 text-[#bbb] mt-0 mb-0',
        subHeading:
          'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
        input:
          'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
        label: 'text-small m-2 mt-4',
        button:
          'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
        previewImage:
          'relative mr-[1rem] h-[200px] w-[300px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-500 flex items-center justify-center hover:bg-slate-800',
        notConnectedWrapper: 'flex justify-center items-center h-screen',
        traitsButtons:
          'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-3 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
        secondaryButton:
          'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
        imageInput:
          'w-[350px] h-[350px] border border-slate-100 border-dashed border-lg flex items-center justify-content-center text-grey mb-4 cursor-pointer rounded-xl',
        imagePreview: 'max-h-[450px] rounded-xl cursor-pointer mb-4 max-w-[350px]'
      }

  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white text-slate-900'}`}>
        <Header />
        <SEO
        title="Mint Audio/Video NFT"
        description="Mint Audio/Video NFT"
        image=""
        currentUrl={`https://nuvanft.io/nfts/mint `} />
        <div className={style.wrapper}>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className={style.pageBanner}>
                <h2 className={style.pageTitle}> Mint Audio/Video NFT</h2>
            </div>
            {!isNaN(address) ? (
                <div className={style.container}>
                </div>
            ) : ''}
        </div>
        <div className={style.container}>
            <CreateAVNFT />
        </div>
    </div>
  )
}

export default mintav