import Link from 'next/link'
import SEO from '../../components/SEO'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { config } from '../../lib/sanityClient'
import { MdOutlineLoyalty } from 'react-icons/md'
import { useThemeContext } from '../../contexts/ThemeContext'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { useSettingsContext } from '../../contexts/SettingsContext'

const loyaltyreward = () => {
    const { dark } = useThemeContext();
    const [collections, setCollections] = useState();
    const { blockchainName } = useSettingsContext();
    const style = {
        wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-4 lg:pb-0 max-w-5xl',
        pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
        pageTitle: 'text-4xl font-bold text-center text-white',
        section: 'p-2 lg:p-8 mb-8 rounded-xl border-sky-700/30 border transition',
        header: 'font-bold text-lg lg:text-xl mb-2 ',
        table: `rounded-3xl border ${dark ? 'border-slate-700' : 'border-neutral-100'} w-[56] p-4 mt-4`,
        tableRow: `flex gap-4 flex-col md:flex-row items-center border-b ${dark ? 'border-slate-700' : 'border-neutral-100'} p-8`,
        tableColFirst: 'w-full md:w-[100px] md:min-w-[100px] text-center font-bold',
        anothertableColFirst: 'w-full md:w-[250px] md:min-w-[250px] text-center font-bold',
        tableColSecond: 'grow',
        button: 'text-white rounded-md border border-sky-700/40 p-1 px-2 text-sm bg-sky-900/60 hover:bg-sky-900/90 cursor-pointer whitespace-nowrap',
      }
    
    useEffect(() => {
        ;(async () => {
            const query = '*[_type == "settings"]{ referralcollections[]-> }';
            const res = await config.fetch(query);
            if(res[0]){
                const allCollections = res[0].referralcollections;
                const allowedChainIds = ['1', '56', '137', '43114', '42161'];
                const liveCollections = allCollections.filter(coll => allowedChainIds.includes(String(coll.chainId)))
                setCollections(liveCollections);
            }
            return res[0];  
        })()
       
        return () => {}
    }, [])

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
        <SEO title="Loyalty Reward"/>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' bg-slate-800'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Loyalty Reward</h2>
      </div>
      <div className={style.wrapper}>
        <div className="w-full">
            <div className="font-bold text-xl lg:text-3xl flex gap-2 w-full justify-start items-center rounded-lg px-4 py-2 text-left">
                <MdOutlineLoyalty className="inline-block -mt-2" color='#2CC9D7' fontSize={30}/>
                <span className="textGradCyan"> What is Loyalty Reward?</span>
            </div>
            <div className="px-4 pb-4 text-sm leading-6">
                <ol className="leading-10 pl-3" style={{'listStyleType': 'lower-alpha'}}>
                    <li>This is the reward which is given to our loyal users when a NFT is sold in Nuva NFT Marketplace. Nuva NFT provides loyalty rewards upto 5 levels. </li>
                </ol>
            </div>
            <div className="font-bold text-xl lg:text-3xl flex gap-2 w-full justify-start items-center rounded-lg px-4 py-2 text-left">
                <MdOutlineLoyalty className="inline-block -mt-2" color='#2CC9D7' fontSize={30}/>
                <span className="textGradCyan"> How to get Loyalty Rewards?</span>
            </div>
            <div className="px-4 pb-4 text-sm leading-6">
                <ol className="leading-10 space-y-3 pl-3" style={{'listStyleType': 'lower-alpha'}}>
                    <li>You need to have at least one user whom you had invited in Nuva NFT to join via your invite link (can be found in <span className={style.button}>Profile Page</span>), and once the user makes a purchase you will be rewarded 10% of the purchased NFT value straightaway. You will be rewarded in same currency in which the NFT is in. e.g. If the user purchased an NFT in Binance chain, your reward will be in BNB.</li>
                    <li>You can invite as many users as you like. There are no restrictions in it. All the users you invite are your direct referrals.</li>
                    <li>If your direct referrals also invite new users, the new users will be your 2<sup>nd</sup> level referrals. If your 2<sup>nd</sup> level referrals makes a NFT purchase, you will receive 8% of the NFT price, while the user by whom the NFT purchaser is referred by, will receive 10% of the NFT price. To get loyalty from your 2<sup>nd</sup> level referrals, you need to own at least one NFT from either from these collections:
                        <div className="flex flex-wrap gap-1">
                            {collections?.filter(coll => coll.payablelevel >= 2).map(coll => 
                                <Link href={`/collection/${blockchainName[coll.chainId]}/${coll.contractAddress}`} key={coll._id}>
                                    <span className={style.button}>{coll.name}</span>
                                </Link>
                            )}
                        </div>
                    </li>
                    <li>If your 2<sup>nd</sup> referrals also invite new users, the new users will be your 3<sup>rd</sup> level referrals. If your 3<sup>rd</sup> level referrals makes a NFT purchase, you will receive 6% of the NFT price, while the user by whom the NFT purchaser is referred by, will receive 10% of the NFT price. To get loyalty from your 3<sup>rd</sup> level referrals, you need to own at least one NFT from either from these collections:
                        <div className="flex flex-wrap gap-1">
                            {collections?.filter(coll => coll.payablelevel >= 3).map(coll => 
                                <Link href={`/collection/${blockchainName[coll.chainId]}/${coll.contractAddress}`} key={coll._id}>
                                    <span className={style.button}>{coll.name}</span>
                                </Link>
                            )}
                        </div>
                    </li>
                    <li>If your 3<sup>rd</sup> referrals also invite new users, the new users will be your 4<sup>th</sup> level referrals. If your 4<sup>th</sup> level referrals makes a NFT purchase, you will receive 5% of the NFT price, while the user by whom the NFT purchaser is referred by, will receive 10% of the NFT price. To get loyalty from your 4<sup>th</sup> level referrals, you need to own at least one NFT from either from these collections:
                        <div className="flex flex-wrap gap-1">
                            {collections?.filter(coll => coll.payablelevel >= 4).map(coll => 
                                <Link href={`/collection/${blockchainName[coll.chainId]}/${coll.contractAddress}`} key={coll._id}>
                                    <span className={style.button}>{coll.name}</span>
                                </Link>
                            )}
                        </div>
                    </li>
                    <li>If your 4<sup>th</sup> referrals also invite new users, the new users will be your 5<sup>th</sup> level referrals. If your 5<sup>th</sup> level referrals makes a NFT purchase, you will receive 5% of the NFT price, while the user by whom the NFT purchaser is referred by, will receive 10% of the NFT price. To get loyalty from your 5<sup>th</sup> level referrals, you need to own at least one NFT from either from these collections:
                        <div className="flex flex-wrap gap-1">
                            {collections?.filter(coll => coll.payablelevel >= 5).map(coll => 
                                <Link href={`/collection/${blockchainName[coll.chainId]}/${coll.contractAddress}`} key={coll._id}>
                                    <span className={style.button}>{coll.name}</span>
                                </Link>
                            )}
                        </div>
                    </li>
                </ol>
            </div>

            <div className={`text-sm border-t mt-5 pt-5 ${dark ? 'border-slate-700' : 'border-neutral-200'}`}>
                <p className="text-center w-full font-bold mb-4">More Tutorials</p>
                <div className="flex justify-between gap-4 flex-wrap">
                    <Link href="/blogs/royalty-reward">
                        <div className="rounded-lg p-2 px-4 w-full md:w-fit border border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition">
                            <BiChevronLeft className="inline" fontSize={20}/> What is Royalty Reward?
                        </div>
                    </Link>
                    <Link href="/blogs/platform-reward">
                        <div className="rounded-lg p-2 px-4 w-full md:w-fit border border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition">
                            What is Platform Reward? <BiChevronRight className="inline" fontSize={20}/>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default loyaltyreward