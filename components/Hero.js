import React from 'react'
import { useRouter } from 'next/router'

const style = {
  wrapper: `relative`,
  container: ``,
  contentWrapper: ` container mx-auto flex relative justify-between px-[1.2rem] flex-wrap items-center`,
  copyContainer: `md:w-1/2 p-[20px]`,
  title: `relative text-black font-semibold shoutoutText`,
  description: `text-black container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-blue-500 rounded-full mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-full mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-[3rem] mx-[20px]`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
  redBlur: `block bg-[#ef233c] w-72 h-72 absolute lg:ml-[10rem] md:ml-[3rem] sm:ml-[2rem] rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-96 lg:h-96`,
  blueBlur: `block bg-[#04868b] w-72 h-72 absolute lg:ml-[43rem] md:ml-[5rem] sm:ml-[5rem] mt-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-96 lg:h-96 nc-animation-delay-2000`,
}

const Hero = () => {
  const router = useRouter();
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <span className={style.redBlur}></span>
        <span className={style.blueBlur}></span>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div className={style.title}>
              Discover, collect, and <br/>sell extraordinary NFTs
            </div>
            <div className={style.description}>
              Nuva NFT is the world&apos;s first and largest NFT marketplace
            </div>
            <div className={style.ctaContainer}>
              <button 
                className={style.accentedButton}
                onClick={() => router.push('/browse')}>Explore</button>
              <button 
                className={style.button}
                onClick={() => router.push('/contracts')}>Create</button>
            </div>
          </div>
          <div className={style.cardContainer}>
            <img
              className="rounded-t-lg"
              src="https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s550"
              alt=""
            />
            <div className={style.infoContainer}>
              <img
                className="h-[2.25rem] rounded-full"
                src="https://lh3.googleusercontent.com/qQj55gGIWmT1EnMmGQBNUpIaj0qTyg4YZSQ2ymJVvwr_mXXjuFiHJG9d3MRgj5DVgyLa69u8Tq9ijSm_stsph8YmIJlJQ1e7n6xj=s64"
                alt=""
              />
              <div className={style.author}>
                <div className={style.name}>Jolly</div>
                <a
                  className="text-[#1868b7]"
                  href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/2324922113504035910649522729980423429926362207300810036887725141691069366277"
                >
                  hola-kanola
                </a>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default Hero