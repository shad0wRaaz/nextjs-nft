import axios from 'axios'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useEffect, useState, useRef } from 'react'
import { config } from '../lib/sanityClient'
import ReCAPTCHA from 'react-google-recaptcha'
import dropimage from '../assets/pandadrop.webp'
import { RiArrowRightLine } from 'react-icons/ri'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { saveSubscriber } from '../mutators/SanityMutators'

const style = {
    wrapper: 'container mx-auto lg:p-[8rem] lg:pb-0 p-[3rem]  pb-0 mt-0',
}

const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080' 

const SubscribeSection = () => {
  const { HOST } = useSettingsContext();
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const {dark, errorToastStyle, successToastStyle} = useThemeContext();
  const captchaRef = useRef(null);
  const SITE_KEY = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

  const handleSubscribe = async (e, sanityClient = config, toastHandler = toast) => {
      e.preventDefault();

      if (subscriberEmail.length === 0) {
        toastHandler.error('Enter your email address to subscribe to our upcoming Drop Lisintgs.', errorToastStyle)
        return;
      }

      //check for correct email address format
      const pattern =
        /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g
      const res = pattern.test(subscriberEmail)
  
      if (res === false) {
        toastHandler.error('Incorrect email address.', errorToastStyle)
        return
      }

      //recaptcha test
      // console.log(e)
      const inputVal = await e.target.form[0].value;
      const token = captchaRef.current.getValue();
      if(!token){
        toastHandler.error('Verify you are human by clicking on Google reCaptcha box', errorToastStyle);
        return;
      }

      captchaRef.current.reset();

      const {data: captchaValue} = await axios.post(`${HOST}/api/captchaverify`, {inputVal: inputVal, token: token});

      if(captchaValue != 'Human'){
        toastHandler.error('Bot Found.', errorToastStyle);
        return;
      }


      const savesubs = await saveSubscriber(subscriberEmail);
      if( savesubs == 'duplicate'){
        setSubscriberEmail('');
        toastHandler.error('You are already subscribed to our newsletter.', errorToastStyle);
        return;
      }
      else if(savesubs == 'error'){
        toastHandler.error('Error in saving subscriber', errorToastStyle);
        return;
      }else {
        setSubscriberEmail('');
        toastHandler.success('Your email address has been added in our newsletter list.', successToastStyle);
        return;
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
        
        const newsletterLink = "https://www.metanuva.com/Images/NewsLetter/1004.png";

        const result = await sanityClient
          .create(subscriberDoc)
          .then((res) => {
            axios.post('/api/email', {
              email: subscriberEmail,
              subjectText: 'Meta Nuva Newsletter',
              emailBody: `<div style="max-width: 600px; margin: auto; font-family: 'Montserrat', sans-serif; padding: 30px">
              <p style="text-align: right; padding-right: 40px;"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/logo-transparent-2.png" style="width: 150px"/></p>
              <div style="padding-top: 0; font-size: 1rem; line-height: 30px; color: #000000 !important;">
                <p>Dear Member,</p>
                <p>Here at Meta Nuva we hold many values dear to us, and effective communication is one of them. There are many ways that we endeavour to support you and keep you informed of all of the latest news and information. We are therefore incredibly proud to share with you our latest member's newsletter.</p>
                <p>With the passing of yet another month, we trust this helps you to reflect upon last month and make strong and achievable goals for the month ahead.</p>
                <p>We hope that you, like us are excited about not only what we offer now to our community, but also what is coming in the future - by sharing our vision, we will be sharing our dreams and desires with you.</p>
                <p>Thank you for being the valued member of Meta Nuva that you are. Please click the button below to open your newsletter.</p>
                <div style="display: flex; justify-content: center; justify-content: center">
                  <p style="background: #0a66c2; color: #ffffff; width: max-content; font-weight: 700; font-size: 15px; padding: 10px 40px; border-radius: 50px;">
                      <a href="${newsletterLink}" target="_blank" style="color: #ffffff; text-decoration: none;">Read Newsletter</a>
                  </p>
                </div>
              </div>
              
              
              <p><b>Best Regards,<br/>Meta Nuva Team</b></p>
              <img src="https://nuvatoken.com/wp-content/uploads/2023/03/mail-three.png" style="width:300px; padding-top: 40px;"/>
                
              <p style="font-style: italic; font-weight: 400; font-size: 13px; padding: 0 10px;">This email and any attachments to it may be confidential and are intended solely for the use of the individual to whom it is addressed. Any views or opinions expressed are solely those of the author and do not necessarily represent those of Meta Nuva. Please disregard this email if you have received it by mistake or were not expecting it.</p>
                <div class="socials" style="padding: 40px;">
                  <p style="text-align: center"><a href="https://linktr.ee/metanuva" target="_blank"><img src="https://nuvatoken.com/wp-content/uploads/2022/12/WhatsApp-Image-2022-11-25-at-16.54.35-300x300.jpeg" style="width: 100px;"/></a></p>
                  <div class="icons" style="display: flex; justify-content: center; align-items: center;">
                      <a href="https://t.me/metanuva" title="Telegram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tl.png" style="width: 32px; margin:0 5px"/></a>
                      <a href="https://twitter.com/nuvacommunity" title="twitter" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/tw.png" style="width: 32px; margin:0 5px"/></a>
                      <a href="https://www.facebook.com/METANUVA" title="facebook" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/fb.png" style="width: 32px; margin:0 5px"/></a>
                      <a href="https://www.youtube.com/c/NUVAGAMERSESPORT" title="Youtube" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/yt.png" style="width: 32px; margin:0 5px"/></a>
                      <a href="https://www.instagram.com/nuva.community/" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/ig.png" style="width: 32px; margin:0 5px"/></a>
                      <a href="https://www.linkedin.com/company/nuvatoken" title="Instagram" target="_blank" class="social-list__link"><img src="https://nuvatoken.com/wp-content/uploads/2023/03/li.png" style="width: 32px; margin:0 5px"/></a>
                  </div>
                </div>
            </div>
            <br/><br/><p style="text-align: center"><a href='${HOST}/unsubscribe?email=${subscriberEmail}'>Click here to unsubscribe</a></p>`,
            })
            toastHandler.success(
              'Your email address has been added in our newsletter list.',
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
                <h2 className="font-semibold text-5xl textGradBlue2 leading-normal">Subscribe for Updates</h2>
                <span className="block mt-5 text-sm">Subcribe to our super-exclusive newsletter subscription and be the first to get updated with latest news, build ups, ecosystem developments, etc.</span>
                <ul className="space-y-4 mt-10 hidden">
                    <li className="flex items-center space-x-4">
                        <span className="nc-Badge inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-blue-800 bg-blue-100  relative">01</span>
                        <span className="font-medium">Get updated with latest news and build ups.</span>
                    </li>
                    <li className="flex items-center space-x-4">
                        <span className="nc-Badge inline-flex px-2.5 py-1 rounded-full font-medium text-xs text-red-800 bg-red-100  relative">02</span>
                        <span className="font-medium">Get rewards</span>
                    </li>
                </ul>
                <form className="mt-10 relative max-w-sm space-y-3">
                    <input 
                        type="email" 
                        className={`block w-full md:max-w-[305px] border focus:ring-none ${dark ? ' border-slate-600 bg-slate-700' : 'bg-white border-neutral-200 focus:ring-0 focus:border-0 outline-0 '} rounded-xl text-sm font-normal h-11 px-4 py-3`}
                        required=""  
                        placeholder="Enter your email"
                        value={subscriberEmail}
                        onChange={(e) => setSubscriberEmail(e.target.value)}
                    />
                     <ReCAPTCHA
                      sitekey={SITE_KEY} 
                      ref={captchaRef}/>
                    <button onClick={handleSubscribe} 
                      className="w-full md:max-w-[305px] flex items-center justify-center rounded-xl !leading-none disabled:bg-opacity-70 gradBlue text-neutral-50 p-4" type="button">
                        Subscribe
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