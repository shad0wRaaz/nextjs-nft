import millify from 'millify';
import React, { useEffect, useState } from 'react'
import { BsArrowRightShort } from 'react-icons/bs';
import { createAwatar } from '../../utils/utilities';
import { useThemeContext } from '../../contexts/ThemeContext';
import { getImagefromWeb3 } from '../../fetchers/s3';

const TopUsers = ({ user }) => {
    const [imgPath, setImgPath] = useState();
    const { dark } = useThemeContext();

    useEffect(() => {

        ;(async () => {
          const nftImagePath = await getImagefromWeb3(user?.web3imageprofile);
          setImgPath(nftImagePath?.data);
        })();
      return() => {}
  
    }, []);

  return (
    <div className="flex flex-row justify-between items-center" key={user?.walletAddress}>
        <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border border-neutral-200">
                <img src={imgPath ? imgPath : createAwatar(user?.walletAddress)} className="h-full w-full object-cover" />    
            </div>
            <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                <span>{user.userName}</span>
                <span>${millify(user.volumeTraded)}</span>
            </div>
        </div>
        <a href={`/user/${user?._id}`} target="_blank">
            <div className={`viewer rounded-xl border ${dark ? ' border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-100'} cursor-pointer p-2`}>
                {dark ? 
                <BsArrowRightShort fontSize={20} className="-rotate-45" color='#ffffff'/>
                :
                <BsArrowRightShort fontSize={20} className="-rotate-45" />
                }
            </div>
        </a>
    </div>
  )
}

export default TopUsers