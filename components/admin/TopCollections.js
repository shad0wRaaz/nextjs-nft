import React, { useEffect, useState } from 'react'
import { getImagefromWeb3 } from '../../fetchers/s3';
import { useThemeContext } from '../../contexts/ThemeContext';
import millify from 'millify';
import { BsArrowRightShort } from 'react-icons/bs';

const TopCollections = ({ collection }) => {
    const [imgPath, setImgPath] = useState();
    const { dark } = useThemeContext();

    useEffect(() => {

        ;(async () => {
          const nftImagePath = await getImagefromWeb3(collection?.web3imageprofile);
          setImgPath(nftImagePath?.data);
        })();
      return() => {}
  
    }, []);


  return (
    <div className="flex flex-row justify-between items-center" key={collection?._id}>
        <div className="user-info flex-grow flex flex-row gap-2 p-4 py-2 items-center">
            {Boolean(collection.web3imageprofile) && (
                <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border border-neutral-200">
                    <img src={imgPath} className="h-full w-full object-cover" />
                </div>
            )}
            <div className={`user-text flex flex-col text-sm ${dark ? 'text-neutral-100' : ''}`}>
                <span>{collection.name}</span>
                <span>${millify(collection.volumeTraded)}</span>
            </div>
        </div>
        <a href={`/collections/${collection?._id}`} target="_blank">
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

export default TopCollections