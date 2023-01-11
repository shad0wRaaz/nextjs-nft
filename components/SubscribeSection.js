import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { config } from '../lib/sanityClient'
import dropimage from '../assets/pandadrop.png'
import { useThemeContext } from '../contexts/ThemeContext'

const HOST = (process.env.NODE_ENV == "production") ? 'https://nuvanft.io' : 'http://localhost:3000';

const style = {
    wrapper: 'container mx-auto lg:p-[8rem] lg:pb-0 p-[4rem]  pb-0 mt-0',
}

const errorToastStyle = {
style: { background: '#ef4444', padding: '16px', color: '#fff' },
iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
style: { background: '#10B981', padding: '16px', color: '#fff' },
iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const SubscribeSection = () => {
    const {dark} = useThemeContext();
    const [subscriberEmail, setSubscriberEmail] = useState('');

    const handleSubscribe = async (e, sanityClient = config, toastHandler = toast) => {
        e.preventDefault()
        if (subscriberEmail.length === 0) {
            toastHandler.error(
              'Enter your email address to subscribe to our upcoming Drop Lisintgs.',
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
                subjectText: 'Nuva NFT Drop Subscription',
                emailBody: `<html>Thank you for subscription to our list. You will now be notified for any upcoming NFT Drops. <br/><br/><a href='${HOST}/unsubscribe?email=${subscriberEmail}'>Click here to unsubscribe</a></html>`,
              })
              toastHandler.success(
                'You will now be notified for any upcoming NFT Drops.',
                successToastStyle
              )
              setSubscriberEmail('')
            })
            .catch((err) => {
              toastHandler.error(err.message, errorToastStyle)
            })
    }
  return (
    <div className={style.wrapper}>
        <div className="relative flex flex-col lg:flex-row lg:items-center">
            <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mr-10 lg:w-2/5">
                <h2 className="font-semibold text-5xl textGradBlue2">Never miss a drop!</h2>
                <span className="block mt-5">Subcribe to our super-exclusive drop list and be the first to know about upcoming drops</span>
                <ul className="space-y-4 mt-10">
                    <li className="flex items-center space-x-4">
                        <span className="nc-Badge inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-blue-800 bg-blue-100  relative">01</span>
                        <span className="font-medium">Get more discount</span>
                    </li>
                    <li className="flex items-center space-x-4">
                        <span className="nc-Badge inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-red-800 bg-red-100  relative">02</span>
                        <span className="font-medium">Get premium magazines</span>
                    </li>
                </ul>
                <form className="mt-10 relative max-w-sm" onSubmit={handleSubscribe}>
                    <input 
                        type="email" 
                        className={`block w-full border ${dark ? ' border-slate-600 focus:ring-slate-500 bg-slate-700' : 'bg-white border-neutral-200 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 '} rounded-full text-sm font-normal h-11 px-4 py-3`}
                        required=""  
                        placeholder="Enter your email"
                        value={subscriberEmail}
                        onChange={(e) => setSubscriberEmail(e.target.value)}
                    />
                    <button className="flex items-center justify-center rounded-full !leading-none disabled:bg-opacity-70 bg-blue-600 hover:bg-blue-700 text-neutral-50 absolute transform top-1/2 -translate-y-1/2 right-1  w-9 h-9  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 dark:focus:ring-offset-0" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </button>
                </form>
            </div>
            <div className="flex-grow">
                <div className="relative aspect-square h-[600px] float-right">
                    <Image src={dropimage} objectFit="contain" layout="fill" alt="subscribe"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SubscribeSection