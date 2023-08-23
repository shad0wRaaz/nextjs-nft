import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { CgReadme } from 'react-icons/cg'
import { config } from '../lib/sanityClient'
import nuvanftLogo from '../assets/nuvanft.png'
import toast, { Toaster } from 'react-hot-toast'
import { BsArrowRightShort } from 'react-icons/bs'
import { HiOutlineNewspaper } from 'react-icons/hi'
import { BiGroup, BiHelpCircle } from 'react-icons/bi'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconArbitrum, IconAvalanche, IconBNB, IconEthereum, IconPolygon } from './icons/CustomIcons'
import { FaFacebookF, FaTelegramPlane, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok } from 'react-icons/fa'



const Footer = () => {
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const addSubscriber = async (
    e,
    sanityClient = config,
    toastHandler = toast
  ) => {
    if (subscriberEmail.length === 0) {
      toastHandler.error(
        'Enter your email address to subscribe to our newsletter.',
        errorToastStyle
      )
      return
    }
    //check for correct email address format
    const pattern =
      /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g
    const res = pattern.test(subscriberEmail)

    if (res === false) {
      toastHandler.error('Incorrect email address.', errorToastStyle)
      return
    }

    //check if subscriber is already present
    const subsriberExists = await sanityClient.fetch(
      `*[_type == "subscribers" && email == "${subscriberEmail}"]`
    )
    if (subsriberExists.length > 0) {
      toastHandler.error(
        'You are already subscribed. Thank you for taking an interest in us.',
        errorToastStyle
      )
      return
    }
    // const query = `*[_type == "subscriber"]`
    const subscriberDoc = {
      _type: 'subscribers',
      email: subscriberEmail,
    }

    const result = await sanityClient
      .create(subscriberDoc)
      .then((res) => {
        axios.post('/api/email', {
          email: subscriberEmail,
          subjectText: 'Nuva NFT Newsletter Subscription',
          emailBody: `<html>You have subscribed to Nuva Nft Newsletter. <a href='http://nuvanft.io/unsubscribe?email=${subscriberEmail}'>Click here to unsubscribe</a></html>`,
        })
        toastHandler.success(
          'Thank you for subscribing our newsletter.',
          successToastStyle
        )
        setSubscriberEmail('')
      })
      .catch((err) => {
        toastHandler.error(err.message, errorToastStyle)
      })
  }

  const style = {
    partnerContainer:
      'container mx-auto bg-neutral-50 border-t border-neutral-200 p-[50px] text-center partnerContainer mt-[80px]',
    bottomWrapper: 'container mx-auto lg:p-[8rem] lg:pb-0 p-[0rem]  pb-0 mt-0',
    bottomContainer:
      'm-auto justify-between flex flex-wrap container px-[1.2rem] gap-4',
    footerContainer:
      'm-auto mt-4 justify-between flex flex-wrap container py-[2rem] px-[1.2rem] border-t flex-col md:flex-row',
    header: `text-lg mb-3 inline-flex items-center gap-1 mt-[40px] text-[${dark ? '#fff': '#1d1d1f'}]`,
    text: '',
    leftBox: 'lg:max-w-[30%] sm:max-w-[300px]',
    socialWrapper: 'flex flex-wrap gap-3',
    socialItem:
      'socialicon cursor-pointer rounded-md p-[7px] flex justify-center items-center',
    copyright: 'text-sm text-center',
    footerLinksWrapper: 'flex gap-3 mt-3 md:mt-0 flex-col md:flex-row justify-center items-center',
    footerLinks: 'transition linear text-sm hover:text-sky-500 text-xs justify-center md:justify-end',
    subscribeWrapper: 'flex m-3 ml-0 gap-3 flex-col md:flex-row flex-wrap',
    subscribe: 'rounded-[10px] p-3 flex-auto focus:ring-0 focus:outline-none',
    subscribeButton:
      'transition linear rounded-[10px] p-3 px-6 gradBlue text-white sm:w-full lg:w-auto',
  }

  return (
    <div className={`${dark ? 'darkNavy': 'bg-neutral-100'}` + ' relative z-0'}>
      <Toaster position="bottom-right" reverseOrder={false} />
      {/* <div className={style.bottomContainer}>
        <h2 className={style.header}>Partners</h2>
      </div> */}
      <div
        className={style.bottomWrapper}
        style={{ marginTop: '120px', paddingTop: '40px' }}
      >
        <div className={style.bottomContainer}>
          <div>
            <h2 className={style.header}><BiHelpCircle/> Information</h2>
            {/* <div className="flex flex-col gap-3 text-sm">
              <p><a href="https://goerlifaucet.com/" target="_blank" className="hover:text-sky-500 transition"><IconEthereum/>Ethereum (Goerli)</a></p>
              <p><a href="https://testnet.bnbchain.org/faucet-smart" target="_blank" className="hover:text-sky-500 transition"><IconBNB/>Binance Smartchain (Testnet)</a></p>
              <p><a href="https://mumbaifaucet.com/" target="_blank" className="hover:text-sky-500 transition"><IconPolygon/>Polygon (Mumbai)</a></p>
              <p><a href="https://faucet.avax.network/" target="_blank" className="hover:text-sky-500 transition"><IconAvalanche/>Avalanche (Avalanche-Fuji)</a></p>
            </div> */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href="/blogs/whatarenfts" className="hover:text-sky-500 transition">What are NFTs?</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href="/blogs/nfttypes" className="hover:text-sky-500 transition">NFT Types</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href="/blogs/nftterms" className="hover:text-sky-500 transition">NFT Terms</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href="/blogs/loyalty-reward" className="hover:text-sky-500 transition">Loyalty Reward</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href="/blogs/royalty-reward" className="hover:text-sky-500 transition">Royalty Reward</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href="/blogs/shared-platform-fee" className="hover:text-sky-500 transition">Platform Fee Reward</a></div>
            </div>
          </div>

          <div className={style.RightBox}>
            <h2 className={style.header}><CgReadme/> Tutorials</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href={'/tutorials/getstarted'} className="hover:text-sky-500 transition">How to get started?</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href={'/tutorials/getstarted'} className="hover:text-sky-500 transition">Create a Crypto Wallet</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href={'/tutorials/getstarted'} className="hover:text-sky-500 transition">Mint/Buy Sell NFTs</a></div>
              <div className="flex items-center"><BsArrowRightShort fontSize={20}/><a href={'/tutorials/getstarted'} className="hover:text-sky-500 transition">Create/Edit Collections</a></div>
            </div>
            
          </div>

          <div className={style.leftBox}>
            <h2
              className={style.header}>
              <HiOutlineNewspaper/> Get Testing Tokens
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center">
                <BsArrowRightShort fontSize={20}/>
                <a href="https://goerlifaucet.com/" target="_blank" className="hover:text-sky-500 transition mr-2">Ethereum</a>
                <IconEthereum/>
              </div>
              <div className="flex items-center">
                <BsArrowRightShort fontSize={20}/>
                <a href="https://testnet.bnbchain.org/faucet-smart" target="_blank" className="hover:text-sky-500 transition mr-2">Binance</a>
                <IconBNB/>
              </div>
              <div className="flex items-center">
                <BsArrowRightShort fontSize={20}/>
                <a href="https://mumbaifaucet.com/" target="_blank" className="hover:text-sky-500 transition mr-2">Polygon</a>
                <IconPolygon/>
              </div>
              <div className="flex items-center">
                <BsArrowRightShort fontSize={20}/>
                <a href="https://www.allthatnode.com/faucet/avalanche.dsrv" target="_blank" className="hover:text-sky-500 transition mr-2">Avalanche</a>
                <IconAvalanche/>
              </div>
              <div className="flex items-center">
                <BsArrowRightShort fontSize={20}/>
                <a href="https://faucet.quicknode.com/arbitrum/goerli" target="_blank" className="hover:text-sky-500 transition mr-2">Arbitrum</a>
                <IconArbitrum/>
              </div>
            </div>
            {/* <p className="text-sm pb-2">
              Join our mailing list to stay in the loop with our newest feature
              releases, NFT drops, and tips and tricks for navigating NuvaNFT.
            </p>
            <div className={style.subscribeWrapper}>
              <input
                type="text"
                className={
                  dark
                    ? style.subscribe +
                      ' border border-sky-400/20 bg-transparent'
                    : style.subscribe
                }
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
              />
              <button className={style.subscribeButton} onClick={addSubscriber}>
                Subscribe
              </button>
            </div> */}
          </div>

          <div className={style.leftBox}>
            <h2 className={style.header}>
              <Image src={nuvanftLogo} alt="Nuva NFT" width="90px" height="55px" />
            </h2>
            <p className="text-sm pb-4">Join our community to keep up to date with our latest work and announcements.</p>
            <div className={style.socialWrapper}>
              <Link href="https://t.me/metanuva">
                <a target="_blank" rel="noopener noreferrer" aria-label='Telegram'>
                  <div className={style.socialItem + ' telegram'}>
                    <FaTelegramPlane color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://twitter.com/nuvacommunity">
                <a target="_blank" rel="noopener noreferrer" aria-label='Twitter'>
                  <div className={style.socialItem + ' twitter'}>
                    <FaTwitter color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.instagram.com/nuva.community/">
                <a target="_blank" rel="noopener noreferrer" aria-label='Instagram'>
                  <div className={style.socialItem + ' instagram'}>
                    <FaInstagram color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.facebook.com/METANUVA">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem + ' facebook'}>
                    <FaFacebookF color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.linkedin.com/company/metanuva/">
                <a target="_blank" rel="noopener noreferrer" aria-label='Linked In'>
                  <div className={style.socialItem + ' linkedin'}>
                    <FaLinkedinIn color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.youtube.com/c/NUVAGAMERSESPORT">
                <a target="_blank" rel="noopener noreferrer" aria-label='Youtube'>
                  <div className={style.socialItem + ' youtube'}>
                    <FaYoutube color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.tiktok.com/@nuvacommunity" aria-label='Tiktok'>
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem + ' tiktok'}>
                    <FaTiktok color={ dark ? 'white' : '#1d1d1f' } fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
            </div>
            <p className="mt-4 text-sm">For Support: <a href="mailto:nuvanft@gmail.com" className="text-sky-600 hover:text-sky-400 transition">nuvanft@gmail.com</a></p>
          </div>

          <div
            className={
              dark
                ? style.footerContainer + ' border-sky-400/20'
                : style.footerContainer + ' border-neutral-200'
            }
            >
            <p className={style.copyright}>&copy; {new Date().getFullYear()} Nuva NFT.</p>
            <div className={style.footerLinksWrapper}>
              <Link href="/blogs/aboutus">
                <a
                  className={
                    dark
                      ? style.footerLinks +
                        ' text-neutral-100'
                      : style.footerLinks + ' text-black'
                  }
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </Link>
              <Link href="/termsandconditions">
                <a
                  className={
                    dark
                      ? style.footerLinks +
                        ' text-neutral-100'
                      : style.footerLinks + ' text-black'
                  }
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>
              </Link>
              <Link href="/privacypolicy">
                <a
                  className={
                    dark
                      ? style.footerLinks +
                        ' text-neutral-100 '
                      : style.footerLinks + ' text-black'
                  }
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </Link>
              <Link href="/cookiespolicy">
                <a
                  className={
                    dark
                      ? style.footerLinks +
                        ' text-neutral-100'
                      : style.footerLinks + ' text-black '
                  }
                  rel="noopener noreferrer"
                >
                  Cookies Policy
                </a>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
      <div
        className={style.bottomWrapper}
        >
        
      </div>
    </div>
  )
}

export default Footer
