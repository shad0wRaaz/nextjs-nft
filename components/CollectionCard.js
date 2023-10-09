import Link from 'next/link'
import millify from 'millify'
import Image from 'next/image'
import { GoVerified } from 'react-icons/go'
import SkeletonLoader from './SkeletonLoader';
import { getImagefromWeb3 } from '../fetchers/s3'
import noBannerImage from '../assets/noBannerImage.png'
import noProfileImage from '../assets/noProfileImage.png'
import { useThemeContext } from '../contexts/ThemeContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useSettingsContext } from '../contexts/SettingsContext'
import { IconEthereum, IconPolygon, IconBNB, IconAvalanche } from './icons/CustomIcons'

const style = {
  card: 'hover:scale-105 hover:shadow-lg transition w-full border rounded-3xl overflow-hidden p-2 pb-5 cursor-pointer backdrop-blur-md',
  bannerContainer:
    'cursor-pointer  relative w-full h-[150px] rounded-3xl overflow-hidden',
  creator: 'text-center text-sm mb-3 flex items-center justify-center gap-1',
  bannerImage: 'object-cover w-full h-full',
  profile:
    'cursor-pointer rounded-full overflow-hidden ring ring-white relative mx-auto top-[-25px] h-[70px] w-[70px] mb-[2rem]',
  title: 'cursor-pointer text-center text-md relative drop-shadow-md',
  description: 'cursor-pointer relative px-4 text-md text-center',
}
const chainIcon = {
  '97': <IconBNB width="1.0rem" height="1.0rem" />,
  '56': <IconBNB width="1.0rem" height="1.0rem" />,
  '80001': <IconPolygon width="1.0rem" height="1.0rem" />,
  '137': <IconPolygon width="1.0rem" height="1.0rem" />,
  '5': <IconEthereum width="1.0rem" height="1.0rem" />,
  '4': <IconEthereum width="1.0rem" height="1.0rem" />,
  '1': <IconEthereum width="1.0rem" height="1.0rem" />,
  '43113': <IconAvalanche width="1.0rem" height="1.0rem" />,
  '43114': <IconAvalanche width="1.0rem" height="1.0rem" />,
}

const CollectionCard = ({
  id,
  name,
  verified,
  description,
  contractAddress,
  profileImage,
  bannerImage,
  floorPrice,
  volumeTraded,
  allOwners,
  creator,
  creatorAddress,
  chainId,
}) => {
  const { dark } = useThemeContext();
  const { currencyByChainId, blockchainName } = useSettingsContext();
  const [imgPath, setImgPath] = useState();
  const [bannerPath, setBannerPath] = useState();

  let collectionAddress = '';
  if(String(contractAddress).toLowerCase() == String('0x9809AbFc4319271259a340775eC03E9746B76068').toLowerCase()) {collectionAddress = 'crypto_creatures'}
  else if(String(contractAddress).toLowerCase() == String('0x2945db324Ec216a5D5cEcE8B4D76f042553a213f').toLowerCase()) {collectionAddress = 'neon_dreams'}
  else if(String(contractAddress).toLowerCase() == String('0x54265672B480fF8893389F2c68caeF29C95c7BE2').toLowerCase()) {collectionAddress = 'celestial_beings'}
  else if(String(contractAddress).toLowerCase() == String('0x9BDa42900556fCce5927C1905084C4b3CffB23b0').toLowerCase()) {collectionAddress = 'artifacts_of_the_future'}
  else { collectionAddress = contractAddress }

  const link = `/collection/${blockchainName[chainId]}/${collectionAddress}`;

  useEffect(() => {

    ;(async () => {
      if(profileImage) {
        const nftImagePath = await getImagefromWeb3(profileImage);
        setImgPath(nftImagePath?.data);
      }

      if(bannerImage) {
        const nftBannerPath = await getImagefromWeb3(bannerImage);
        setBannerPath(nftBannerPath?.data);
      }
    })();

    return () => {}

  }, []);

  return (
    <Link href={link} passHref>
      <a className="w-full">
        <div
          className={
            dark
              ? style.card + '  border-sky-400/20 bg-slate-800/80'
              : style.card + ' border-slate-200 bg-[#ffffff99]'
          }
        >
          <div className={style.bannerContainer}>
            {bannerPath ? (
              <img
                src={bannerPath}
                className={style.bannerImage}
                alt={name}
              />
            ) : (
              <SkeletonLoader roundness="xl"/>
            )}
          </div>

          <div className="relative">
            <svg
              className={`mx-auto -mt-[32px] h-14 ${
                dark ? 'text-darkGray' : 'text-white'
              }`}
              width="134"
              height="54"
              viewBox="0 0 134 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M101.734 19.8581C99.2658 17.4194 96.9737 14.8065 94.5052 12.1935C94.1526 11.671 93.6237 11.3226 93.0947 10.8C92.7421 10.4516 92.5658 10.2774 92.2131 9.92903C85.6895 3.83226 76.6974 0 67 0C57.3026 0 48.3105 3.83226 41.6105 9.92903C41.2579 10.2774 41.0816 10.4516 40.7289 10.8C40.2 11.3226 39.8474 11.671 39.3184 12.1935C36.85 14.8065 34.5579 17.4194 32.0895 19.8581C23.2737 28.7419 11.4605 30.4839 -0.176331 30.8323V54H16.3974H32.0895H101.558H110.197H134V30.6581C122.363 30.3097 110.55 28.7419 101.734 19.8581Z"
                fill=""
              ></path>
            </svg>

            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <div className="wil-avatar relative inline-flex h-20 bg-white w-20 flex-shrink-0 items-center justify-center rounded-full text-2xl font-semibold uppercase text-neutral-100 shadow-inner ring-2 ring-neutral-600">
                {imgPath ? (
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    src={imgPath}
                    alt={name}
                  />
                ) : (
                  <SkeletonLoader roundness="full" />
                )}
              </div>
            </div>
          </div>

          <div className="relative top-1 mt-2">
            <p className={style.title}>{name}</p>
            <p className={style.creator}>
              by
              <Link href={`/user/${creatorAddress}`}>
                <span className=" cursor-pointer hover:text-sky-500">
                  {' '}
                  {creator == 'Unnamed' ? <span className="font-bold">{creatorAddress.slice(0,5) + '...' + creatorAddress.slice(-5)}</span> : creator}
                </span>
              </Link>
              {verified ? <GoVerified className='text-sky-500'/> : ''}
            </p>
            {/* <p className={style.description}>{description.slice(0, 32)}...</p> */}
          </div>
          
          <div className="mt-4 flex justify-between p-2 text-sm">

              <div className="">
                <p className="mb-1">Floor Price</p>
                <p className="flex items-center justify-start">
                  {/* {chainId == '137' || (chainId == '80001' && <IconPolygon />)}
                  {chainId == '1' || (chainId == '4' && <IconEthereum />)} */}
                  {floorPrice}{' '}
                  {currencyByChainId[chainId]}
                </p>
              </div>

            

              <div className="">
                <p className="mb-1">Volume Traded</p>
                <p className="flex items-center justify-end gap-1">
                  {/* {chainId == '137' || (chainId == '80001' && <IconPolygon />)}
                  {chainId == '1' || (chainId == '4' && <IconEthereum />)} */}
                  ${millify(Number(volumeTraded))}
                </p>
              </div>

          </div>
        </div>
      </a>
    </Link>
  )
}

export default CollectionCard
