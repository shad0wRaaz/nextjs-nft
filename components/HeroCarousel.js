import Slider from 'react-slick'
import Tilt from 'react-parallax-tilt'
import { useRouter } from 'next/router'
import FeaturedItems from './FeaturedItems'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: `relative`,
  container: `pt-[8rem]`,
  contentWrapper: `flex mb-[2rem] h-[70vh] container mx-auto relative justify-between sm:px-[2rem] lg:px-[8rem] flex-wrap items-center`,
  copyContainer: `md:w-1/2`,
  title: `relative p-[20px] font-semibold text-4xl md:text-5xl xl:text-6xl leading-[5rem] text-white`,
  description: `container-[400px] mt-[0.8rem] p-[20px] shoutoutDescription max-w-[500px] text-white`,
  ctaContainer: `flex justify-start gap-[20px] px-[20px] mt-5 mb-8`,
  accentedButton: `gradBlue hover:bg-200 transition relative text-lg font-semibold px-12 py-4 rounded-full text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-slate-600 rounded-full text-[#e4e8ea] hover:bg-slate-700 cursor-pointer`,
  cardContainer: `md:w-1/2 md:p-4 sm:p-0`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
  redBlur: `block bg-[#ef233c] w-72 h-72 absolute lg:ml-[10rem] md:ml-[3rem] sm:ml-[2rem] rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96`,
  blueBlur: `block bg-[#04868b] w-72 h-72 absolute lg:ml-[43rem] md:ml-[5rem] sm:ml-[5rem] mt-40 rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96 nc-animation-delay-2000`,
}

const settings = {
  dots: false,
  infinite: true,
  fade: true,
  speed: 7000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 7000,
  pauseOnHover: true
};

const HeroCarousel = (props) => {
  const { dark } = useThemeContext()

  const router = useRouter()
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <span className={style.redBlur}></span>
        <span className={style.blueBlur}></span>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div
              className={style.title}
            >
              Discover, Collect, Mint, Sell and Buy NFTs 🖼
            </div>
            {/* <div className={style.description}>
              Discover the most outstanding NFTs in all topics of life. Create 
              your own, Mint, Sell  Buy
            </div> */}
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
            <Tilt  
              perspective={3000}
              tiltMaxAngleX={20}
              tiltMaxAngleY={20}
              transitionSpeed={1500}
              className="parallax-effect flex justify-center items-center rounded-2xl shadow-md p-2 md:left-0 sm:left-[2rem] cursor-pointer bg-[#ffffffdd] backdrop-blur-md">
                <div className="inner-element featured relative w-full transition">
                  <Slider {...settings}>
                      {Boolean(props.featuredNfts) ? props.featuredNfts?.map((nft, index) => (
                          <FeaturedItems item={nft} id={index} key={index} />
                          )) : ''}
                  </Slider>
                </div>
              </Tilt>
            {/* <section id="slider">
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
                          pathname: `/nfts/${nfts.nftitem._id}`,
                          query: {
                            c: nfts.contractAddress,
                          },
                        }}
                      >
                        <span>{nfts.nftitem.name}</span>
                      </Link>
                    </div>
                  </label>
                ))}
            </section> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
