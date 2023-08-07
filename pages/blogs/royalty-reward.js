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

const sharedroyalty = () => {
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
        <SEO title="Shared Royalty"/>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' bg-slate-800'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Royalty Reward</h2>
      </div>
      <div className={style.wrapper}>
        <div className="w-full">
            <div className="font-bold text-xl lg:text-3xl flex gap-2 w-full justify-start items-center rounded-lg px-4 py-2 text-left">
                <MdOutlineLoyalty className="inline-block -mt-2" color='#2CC9D7' fontSize={30}/>
                <span className="textGradCyan"> What is Royalty Reward?</span>
            </div>
            <div className="px-4 pb-4 text-sm leading-6">
                <ol className="leading-10 pl-3" style={{'listStyleType': 'lower-alpha'}}>
                    <li>This is the reward which is given to our any users when a NFT is sold in Nuva NFT Marketplace. Nuva NFT provides royalty reward only to the NFT buyers who buys the NFT from selected collections from Nuva NFT Marketplace. </li>
                </ol>
            </div>
            <div className="font-bold text-xl lg:text-3xl flex gap-2 w-full justify-start items-center rounded-lg px-4 py-2 text-left">
                <MdOutlineLoyalty className="inline-block -mt-2" color='#2CC9D7' fontSize={30}/>
                <span className="textGradCyan"> How to get Royalty Rewards?</span>
            </div>
            <div className="px-4 pb-4 text-sm leading-6">
                <ol className="leading-10 space-y-3 pl-3" style={{'listStyleType': 'lower-alpha'}}>
                    <li>You need to buy/mint NFT in Nuva NFT platform from selected collections:
                        <div className="flex flex-wrap gap-1">
                            {collections?.filter(coll => coll.payablelevel >= 2).map(coll => 
                                <Link href={`/collection/${blockchainName[coll.chainId]}/${coll.contractAddress}`} key={coll._id}>
                                    <span className={style.button}>{coll.name}</span>
                                </Link>
                            )}
                        </div>
                    </li>
                    <li>
                        Once you buy NFTs (only those listed by the creator) or mint an NFT from the selected collections, your wallet address will be added to the smart contract of the NFT as 5% royalty receiver.
                    </li>
                    <li>
                        On every resale of the NFT, you will receive 50% from a total of 10% Royalty Reward. No matter where the NFT sale takes place, you will keep on receiving the royalty reward.
                    </li>
                    <li>
                        To check you are the royalty receiver, you can click on the Royalty Receiver address in the NFT page which will reveal your wallet address and the creator wallet address equally sharing the 10% royalty rewards.
                        <br/>
                        <span className="text-slate-400">For an example, if you own an NFT of 100 ETH, 10% will be the royalty which is 10 ETH. 50% of 10 ETH is 5 ETH. That means you will be receiving 5 ETH on the next sale, which is 5% of the total NFT sale value. If the same NFT is sold for 200 ETH next time, you will receive 10 ETH. If again the NFT is sold for 300 ETH, you will be getting 15 ETH. This way, you will be receiving 5% as royalty on every sale.</span>
                    </li>
                </ol>
            </div>

            <div className={`text-sm border-t mt-5 pt-5 ${dark ? 'border-slate-700' : 'border-neutral-200'}`}>
                <p className="text-center w-full font-bold mb-4">More Tutorials</p>
                <div className="flex justify-between gap-4 flex-wrap">
                    <Link href="/blogs/platform-reward">
                        <div className="rounded-lg p-2 px-4 w-full md:w-fit border border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition">
                            <BiChevronLeft className="inline" fontSize={20}/> What is Platform Reward?
                        </div>
                    </Link>
                    <Link href="/blogs/loyalty-reward">
                        <div className="rounded-lg p-2 px-4 w-full md:w-fit border border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition">
                             What is Loyalty Reward? <BiChevronRight className="inline" fontSize={20}/>
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

export default sharedroyalty