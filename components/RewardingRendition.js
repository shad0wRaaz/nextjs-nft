import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useThemeContext } from '../contexts/ThemeContext'
import neon from '../pages/rewarding-renditions/assets/images/neon.png'
import artifacts from '../pages/rewarding-renditions/assets/images/artifacts.png'
import bannerbg from '../pages/rewarding-renditions/assets/images/banner-bg.webp'
import fierymonkey from '../pages/rewarding-renditions/assets/images/fierymonkey.png'
import rockycelestial from '../pages/rewarding-renditions/assets/images/rockycelestial.png'
import { TbSquareRoundedNumber2, TbSquareRoundedNumber3, TbSquareRoundedNumber4, TbSquareRoundedNumber5 } from 'react-icons/tb'

const RewardingRendition = () => {
    const { dark } = useThemeContext();
    const style = {
        wrapperContainer: 'rewardingrenditions text-center bg-center bg-top md:bg-center md:bg-cover z-0 relative',
        wrapper: 'container mx-auto lg:p-[8rem] lg:pt-[4rem] p-[2rem]',
        title: 'font-bold mb-[0.5rem] grow text-center flex flex-col md:flex-row justify-center items-center gap-2 text-white text-[3rem]',
        subtitle: 'mb-[4rem]',
        collectionWrapper:
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 gap-5 mt-[7rem]',
        collection:
          `cursor-pointer mb-[4rem] md:mb-0 hover:scale-125 hover:z-50 backdrop-blur-md relative w-full py-4 px-[1rem] flex justify-start rounded-3xl transition duration-300 h-[430px] ${dark ? 'bg-slate-800/70' : 'bg-white/70 shadow-md'}`,
        productBackground: 'absolute overflow-hidden top-0 left-0 w-full h-[200px] bg-slate-500 rounded-t-3xl -z-1',
        orange: ' bg-gradient-to-br from-[#FA762F] to-[#F75136] duration-100',
        neon: ' bg-gradient-to-br from-[#C025D0] to-[#DA2678] duration-150',
        apple: ' bg-gradient-to-br from-[#1FC25D] to-[#15813E] duration-200',
        flamingo: ' bg-gradient-to-br from-[#397FF5] to-[#1D4CD4] duration-250',
        imageContainer:
          'bg-[#eeeeee] mr-[1rem] rounded-full relative h-[60px] w-[60px] overflow-hidden',
        collectionDescriptionContainer: 'flex flex-col',
        collectionTitle: 'font-bold text-lg text-left',
        productImage: 'absolute -top-[4rem] left-[2.5rem] z-20',
        bigtext: 'absolute font-bold text-8xl -rotate-45 bottom-0 -left-[5rem]  left-0 z-10 opacity-10 text-black',
        productDescriptionBox: 'pt-[200px] w-full',
        nftCount : 'text-xs text-left rounded-md bg-white w-fit py-1 px-2 mt-2',
        unilevelInfo: 'text-left mt-2 text-sm flex gap-2 items-center',
        buyButton: 'rounded-lg p-2 px-3 text-sm font-bold mt-4 animate-pulse',
        readMore: 'rounded-full gradBlue py-4 px-8 font-bold',
      }

  return (
    <div className={style.wrapperContainer} style={{ backgroundImage: `url(${bannerbg.src})`}} id='rewardingrenditions'>
        <div className={style.wrapper}>
            <a name="rewardingrendition">&nbsp;</a>
            <div className="flex-between flex flex-col md:flex-row items-center relative z-10">
                <h2 className={style.title}>
                    <Link href="/rewarding-renditions">
                        <span className="textGradPink cursor-pointer">
                            Rewarding Renditions
                        </span>
                    </Link>
                </h2>
            </div>
            <div className="">Nuva NFT's exclusive 4 sets of NFT Collections which allows the holders to earn from the Unilevel network, get shared Royalty Fee on every sale, get shared Platform fees and occasional BNB Airdrops.</div>

            <div className={style.collectionWrapper}>
                <Link href="/collection/binance/crypto_creatures">
                    <div className={style.collection}>
                            <div className={style.productImage}>
                                <Image src={fierymonkey.src} height="200px" width="200px" objectFit='fit'/>
                            </div>
                        <div className={style.productBackground + style.orange}>
                            <div className={style.bigtext}>
                                CRYPTO
                            </div>
                        </div>
                        <div className={style.productDescriptionBox}>
                            <p className={style.collectionTitle}>Crypto Creatures</p>
                            <p className={style.nftCount + style.orange}>5,000 NFTs</p>
                            <p className={style.unilevelInfo}>Unilevel Access: <TbSquareRoundedNumber2 fontSize={25} /> </p>
                            <p className="text-left text-sm mt-2">Earn from 10% Direct + 8% Indirect<br/><br/></p>
                            <button className={style.buyButton + style.orange}>
                                    View Collection
                            </button>
                        </div>
                    </div>
                </Link>
                <Link href="/collection/binance/neon_dreams">
                    <div className={style.collection}>
                            <div className={style.productImage}>
                                <Image src={neon.src} height="200px" width="200px" objectFit='fit'/>
                            </div>
                        <div className={style.productBackground + style.neon}>
                            <div className={style.bigtext}>
                                NEONDR
                            </div>
                        </div>
                        <div className={style.productDescriptionBox}>
                            <p className={style.collectionTitle}>Neon Dreams</p>
                            <p className={style.nftCount + style.neon}>5,000 NFTs</p>
                            <p className={style.unilevelInfo}>Unilevel Access: <TbSquareRoundedNumber3 fontSize={25} /> </p>
                            <p className="text-left text-sm mt-2">Earn from 10% Direct + (8% + 6%) Indirect</p>
                            <button className={style.buyButton + style.neon}>
                                    View Collection
                            </button>
                        </div>
                    </div>
                </Link>
                <Link href="/collection/binance/celestial_beings">
                    <div className={style.collection}>
                            <div className={style.productImage}>
                                <Image src={rockycelestial.src} height="200px" width="200px" objectFit='fit'/>
                            </div>
                        <div className={style.productBackground + style.flamingo}>
                            <div className={style.bigtext}>
                                CELEST
                            </div>
                        </div>
                        <div className={style.productDescriptionBox}>
                            <p className={style.collectionTitle}>Celestial Beings</p>
                            <p className={style.nftCount + style.flamingo}>10,000 NFTs</p>
                            <p className={style.unilevelInfo}>Unilevel Access: <TbSquareRoundedNumber4 fontSize={25} /> </p>
                            <p className="text-left text-sm mt-2">Earn from 10% Direct + (8% + 6% + 5%) Indirect</p>
                            <button className={style.buyButton + style.flamingo}>
                                    View Collection
                            </button>
                        </div>
                    </div>
                </Link>
                <Link href="/collection/binance/artifacts_of_the_future">
                    <div className={style.collection}>
                            <div className={style.productImage}>
                                <Image src={artifacts.src} height="200px" width="200px" objectFit='fit'/>
                            </div>
                        <div className={style.productBackground + style.apple}>
                            <div className={style.bigtext}>
                                ARTIFA
                            </div>
                        </div>
                        <div className={style.productDescriptionBox}>
                            <p className={style.collectionTitle}>Artifacts of the Future</p>
                            <p className={style.nftCount + style.apple}>20,000 NFTs</p>
                            <p className={style.unilevelInfo}>Unilevel Access: <TbSquareRoundedNumber5 fontSize={25} /> </p>
                            <p className="text-left text-sm mt-2">Earn from 10% Direct + (8% + 6% + 5% + 5%) Indirect</p>
                            <button className={style.buyButton + style.apple}>
                                    View Collection
                            </button>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="flex justify-center mt-[3rem] z-100">
                <Link href="/rewarding-renditions">
                    <button className={style.readMore}>Learn about Rewarding Renditions</button>
                </Link>
            </div>

        </div>
    </div>
  )
}

export default RewardingRendition