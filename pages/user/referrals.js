import Moment from 'react-moment'
import { useQuery } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { BiWallet } from 'react-icons/bi'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { useAddress } from '@thirdweb-dev/react'
import React, { useRef, useState } from 'react'
import { createAwatar } from '../../utils/utilities';
import { getImagefromWeb3 } from '../../fetchers/s3'
import { useUserContext } from '../../contexts/UserContext'
import { useThemeContext } from '../../contexts/ThemeContext'
import { IconBNB } from '../../components/icons/CustomIcons'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getMyNetwork, getReferralPayment } from '../../fetchers/SanityFetchers'
import { TbSquareRoundedNumber1Filled, TbSquareRoundedNumber2Filled, TbSquareRoundedNumber3Filled, TbSquareRoundedNumber4Filled, TbSquareRoundedNumber5Filled,  } from 'react-icons/tb'

const referrals = () => {
    const address = useAddress();
    const { dark } = useThemeContext();
    const { myUser } = useUserContext();
    const leveltwoRef = useRef(0);
    const levelthreeRef = useRef(0);
    const levelfourRef = useRef(0);
    const levelfiveRef = useRef(0);
    const [totalBonus, setTotalBonus] = useState(0);
    const { chainExplorer, HOST } = useSettingsContext();
    

    const addteam = () => {
        teamcountRef.current += 1;
    }
    const style = {
        wrapper: '',
        userprofile: 'w-[40px] mx-auto mb-1 h-[40px] rounded-full object-cover outline outline-2 outline-slate-300 mt-3',
        tablewrapper: `max-h-[500px] overflow-scroll rounded-lg border ${dark ? 'border-slate-700' : 'border-neutral-200'}`,
        userul: dark ? 'before:border-l before:border-slate-700' :'before:border-l before:border-neutral-200',
        userli: dark ? 'before:border-t before:border-slate-700 after:border-t after:border-slate-700 last:before:border-r last:before:border-border-slate-700 after:border-l after:border-slate-700' :'before:border-t before:border-neutral-200 after:border-t after:border-neutral-200 last:before:border-r last:before:border-border-slate-200 after:border-l after:border-neutral-200',
        userbox: `${dark ? 'border border-slate-700': 'border border-neutral-200'} bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/50 to-blue-500/50`,
        table: `text-sm w-full text-base`,
        tableheader: `font-normal py-4 ${dark ? 'bg-slate-600' : ' bg-neutral-100'} text-left pl-2`,
        tablecell: 'py-3 pl-2',
        networklabel: 'mr-2 opacity-10 absolute top-3 left-2',
        pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
        container: 'my-[3rem] container mx-auto p-1 pt-0 max-w-5xl',
        formWrapper: 'flex flex-wrap flex-col ',
        pageTitle: 'text-4xl font-bold text-center text-white',
        smallText: 'text-xs m-2 mt-0 mb-0',
        subHeading:
          'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
        input:
          `m-2 outline-none p-3 rounded-[0.4rem]  transition linear' + ${dark ? ' bg-[#1e293b] hover:bg-[#334155] ' : ' border border-neutral-200 bg-neutral-100 hover:bg-neutral-200'}`,
        label: 'text-small m-2 mt-4',
        button:
          'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
        previewImage:
          'relative mr-[1rem] h-[220px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-500 flex items-center justify-center',
        notConnectedWrapper: 'flex justify-center items-start h-screen pt-[4rem]',
        traitsButtons:
          'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-2 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
        secondaryButton:
          'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
        imageInput:
          'w-[350px] h-[350px] border border-slate-100 border-dashed border-lg flex items-center justify-content-center text-grey mb-4 cursor-pointer rounded-xl',
        imagePreview: 'max-h-[450px] rounded-xl cursor-pointer mb-4 max-w-[350px]'
      }
    
    const {data: networkData, status: networkStatus} = useQuery(
        ["network"],
        getMyNetwork(address),
        {
            enabled: Boolean(address),
            onSuccess: (res) => {},
            onError: (err) => {},
        }
    );

    const {data: referralPaymentData, status: referralPaymentStatus } = useQuery(
        ['referralpayment'],
        getReferralPayment(address),
        {
            enabled: Boolean(address),
            onSuccess: (res) => 
            { 
                const totals = res.map(r => r.amount);
                const sum = totals.reduce((a,b) => a + b, 0);
                setTotalBonus(sum);
            }
        }
    )

  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white text-slate-900'}`}>
        <Header />
        <div className={style.wrapper}>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className={style.pageBanner}>
                <h2 className={style.pageTitle}> Referrals</h2>
            </div>
            {!isNaN(address) ? (
                <>
                    <div className={style.container}>
                    <p className="font-semibold text-center">Network Levels</p>
                        <div className="flex flex-wrap mb-10 items-center">
                            <div className="p-3 w-full md:w-1/5">
                                <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                    <TbSquareRoundedNumber1Filled fontSize={50} className={style.networklabel} />
                                    <p className="font-bold text-3xl">{networkStatus == "loading" ? 'Loading...' : networkData?.length}</p>
                                </div>
                            </div>
                            <div className="p-3 w-1/2 md:w-1/5">
                                <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                    <TbSquareRoundedNumber2Filled fontSize={50} className={style.networklabel} />
                                    <p className="font-bold text-3xl">{leveltwoRef.current}</p>
                                </div>
                            </div>
                            <div className="p-3 w-1/2 md:w-1/5">
                                <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                    <TbSquareRoundedNumber3Filled fontSize={50} className={style.networklabel} />
                                    <p className="font-bold text-3xl">{levelthreeRef.current}</p>
                                </div>
                            </div>
                            <div className="p-3 w-1/2 md:w-1/5">
                                <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                    <TbSquareRoundedNumber4Filled fontSize={50} className={style.networklabel} />
                                    <p className="font-bold text-3xl">{levelfourRef.current}</p>
                                </div>
                            </div>
                            <div className="p-3 w-1/2 md:w-1/5">
                                <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center relative`}>
                                    <TbSquareRoundedNumber5Filled fontSize={50} className={style.networklabel} />
                                    <p className="font-bold text-3xl">{levelfiveRef.current}</p>
                                </div>
                            </div>
                            {/* <div className="p-3 w-full md:w-1/6">
                                <div className={`border ${dark ? 'border-slate-700' : 'border-netural-200'} p-5 rounded-lg text-center`}>
                                    <p className="">Referral Bonus</p>
                                    <p className="font-semibold text-3xl"><IconBNB/>{totalBonus}</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <p className="font-semibold text-center">Network Tree</p>

                    <div className="flex flex-col">
                        <div className="mb-10 overflow-scroll">
                            <div className="tree w-max mx-auto"><span className="hidden">{leveltwoRef.current = 0 }{levelthreeRef.current = 0 }{levelfourRef.current = 0 }{levelfiveRef.current = 0 }</span>
                                <ul className="flex w-[2000px] lg:w-auto justify-start lg:justify-center">
                                    <li>
                                        <a href="#" className={style.userbox + ' outline-2 outline-sky-700  outline-double'}>
                                            {myUser && (
                                                <>
                                                    <img src={Boolean(myUser.web3imageprofile) ? getImagefromWeb3(myUser.web3imageprofile) : createAwatar(myUser.walletAddress)} alt={myUser.userName} className={style.userprofile} /> 
                                                    {myUser.userName != "Unnamed" && <>{myUser.userName}</>}
                                                    <p>
                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                        <span className="text-sm">
                                                            {myUser.walletAddress.slice(0,4)}...{myUser.walletAddress.slice(-4)}
                                                        </span>
                                                    </p>
                                                </>
                                            )}
                                        </a>
                                        <ul className={style.userul}>
                                            {networkStatus == "success" && networkData.map((person) => (
                                                <li key={person.walletAddress} className={style.userli + ' first:before:!hidden'}>
                                                    <a href={`/user/${person.walletAddress}`} className={style.userbox}>
                                                        <img src={Boolean(person.web3imageprofile) ? getImagefromWeb3(person.web3imageprofile) : createAwatar(person.walletAddress)} alt={person.userName} className={style.userprofile} />
                                                        {/* <span className="hidden">{teamcountRef.current += 1}</span> */}
                                                        {person.userName != "Unnamed" && <>{person.userName}</>}
                                                        <p>
                                                            <BiWallet className="inline-block" fontSize={14}/> 
                                                            <span className="text-sm">
                                                                {person.walletAddress.slice(0,4)}...{person.walletAddress.slice(-4)}
                                                            </span>
                                                        </p>
                                                    </a>
                                                    {Boolean(person.level1Friends) && (
                                                        <ul className={style.userul + `${(Boolean(myUser) && myUser.payablelevel == 1) ? ' pointer-events-none opacity-30': ''}`}>
                                                            {person.level1Friends?.map((level1Friend) => (
                                                            <li key={level1Friend.walletAddress} className={style.userli}>
                                                                <a href={`/user/${level1Friend.walletAddress}`} className={style.userbox}>
                                                                    <img 
                                                                        src={
                                                                            Boolean(level1Friend.web3imageprofile) ? 
                                                                                getImagefromWeb3(level1Friend.web3imageprofile) : 
                                                                                createAwatar(level1Friend.walletAddress)
                                                                            } 
                                                                        alt={level1Friend.userName} 
                                                                        className={style.userprofile} />
                                                                    <span className="hidden">{leveltwoRef.current += 1}</span>
                                                                    {level1Friend.userName != "Unnamed" && <>{level1Friend.userName}</>}
                                                                    <p>
                                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                                        <span className="text-sm">
                                                                            {level1Friend.walletAddress.slice(0,4)}...{level1Friend.walletAddress.slice(-4)}
                                                                        </span>
                                                                    </p>
                                                                </a>
                                                                {Boolean(level1Friend.level2Friends) && (
                                                                    <ul className={style.userul + `${(Boolean(myUser) && myUser.payablelevel == 2) ? ' pointer-events-none opacity-30': ''}`}>
                                                                        {level1Friend.level2Friends?.map((level2Friend) => (
                                                                            <li key={level2Friend.walletAddress} className={style.userli}>
                                                                                <a href={`/user/${level2Friend.walletAddress}`} className={style.userbox}>
                                                                                    <img 
                                                                                        src={
                                                                                            Boolean(level2Friend.web3imageprofile) ? 
                                                                                            getImagefromWeb3(level2Friend.web3imageprofile) : 
                                                                                            createAwatar(level2Friend.walletAddress)
                                                                                        }
                                                                                        alt={level2Friend.userName}
                                                                                        className={style.userprofile} />
                                                                                    <span className="hidden">{levelthreeRef.current += 1}</span>
                                                                                    {level2Friend.userName != "Unnamed" && <>{level2Friend.userName}</>}
                                                                                    <p>
                                                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                                                        <span className="text-sm">
                                                                                            {level2Friend.walletAddress.slice(0,4)}...{level2Friend.walletAddress.slice(-4)}
                                                                                        </span>
                                                                                    </p>
                                                                                </a>
                                                                                {Boolean(level2Friend.level3Friends) && (
                                                                                    <ul className={style.userul + `${(Boolean(myUser) && myUser.payablelevel == 3) ? ' pointer-events-none opacity-30': ''}`}>
                                                                                        {level2Friend.level3Friends?.map((level3Friend) => (
                                                                                            <li key={level3Friend.walletAddress} className={style.userli}>
                                                                                                <a href={`/user/${level3Friend.walletAddress}`} className={style.userbox}>
                                                                                                    <img 
                                                                                                        src={
                                                                                                            Boolean(level3Friend.web3imageprofile) ? 
                                                                                                            getImagefromWeb3(level3Friend.web3imageprofile) : 
                                                                                                            createAwatar(level3Friend.walletAddress)
                                                                                                        } 
                                                                                                        alt={level3Friend.userName} 
                                                                                                        className={style.userprofile} />
                                                                                                    <span className="hidden">{levelfourRef.current += 1}</span>
                                                                                                    {level3Friend.userName != "Unnamed" && <>{level3Friend.userName}</>}
                                                                                                    <p>
                                                                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                                                                        <span className="text-sm">
                                                                                                            {level3Friend.walletAddress.slice(0,4)}...{level3Friend.walletAddress.slice(-4)}
                                                                                                        </span>
                                                                                                    </p>
                                                                                                </a>
                                                                                                {Boolean(level3Friend.level4Friends) && (
                                                                                                    <ul className={style.userul + `${(Boolean(myUser) && myUser.payablelevel == 4) ? ' pointer-events-none opacity-30': ''}`}>
                                                                                                        {level3Friend.level4Friends?.map((level4Friend) => (
                                                                                                            <li key={level4Friend.walletAddress} className={style.userli}>
                                                                                                                <a href={`/user/${level4Friend.walletAddress}`} className={style.userbox}>
                                                                                                                    <img 
                                                                                                                        src={
                                                                                                                            Boolean(level4Friend.web3imageprofile) ? 
                                                                                                                            getImagefromWeb3(level4Friend.web3imageprofile) : 
                                                                                                                            createAwatar(level4Friend.walletAddress)
                                                                                                                        } 
                                                                                                                        alt={level4Friend.userName} 
                                                                                                                        className={style.userprofile} />
                                                                                                                    <span className="hidden">{levelfiveRef.current += 1}</span>
                                                                                                                    {level4Friend.userName != "Unnamed" && <>{level4Friend.userName}</>}
                                                                                                                    <p>
                                                                                                                        <BiWallet className="inline-block" fontSize={14}/> 
                                                                                                                        <span className="text-sm">
                                                                                                                            {level4Friend.walletAddress.slice(0,4)}...{level4Friend.walletAddress.slice(-4)}
                                                                                                                        </span>
                                                                                                                    </p>
                                                                                                                </a>
                                                                                                                {/* {Boolean(level4Friend.level5Friends) && (
                                                                                                                    <ul className={style.userul}>
                                                                                                                        {level4Friend.level5Friends?.map((level5Friend) => (
                                                                                                                        <li key={level5Friend.walletAddress}>
                                                                                                                                <a href={`/user/${level5Friend.walletAddress}`} className={style.userbox}>
                                                                                                                                    {level5Friend.userName != "Unnamed" ? level5Friend.userName : (<>{level5Friend.walletAddress.slice(0,4)}...{level5Friend.walletAddress.slice(-4)}</>)}
                                                                                                                                <span>test</span>
                                                                                                                                </a>
                                                                                                                                
                                                                                                                        </li>
                                                                                                                        ))}
                                                                                                                    </ul>
                                                                                                                )} */}
                                                                                                            </li>
                                                                                                        ))}
                                                                                                    </ul>
                                                                                                )}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-sm">Commissions from Grayed out networks will get unlocked once high value NFTs are purchased from any of Nuva NFT's collections. <a href="/user/0x9cB0b5Ba3873b4E4860A8469d66998059Af79eA6">Click here to check the collections.</a></p>
                    <div className={style.container}>
                        <div className="relative">
                            <p className="font-semibold text-center mb-5">Referral Bonuses</p>
                            <div className={style.tablewrapper}>
                                <table className={style.table}>
                                    <thead className="relative">
                                        <tr className="sticky top-0">
                                            <th className={style.tableheader}>SNo</th>
                                            <th className={style.tableheader}>Date</th>
                                            <th className={style.tableheader}>Transaction Id</th>
                                            <th className={style.tableheader}>Amount</th>
                                            <th className={style.tableheader}>From User</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referralPaymentStatus == "success" && referralPaymentData.map((refdata, index) => (
                                            <tr key={refdata._id}>
                                                <td className={style.tablecell}>{index + 1}</td>
                                                <td className={style.tablecell}><Moment fromNow>{refdata._createdAt}</Moment></td>
                                                <td className={style.tablecell}>
                                                    <a href={`${chainExplorer[97]}tx/${refdata.txid}`} target="_blank" className="p-2 hover:bg-slate-600/20 rounded-lg">
                                                        {refdata.txid.slice(0,5)}...{refdata.txid.slice(-5)}
                                                    </a>
                                                </td>
                                                <td className={style.tablecell}><IconBNB/>{refdata.amount}</td>
                                                <td className={style.tablecell}>{refdata.referee._ref}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            ): ''}
        </div>
        <Footer/>
    </div>
  )
}

export default referrals