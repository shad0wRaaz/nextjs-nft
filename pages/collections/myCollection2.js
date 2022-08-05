import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { useAddress, useSigner,useNFTs, useNFTCollection } from '@thirdweb-dev/react'
import { config } from '../../lib/sanityClient'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import NFTCard from '../../components/NFTCard'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import EthereumLogo from '../../assets/ethereum.png'
import MaticLogo from '../../assets/matic.png'


const style = {
  bannerImageContainer: `h-[30vh] w-full overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-full px-4 pb-10`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-4 border-[#ffffff] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem] mr-2`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border border-slate-700 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border border-slate-700 border-r-1`,
  title: `text-2xl font-bold my-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `min-w-[500px] flex justify-around py-4 border border-white-100 rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#94a3b8] text-xl w-max-1/4 flex-wrap mt-4`,
  nftwrapper: `flex flex-wrap justify-center`
}

const Collection2 = () => {
  const router = useRouter();
  const address = useAddress();
  const signer = useSigner();
  const [collection, setCollection] = useState({});
  const [nfts, setNfts] = useState([]);
  const [listings, setListings] = useState([]);
  const [userData, setUserData] = useState({});
  const collectionid = '0x107E3947C2ff89af2DD3d07bDb0515e4af97593a';

  const nftModule = useMemo(() => {
    if (!signer) return

    const sdk = new ThirdwebSDK(signer);
    return sdk.getNFTCollection(collectionid);
  }, [address]);

  // get all NFTs in the collection
  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getOwned();

      setNfts(nfts);
    })()
  }, [nftModule, address]);

  const marketPlaceModule = useMemo(() => {
    if (!signer) return

    const sdk = new ThirdwebSDK(signer);
    // return sdk.getMarketplaceModule('0x1466c3D7c82163FffD7B90C4692DEa2096eD8CD8');
    return sdk.getMarketplace('0x9a9817a85E5d54345323e381AC503F3BDC1f01f4');
  }, [address])

  // get all listings in the collection
  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings());
    })()
  }, [marketPlaceModule]);

  const fetchCollectionData = async (sanityClient = config) => {
    const query = `*[_type == "nftCollection" && createdBy->walletAddress == "${address}" ] {
      profileImage,
      bannerImage,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->walletAddress,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`;

    const collectionData = await sanityClient.fetch(query);
    setCollection(collectionData);
  }
  useEffect(() => {
    console.log(collection);
  }, [collection])
  
  useEffect(() => {
    fetchCollectionData()
  }, [collectionid]);

  const fetchUserData = async (sanityClient = config) => {
    const query = `*[_type == "users" && walletAddress == "${address}"] {
      userName,
      profileImage,
      bannerImage
    }`;

    const sanityUserData = await sanityClient.fetch(query);
    setUserData(sanityUserData[0]);
  }

  useEffect(() => {
    fetchUserData();
  }, [address])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            userData?.bannerImage
              ? userData.bannerImage
              : 'https://bit.ly/placeholder-img'
          }
          alt={userData?.userName}
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              userData?.profileImage
                ? userData.profileImage
                : 'https://bit.ly/placeholder-img'
            }
            alt={userData?.userName}
          />
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{ userData?.userName }</div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>Collections</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>Items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src={EthereumLogo.src}
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className={style.nftwrapper}>
        {nfts.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collection?.title}
            listings={listings}
          />
        ))}
      </div>
      <Footer/>
    </div>
  )
}

export default Collection2