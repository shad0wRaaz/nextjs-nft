import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { config } from '../lib/sanityClient'
import Link from 'next/link'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: `relative`,
  container: ``,
  contentWrapper: `flex mb-[6rem] h-[70vh] container mx-auto relative justify-between sm:px-[2rem] lg:px-[8rem] flex-wrap items-center`,
  copyContainer: `md:w-1/2`,
  title: `relative p-[20px] font-semibold text-4xl md:text-5xl xl:text-6xl !leading-[114%] `,
  description: `container-[400px] mt-[0.8rem] mb-[2.5rem] p-[20px] shoutoutDescription max-w-[500px]`,
  ctaContainer: `flex justify-start gap-[20px] px-[20px]`,
  accentedButton: `gradBlue hover:bg-200 transition relative text-lg font-semibold px-12 py-4 rounded-full text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-slate-800 rounded-full  text-[#e4e8ea] hover:bg-slate-700 cursor-pointer`,
  cardContainer: `md:w-1/2 w-full lg:pt-[7rem] cardCarousel`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
  redBlur: `block bg-[#ef233c] w-72 h-72 absolute lg:ml-[10rem] md:ml-[3rem] sm:ml-[2rem] rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96`,
  blueBlur: `block bg-[#04868b] w-72 h-72 absolute lg:ml-[43rem] md:ml-[5rem] sm:ml-[5rem] mt-40 rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96 nc-animation-delay-2000`,
}

const HeroCarousel = () => {
  const [featuredNfts, setFeaturedNFts] = useState()
  const [count, setCount] = useState(0)
  const { dark } = useThemeContext()

  useEffect(() => {
    ;(async (sanityClient = config) => {
      const query = `*[_type == "featuredNfts"] {
              name, contractAddress, id, owner, nftImage
          }`
      setFeaturedNFts(await sanityClient.fetch(query))
    })()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((c) => ++c % 5)
    }, 4000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!featuredNfts) return
  }, [featuredNfts])

  const router = useRouter()
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <span className={style.redBlur}></span>
        <span className={style.blueBlur}></span>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div
              className={dark ? style.title + ' text-neutral-200' : style.title}
            >
              Discover, collect,
              <br />
              and sell NFTs 🖼
            </div>
            <div className={style.description}>
              Discover the most outstanding NFTs in all topics of life. Creative
              your NFTs and sell them
            </div>
            <div className={style.ctaContainer}>
              <button
                className={style.accentedButton}
                onClick={() => router.push('/browse')}
              >
                Explore
              </button>
              <button
                className={style.button}
                onClick={() => router.push('/contracts')}
              >
                Mint
              </button>
            </div>
          </div>

          <div className={style.cardContainer}>
            <section id="slider">
              {featuredNfts &&
                featuredNfts.map((nfts, index) => (
                  <input
                    key={index}
                    type="radio"
                    name="slider"
                    id={`s${index + 1}`}
                    checked={count == index ? true : false}
                    readOnly
                  />
                ))}

              {featuredNfts &&
                featuredNfts.map((nfts, index) => (
                  <label
                    htmlFor={`s${index + 1}`}
                    id={`slide${index + 1}`}
                    key={index}
                    className="flex items-start justify-center overflow-hidden"
                  >
                    <img src={nfts.nftImage} className="rounded-xl" />
                    <div className="absolute bottom-5 left-0 h-[50px] w-full bg-black/70 p-2 pb-0 text-center text-lg text-white">
                      <Link
                        href={{
                          pathname: `/nfts/${nfts.id}`,
                          query: {
                            c: nfts.contractAddress,
                          },
                        }}
                      >
                        <span>{nfts.name}</span>
                      </Link>
                    </div>
                  </label>
                ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
