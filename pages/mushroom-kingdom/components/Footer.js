import React from 'react'
import Link from 'next/link'
import discord from '../assets/images/discord.png'
import twitter from '../assets/images/twitter.png'
import youtube from '../assets/images/youtube.png'
import facebook from '../assets/images/facebook.png'
import instagram from '../assets/images/instagram.png'
import tiktok from '../assets/images/tiktok.png'

const Footer = ({ setShowMenu }) => {
  return (
    <footer 
        onClick={() => setShowMenu(false)} className="footer">
        <div className="footer__wrapper alfaslab bg-[#23162c] py-[70px] md:py-[100px] !pb-0" data-aos="fade-up" data-aos-duration="1000">
            <div className="container mx-auto p-8">
                <div className="footer__content text-center">
                    <h2 className="mushroom-kingdom-gradient font-hennypenny">Follow Us!</h2>
                    <p className="font-oregano text-3xl">If two Heads Area Better Than One, 40,000 Heads Should Be Way Better!<br/>Join Our Community.</p>
                    <ul className="social justify-content-center flex justify-center gap-3 mt-8">
                        <li className="social__item transition hover:-translate-y-1"><Link href="https://discord.gg/Zzfqk5bf3F" className="social__link"><a target="_blank" aria-label='Discord'><img src={discord.src} alt="Discord"/></a></Link></li>
                        <li className="social__item transition hover:-translate-y-1"><Link href="https://twitter.com/RewardRendition" className="social__link"><a target="_blank" aria-label='Twitter'><img src={twitter.src} alt="twitter"/></a></Link></li>
                        <li className="social__item transition hover:-translate-y-1"><Link href="https://www.facebook.com/RewardRenditions" className="social__link"><a target="_blank" aria-label='Facebook'><img src={facebook.src} alt="facebook" style={{ height: '60px', width: '60px'}} /></a></Link></li>
                        <li className="social__item transition hover:-translate-y-1"><Link href="https://www.instagram.com/nuva_nft" className="social__link"><a target="_blank" aria-label='Instagram'><img src={instagram.src} alt="instagram"/></a></Link></li>
                        <li className="social__item transition hover:-translate-y-1"><Link href="https://www.youtube.com/@METANUVACOMMUNITY" className="social__link"><a target="_blank" aria-label='Youtube'><img src={youtube.src} alt="youtube"/></a></Link></li>
                        <li className="social__item transition hover:-translate-y-1"><Link href="https://www.tiktok.com/@nuvacommunity" className="social__link"><a target="_blank" aria-label='Tiktok'><img src={tiktok.src} alt="tiktok"/></a></Link></li>
                    </ul>
                </div>
                <div className="footer__copyright">
                    <div className="container mx-auto p-8 pt-[5rem]">
                        <div className="text-center py-4">
                            <p className=" mb-0 text-lg">© 2023 Rewarding Renditions | All Rights Reserved <a href="/" className="text-[#abff87]" target="_blank"> Nuva NFT</a> </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer