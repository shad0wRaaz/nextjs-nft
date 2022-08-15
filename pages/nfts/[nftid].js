import millify from 'millify'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import { BiChevronUp } from 'react-icons/bi'
import Header from '../../components/Header'
import { Disclosure } from '@headlessui/react'
import { config } from '../../lib/sanityClient'
import Purchase from '../../components/nft/Purchase'
import { useUserContext } from '../../contexts/UserContext'
import ItemActivity from '../../components/nft/ItemActivity'
import AuctionTimer from '../../components/nft/AuctionTimer'
import { useThemeContext } from '../../contexts/ThemeContext'
import GeneralDetails from '../../components/nft/GeneralDetails'
import { useAddress, useNFTCollection } from '@thirdweb-dev/react'
import { useMarketplaceContext } from '../../contexts/MarketPlaceContext'
import BrowseByCategory from '../../components/BrowseByCategory'
import RelatedNFTs from '../../components/RelatedNFTs'
import { IconImage, IconVideo } from '../../components/icons/CustomIcons'
import {
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineDotsVertical,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi'
import { BigNumber } from 'ethers'
import { getAllNFTs } from '../../fetchers/Web3Fetchers'
import { BsPause, BsPlay } from 'react-icons/bs'
import { MdAudiotrack } from 'react-icons/md'
const style = {
  wrapper: `flex flex-col pt-[5rem] items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}
const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const Nft = () => {
  const { dark } = useThemeContext()
  const { queryStaleTime } = useUserContext()
  const { activeListings, rpcUrl, setRpcUrl } = useMarketplaceContext()
  const address = useAddress()
  const [selectedNft, setSelectedNft] = useState()
  const [listingData, setListingData] = useState() //this will hold current or selected listing nft
  const [isAuctionItem, setIsAuctionItem] = useState(false) //identify for auctioned item
  const router = useRouter()
  const collectionid = router.query.c
  const collection = useNFTCollection(collectionid)
  const [collectionData, setCollectionData] = useState('')
  const [metaDataFromSanity, setMetadataFromSanity] = useState({
    likedBy: [],
    views: 0,
    likes: 0,
  })
  const [isLiked, setIsLiked] = useState(false)
  const [playItem, setPlayItem] = useState(false)

  //Add or Remove Likes/Heart
  const addRemoveLike = async (
    e,
    toastHandler = toast,
    sanityClient = config
  ) => {
    if (!address) {
      toastHandler.error(
        'Connected wallet is required before sending a like to an NFT.',
        errorToastStyle
      )
      return
    }

    // console.log(metaDataFromSanity)
    // console.log(isNaN(undefined))
    if (!metaDataFromSanity?._id) return
    let filteredLikers = []

    if (isLiked) {
      //change like color
      setIsLiked(false)

      //remove like
      const likerToRemove = [`likedBy[_ref == "${address}"]`]
      await sanityClient
        .patch(metaDataFromSanity?._id)
        .unset(likerToRemove)
        .commit()
        .then(() => {
          //remove from state variable too , to reflect updated likes count value
          const filteredLikers = metaDataFromSanity.likedBy.filter((likers) => {
            return likers._ref != address
          })
          setMetadataFromSanity({
            ...metaDataFromSanity,
            likedBy: filteredLikers,
          })

          toastHandler.success('You unliked this NFT.', successToastStyle)
        })
        .catch((err) => {
          console.log(err)
          toastHandler.error('Error in unliking.', errorToastStyle)
        })
    } else {
      //add like
      setIsLiked(true)
      await sanityClient
        .patch(metaDataFromSanity?._id)
        .setIfMissing({ likedBy: [] })
        .insert('before', 'likedBy[0]', [{ _ref: address }])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
          toastHandler.success('You liked this NFT.', successToastStyle)

          //add current user into likedby array
          filteredLikers = [
            ...metaDataFromSanity.likedBy,
            { _ref: address, _type: 'reference' },
          ]
          setMetadataFromSanity({
            ...metaDataFromSanity,
            likedBy: filteredLikers,
          })
        })
        .catch((err) => {
          // console.error(err)
          // toastHandler.error('Error in liking the NFT.', errorToastStyle)
        })
    }
  }

  //get Collection Data from Sanity
  useEffect(() => {
    if (!collectionid) return //get NFT Items' meta data
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && contractAddress == "${collectionid}" && id == "${router.query.nftid.toString()}"] {
          views, likedBy, likes, transactionHashes, _id
        }`
      const result = await sanityClient.fetch(query)
      setMetadataFromSanity(result[0])

      //get collection data
      const query2 = `*[_type == "nftCollection" && contractAddress == "${collectionid}"] {
        profileImage,
        bannerImage,
        volumeTraded,
        createdBy,
        category,
        chainId,
        contractAddress,
        "creator": createdBy->walletAddress,
        name, floorPrice,
        "allOwners": owners[]->,
        description,
        showUnlisted,
        }`
      await sanityClient.fetch(query2).then((data) => {
        setCollectionData(data[0])
        if (data[0].chainId == '4') {
          setRpcUrl(process.env.NEXT_PUBLIC_INFURA_RINKEBY_URL)
        } else if (data[0].chainId == '80001') {
          setRpcUrl(process.env.NEXT_PUBLIC_INFURA_POLYGON_URL)
        }
      })
    })()
  }, [collectionid])

  const { data: nftData, status: nftStatus } = useQuery(
    ['allnftss', collectionid],
    getAllNFTs(rpcUrl),
    {
      enabled: Boolean(collectionid) && Boolean(rpcUrl),
      onError: () => {
        toast.error(
          'Error fetching NFts. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {
        const selectedNftItem = res.find(
          (nft) => nft.metadata.id.toString() == router.query.nftid.toString()
        )
        setSelectedNft(selectedNftItem)

        if (activeListings) {
          const listingItem = activeListings?.find(
            (marketNft) =>
              JSON.stringify(marketNft.asset?.id) ==
                JSON.stringify(selectedNftItem?.metadata.id) &&
              marketNft.assetContractAddress == collectionid
          )
          setListingData(listingItem)

          if (Boolean(listingItem?.reservePrice)) {
            setIsAuctionItem(true)
          }
        }
      },
    }
  )

  useEffect(() => {
    if (!address) {
      setIsLiked(false)
      return
    }
    //check if current user has liked this NFT or not and set isLiked state accordingly
    if (metaDataFromSanity?.likedBy?.length > 0) {
      const amILiker = metaDataFromSanity.likedBy.find(
        (likers) => likers._ref == address
      )
      if (amILiker) {
        setIsLiked(true)
      }
    } else {
      setIsLiked(0)
    }
  }, [metaDataFromSanity, address])

  // useEffect(() => {
  //   console.log(listingData)
  // }, [listingData])
  // useEffect(() => {
  //   setListingData(
  //     activeListings?.find(
  //       (marketNft) =>
  //         JSON.stringify(marketNft.asset?.id) ==
  //           JSON.stringify(selectedNft?.metadata.id) &&
  //         marketNft.assetContractAddress == collectionid
  //     )
  //   )
  // }, [activeListings])

  // useEffect(() => {

  //   if (!listingData) return

  //   if (Boolean(listingData.reservePrice)) {
  //     setIsAuctionItem(true)
  //   }
  // }, [listingData])

  // useEffect(() => {
  //   console.log(selectedNft)
  // }, [selectedNft])

  return (
    <div
      className={`overflow-hidden ${dark && 'darkBackground text-neutral-100'}`}
    >
      <Header />
      <main className="container mx-auto mt-11 flex">
        <div className="grid w-full grid-cols-1 gap-10 px-[1.2rem] md:gap-14 lg:grid-cols-2">
          <div className="space-y-8">
            <div
              className={
                selectedNft?.owner.toString() ==
                '0x0000000000000000000000000000000000000000'
                  ? 'disabled pointer-none relative opacity-50'
                  : 'relative'
              }
            >
              <div className="aspect-w-11 aspect-h-12 overflow-hidden rounded-3xl">
                {playItem && selectedNft?.metadata?.properties.itemtype == "video" && (
                  <video className="w-full h-full" autoPlay loop>
                    <source src={selectedNft?.metadata?.animation_url}/>
                    Your browser does not support video tag. Upgrade your browser.
                  </video>
                )}
                {playItem && selectedNft?.metadata?.properties.itemtype == "audio" && (
                  <>
                    <audio className="w-full h-full" autoPlay loop>
                      <source src={selectedNft?.metadata?.animation_url}/>
                      Your browser does not support video tag. Upgrade your browser.
                    </audio>
                    <img
                      src={selectedNft?.metadata?.image}
                      className="h-full w-full object-cover"
                    />
                  </>
                )}
                {!playItem && (
                  <img
                    src={selectedNft?.metadata?.image}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full  bg-black/50 text-white md:h-10 md:w-10">
                {selectedNft?.metadata?.properties?.itemtype == "image" && (<IconImage/>)}
                {selectedNft?.metadata?.properties?.itemtype == "video" && (<IconVideo/>)}
                {selectedNft?.metadata?.properties?.itemtype == "audio" && (<MdAudiotrack/>)}
              </div>

              {playItem ? (
                <div 
                  className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white md:h-10 md:w-10 cursor-pointer"
                  onClick={() => setPlayItem(curVal => !curVal)}>
                  <BsPause size={25} /> 
                </div>
              ) : (
                <div 
                className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white md:h-10 md:w-10 cursor-pointer"
                onClick={() => setPlayItem(curVal => !curVal)}>
                  <BsPlay size={25}/>
                </div>
              )}
              

              <button
                className="absolute right-3 top-3 flex h-10 items-center justify-center rounded-full bg-black/50 px-3.5 text-white "
                onClick={addRemoveLike}
              >
                <svg
                  className="h-5 w-5 hover:animate-ping"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                    stroke="currentColor"
                    fill={isLiked ? '#ef4444' : ''}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                {metaDataFromSanity?.likedBy?.length > 0 ? (
                  <span className="ml-2 text-sm">
                    {millify(metaDataFromSanity?.likedBy?.length)}
                  </span>
                ) : (
                  <span className="ml-2 text-sm">0</span>
                )}
              </button>
            </div>

            <div className="mt-4 w-full rounded-2xl">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                        dark
                          ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                          : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                      } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        <HiOutlineDocumentText fontSize={18} />
                        <span className="text-lg">Description</span>
                      </div>
                      <BiChevronUp
                        className={`${
                          open ? 'transform transition' : 'rotate-180'
                        } h-5 w-5 text-neutral-500 transition`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                      {selectedNft?.metadata?.description}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`mt-3 flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                        dark
                          ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                          : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                      } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        <HiOutlineStar fontSize={18} />
                        <span className="text-lg">Properties</span>
                      </div>
                      <BiChevronUp
                        className={`${
                          open ? 'transform transition' : 'rotate-180 '
                        } h-5 w-5 text-neutral-500 transition`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-md flex flex-wrap justify-start gap-3 px-4 pt-4 pb-2">
                      {selectedNft?.metadata?.properties?.traits?.map(
                        (props, id) => (
                          <div
                            className={`w-[130px] rounded-xl border border-solid ${
                              dark
                                ? 'border-slate-600 bg-slate-700'
                                : 'border-sky-300 bg-sky-100'
                            } py-2 px-2 text-center transition  duration-500 hover:border-solid`}
                            key={id}
                          >
                            <p
                              className={
                                dark
                                  ? 'text-sm font-bold text-neutral-200'
                                  : 'text-sm font-bold text-sky-400'
                              }
                            >
                              {props.propertyKey}
                            </p>
                            <p
                              className={
                                dark ? 'text-neutral-100' : 'text-sky-500'
                              }
                            >
                              {props.propertyValue}
                            </p>
                            <p className="mt-2  py-0 text-center text-[0.7rem] font-bold">
                              <span
                                className={`w-fit rounded-md ${
                                  dark
                                    ? ' border border-slate-500 px-2 text-neutral-50'
                                    : 'border border-sky-300 px-2 text-sky-500'
                                }`}
                              >
                                100% Match
                              </span>
                            </p>
                          </div>
                        )
                      )}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`mt-3 flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                        dark
                          ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                          : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                      } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        <HiOutlineDotsVertical fontSize={18} />
                        <span className="text-lg">Details</span>
                      </div>
                      <BiChevronUp
                        className={`${
                          open ? 'transform transition' : 'rotate-180 '
                        } h-5 w-5 text-neutral-500 transition`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                      <div>
                        <div className="flex flex-row justify-between">
                          <span>Contract Address</span>
                          <span className="line-clamp-1 text-base">
                            {collectionid?.slice(0, 7)}...
                            {collectionid?.slice(-5)}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between py-4">
                          <span>Token ID</span>
                          <span className="line-clamp-1 text-base">
                            {selectedNft?.metadata?.id.toString()}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Blockchain</span>
                          <span className="line-clamp-1 text-base">
                            Polygon
                          </span>
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`mt-3 flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm ${
                        dark
                          ? ' bg-slate-800 text-neutral-100 hover:bg-slate-700'
                          : ' bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                      } focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        <HiOutlineQuestionMarkCircle fontSize={18} />
                        <span className="text-lg">
                          About {collectionData.name}
                        </span>
                      </div>
                      <BiChevronUp
                        className={`${
                          open ? 'transform transition' : 'rotate-180 '
                        } h-5 w-5 text-neutral-500 transition`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                      {collectionData.description}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
          <div className="border-t-2 border-neutral-200 pt-10 lg:border-t-0 lg:pt-0 xl:pl-10">
            <GeneralDetails
              selectedNft={selectedNft}
              listingData={listingData}
              collectionAddress={collectionid}
              nftCollection={collectionData}
            />

            <AuctionTimer
              selectedNft={selectedNft}
              listingData={listingData}
              auctionItem={isAuctionItem}
            />

            <Purchase
              selectedNft={selectedNft}
              listingData={listingData}
              nftCollection={collectionData}
              auctionItem={isAuctionItem}
            />

            <ItemActivity
              collectionAddress={collectionid}
              selectedNft={selectedNft}
            />
          </div>
        </div>
      </main>
      <RelatedNFTs collection={collectionData}/>
      <BrowseByCategory />
      <Footer />
    </div>
  )
}

export default Nft
