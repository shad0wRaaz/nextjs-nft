import React from 'react'
import { IconBNB } from './icons/CustomIcons'
import { useThemeContext } from '../contexts/ThemeContext'
import { useUserContext } from '../contexts/UserContext';
import { useMarketplaceContext } from '../contexts/MarketPlaceContext';
import { useSettingsContext } from '../contexts/SettingsContext';

const Loyalty = ({ isLogged }) => {
  const { dark } = useThemeContext();
  const { myUser } = useUserContext();
  const { chainIcon, blockchainIdFromName } = useSettingsContext();
  const { selectedBlockchain } = useMarketplaceContext();
  var totals = 0;

  if(myUser?.referralbonus){
    const referrals = JSON.parse(myUser.referralbonus);
    referrals.filter(referral => referral.chainId == blockchainIdFromName[selectedBlockchain]).map(referral => totals += referral.amount);
  }
  return (
    <div className={`inline-flex mr-3 ${isLogged ? dark? 'w-full text-white shadow-md bg-slate-700 bg-opacity-60 hover:bg-opacity-100': 'w-full text-slate-800 bg-neutral-200 ' :'w-full md:w-fit bg-black hover:bg-opacity-30 bg-opacity-20 text-white'} justify-between items-center rounded-[10px]  transition px-4 py-2.5 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
      <div className="border-r border-slate-600/50 pr-2">
        {chainIcon[blockchainIdFromName[selectedBlockchain]]} {!isLogged ? '0' : totals.toFixed(3)}
      </div>
      <div className="pl-2">
      Loyalty Reward
      </div>
    </div>
  )
}

export default Loyalty