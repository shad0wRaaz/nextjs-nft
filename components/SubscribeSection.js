import Image from 'next/image'
import toast from 'react-hot-toast'
import { config } from '../lib/sanityClient'
import dropimage from '../assets/pandadrop.png'
import { useThemeContext } from '../contexts/ThemeContext'
import { useState } from 'react'
import axios from 'axios'


const style = {
    wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] mt-0',
    container: 'text-white browseWrapper p-[4rem] rounded-3xl ',
    title: `font-bold text-[2rem] flex justify-between items-center text-center mb-[2rem]`,
    contentWrapper:
      'flex justify-center items-center flex-row flex-nowrap gap-[20px]',
    content:
      'bg-white p-[30px] rounded-xl flex justify-center flex-col items-center',
    contentTitle: 'text-lg font-bold mb-2',
    contentDescription: 'text-md px-[25px]',
    collectionCard: 'm-[20px]  hover:opacity-90',
    collectionCardName: 'font-bold cursor-pointer p-4 pl-0 flex gap-3',
    imageContainer: 'h-[160px] w-[215px] rounded-3xl overflow-hidden relative',
    controls: 'flex gap-4 text-slate-500 cursor-pointer transition',
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
    const {dark} = useThemeContext()
    const [subscriberEmail, setSubscriberEmail] = useState('')

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
                emailBody: `<html>You will now be notified for any upcoming NFT Drops. <br/><br/><a href='http://localhost:3000/unsubscribe?email=${subscriberEmail}'>Click here to unsubscribe</a></html>`,
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
                <h2 className="font-semibold text-4xl">Never miss a drop!</h2>
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
                        placeHolder="Enter your email"
                        value={subscriberEmail}
                        onChange={(e) => setSubscriberEmail(e.target.value)}
                    />
                    <button className="flex items-center justify-center rounded-full !leading-none disabled:bg-opacity-70 bg-sky-600 hover:bg-sky-700 text-neutral-50 absolute transform top-1/2 -translate-y-1/2 right-1  w-9 h-9  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 dark:focus:ring-offset-0" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
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