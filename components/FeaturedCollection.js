import React from 'react'
import background from '../assets/nftworlds.jpg'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import creature1  from '../pages/rewarding-renditions/assets/cryptocreatures/1.png'
import creature2  from '../pages/rewarding-renditions/assets/cryptocreatures/2.png'
import creature3  from '../pages/rewarding-renditions/assets/cryptocreatures/3.png'
import creature4  from '../pages/rewarding-renditions/assets/cryptocreatures/4.png'
import creature5  from '../pages/rewarding-renditions/assets/cryptocreatures/5.png'
import creature6  from '../pages/rewarding-renditions/assets/cryptocreatures/6.png'
import creature7  from '../pages/rewarding-renditions/assets/cryptocreatures/7.png'
import creature8  from '../pages/rewarding-renditions/assets/cryptocreatures/8.png'

const FeaturedCollection = () => {
    const style = {
        wrapperContainer: 'topCollectionWrapper text-center bg-center bg-top md:bg-center md:bg-cover z-0 relative',
        wrapper: 'container mx-auto lg:p-[8rem] p-[2rem]',
        title: 'font-bold mb-[2rem] grow text-center flex flex-col md:flex-row justify-center items-center gap-2 text-white text-[3rem]',
        collectionWrapper:
          'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        collection:
          'cursor-pointer py-4 px-[1rem] md:w-1/6 sm:w-[40%] flex items-center justify-start rounded-xl border bg-white hover:bg-[#ffffffcc] transition duration-300',
        imageContainer:
          'bg-[#eeeeee] mr-[1rem] rounded-full relative h-[60px] w-[60px] overflow-hidden',
        collectionDescriptionContainer: 'flex flex-col',
        collectionTitle: 'font-bold text-medium text-left',
        itemTitle: 'text-black text-sm text-left',
        coinLogo: 'inline mr-[3px] ml-[5px] h-[15px] w-auto',
      }
      const cryptoImages = [
        {
            original: creature1.src,
            thumbnail: creature1.src,
          },
          {
            original: creature2.src,
            thumbnail: creature2.src,
          },
          {
            original: creature3.src,
            thumbnail: creature3.src,
          },
          {
            original: creature4.src,
            thumbnail: creature4.src,
          },
          {
            original: creature5.src,
            thumbnail: creature5.src,
          },
          {
            original: creature6.src,
            thumbnail: creature6.src,
          },
          {
            original: creature7.src,
            thumbnail: creature7.src,
          },
          {
            original: creature8.src,
            thumbnail: creature8.src,
          },
      ];
  return (
    <div className={style.wrapperContainer} style={{ backgroundImage: `url(${background.src})`}}>
        <div className={style.wrapper}>
            <div className="flex-between flex flex-col md:flex-row items-center relative z-10">
                <h2 className={style.title}><span className="textGradPink">Featured</span> Collection</h2>
                    <ImageGallery 
                    items={cryptoImages}
                    showNav={false}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    isRTL={true}
                    slideInterval={2000}/>
            </div>
        </div>
    </div>
  )
}

export default FeaturedCollection