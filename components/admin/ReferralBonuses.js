import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getReferralBonuses } from '../../fetchers/SanityFetchers'
import Moment from 'react-moment';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { IconBNB } from '../icons/CustomIcons';
import { useThemeContext } from '../../contexts/ThemeContext';

const ReferralBonuses = () => {
    const { dark } = useThemeContext()
    const [bonuses, setBonuses] = useState();
    const { chainExplorer } = useSettingsContext();
    const [searchText, setSearchText] = useState();
    const [filterData, setFilterData] = useState();
    const style = {
        userprofile: 'w-[40px] mx-auto mb-1 h-[40px] rounded-full object-cover outline outline-2 outline-slate-300 mt-3',
        tablewrapper: `max-h-[520px] overflow-auto`,
        table: `text-sm w-full text-base whitespace-nowrap ${dark ? 'text-neutral-100': 'text-slate-700'}`,
        tableheader: `font-normal py-4 ${dark ? 'bg-slate-600' : ' bg-neutral-100'} text-left pl-2`,
        tablecell: 'py-3 pl-2',
        smallText: 'text-xs m-2 mt-0 mb-0',
        subHeading:
          'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
        input:
          `w-full outline-none p-3 rounded-md transition linear text-sm mb-4 border ${dark ? ' bg-slate-700 hover:bg-slate-600 border-slate-600 text-neutral-100' : ' border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-slate-700'}`,
        label: 'text-small m-2 mt-4',
        button:
          'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
      }

    const {data, status} = useQuery(
        ['referralBonues'],
        getReferralBonuses(),
        {
            onSuccess:(res) => {
                // console.log(res);
                let bonusData = 0;
                res?.map(data => {
                    const referrals = JSON.parse(data.referralbonus);

                    //construct new object to insert user's name
                    const newsrefdata = referrals.map(res => {
                        const dataWithUserName = {
                            ...res,
                            username: data.userName,
                            destination: data._id,
                        }
                        return dataWithUserName;
                    });
                    console.log(newsrefdata)
                    if(bonusData == 0){
                        bonusData = [...newsrefdata];
                    }else{
                        bonusData = [...bonusData, ...newsrefdata];
                    }
                })

                //sort data by date of transaction
                bonusData = bonusData.sort(function(a,b){
                    return new Date(b.sentTime) - new Date(a.sentTime);
                  })
                setBonuses(bonusData);
                setFilterData(bonusData);

                //save bonusData into a single array
            },
            onError:(err) =>{
                console.log(err);
            }
        }
    )

    useEffect(() => {
        if(!bonuses) return
        if(!searchText) {
            setFilterData([...bonuses]);
        }else{
            const temp = bonuses.filter(bonus => 
                bonus.source.toLowerCase().match(searchText.toLowerCase()) || 
                bonus.destination.toLowerCase().match(searchText.toLowerCase()) || 
                bonus.username.toLowerCase().match(searchText.toLowerCase()))
            setFilterData(temp)
        }
    }, [searchText])

  return (
    <div>
        <input 
            className={style.input} 
            placeholder='Search Transactions by Wallet Address/Username'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
        <div className={style.tablewrapper}>
            <table className={style.table}>
                <thead className="relative">
                    <tr className="sticky top-0">
                        <th className={style.tableheader}>SNo</th>
                        <th className={style.tableheader}>Date</th>
                        <th className={style.tableheader}>Transaction Id</th>
                        <th className={style.tableheader}>Amount</th>
                        <th className={style.tableheader}>Receiver</th>
                        <th className={style.tableheader}>From</th>
                    </tr>
                </thead>
                <tbody>
                    {filterData?.map((bonus, index) => (
                        <tr key={index}>
                            <td className={style.tablecell}>{index + 1}</td>
                            <td className={style.tablecell}><Moment fromNow>{bonus.sentTime}</Moment></td>
                            <td className={style.tablecell}>
                                <a href={`${chainExplorer[bonus.chainId]}tx/${bonus.transactionHash}`} target="_blank" className="p-2 hover:bg-slate-600/20 rounded-lg">
                                    {bonus.transactionHash.slice(0,5)}...{bonus.transactionHash.slice(-5)}
                                </a>
                            </td>
                            <td className={style.tablecell}><IconBNB/>{bonus.amount}</td>
                            <td className={style.tablecell}>{bonus.username} - {bonus.destination.slice(0,5)}...{bonus.destination.slice(-5)}</td>
                            <td className={style.tablecell}>{bonus.source.slice(0,5)}...{bonus.source.slice(-5)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ReferralBonuses