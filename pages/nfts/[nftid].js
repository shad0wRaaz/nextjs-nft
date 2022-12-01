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
import { IconBNB, IconEthereum, IconHeart, IconImage, IconPolygon, IconVideo } from '../../components/icons/CustomIcons'
import {
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineDotsVertical,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi'
import { getAllNFTs } from '../../fetchers/Web3Fetchers'
import { BsPause, BsPlay } from 'react-icons/bs'
import { MdAudiotrack } from 'react-icons/md'
import ReportActivity from '../../components/nft/ReportActivity'
import ItemOffers from '../../components/nft/ItemOffers'
import axios from 'axios'

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
const chainIcon = {
  '97': <IconBNB width="1.3rem" height="1.3rem" />,
  '80001': <IconPolygon width="1.3rem" height="1.3rem" />,
  '5': <IconEthereum width="1.3rem" height="1.3rem" />,
  '4': <IconEthereum width="1.3rem" height="1.3rem" />
}
const chainName = {
  '80001': 'Mumbai',
  '97': 'Binance Smart Chain Testnet',
  '4': 'Rinkeby',
  '137': 'Polygon',
  '5': 'Goerli',
}
const rpcChains = {
  '80001': process.env.NEXT_PUBLIC_INFURA_MUMBAI_URL,
  '97': process.env.NEXT_PUBLIC_INFURA_TBNB_URL,
  '4': process.env.NEXT_PUBLIC_INFURA_RINKEBY_URL,
  '137': process.env.NEXT_PUBLIC_INFURA_POLYGON_URL,
  '5': process.env.NEXT_PUBLIC_INFURA_GOERLI_URL,
}

const Nft = () => {
  const { dark } = useThemeContext()
  const { activeListings, rpcUrl, setRpcUrl } = useMarketplaceContext()
  const address = useAddress()
  const [selectedNft, setSelectedNft] = useState()
  const [listingData, setListingData] = useState() //this will hold current or selected listing nft
  const [isAuctionItem, setIsAuctionItem] = useState(false) //identify for auctioned item

  const router = useRouter()
  const tokenid = router.query.nftid
  // const collectionContractAddress = ""
  // const collection = useNFTCollection(collectionContractAddress)

  const [collectionData, setCollectionData] = useState('')
  const [metaDataFromSanity, setMetadataFromSanity] = useState()
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
    if (!tokenid) return //get NFT Items' meta data
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && _id == "${tokenid}"] {
          views, likedBy, likes, _id, chainId, id, name,
          ownedBy->,
          createdBy->,
          collection->
        }`
      const result = await sanityClient.fetch(query)
      

      setMetadataFromSanity(result[0])
      setCollectionData(result[0].collection)

      setRpcUrl(rpcChains[result[0]?.collection?.chainId])
        // console.log(chainName[result[0]?.collection.chainId])
      
    })()

    ;(async() => {
      axios.get(`http://localhost:8080/api/nft/${tokenid}`).then(res => {
        console.log(res)
        // console.log(JSON.parse(res.data))
      })
    })()
  }, [tokenid])

  const { data: nftData, status: nftStatus } = useQuery(
    ['allnftss', metaDataFromSanity?.collection?.contractAddress],
    getAllNFTs(rpcUrl),
    {
      enabled: Boolean(metaDataFromSanity?.collection?.contractAddress) && Boolean(rpcUrl),
      onError: () => {
        toast.error(
          'Error fetching NFts. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: (res) => {

        const selectedNftItem = res.find(
          (nft) => nft.metadata.properties.tokenid == router.query.nftid
        )

        setSelectedNft(selectedNftItem)

        if (activeListings) {
          const listingItem = activeListings?.find(
            (marketNft) =>
              JSON.stringify(marketNft.asset?.id) ==
                JSON.stringify(selectedNftItem?.metadata.id) &&
              marketNft.assetContractAddress == metaDataFromSanity?.collection?.contractAddress
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
    setIsLiked(false)
    if (!address) return
    //check if current user has liked this NFT or not and set isLiked state accordingly
    if (metaDataFromSanity?.likedBy?.length > 0) {
      const amILiker = metaDataFromSanity.likedBy.find(
        (likers) => likers._ref == address
      )
      if (amILiker) {
        setIsLiked(true)
      }
    } else {
      setIsLiked(false)
    }
  }, [metaDataFromSanity, address])

  

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
                {selectedNft?.metadata?.properties?.itemtype == "audio" ? <MdAudiotrack /> : selectedNft?.metadata?.properties?.itemtype  == "video" ? <IconVideo /> : <IconImage />}
              </div>

              {(selectedNft?.metadata?.properties?.itemtype == "audio" || selectedNft?.metadata?.properties?.itemtype == "video") && 
                (<div 
                    className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white md:h-10 md:w-10 cursor-pointer"
                    onClick={() => setPlayItem(curVal => !curVal)}>
                    { playItem ? <BsPause size={25} /> : <BsPlay size={25}/> }
                </div>
                )
              }

              <button
                className="absolute right-3 top-3 flex h-10 items-center justify-center rounded-full bg-black/50 px-3.5 text-white "
                onClick={addRemoveLike}
              >
                <IconHeart color={isLiked ? '#ef4444' : ''} />
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
                            {metaDataFromSanity?.collection?.contractAddress?.slice(0, 7)}...
                            {metaDataFromSanity?.collection?.contractAddress?.slice(-5)}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between py-4">
                          <span>Token ID</span>
                          <span className="line-clamp-1 text-base">
                            {selectedNft?.metadata?.properties.tokenid}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Blockchain</span>
                          <span className="line-clamp-1 text-base">
                            {chainIcon[metaDataFromSanity?.collection?.chainId]}
                            {chainName[metaDataFromSanity?.collection?.chainId]}
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
                          About { metaDataFromSanity?.collection?.name }
                        </span>
                      </div>
                      <BiChevronUp
                        className={`${
                          open ? 'transform transition' : 'rotate-180 '
                        } h-5 w-5 text-neutral-500 transition`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-md px-4 pt-4 pb-2">
                      { metaDataFromSanity?.collection?.description }
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
              metaDataFromSanity={ metaDataFromSanity }
              />
            
            {/* {listingData && (parseInt(listingData?.secondsUntilEnd.hex, 16) != parseInt(listingData?.startTimeInSeconds.hex, 16)) && (
              <AuctionTimer
              selectedNft={selectedNft}
              listingData={listingData}
              auctionItem={isAuctionItem}
              />
              )} */}

            <Purchase
              selectedNft={selectedNft}
              listingData={listingData}
              nftCollection={metaDataFromSanity?.collection}
              auctionItem={isAuctionItem}
              />
            <ItemOffers
              selectedNft={selectedNft}
              listingData={listingData}
              metaDataFromSanity={metaDataFromSanity}
              />

            <ItemActivity
              collectionAddress={metaDataFromSanity?.collection?.contractAddress}
              selectedNft={selectedNft}
              metaDataFromSanity={ metaDataFromSanity }
              />
            {address && (
              <ReportActivity
                collectionAddress={metaDataFromSanity?.collection?.contractAddress}
                selectedNft={selectedNft}
                metaDataFromSanity={ metaDataFromSanity }
              />
            )}
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
