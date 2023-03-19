import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useThemeContext } from '../contexts/ThemeContext';
import checkAnimated from '../public/assets/check-animated.gif';
import crossAnimated from '../public/assets/cross-animated.gif';
import { useSettingsContext } from '../contexts/SettingsContext';
import { checkEmailVerification } from '../fetchers/SanityFetchers';
import { AiOutlineHome } from 'react-icons/ai';

const style = {
    pageBanner: 'pb-[8rem] pt-[15rem] gradSky mb-[2rem]',
    pageTitle: 'text-2xl  text-center text-white flex justify-center gap-3 items-center',
    buttonContainer: 'flex items-center justify-center p-4',
    homeButton: 'flex items-center justify-center gap-1 rounded-lg bg-white shadow-md px-6 py-3 text-slate-700',
  }

const emailconfirm = () => {
    const router = useRouter();
    const {e,c} = router.query;
    const { dark } = useThemeContext();
    const { HOST } = useSettingsContext();
    const [verified, setVerified] = useState(false);

    useEffect(() => {

        ;(async() => {
            const isVerified = await checkEmailVerification(e,c);
            console.log(isVerified)
            setVerified(isVerified);
        })()

        return() => {
            //do nothing
        }
    }, [router])

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground text-neutral-100'}`}>
        <Header />
        <div>
            <div
                className={
                    dark
                    ? style.pageBanner + ' darkGray'
                    : style.pageBanner + ' bg-sky-100'
                }>
            <h2 className={style.pageTitle}>
                {verified ? (
                    <>
                        <img src={checkAnimated.src} className="w-10" />Email Verified
                    </>
                ) : (
                    <>
                        <img src={crossAnimated.src} className="w-10" />Could not verify email
                    </>
                )}
            </h2>
            <div className={style.buttonContainer}>
                <button className={style.homeButton} onClick={() => router.push('/')}><AiOutlineHome/> Go to Home</button>
            </div>
            </div>
        </div>
        <Footer/>
    </div>

  )
}

export default emailconfirm