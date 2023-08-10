import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { config } from '../lib/sanityClient'
import { useThemeContext } from '../contexts/ThemeContext'
import Loader from '../components/Loader'

const style = {
  wrapper:
    ' max-w-[1000px] mx-auto mt-[4rem] p-[2rem] pb-[4rem] rounded-xl text-center',
  pageBanner: 'py-[8rem] pb-[4rem] mb-[2rem]',
  pageTitle: 'text-4xl text-center text-black font-bold my-4 textGradBlue',
  inputText: 'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear w-96 text-center',
  button:
    'flex gap-2 items-center justify-center gradBlue rounded-lg cursor-pointer p-1 m-3 ease-linear transition mx-auto',
}

const unsubscribe = () => {
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter()
  const email = router.query.email

  useEffect(() => {
    if(!email) return;
    setUserEmail(email)
  }, [email])

  async function unsubscribeThisEmail(
    e,
    sanityclient = config,
    toastHandler = toast
  ) {
    if (!userEmail) {
      toastHandler.error(
        'Please enter your email address',
        errorToastStyle
      )
      return
    }
    setLoading(true);
    const query = `*[_type == "subscribers"]`
    const res = await sanityclient.fetch(query);

    const allEmails = JSON.parse(res[0].email);

    if(allEmails.find(user => String(user.e).toLowerCase() == String(userEmail).toLowerCase())) {
      const updatedData = allEmails.filter(user => String(user.e).toLowerCase() != String(userEmail).toLowerCase())
      sanityclient
      .patch(res[0]?._id)
      .set({ email: JSON.stringify(updatedData)})
      .commit()
      .then(() => {
        setUserEmail('')
        toastHandler.success(
          'You have been unsubscribed..',
          successToastStyle
        )
      })
      .catch((err) => {
        console.log(err.message)
        toastHandler.error('Error in unsubscribing.', errorToastStyle)
      })

    }else{
      toast.error('User not found', errorToastStyle);
    }
    setLoading(false);
    return;

   

    sanityclient
      .delete(res[0]?._id)
      .then(() => {
        toastHandler.success(
          'You have been unsubscribed from our newsletter.',
          successToastStyle
        )
      })
      .catch((err) => {
        console.log(err.message)
        toastHandler.error('Error in unsubscribing.', errorToastStyle)
      })

    // send out email for notification
    axios.post('/api/email', {
      email: email,
      subjectText: 'Nuva NFT Newsletter Subscription',
      emailBody:
        '<html>Your email has been taken out of our subscription list.</html>',
    })
  }
  return (
    <div className={dark && ' darkBackground text-neutral-100'}>
      <SEO />
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' darkGray'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Feeling to go away from us.</h2>
      </div>
      <div className={style.wrapper}>
        <div className="flex flex-col w-fit justify-center m-auto">
          <span>Enter your email address</span>
          <input type="text" className={style.inputText} value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
        </div>
        <button
          className={style.button}
          onClick={() => unsubscribeThisEmail(email)}
        >
          {loading ? <div className="px-6"><Loader/></div> : <span className="rounded-full p-3 px-6 text-white">Unsubscribe</span>}
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default unsubscribe
