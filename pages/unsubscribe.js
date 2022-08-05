import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { config } from '../lib/sanityClient'
import axios from 'axios'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper:
    ' max-w-[1000px] mx-auto mt-[4rem] p-[2rem] pb-[4rem] rounded-xl text-center',
  pageBanner: 'py-[4rem] mb-[2rem]',
  pageTitle: 'text-4xl text-center text-black font-bold my-4 textGradBlue',
  button:
    'flex gap-2 items-center justify-center gradBlue rounded-lg cursor-pointer p-1 m-3 ease-linear transition mx-auto',
}
const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const unsubscribe = () => {
  const { dark } = useThemeContext()
  const router = useRouter()
  const email = router.query.email

  async function unsubscribeThisEmail(
    e,
    sanityclient = config,
    toastHandler = toast
  ) {
    if (!email) {
      toastHandler.error(
        'Email not provided for unsubscribing.',
        errorToastStyle
      )
      return
    }
    const query = `*[_type == "subscribers" && email=="${email}"]`
    const res = await sanityclient.fetch(query)

    if (res.length == 0) {
      toastHandler.error('User not found to unsubscribe.', errorToastStyle)
      return
    }

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
        <button
          className={style.button}
          onClick={() => unsubscribeThisEmail(email)}
        >
          <span className="rounded-full p-3 px-6 text-white">Unsubscribe</span>
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default unsubscribe
