import millify from 'millify'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import { BiChevronUp } from 'react-icons/bi'
import Header from '../../components/Header'
import { MdAudiotrack } from 'react-icons/md'
import { Disclosure } from '@headlessui/react'
import { config } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { BsPause, BsPlay } from 'react-icons/bs'
import Purchase from '../../components/nft/Purchase'
import RelatedNFTs from '../../components/RelatedNFTs'
import ItemOffers from '../../components/nft/ItemOffers'
import BurnCancel from '../../components/nft/BurnCancel'
import ItemActivity from '../../components/nft/ItemActivity'
import AuctionTimer from '../../components/nft/AuctionTimer'
import { useThemeContext } from '../../contexts/ThemeContext'
import ReportActivity from '../../components/nft/ReportActivity'
import BrowseByCategory from '../../components/BrowseByCategory'
import GeneralDetails from '../../components/nft/GeneralDetails'
import { useAddress, useContract, useSigner } from '@thirdweb-dev/react'
import { IconAvalanche, IconBNB, IconEthereum, IconHeart, IconImage, IconPolygon, IconVideo } from '../../components/icons/CustomIcons'
import {
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineDotsVertical,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi'

const style = {
  wrapper: `flex flex-col pt-[5rem] sm:px-[2rem] lg:px-[8rem] items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}
const chainIcon = {
  '97': <IconBNB width="1.3rem" height="1.3rem" />,
  '56': <IconBNB width="1.3rem" height="1.3rem" />,
  '80001': <IconPolygon width="1.3rem" height="1.3rem" />,
  '137': <IconPolygon width="1.3rem" height="1.3rem" />,
  '5': <IconEthereum width="1.3rem" height="1.3rem" />,
  '4': <IconEthereum width="1.3rem" height="1.3rem" />,
  '43114': <IconAvalanche width="1.3rem" height="1.3rem" />,
  '43113': <IconAvalanche width="1.3rem" height="1.3rem" />,
}
const chainName = {
  '80001': 'Mumbai',
  '137': 'Polygon',
  '97': 'Binance Smart Chain Testnet',
  '56': 'Binance Smart Chain',
  '4': 'Rinkeby',
  '5': 'Goerli',
  '1': 'Ethereum',
  '43114': 'Avalanche',
  '43113': 'Avalanche Fuji',
}
// const rpcChains = {
//   '80001': process.env.NEXT_PUBLIC_INFURA_MUMBAI_URL,
//   '97': process.env.NEXT_PUBLIC_INFURA_TBNB_URL,
//   '4': process.env.NEXT_PUBLIC_INFURA_RINKEBY_URL,
//   '137': process.env.NEXT_PUBLIC_INFURA_POLYGON_URL,
//   '5': process.env.NEXT_PUBLIC_INFURA_GOERLI_URL,
// }

const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080' 
const FRONTHOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io' : 'http://localhost:3000' 

const Nft = (props) => { //props are from getServerSideProps

  const {nftContractData, metaDataFromSanity, listingData, thisNFTMarketAddress, thisNFTblockchain } = props;
  const [totalLikers, setTotalLikers] = useState(metaDataFromSanity?.likedBy?.length);
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const address = useAddress();
  const signer = useSigner();
  const [isLiked, setIsLiked] = useState(false)
  const [playItem, setPlayItem] = useState(false)
  const [thisNFTMarketContract, setThisNFTMarketContract] = useState();

  //get Market Contract signed with connected wallet otherwise get generic
  useEffect(()=>{
    if(!thisNFTMarketAddress && !thisNFTblockchain) {
      toast.error("Marketplace could not be found.", errorToastStyle);
      return;
    }

    ;(async () => {
      let sdk = '';
      if(signer) { 
        sdk = new ThirdwebSDK(signer); 
      }
      else { 
        sdk = new ThirdwebSDK(thisNFTblockchain); 
      }

      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");
      setThisNFTMarketContract(contract);
    })();

    return() => {
      // just clean up function, nothing else
    }
  }, [thisNFTMarketAddress, address, signer])


  let isAuctionItem = false;
  if(listingData?.reservePrice) {
    isAuctionItem = true;
  }

 
  
  //Add or Remove Likes/Heart
  const addRemoveLike = async (
    e,
    toastHandler = toast,
    sanityClient = config
  ) => {
    if (!address) {
      toastHandler.error(
        'Wallet not connected.',
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
      setTotalLikers(prev => prev - 1);
      toastHandler.success('You unliked this NFT.', successToastStyle);
      const likerToRemove = [`likedBy[_ref == "${address}"]`]
      await sanityClient
        .patch(metaDataFromSanity?._id)
        .unset(likerToRemove)
        .commit()
        .then(() => {
;          //remove from state variable too , to reflect updated likes count value
          const filteredLikers = metaDataFromSanity.likedBy.filter((likers) => {
            return likers._ref != address
          })
          // setMetadataFromSanity({
          //   ...metaDataFromSanity,
          //   likedBy: filteredLikers,
          // })

        })
        .catch((err) => {
          console.log(err)
          toastHandler.error('Error in unliking.', errorToastStyle)
        })
    } else {
      //add like
      setIsLiked(true)
      setTotalLikers(prev => prev + 1);
      toastHandler.success('You liked this NFT.', successToastStyle)
      await sanityClient
        .patch(metaDataFromSanity?._id)
        .setIfMissing({ likedBy: [] })
        .insert('before', 'likedBy[0]', [{ _ref: address }])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {

          //add current user into likedby array
          filteredLikers = [
            ...metaDataFromSanity.likedBy,
            { _ref: address, _type: 'reference' },
          ]
          // setMetadataFromSanity({
          //   ...metaDataFromSanity,
          //   likedBy: filteredLikers,
          // })
        })
        .catch((err) => {
          // console.error(err)
          // toastHandler.error('Error in liking the NFT.', errorToastStyle)
        })
    }
  }

  //get Collection Data from Sanity
  // useEffect(() => {
  //   if (!tokenid) return //get NFT Items' meta data
  //   ;(async (sanityClient = config, marketplace = marketContract) => {
  //     // console.log(await marketData.getListing(1))
  //     const query = `*[_type == "nftItem" && _id == "${tokenid}"] {
  //         views, filepath, likedBy, likes, _id, chainId, listingid, id, name,
  //         ownedBy->,
  //         createdBy->,
  //         collection->
  //       }`
  //     const result = await sanityClient.fetch(query)

  //     setMetadataFromSanity(result[0])
  //     setCollectionData(result[0].collection)

  //     setRpcUrl(rpcChains[result[0]?.collection?.chainId])
      
  //       //get nft data from contract
  //       const sdk = new ThirdwebSDK(rpcUrl);
  //       const contract = await sdk.getContract(result[0].collection.contractAddress, "nft-collection");
  //       const nft = await contract.get(result[0].id)
  //       setNftContractData(nft)

  //       //get listing data of the nft from contract
  //       //market id: 0x0bFc480e8e9D391a0A601ed5B54151D3e526BACd

  //       // if(result[0].listingid != ""){

  //       // await axios
  //       //           .get(`${HOST}/api/nft/${tokenid}`)
  //       //           .then((res) => { 
  //       //             const data = res.data;
  //       //             setListingData(data)

  //       //             if (Boolean(data?.reservePrice)) {
  //       //               setIsAuctionItem(true)
  //       //             }

  //       //           });
          
  //       // }

  //   })()
  // }, [tokenid])

  // const { data: nftData, status: nftStatus } = useQuery(
  //   ['allnftss', metaDataFromSanity?.collection?.contractAddress],
  //   getAllNFTs(rpcUrl),
  //   {
  //     enabled: Boolean(metaDataFromSanity?.collection?.contractAddress) && Boolean(rpcUrl) && false,
  //     onError: () => {
  //       toast.error(
  //         'Error fetching NFTs. Refresh and try again.',
  //         errorToastStyle
  //       )
  //     },
  //     onSuccess: (res) => {

  //       const selectedNftItem = res.find(
  //         (nft) => nft.metadata.properties.tokenid == router.query.nftid
  //       )

  //       setSelectedNft(selectedNftItem)

  //       if (activeListings) {
  //         const listingItem = activeListings?.find(
  //           (marketNft) =>
  //             JSON.stringify(marketNft.asset?.id) ==
  //               JSON.stringify(selectedNftItem?.metadata.id) &&
  //             marketNft.assetContractAddress == metaDataFromSanity?.collection?.contractAddress
  //         )
  //         setListingData(listingItem)

  //         if (Boolean(listingItem?.reservePrice)) {
  //           setIsAuctionItem(true)
  //         }
  //       }
  //     },
  //   }
  // )

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

    return() => {
      //nothing , just clean up function
    }
  }, [metaDataFromSanity, address])

  

  return (
    <div
      className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white'}`}
    >
      <Header />
      <main className="container sm:px-[2rem] lg:px-[8rem] mx-auto mt-11 flex pt-[5rem] md:pt-[8rem]">
        <div className="grid w-full grid-cols-1 gap-10 px-[1.2rem] md:gap-14 lg:grid-cols-2">
          <div className="space-y-8">
            <div
              className={
                nftContractData?.owner?.toString() ==
                '0x0000000000000000000000000000000000000000'
                  ? 'disabled pointer-none relative opacity-50'
                  : 'relative'
              }
            >
              <div className="aspect-w-11 aspect-h-12 overflow-hidden rounded-3xl max-h-[38rem]">
                {playItem && nftContractData?.metadata?.properties.itemtype == "video" && (
                  <video className="w-full h-full" autoPlay loop>
                    <source src={nftContractData?.metadata?.animation_url}/>
                    Your browser does not support video tag. Upgrade your browser.
                  </video>
                )}
                {playItem && nftContractData?.metadata?.properties.itemtype == "audio" && (
                  <>
                    <audio className="w-full h-full" autoPlay loop>
                      <source src={nftContractData?.metadata?.animation_url}/>
                      Your browser does not support video tag. Upgrade your browser.
                    </audio>
                    <img
                      src={nftContractData?.metadata?.image}
                      className="h-full w-full object-cover"
                    />
                  </>
                )}
                {!playItem && (
                  <img
                    src={nftContractData?.metadata?.image}
                    className="h-full w-full object-cover"
                  />
                  // <img
                  //   src={selectedNft?.metadata?.image}
                  //   className="h-full w-full object-cover"
                  // />
                )}
              </div>

              <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full  bg-black/50 text-white md:h-10 md:w-10">
                {nftContractData?.metadata?.properties?.itemtype == "audio" ? <MdAudiotrack /> : nftContractData?.metadata?.properties?.itemtype  == "video" ? <IconVideo /> : <IconImage />}
              </div>

              {(nftContractData?.metadata?.properties?.itemtype == "audio" || nftContractData?.metadata?.properties?.itemtype == "video") && 
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
                {totalLikers > 0 ? (
                  <span className="ml-2 text-sm">
                    {millify(totalLikers)}
                  </span>
                ) : (
                  <span className="ml-2 text-sm">0</span>
                )}
              </button>
            </div>

            <GeneralDetails
              nftContractData={nftContractData}
              listingData={listingData}
              metaDataFromSanity={ metaDataFromSanity }
              />

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
                      {nftContractData?.metadata?.description}
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
                      {nftContractData?.metadata?.properties?.traits?.map(
                        (props, id) => (
                          <div key={id}>
                            {props.propertyKey != "" ? (

                            <div
                              className={`w-[130px] rounded-xl border border-solid ${
                                dark
                                  ? 'border-slate-600 bg-slate-700'
                                  : 'border-sky-200/70 bg-sky-100'
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
                                  dark ? 'text-neutral-100 text-sm' : 'text-sm text-sky-500'
                                }
                              >
                                {props.propertyValue}
                              </p>
                              {/* <p className="mt-2  py-0 text-center text-[0.7rem] font-bold">
                                <span
                                  className={`w-fit rounded-md ${
                                    dark
                                      ? ' border border-slate-500 px-2 text-neutral-50'
                                      : 'border border-sky-300 px-2 text-sky-500'
                                  }`}
                                >
                                  100% Match
                                </span>
                              </p> */}
                            </div>
                            ) : (<span className={`text-sm ${dark ? 'text-slate-500' : 'text-neutral-600'}`}>No properties defined.</span>)}
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
                        <div className="flex flex-row justify-between py-2">
                          <span>Contract Address</span>
                          <span className="line-clamp-1 text-base">
                            {metaDataFromSanity?.collection?.contractAddress?.slice(0, 7)}...
                            {metaDataFromSanity?.collection?.contractAddress?.slice(-5)}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between py-2">
                          <span>Token ID</span>
                          <span className="line-clamp-1 text-base">
                            {nftContractData?.metadata?.properties?.tokenid}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between py-2">
                          <span>Token Standard</span>
                          <span className={`line-clamp-1 text-xs border rounded-lg py-1 px-2 bg-slate-${dark ? '700' : '100'} border-slate-${dark ? '600' : '200'}`}>
                            {nftContractData?.type}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between py-2">
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
          <div className={`border-t ${dark ? ' border-slate-600' : ' border-neutral-200'} pt-10 lg:border-t-0 lg:pt-0 xl:pl-10`}>
            
            {/* {listingData && (parseInt(listingData?.secondsUntilEnd.hex, 16) != parseInt(listingData?.startTimeInSeconds.hex, 16)) && (
              <AuctionTimer
              selectedNft={selectedNft}
              listingData={listingData}
              auctionItem={isAuctionItem}
              />
              )} */}

            <Purchase
              nftContractData={nftContractData}
              listingData={listingData}
              nftCollection={metaDataFromSanity?.collection}
              auctionItem={isAuctionItem}
              thisNFTMarketAddress={thisNFTMarketAddress}
              thisNFTblockchain={thisNFTblockchain}
              />

            {/* {isAuctionItem && ( */}
              <ItemOffers
                selectedNft={nftContractData}
                listingData={listingData}
                metaDataFromSanity={metaDataFromSanity}
                thisNFTMarketAddress={thisNFTMarketAddress}
                thisNFTblockchain={thisNFTblockchain}
                />
             {/* )} */}

            <ItemActivity
              collectionAddress={metaDataFromSanity?.collection?.contractAddress}
              selectedNft={nftContractData}
              metaDataFromSanity={ metaDataFromSanity }
              />
            {address && (
              <ReportActivity
                collectionAddress={metaDataFromSanity?.collection?.contractAddress}
                selectedNft={nftContractData}
                metaDataFromSanity={ metaDataFromSanity }
              />
            )}
            <BurnCancel 
              nftContractData={nftContractData} 
              listingData={listingData} 
              collectionAddress={metaDataFromSanity?.collection?.contractAddress}
              thisNFTMarketAddress={thisNFTMarketAddress}
              thisNFTblockchain={thisNFTblockchain}
              />
          </div>
        </div>
      </main>
      <RelatedNFTs collection={metaDataFromSanity.collection} listingData={listingData} />
      <BrowseByCategory />
      <Footer />
    </div>
  )
}

export default Nft

export async function getServerSideProps(context){
  const { query } = context;
  var nftdata = "";
  var sanityData = "";
  var nftcontractdata = "";

  const response = await fetch(`${HOST}/api/nft/listing/${query.nftid}`); 
  if(response.status == 200) {nftdata = await response.json();}

  const response2 = await fetch(`${HOST}/api/nft/${query.nftid}`);
  if(response2.status == 200) { sanityData = await response2.json(); }


  const collectionAddress = sanityData.collection?.contractAddress;
  const response3 = await fetch(`${HOST}/api/nft/contract/${sanityData.chainId}/${collectionAddress}/${sanityData.id}`);
  if(response3.status == 200) { nftcontractdata = await response3.json(); }

  //determine which marketplace is current NFT is in

  const nftChainid = sanityData?.collection.chainId;
  const marketplace = {
    '80001': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
    '5': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
    '43113': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
    '43114': process.env.NEXT_PUBLIC_AVALANCE_MARKETPLACE,
    '97': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
    '421563': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
    '1': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
    '137': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
    '56': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
  }
  const blockchainName = {
    '80001': 'mumbai',
    '137': 'polygon',
    '43113': 'avalanche-fuji',
    '43114': 'avalanche',
    '97': 'binance-testnet',
    '56': 'binance',
    '421563': 'arbitrum-goerli',
    '5': 'goerli',
    '1': 'mainnet',
  }
  const marketAddress = marketplace[nftChainid];

  return {
    props: {
      listingData: nftdata,
      metaDataFromSanity: sanityData,
      nftContractData: nftcontractdata,
      thisNFTMarketAddress: marketAddress,
      thisNFTblockchain: blockchainName[nftChainid]
    }
  }
}