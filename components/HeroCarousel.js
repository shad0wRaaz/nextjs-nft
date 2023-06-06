import Slider from 'react-slick'
import Tilt from 'react-parallax-tilt'
import { useRouter } from 'next/router'
import "slick-carousel/slick/slick.css";
import SaveReferral from './SaveReferral'
import FeaturedItems from './FeaturedItems'
import { RiCloseFill } from 'react-icons/ri';
import { config } from '../lib/sanityClient';
import { useEffect, useState } from 'react';
import "slick-carousel/slick/slick-theme.css";
import { useAddress } from '@thirdweb-dev/react';
import { useThemeContext } from '../contexts/ThemeContext'
import { getFullListings } from '../fetchers/Web3Fetchers';
import { useQuery } from 'react-query';

const style = {
  wrapper: `relative overflow-hidden`,
  container: `pt-[8rem]`,
  contentWrapper: `flex h-[70vh] container mx-auto relative justify-between sm:px-[2rem] lg:px-[8rem] flex-wrap items-center`,
  copyContainer: `lg:w-1/2`,
  title: `relative p-[20px] font-semibold text-4xl md:text-5xl xl:text-6xl leading-[3.5rem] md:leading-[5rem] lg:leading-[5rem] xl:leading-[5rem] text-white`,
  description: `container-[400px] mt-[0.8rem] p-[20px] shoutoutDescription max-w-[500px] text-white`,
  ctaContainer: `flex justify-start gap-[20px] px-[20px] mt-5 mb-8`,
  accentedButton: `gradBlue hover:bg-200 transition relative text-lg font-semibold px-12 py-4 rounded-full text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-slate-600 rounded-full text-[#e4e8ea] hover:bg-slate-700 cursor-pointer`,
  cardContainer: `lg:w-1/2 md:p-4 sm:p-0`,
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
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true
};

const HeroCarousel = (props) => {
  const { dark } = useThemeContext();
  const [referralModal, setReferralModal] = useState(false);
  const [userData, setUserData] = useState();
  const address = useAddress();
  const router = useRouter();
  const [featuredListedNFTs, setFeaturedListedNFTs] = useState();

  useEffect(() => {
    if(!address) return;
    ;(async() => {
      const data = await config.fetch(`*[_type == "users" && walletAddress == "${address}"]`);
      setUserData(data[0]);

      if(!data[0].referrer){

        //check if user has opted not to see the referral again
        const askagain = localStorage.getItem('referral');
    
        if(askagain == 'false' || askagain == null ){
          setReferralModal(true);    
        }
      }
    })()

    return() => {
      //do nothing, only clean up section
    }

  }, [address])

  const { data } = useQuery(
    ['fulllistings'], 
    getFullListings(),
    {
      onSuccess: (res) => {
        if(props.featuredNfts){
          const thisItem = res.filter((nft) =>
          { 
            return props.featuredNfts.some(f => String(f.collection.contractAddress).toLowerCase() == String(nft.assetContractAddress).toLowerCase() && f?.id == nft?.asset?.id);
          }
        );
          setFeaturedListedNFTs(thisItem);
        }
      }
    });
  return (
    <div className={style.wrapper}>
      <div className={style.container}>

          {/* Referral Modal */}
          <div className={`fixed top-0 ${referralModal ? 'flex' : 'hidden'} mx-auto items-center justify-center p-4 md:p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-20`}>
            <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-4 md:p-10 rounded-3xl w-[40rem] overflow-y-auto z-50 relative`}>
              <div
                className="absolute top-5 right-6 md:right-10  transition duration-[300] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70 cursor-pointer"
                onClick={() => setReferralModal(false) }>
                <RiCloseFill fontSize={25}/>
              </div>
              <SaveReferral setReferralModal={setReferralModal} userData={userData}/>
            </div>
          </div>

        <span className={style.redBlur}></span>
        <span className={style.blueBlur}></span>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div
              className={style.title}
            >
              Discover, Collect, Mint, Sell and Buy NFTs 🖼
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
                onClick={() => router.push('/tutorials/getstarted')}
              >
                Tutorials
              </button>
            </div>
          </div>
          {featuredListedNFTs && (
            <>
              <div className={style.cardContainer + ' hidden lg:flex'}>
                <Tilt  
                  perspective={3000}
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                  transitionSpeed={1500}
                  className="parallax-effect justify-center items-center rounded-2xl p-2 md:left-0 sm:left-[2rem] cursor-pointer">
                    <div className="inner-element featured relative w-full lg:w-[50vh] transition ">
                      <Slider {...settings}>
                          {featuredListedNFTs?.map((nft, index) => (
                              <FeaturedItems item={nft} id={index} key={index} allFeatured={props.featuredNfts}/>
                              ))
                          }
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
              <div className={style.cardContainer + ' lg:hidden'}>
                <div className="inner-element featured relative w-full lg:w-[50vh] transition ">
                  <Slider {...settings}>
                      {featuredListedNFTs?.map((nft, index) => (
                          <FeaturedItems item={nft} id={index} key={index} allFeatured={props.featuredNfts}/>
                          )) 
                      }
                  </Slider>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
