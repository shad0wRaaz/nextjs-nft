import Link from 'next/link';
import {getLocalStorage, setLocalStorage} from '../lib/storageHelper';
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function CookieBanner(){
    const [cookieConsent, setCookieConsent] = useState(null);

    useEffect (() => {
        const storedCookieConsent = getLocalStorage("cookie_consent", null)
        setCookieConsent(storedCookieConsent)
    }, [setCookieConsent])

    
    useEffect(() => {
        const newValue = cookieConsent ? 'granted' : 'denied'

        window.gtag("consent", 'update', {
            'analytics_storage': newValue
        });

        setLocalStorage("cookie_consent", cookieConsent)

        //For Testing
        // console.log("Cookie Consent: ", cookieConsent)

    }, [cookieConsent]);


    return (
        <div className={`my-10 mx-2 max-w-max md:max-w-screen-md ${cookieConsent != null ? "hidden" : "flex"}
                        fixed top-0 left-0 right-0 mx-6 md:mx-auto
                         p-8 justify-between items-center flex-col gap-4  
                         bg-gray-100 rounded-2xl shadow z-50`}>
            <Tab.Group>
                <Tab.List className="border w-full border-l-0 border-r-0">
                    <Tab className={({selected}) => classNames('p-4 border border-t-0 border-l-0 border-r-0 border-b-4 transition', selected ? 'border-blue-600 text-blue-700': 'border-white') }>Consent</Tab>
                    <Tab className={({selected}) => classNames('p-4 border border-t-0 border-l-0 border-r-0 border-b-4 transition', selected ? 'border-blue-600 text-blue-700': 'border-white') }>About</Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className='text-left text-sm'>
                            {/* <p>We require your consent to allow us to store cookies that will allow us to make your user experience in using the site better. Users have the right to accept or decline the consent that will allow us to store and use of their data on the website accordingly. The stored user data adheres to the relevant <Link href="/cookiespolicy"><span className="text-sky-600 cursor-pointer">Cookie</span></Link>, <Link href="/privacypolicy"><span className="text-sky-600 cursor-pointer">Privacy</span></Link> and <Link href="/termsandconditions"><span className="text-sky-600 cursor-pointer">Terms and Conditions</span></Link> Policies that can be found on the website.</p> */}
                            <p className="font-bold mb-3">This website uses cookies</p>
                            <p>We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.</p>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel className="text-sm">
                        <p className="mb-3">Cookies are small text files that can be used by websites to make a user's experience more efficient.</p>

                        <p className="mb-3">The law states that we can store cookies on your device if they are strictly necessary for the operation of this site. For all other types of cookies we need your permission. This means that cookies which are categorized as necessary, are processed based on GDPR Art. 6 (1) (f). All other cookies, meaning those from the categories preferences and marketing, are processed based on GDPR Art. 6 (1) (a) GDPR.</p>

                        <p className="mb-3">This site uses different types of cookies. Some cookies are placed by third party services that appear on our pages.</p>

                        {/* <p className="mb-3">You can at any time change or withdraw your consent from the Cookie Declaration on our website.</p> */}

                        <p className="mb-3">Learn more about who we are, how you can contact us and how we process personal data in our <Link href="/privacypolicy"><span className="text-sky-600 cursor-pointer">Privacy Policy</span></Link>.</p>

                        <p className="mb-3">Please state your consent ID and date when you contact us regarding your consent.</p>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            
            <div className='flex gap-2'>
                <button className='px-5 py-2 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition' onClick={() => setCookieConsent(false)}>Decline</button>
                <button className='gradBlue px-5 py-2 text-white rounded-lg hover:bg-gray-700 transition' onClick={() => setCookieConsent(true)}>Allow Cookies</button>
            </div>   
        </div>
    )}