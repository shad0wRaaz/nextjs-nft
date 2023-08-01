import axios from 'axios'
import Sell from './Sell'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { BigNumber, ethers } from 'ethers'
import { config } from '../../lib/sanityClient'
import { TiWarningOutline } from 'react-icons/ti'
import { BsLightningCharge } from 'react-icons/bs'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useUserContext } from '../../contexts/UserContext'
import { RiAuctionFill, RiAuctionLine } from 'react-icons/ri'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md'
import { ChainId, NATIVE_TOKENS, ThirdwebSDK } from '@thirdweb-dev/sdk'
import { IconLoading, IconOffer, IconWallet } from '../icons/CustomIcons'
import { getMyPayingNetwork, getUser } from '../../fetchers/SanityFetchers'
import { updateSingleUserDataToFindMaxPayLevel } from '../../utils/utilities'
import { useChainId, useAddress, useSigner, useSwitchChain } from '@thirdweb-dev/react'
import { saveTransaction, addVolumeTraded, sendReferralCommission, updatePayableLevel, updateBoughtNFTs } from '../../mutators/SanityMutators'

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-md `,
  price: 'flex gap-[10px] items-center mb-4',
  priceValue: 'text-2xl font-bold',
  buttons: 'flex',
}
const blockchainNum = {
  "mumbai" : 80001,
  "polygon": 137,
  "binance-testnet": 97,
  "binance": 56,
  "avalanche-fuji": 43113,
  "avalanche": 43114,
  "goerli": 5,
  "mainnet": 1,
}
const currency = {
  "mumbai" : { offerCurrency: "WMATIC", bidCurrency: "MATIC" },
  "polygon": { offerCurrency: "WMATIC", bidCurrency: "MATIC" },
  "binance-testnet": { offerCurrency: "TBNB", bidCurrency: "TBNB" },
  "binance": { offerCurrency: "BNB", bidCurrency: "BNB" },
  "avalanche-fuji": { offerCurrency: "AVAX", bidCurrency: "AVAX" },
  "avalanche": { offerCurrency: "AVAX", bidCurrency: "AVAX" },
  "goerli": { offerCurrency: "ETH", bidCurrency: "ETH" },
  "mainnet": { offerCurrency: "ETH", bidCurrency: "ETH" },
}

const MakeOffer = ({
  nftContractData,
  nftCollection,
  listingData,
  auctionItem,
  thisNFTMarketAddress,
  thisNFTblockchain,
  ownerData,
  splitContract,
  royaltySplitData
}) => {

  var listed = true
  if(listingData?.message || !listingData) {
    listed = false
  }

  const { coinPrices, loadingNewPrice, setLoadingNewPrice, HOST, referralCommission, referralAllowedCollections, blockchainIdFromName, refs } = useSettingsContext();
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const {myUser} = useUserContext();
  const chainId = useChainId();
  const address = useAddress();
  const signer = useSigner();
  const settingRef = useRef();
  const bidsettingRef = useRef();
  const [offerAmount, setOfferAmount] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const queryClient = useQueryClient();
  const [buyLoading, setBuyLoading] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  const [coinMultiplier, setCoinMultiplier] = useState();
  const [closeBidLoading, setCloseBidLoading] = useState();
  const burntOwnerAddress = "0x0000000000000000000000000000000000000000";
  const isburnt = nftContractData.owner == burntOwnerAddress ? true : false;
  const router = useRouter();
  const [minNextBig, setMinNextBig] = useState(0);
  const [testnet, setTestnet] = useState(false);
  const switchChain = useSwitchChain();
  const [isAllowedSeperateCommission, setAllowedSeperateCommission] = useState(false);

  const { mutate: mutateSaveTransaction } = useMutation(
    ({ transaction, id, eventName, price, chainid, itemid }) =>
      saveTransaction({
        transaction,
        id,
        eventName,
        price,
        chainid,
        itemid,
      }),
    {
      onError: () => {
        toast.error(
          'Error saving transaction. Contact administrator.',
          errorToastStyle
        )
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries(['eventData']);
        queryClient.invalidateQueries(['activities']);
        queryClient.invalidateQueries(['marketplace']);
      },
    }
  )

  const { mutate: addVolume } = useMutation(
    ({ id, volume }) =>
      addVolumeTraded({ id, volume }),
    {
      onError: () => {
        toast.error('Error in adding Volume Traded.', errorToastStyle)
      },
    }
  )

  const { mutate: updateLevel } = useMutation(
    ({walletAddress, level}) => updatePayableLevel({walletAddress, level}),
    {
      onError: (err) =>{ toast.error('Commission level could not be updated', errorToastStyle);},
      onSuccess: (res) => {  }
    }
  );

  const { mutate: changeBoughtNFTs } = useMutation(
    ({ walletAddress, chainId, contractAddress, tokenId, payablelevel, type}) => updateBoughtNFTs({ walletAddress, chainId, contractAddress, tokenId, payablelevel, type}),
    {
      onError: (err) => { console.log(err); },
      onSuccess: (res) => { console.log(res)}
    }
  )
  
  const currencyChainMatcher = {
      "80001": "MATIC",
      "137" : "MATIC",
      "1": "ETH",
      "5": "ETH",
      "43113": "AVAX",
      "43114": "AVAX",
      "97": "TBNB",
      "56": "BNB"
  }

  //check for testnet NFTs
  useEffect(() => {
    if(!nftCollection) return
    const testnets = ["binance-testnet", "mumbai", "goerli", "avalanche-fuji"]
    if(testnets.includes(thisNFTblockchain)){
      setTestnet(true);
    }
    //check if this collection has seperate commission list

    if(!referralAllowedCollections) return
    const allAllowedCollections = referralAllowedCollections.map(collection => collection._ref);

    if(allAllowedCollections.includes(nftCollection?._id)){
      setAllowedSeperateCommission(true);
    }
    return() => {
//clean up function
    }

  }, [referralAllowedCollections]);

  useEffect(() => {
    if (!listingData) return

    //get currency symbol from market(listed) nft item
    const currencySymbol = listingData?.buyoutCurrencyValuePerToken?.symbol;

    if (currencySymbol == 'MATIC') {
      setCoinMultiplier(coinPrices?.maticprice);
    } else if (currencySymbol == 'ETH') {
      setCoinMultiplier(coinPrices?.ethprice);
    } else if (currencySymbol == 'AVAX') {
      setCoinMultiplier(coinPrices?.avaxprice);
    } else if (currencySymbol == 'BNB' || currencySymbol == "TBNB" || currencySymbol == "tBNB") {
      setCoinMultiplier(coinPrices?.bnbprice);
    }

    if(auctionItem){
      //get minimum next bid
      ;(async() => {
        const sdk = signer ? new ThirdwebSDK(signer) : new ThirdwebSDK(thisNFTblockchain, {
          clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
        });
        const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace-v3");
        const minBid = await contract?.englishAuctions?.getMinimumNextBid(listingData?.id);
        setMinNextBig(minBid);
        // console.log(minBid);
  
      })()
    }

    return() => {
      //do nothing
    }
  }, [listingData, coinPrices])

  const convertBuyPricetoBNB = (price) => {
    if(!nftCollection) return null
    switch(nftCollection?.chainId){
      case "97":
        return price;
      case "56":
        return price;
      case "80001":
        return (Number(price) * Number(coinPrices.maticprice) / Number(coinPrices.bnbprice));
      case "137":
        return (Number(price) * Number(coinPrices.maticprice) / Number(coinPrices.bnbprice));
      case "1":
        return (Number(price) * Number(coinPrices.ethprice) / Number(coinPrices.bnbprice));
      case "5":
        return (Number(price) * Number(coinPrices.ethprice) / Number(coinPrices.bnbprice));
      case "43113":
        return (Number(price) * Number(coinPrices.avaxprice) / Number(coinPrices.bnbprice));
      case "43114":
        return (Number(price) * Number(coinPrices.avaxprice) / Number(coinPrices.bnbprice));
      default:
        return null;
    }
  }

  const updateRoyaltyReceiver = async () => {
    if(!referralAllowedCollections || !listingData) return;
    const allowedContracts = referralAllowedCollections.map(coll => coll._ref);
    const companyWallets = [
      String(process.env.NEXT_PUBLIC_RENDITIONS_WALLET_ADDRESS).toLowerCase(),
      String(process.env.NEXT_PUBLIC_DEPICTIONS_WALLET_ADDRESS).toLowerCase(),
      String(process.env.NEXT_PUBLIC_CREATIONS_WALLET_ADDRESS).toLowerCase(),
      String(process.env.NEXT_PUBLIC_VISIONS_WALLET_ADDRESS).toLowerCase(),
    ]
    if((listingData.sellerAddress == '0x4A70209B205EE5C060E3065E1c5E88F3e6BA26Bf' || companyWallets.includes(String(listingData.sellerAddress).toLowerCase())) && allowedContracts.includes(nftCollection._id)) 
    {
      // console.log('processing change of royalty receiver')
      await axios.post(`${HOST}/api/nft/setroyaltybytoken`,
      {
        contractAddress: listingData.assetContractAddress, 
        walletAddress: address, 
        tokenId: parseInt(listingData.tokenId.hex, 16),
        chain: thisNFTblockchain,
      });
    }
  }

  const payToMySponsors = async() => {

     // checking amount of tokens to send
    //  const bigNumberPrice = parseInt(listingData.buyoutPrice?.hex, 16);
    //  const divider = BigNumber.from(10).pow(18);
     let buyOutPrice = ethers.utils.formatUnits(listingData?.buyoutPrice?.hex, 18);

    if(!referralCommission) {
      toast.error("Referral commission could not be found", errorToastStyle);
      return;
    }
    let sponsors = [];
    const payNetwork = await getMyPayingNetwork(address);

    let network = updateSingleUserDataToFindMaxPayLevel(payNetwork[0],refs);
    if(Boolean(network?.sponsor)){
      network = {
        ...network,
        sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor, refs)
      }

      if(Boolean(network?.sponsor?.sponsor)){
        network = {
          ...network,
          sponsor: {
            ...network.sponsor,
            sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor, refs),
          }
        }

        if(Boolean(network?.sponsor?.sponsor?.sponsor)){
          network = {
            ...network,
            sponsor: {
              ...network.sponsor,
              sponsor: {
                ...network.sponsor.sponsor,
                sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor.sponsor, refs)
              }
            }
          }
        }

        if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor)){
          network = {
            ...network,
            sponsor: {
              ...network.sponsor,
              sponsor: {
                ...network.sponsor.sponsor,
                sponsor:{
                  ...network.sponsor.sponsor.sponsor,
                  sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor.sponsor.sponsor, refs)
                }
              }
            }
          }
        }

        if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor?.sponsor)){
          network = {
            ...network,
            sponsor: {
              ...network.sponsor,
              sponsor: {
                ...network.sponsor.sponsor,
                sponsor:{
                  ...network.sponsor.sponsor.sponsor,
                  sponsor: {
                    ...network.sponsor.sponsor.sponsor.sponsor,
                    sponsor: updateSingleUserDataToFindMaxPayLevel(network.sponsor.sponsor.sponsor.sponsor.sponsor, refs)
                  }
                }
              }
            }
          }
        }
      }
      // console.log(network);
    }


    
    // const tokenPriceinBNB = convertBuyPricetoBNB(buyOutPrice);
    if(Boolean(network?.sponsor) && network?.sponsor?.paylevel >= 1){

      let sponsor_L1 = network.sponsor.walletAddress;
      let sponsor_L1_rate = isAllowedSeperateCommission ? nftCollection?.referralrate_one : referralCommission.referralrate_one;
      sponsors.push({ receiver: sponsor_L1, token: buyOutPrice * sponsor_L1_rate / 100 });  
    }
      if(Boolean(network?.sponsor?.sponsor) && network?.sponsor?.sponsor?.paylevel >= 2){
        let sponsor_L2 =  network.sponsor.sponsor.walletAddress;
        let sponsor_L2_rate = isAllowedSeperateCommission ? nftCollection?.referralrate_two : referralCommission.referralrate_two;
        sponsors.push({ receiver: sponsor_L2, token: buyOutPrice * sponsor_L2_rate / 100 });
      }

      if(Boolean(network?.sponsor?.sponsor?.sponsor) && network?.sponsor?.sponsor?.sponsor?.paylevel >= 3){
        let sponsor_L3 =  network.sponsor.sponsor.sponsor.walletAddress;
        let sponsor_L3_rate = isAllowedSeperateCommission ? nftCollection?.referralrate_three : referralCommission.referralrate_three;
        sponsors.push({ receiver: sponsor_L3, token: buyOutPrice * sponsor_L3_rate / 100 });
      }

      if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor) && network?.sponsor?.sponsor?.sponsor?.sponsor?.paylevel >= 4){
        let sponsor_L4 =  network.sponsor.sponsor.sponsor.sponsor.walletAddress;
        let sponsor_L4_rate = isAllowedSeperateCommission ? nftCollection?.referralrate_four : referralCommission.referralrate_four;
        sponsors.push({ receiver: sponsor_L4, token: buyOutPrice * sponsor_L4_rate / 100 });
      }

      if(Boolean(network?.sponsor?.sponsor?.sponsor?.sponsor?.sponsor) && network?.sponsor?.sponsor?.sponsor?.sponsor?.sponsor?.paylevel >= 5){
        let sponsor_L5 =  network.sponsor.sponsor.sponsor.sponsor.sponsor.walletAddress;
        let sponsor_L5_rate = isAllowedSeperateCommission ? nftCollection?.referralrate_five : referralCommission.referralrate_five;
        sponsors.push({ receiver: sponsor_L5, token: buyOutPrice  * sponsor_L5_rate / 100 });
      }
      // console.log(sponsors)
    // return;

    //send the tokens and get list of transaction hash to save in database
    const tx = sendReferralCommission(sponsors, address, nftCollection.chainId, thisNFTblockchain);


  }

  //function to make offer for nfts
  const makeAnOffer = async (
    listingId = listingData.id.toString(),
    quantityDesired = 1,
    toastHandler = toast,
    qc = queryClient
  ) => {
    if (!address || !signer) {
      toastHandler.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
      )
      return
    }
    if(offerAmount <= 0){
      toastHandler.error('Invalid Offer Amount entered.', errorToastStyle);
      return
    }
    
    if(!listingData) return

    //check if the conencted wallet is in same chain
    // if(currencyChainMatcher[chainId] != listingData?.buyoutCurrencyValuePerToken.symbol && listingData?.message != 'NFT data not found'){
    //   toast.error("Wallet is connected to wrong chain. Switch to correct chain.", errorToastStyle);
    //   // switchNetwork(Number(nftCollection?.chainId));
    //   return
    // }

    if(blockchainIdFromName[thisNFTblockchain] != chainId.toString()){
      toast.error('Wallet is connected to wrong chain. Switch to correct chain', errorToastStyle);
      switchChain(Number(nftCollection.chainId)).catch(err => { console.log(err)});
      return;
    }

    try {
      setOfferLoading(true); 
      const sdk = new ThirdwebSDK(signer, {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
      });
      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace-v3");

      const tx = await contract?.offers.makeOffer(
              {
                assetContractAddress: nftContractData?.contract,
                tokenId: nftContractData?.tokenId,
                quantity: quantityDesired,
                totalPrice: offerAmount,
            }).catch(err => {
              setOfferLoading(false);
              setOfferAmount(0); 
              openOfferSetting('none');
              toast.error("Error in buying. Possible reason: Insufficient funds or Wrapped tokens", errorToastStyle);
            });
      if(tx){
        //save transaction
        // mutateSaveTransaction({
        //   transaction: tx,
        //   id: nftContractData.metadata.id.toString(),
        //   eventName: 'Offer',
        //   itemid: nftContractData.metadata.properties.tokenid,
        //   price: offerAmount.toString(),
        //   chainid: chainId,
        // });
  
        qc.invalidateQueries(['activities']);
        qc.invalidateQueries(['eventData']);
        qc.invalidateQueries(['marketplace']);
  
        toastHandler.success('Offer has been placed.', successToastStyle);
        setOfferLoading(false);
        setOfferAmount(0);
        openOfferSetting('none');
      }


    } catch (error) {
      console.log(error)
      if(error.toString().search("execution reverted: !BAL20")) {
        toastHandler.error('Not enough Wrapped Token to make an offer.', errorToastStyle)
      }else {
        toastHandler.error("Error placing offer.", errorToastStyle)
      }
      setOfferLoading(false)
    }
  }

  const bidItem = async ( 
    listingId = listingData.id.toString(),
    toastHandler = toast,
    qc = queryClient
  ) => {
    // console.log(listingId)


    if (!address) {
      toastHandler.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
      )
      return
    }
    if(bidAmount <= 0 || (bidAmount < Number(minNextBig.displayValue))){
      toastHandler.error('Bidding amount must be higher than minimum bidding amount.', errorToastStyle);
      return
    }
    try {

      //check if the conencted wallet is in same chain
      // if(currencyChainMatcher[chainId] != listingData?.buyoutCurrencyValuePerToken.symbol && listingData?.message != 'NFT data not found'){
      //   toast.error("Wallet is connected to wrong chain. Switch to correct chain.", errorToastStyle);
      //   // switchNetwork(Number(nftCollection?.chainId));
      //   return
      // }
      if(blockchainIdFromName[thisNFTblockchain] != chainId.toString()){
        toast.error('Wallet is connected to wrong chain. Switch to correct chain', errorToastStyle);
        switchChain(Number(nftCollection.chainId)).catch(err => { console.log(err)});
        return;
      }

      setBidLoading(true)
      // await module.setBidBufferBps(500) //bid buffer, next bid must be at least 5% higher than the current bid
      const sdk = new ThirdwebSDK(signer, {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
      });
      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace-v3");

      const tx = await contract.englishAuctions.makeBid(listingId, bidAmount)
          .catch(err => {
            setBidLoading(false);
            setBidAmount(0); 
            openBidSetting('none');
            toast.error("Error in bidding. Possible reason: Insufficient funds", errorToastStyle);
          })
      if(tx) {
        toastHandler.success('Bid placed successfully', successToastStyle);
        
        //save transaction
        // mutateSaveTransaction({
        //   transaction: tx,
        //   id: nftContractData.metadata.id.toString(),
        //   eventName: 'Bid',
        //   itemid: nftContractData.metadata.properties.tokenid,
        //   price: bidAmount.toString(),
        //   chainid: chainId,
        // });
        qc.invalidateQueries(['activities']);
        qc.invalidateQueries(['eventData']);
        qc.invalidateQueries(['marketplace']);
      }
    } catch (error) {
      // console.log(error)
      toastHandler.error(error.message, errorToastStyle)
    }
    setBidAmount(0);
    setBidLoading(false)
    openBidSetting('none');
  }

  const buyItem = async (
    listingId = listingData?.id?.toString(),
    quantityDesired = 1,
    toastHandler = toast,
    qc = queryClient,
    sanityClient = config
    ) => {
     
      if(!listingData) {
        toastHandler.error('NFT listing not found', errorToastStyle);
        return;
      }
      if (!address || !signer) {
        toastHandler.error(
          'Wallet not connected. Connect wallet first.',
          errorToastStyle
          )
          return
        }
        try {
          //check if the conencted wallet is in same chain
          //check for correct connected chain with nft chain
          if(nftCollection.chainId != chainId.toString()){
            toast.error('Wallet is connected to wrong chain. Switch to correct chain', errorToastStyle);
            switchChain(Number(nftCollection.chainId)).catch(err => { console.log(err)});
            return;
          }

          setBuyLoading(true);
          setLoadingNewPrice(true);

          const sdk = new ThirdwebSDK(signer, {
            clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
          });
          const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace-v3");

          // const bigNumberPrice = parseInt(listingData.buyoutPrice?.hex, 18);
          // const divider = BigNumber.from(10).pow(18);
          // const buyOutPrice = bigNumberPrice / divider;
          const buyOutPrice = ethers.utils.formatUnits(listingData.buyoutPrice.hex, 18);

          const tx = await contract.directListings
                          .buyFromListing(listingId, quantityDesired, address)
                          .catch(err => 
                              {
                                console.log(err)
                                setBuyLoading(false);
                                setLoadingNewPrice(false); 
                                toast.error("Error in buying. Possible reason: Insufficient funds", errorToastStyle);
                              });
          if(tx){
            console.log(splitContract, royaltySplitData[0].address, process.env.NEXT_PUBLIC_ENX_KEY);
            const result = await axios.post(`${HOST}/api/nft/distributeToken`, {
              splitContract,
              walletAddress: royaltySplitData[0].address,
              key: process.env.NEXT_PUBLIC_ENX_KEY,
              chain: thisNFTblockchain,
            }).catch(err => {
              console.log(err)
            });
            console.log(result);
      
              // mutateSaveTransaction({
              //   transaction: tx,
              //   id: nftContractData.tokenId,
              //   eventName: 'Buy',
              //   itemid: nftContractData.metadata.properties.tokenid,
              //   price: buyOutPrice.toString(),
              //   chainid: chainId,
              // })
              // console.log(tx)
              if(Boolean(nftCollection)){
                const volume2Add = parseFloat(buyOutPrice * coinMultiplier);
                
                //adding volume to Collection
                addVolume({
                  id: nftCollection?._id,
                  volume: volume2Add,
                });
          
                //adding volume to the user
                addVolume({
                  id: String(address).toLowerCase(),
                  volume: volume2Add
                });

                //update pay info-> list of all bought NFTs from the selected Collections
                const payObj =  {
                  walletAddress: address,
                  chainId: nftCollection.chainId,
                  contractAddress: listingData.assetContractAddress,
                  tokenId: listingData.asset.id,
                  payablelevel: Boolean(nftCollection.payablelevel) ? nftCollection.payablelevel : 1,
                  type: 'buy'
                }
                changeBoughtNFTs(payObj); // this will change buyer's bought NFT field -> add NFT
                
                // //also update the bought NFTs from seller address
                // //no need to do this if the seller is company
                if(listingData.sellerAddress != process.env.NEXT_PUBLIC_TEST_COMPANY_WALLET_ADDRESS && listingData.sellerAddress != process.env.NEXT_PUBLIC_COMPANY_WALLET_ADDRESS){
                  const sellObj = {
                    ...payObj,
                    walletAddress: listingData?.sellerAddress,
                    type: 'sell',
                  }
                  changeBoughtNFTs(sellObj); // this will change seller's bought NFT field -> remove NFT
                }
                
                //no need to do updateLevel, as this will now be handled using boughtnfts field
                //check payable commission level, only update if new nft collection has higher level the user's current payable level
                // const userlevel = Boolean(myUser?.payablelevel) ? Number(myUser.payablelevel) : 0;
                // const collectionlevel = Boolean(nftCollection?.payablelevel) ? Number(nftCollection.payablelevel) : 0;

                // if(collectionlevel > userlevel) {
                //   updateLevel(
                //     { 
                //       walletAddress: address, 
                //       level: nftCollection?.payablelevel
                //     }
                //   );
                // }
          
                // payout to network
                await payToMySponsors();

                //change the unilevel of seller, if it applies


                //update the royalty receiver of the nft, only if this is first purchase and it is from the company
                await updateRoyaltyReceiver();
              }
        
              //update Owner in Database
              // await sanityClient
              //       .patch(nftContractData.metadata.properties.tokenid)
              //       .set({ "ownedBy" : { _type: 'reference', _ref: address} })
              //       .commit();
        
        
              qc.invalidateQueries(['activities']);
              qc.invalidateQueries(['owner']);
              qc.invalidateQueries(['marketplace']);
              
              //delete data from market data in mango
              ;(async() => {
                setLoadingNewPrice(true);
                await axios
                      .get(`${HOST}/api/mango/deleteSingle/${thisNFTblockchain}/${nftContractData?.contract}/${nftContractData?.tokenId}`)
                      .catch(err => console.log(err))
                      .then((res) =>{
                        setBuyLoading(false);
                        setLoadingNewPrice(false);
                        router.reload(window.location.pathname);
                        router.replace(router.asPath);
                        toastHandler.success('NFT bought successfully.', successToastStyle);
                      })
              })()

              //update listing data
              // await axios
              //       .get(`${HOST}/api/updateListings/${thisNFTblockchain}`)
              //       .finally(() => {
              //         router.reload(window.location.pathname);
              //         router.replace(router.asPath);
              //         setLoadingNewPrice(false);
              //         setBuyLoading(false)
              //         toastHandler.success('NFT purchase successful.', successToastStyle);
              //       });
          }
      
    } catch (error) {
      // console.log(error?.message)
      setBuyLoading(false);
      setLoadingNewPrice(false);
      toastHandler.error('Error in buying NFT', errorToastStyle);
      return
    }
  }
  const openOfferSetting = (value) => {
    if(!address) {
      toast.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
        )
      return
    }
    setOfferAmount(0);
    settingRef.current.style.display = value;
  }
  const openBidSetting = (value) => {
    setBidAmount(0);
    bidsettingRef.current.style.display = value;
  }

  const executeBiddingSales = async(
    listingId = listingData?.id?.toString(),
    toastHandler = toast,
    qc = queryClient,
    sanityClient = config
  ) => {
    if(!listingData) {
      toastHandler.error('NFT listing not found', errorToastStyle);
      return;
    }
    if (!address) {
      toastHandler.error(
        'Wallet not connected. Connect wallet first.',
        errorToastStyle
        )
        return
    }
    if(!signer){
      toast.error("Wallet not connected. Connect wallet first.", errorToastStyle);
      return
    }
    try{
      setCloseBidLoading(true);
      const sdk = new ThirdwebSDK(signer, {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
      });
      const contract = await sdk.getContract(thisNFTMarketAddress, "marketplace");
      
      const tx = await contract.auction.executeSale(listingId);
      
      //save transaction
      // mutateSaveTransaction({
      //   transaction: tx,
      //   id: nftContractData.metadata.id.toString(),
      //   eventName: 'Offer',
      //   itemid: nftContractData.metadata.properties.tokenid,
      //   price: offerAmount.toString(),
      //   chainid: chainId,
      // });

      qc.invalidateQueries(['activities']);
      qc.invalidateQueries(['eventData']);
      qc.invalidateQueries(['marketplace']);
      await axios
      .get(`${HOST}/api/updateListings/${thisNFTblockchain}`)
      .finally(() => {
        router.reload(window.location.pathname);
        router.replace(router.asPath);
        setCloseBidLoading(false);
        toastHandler.success('Bidding has been closed and the sales has been executed.', successToastStyle);
      });
      
      
    }catch(error){
      console.log(error)
      toastHandler.error("Error in closing the auction.", errorToastStyle);
    }



  }


  return (
    <div className="">
      {testnet && (
        <span className="inline-flex items-center rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-700 mb-5">
          <TiWarningOutline fontSize={18}/> Testnet NFT
        </span>
      )}
      {listed && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mt-4">
          <div className="relative flex flex-1 flex-col items-center rounded-xl border-2 border-green-500 p-6 sm:flex-row justify-center">
            <span className="absolute bottom-full translate-y-3 rounded-lg bg-green-500 py-1 px-1.5 text-sm text-white">
              Current Price
            </span>
            {loadingNewPrice ? (
            <div className="flex gap-2 justify-center text-md text-green-500 text-center w-full">
              <IconLoading color="rgb(34 197 94)" /> Loading
            </div>) : (
              <>
                <span className="text-3xl font-semibold text-green-500 xl:text-4xl">
                  {parseInt(listingData?.buyoutPrice.hex, 16) / Math.pow(10, 18)}{' '}
                  {listingData?.buyoutCurrencyValuePerToken?.symbol}
                </span>
                {coinMultiplier && (
                  <span className="text-lg text-neutral-400 sm:ml-5">
                    ( ≈ $
                    {parseFloat((parseInt(listingData?.buyoutPrice.hex, 16) / Math.pow(10, 18)) * coinMultiplier).toFixed(5)}
                    )
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {!listed && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center mt-4">
          <div className={`relative flex flex-1 flex-col ${isburnt ? 'bg-red-500' : ''} items-baseline justify-center rounded-xl border-2 border-red-500 p-6 sm:flex-row`}>
            {loadingNewPrice ? (
              <div className="flex gap-2 justify-center text-red-500 text-center w-full">
              <IconLoading color="rgb(239 68 68)" /> Loading
            </div>
            ) :(
              <>
              {isburnt ? (
                <div className="flex gap-2 text-md text-neutral-100 xl:text-md">
                  <BsLightningCharge className="text-xl" /> Burnt NFT
                </div>
              ) : (
                <span className="text-xl text-red-500 xl:text-md">
                  Not listed
                </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
        {!listed && (String(address).toLowerCase() == String(ownerData?.ownerOf).toLowerCase()) && (
          <Sell
            nftContractData={nftContractData}
            nftCollection={nftCollection}
            thisNFTMarketAddress={thisNFTMarketAddress}
            thisNFTblockchain={thisNFTblockchain}
          />
        )}
        {/* nftContractData?.owner <- this was in place of -> ownerData?.ownerOf */}
        {listed && address?.toLowerCase() != ownerData?.ownerOf.toLowerCase() && !auctionItem && (
          <>
            {buyLoading ? (
              <div className="gradBlue relative inline-flex flex-1 h-auto cursor-wait items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base">
                <IconLoading dark="inbutton" />
                <span className="ml-2.5">Processing...</span>
              </div>
            ) : (
              <div
                className={`gradBlue ${offerLoading && 'pointer-events-none opacity-60'} relative inline-flex h-auto flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base`}
                onClick={() => buyItem()}
              >
                <IconWallet />
                <span className="ml-2.5">Buy</span>
              </div>
            )}
            {!isAllowedSeperateCommission && (
              <>
                {offerLoading ? (
                  <div className={`transition relative inline-flex flex-1 w-full h-auto cursor-pointer items-center justify-center rounded-xl border ${dark ? 'border-slate-700 bg-slate-700 text-neutral-100 hover:bg-slate-600' : 'border-neutral-200 bg-white text-slate-700 hover:bg-neutral-100'} px-4 py-3 text-sm font-medium  transition-colors  focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base`}>
                    <IconLoading dark={dark ? 'inbutton' : ''}/>
                    <span className="ml-2.5">Processing...</span>
                  </div>
                  ):(
                      <div
                        className={`transition ${buyLoading && 'pointer-events-none opacity-60'} relative inline-flex flex-1 w-full h-auto cursor-pointer items-center justify-center rounded-xl border ${dark ? 'border-slate-700 bg-slate-700 text-neutral-100 hover:bg-slate-600' : 'border-neutral-200 bg-white text-slate-700 hover:bg-neutral-100'} px-4 py-3 text-sm font-medium  transition-colors  focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base`}
                        onClick={() => openOfferSetting('block')}>
                          <IconOffer />
            
                          <span className="ml-2.5"> Offer</span>
                      </div>  
                )}
              </>
            )}

          </>
        )}

        {listed &&
          auctionItem &&
          listingData.sellerAddress.toLowerCase() != address?.toLowerCase() && (
            <div className="flex justify-between items-center flex-grow gap-2 flex-col md:flex-row">
              {!auctionItem && (
                <div className="gradBlue relative w-full inline-flex h-auto flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base">
                  <IconWallet /> <span className="ml-2.5">Buy</span>
                </div>
              )}
              {bidLoading ? (
                <div className={`transition relative inline-flex flex-1 w-full h-auto cursor-pointer items-center justify-center rounded-xl border ${dark ? 'border-slate-700 bg-slate-700 text-neutral-100 hover:bg-slate-600' : 'border-neutral-200 bg-white text-slate-700 hover:bg-neutral-100'} px-4 py-3 text-sm font-medium  transition-colors  focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base`}>
                  <IconLoading dark="inbutton" />
                  <span className="ml-2.5">Processing...</span>
                </div>
              ) : (
                <div
                  className={`transition gradBlue relative inline-flex flex-1 w-full h-auto cursor-pointer items-center justify-center rounded-xl border ${dark ? 'text-neutral-100 border-0' : 'border-neutral-200 text-neutral-100'} px-4 py-3 text-sm font-medium  transition-colors  focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-6 sm:text-base`}
                  onClick={() => openBidSetting('block')}
                >
                  <RiAuctionLine fontSize={20}/>
                  <span className="ml-2.5">Place a Bid</span>
                </div>
              )}
            </div>
          )}

          {listed && auctionItem &&
            listingData.sellerAddress.toLowerCase() == address?.toLowerCase() && (
              <div className="flex justify-between items-center flex-grow gap-2 flex-col md:flex-row">
                <div 
                  className="gradBlue relative w-full inline-flex h-auto flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-50  transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base"
                  onClick={() => executeBiddingSales()}>
                  <RiAuctionFill /> <span className="ml-2.5">Close Auction and Execute Sale</span>
                </div>
              </div>
            )
          }
      </div>

      {/* Offer Section Modal */}
      {!buyLoading && (
        <div className={`offerSetting w-full mt-4 p-4 rounded-xl hidden ${dark ? 'bg-slate-800' : 'bg-neutral-100'} ${offerLoading ? 'pointer-events-none opacity-40' : ''}`} ref={settingRef}>
            <div className="flex flex-wrap gap-4">
              <div className="inputControls flex flex-1">
                <div className={`text-sm p-3 border rounded-l-xl ${dark ? 'bg-slate-800 border-slate-700' : 'bg-neutral-200 border-neutral-200'}`}>
                  { currency[thisNFTblockchain].offerCurrency }
                </div>
                <input 
                  type="number" 
                  className={`border flex-1  text-sm p-3 ring-0 outline-0 rounded-r-xl ${dark ? 'bg-slate-700 border-slate-700/50' : 'bg-white border-neutral-200 border-l-0'}`} 
                  placeholder="Enter amount to offer"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)} />
              </div>
              <div className="buttonControls flex flex-1">
                <button 
                  className={`gradBlue p-3 text-white rounded-xl px-6 flex items-center gap-2 w-full justify-center`}
                  onClick={() => makeAnOffer()}>
                    <MdOutlineCheckCircle /> Offer
                </button>
                <button 
                  className={`${dark ? 'bg-slate-700 border-slate-600 hover:bg-slate-500' :'bg-white hover:bg-blue-600 text-slate-800 hover:text-white border-netural-200'} transition border p-3 text-white items-center rounded-xl ml-3 px-6 flex gap-2 w-full justify-center`}
                  onClick={() => openOfferSetting('none')}>
                    <MdOutlineCancel /> Cancel
                </button>
              </div>
            </div>
            <p className="text-neutral-500 mt-2 text-center text-xs">You need to have Wrapped Token to make an offer.</p>
        </div>
      )}
      {/* End of Offer Modal Section */}

      {/* Bidding Section Modal*/}
      <div className={`offerSetting w-full mt-4 p-4 rounded-xl hidden ${dark ? 'bg-slate-800' : 'bg-neutral-100'} ${bidLoading ? 'pointer-events-none opacity-40' : ''}`} ref={bidsettingRef}>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="inputControls flex flex-1">
            <div 
              className={`text-sm p-3 border rounded-l-xl ${dark ? 'bg-slate-800 border-slate-700' : 'bg-neutral-200 border-neutral-200'}`}>
                { currency[thisNFTblockchain].bidCurrency }
            </div>
            <input 
              type="number" 
              className={`border flex-1  text-sm p-3 ring-0 outline-0 rounded-r-xl ${dark ? 'bg-slate-700 border-slate-700/50' : 'bg-white border-neutral-200 border-l-0'}`} 
              placeholder="Enter amount to offer"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)} />
          </div>
          {minNextBig ? (
            <p className="text-xs">
              Minimum Bid: {minNextBig.displayValue} {minNextBig.symbol}
            </p>
          ) : null}
          <div className="buttonControls flex flex-1">
            <button 
              className={`gradBlue p-3 text-white rounded-xl ml-0 px-6 flex items-center gap-2 w-full text-center justify-center`}
              onClick={() => bidItem()}>
                <MdOutlineCheckCircle /> Bid
            </button>
            <button 
              className={`${dark ? 'bg-slate-700 border-slate-600 hover:bg-slate-500' :'bg-white hover:bg-blue-600 text-slate-800 hover:text-white border-netural-200'} transition border p-3 justify-center text-white items-center rounded-xl ml-3 px-6 flex gap-2 w-full text-center`}
              onClick={() => openBidSetting('none')}>
                <MdOutlineCancel /> Cancel
            </button>
          </div>
        </div>
      </div>
      {/* End of Bidding Modal Section */}
    </div>
  )
}

export default MakeOffer
