import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { getImagefromWeb3 } from '../fetchers/s3';
import { createAwatar } from '../utils/utilities';
import { BiWallet } from 'react-icons/bi';

const ReferralUserBox = ({ walletAddress, profileImage, userName, hiddenValue}) => {
    const { dark } = useThemeContext();
    const [imgPath, setImgPath] = useState();

    const style={
        userprofile: 'w-[40px] mx-auto mb-1 h-[40px] rounded-full object-cover outline outline-2 outline-slate-300 mt-3',
        userbox: `${dark ? 'border border-slate-700': 'border border-neutral-200'} bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/50 to-blue-500/50`,
    }

    useEffect(() => {
        if(!profileImage) return;
    
        ;(async() => {
          const imgPath = await getImagefromWeb3(profileImage);
          setImgPath(imgPath?.data);
    
        })()
    
        return() => {}
    
      }, [profileImage]);

  return (
    <>
        <a href={`/user/${walletAddress}`} className={style.userbox}>
            <img 
                src={ imgPath ? imgPath : createAwatar(walletAddress) } 
                alt={userName} 
                className={style.userprofile} />
            <span className="hidden">{hiddenValue && hiddenValue}</span>
            {userName != "Unnamed" && <>{userName}</>}
            <p>
                <BiWallet className="inline-block" fontSize={14}/> 
                <span className="text-sm">
                    {walletAddress.slice(0,4)}...{walletAddress.slice(-4)}
                </span>
            </p>
        </a>
    </>
  )
}

export default ReferralUserBox