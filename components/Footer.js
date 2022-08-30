import Link from 'next/link'
import toast from 'react-hot-toast'
import React, { useState } from 'react'
import { config } from '../lib/sanityClient'
import {
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa'
import axios from 'axios'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  partnerContainer:
    'container mx-auto bg-neutral-50 border-t border-neutral-200 p-[50px] text-center partnerContainer mt-[80px]',
  bottomWrapper: 'container mx-auto lg:p-[8rem] lg:pb-0 p-[2rem]  pb-0 mt-0',
  bottomContainer:
    'm-auto justify-between flex flex-wrap container px-[1.2rem]',
  footerContainer:
    'm-auto justify-between flex flex-wrap container py-[2rem] px-[1.2rem] border-t',
  header: 'font-bold text-lg mb-3',
  text: '',
  leftBox: 'lg:max-w-[50%] sm:max-w-[290px]',
  socialWrapper: 'flex flex-wrap gap-3',
  socialItem:
    'transition linear hover:bg-[#f55d6d] curosr-pointer gradBlue rounded-md p-[7px] flex justify-center items-center',
  copyright: 'text-sm',
  footerLinksWrapper: 'flex gap-3',
  footerLinks: 'transition linear text-sm',
  subscribeWrapper: 'flex m-3 ml-0 gap-3 flex-col md:flex-row',
  subscribe: 'rounded-[10px] p-3 flex-auto focus:ring-0 focus:outline-none',
  subscribeButton:
    'transition linear rounded-[10px] p-3 px-6 gradBlue text-white',
}
const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const Footer = () => {
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const { dark } = useThemeContext()
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
          emailBody: `<html>You have subscribed to Nuva Nft Newsletter. <a href='http://localhost:3000/unsubscribe?email=${subscriberEmail}'>Click here to unsubscribe</a></html>`,
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

  return (
    <div className={`${dark ? 'darkNavy': 'bg-neutral-100'}`}>
      {/* <div className={style.bottomContainer}>
        <h2 className={style.header}>Partners</h2>
      </div> */}
      <div
        className={style.bottomWrapper}
        style={{ marginTop: '120px', paddingTop: '80px' }}
      >
        <div className={style.bottomContainer}>
          <div className={style.leftBox}>
            <h2
              className={
                dark
                  ? style.header + ' text-neutral-200'
                  : style.header + ' text-neutral-600'
              }
            >
              Get Latest Updates
            </h2>
            <p className={style.text}>
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
            </div>
          </div>
          <div className={style.RightBox}>
            <h2 className={style.header}>Join the Community</h2>
            <div className={style.socialWrapper}>
              <Link href="https://t.me/+6qVi9uU9KzY2YzE0">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem}>
                    <FaTelegramPlane color="white" fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://twitter.com/nuvatoken">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem}>
                    <FaTwitter color="white" fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.instagram.com/nuvatoken/">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem}>
                    <FaInstagram color="white" fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.facebook.com/Nuva-Token-106516075262562">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem}>
                    <FaFacebookF color="white" fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.linkedin.com/company/nuvatoken">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem}>
                    <FaLinkedinIn color="white" fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
              <Link href="https://www.youtube.com/c/NUVAGAMERSESPORT">
                <a target="_blank" rel="noopener noreferrer">
                  <div className={style.socialItem}>
                    <FaYoutube color="white" fontSize="1.1rem" />
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={style.bottomWrapper}
        >
        <div
          className={
            dark
              ? style.footerContainer + ' border-sky-400/20'
              : style.footerContainer + ' border-neutral-200'
          }
          >
          <p className={style.copyright}>&copy; 2022 Meta Nuva Ltd.</p>
          <div className={style.footerLinksWrapper}>
            <Link href="/privacypolicy">
              <a
                className={
                  dark
                    ? style.footerLinks +
                      ' text-neutral-100 hover:text-neutral-300'
                    : style.footerLinks + ' text-black hover:text-slate-500 '
                }
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </Link>
            <Link href="/cookiepolicy">
              <a
                className={
                  dark
                    ? style.footerLinks +
                      ' text-neutral-100 hover:text-neutral-300'
                    : style.footerLinks + ' text-black hover:text-slate-500 '
                }
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
