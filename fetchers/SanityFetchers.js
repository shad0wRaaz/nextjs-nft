import { config } from '../lib/sanityClient'
import axios from 'axios'
import { getCollectionData } from './Web3Fetchers'

const HOST = process.env.NODE_ENV == "production" ? 'https://nuvanft.io:8080' :'http://localhost:8080'

export const getUser = 
async (address) => {
  const query = `*[_type == "users" && walletAddress match "${address}"] {
      web3imagebanner, volumeTraded, biography, fbhHandle, followers, following, igHandle, web3imageprofile, twitterHandle, userName, walletAddress, _createdAt, payablelevel,
    }`
  const res = await config.fetch(query)
  return res[0]
}
export const checkReferralUser = 
async(address) => {
  const query = `*[_type == "users" && walletAddress == "${address}"] {
    walletAddress, _createdAt
  }`;
const res = await config.fetch(query)
return res;
}
export const checkUsername = 
async (username, walletaddress) => {
// console.log(username, walletaddress)
  const query = `*[_type == "users" && userName == "${username}"]`
  const res = await config.fetch(query);

  if(res.length > 0) {
    if (res[0].walletAddress != walletaddress){
      return true;
    }
  }
  return false;
}

export const checkDuplicateEmail = 
async (email, walletaddress) => {
  
  const query = `*[_type == "users" && email == "${email}"]`;
  const res = await config.fetch(query);

  if(res.length > 0){
    if(res[0].walletAddress != walletaddress){
      return true; //duplicate is found
    }
  }
  return false;
}

export const checkEmailVerification = 
async (id, randomCode) => {
  const query = `*[_type == "users" && _id == "${id}"]`
  const res = await config.fetch(query);

  if(res.length > 0){
    if(res[0].verified == true){
      // console.log('already verified')
      return true;
    }
    if(res[0].verificationcode == randomCode){
      //change verification status
      await config.patch(id).set({verified: true}).commit();
      return true; //email can be verified
    }
  }
  return false;
}

export const checkCollectionName = 
async (collectioname, collectionaddress) => {

  const query = `*[_type == "nftCollection" && name == "${collectioname}"]`
  const res = await config.fetch(query);
  
  if(res.length > 0) {
    if (res[0].contractAddress == collectionaddress){
      return true;
    }
  }
  return false;
}

export const getUserContinuously =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "users" && walletAddress match "${address}"] {
      web3imagebanner, biography, fbHandle, followers, following, igHandle, web3imageprofile, twitterHandle, userName, walletAddress, _createdAt, verified, payablelevel,
    }`
    const res = await config.fetch(query)
    return res[0]
  }

export const getReportActivities = 
(itemid) => async({queryKey}) => {

  const[_, collectionAddress] = queryKey;
  const query = `*[_type == "notifications" && item._ref == "${itemid}"] {_createdAt, eventTitle, description, from->} | order(_createdAt desc)`;
  const res = await config.fetch(query);
  return res
}

export const getNotifications =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "notifications" && to->walletAddress == "${address}"] {..., from->} | order(_createdAt desc)`
    const res = await config.fetch(query)
    return res
  }

export const getNFTCollectionsByCategory =
  () =>
  async ({ queryKey }) => {
    const [_, categoryName] = queryKey
    // const query = `*[_type == "nftCollection" && category == "${categoryName}"] {
    //     _id,
    //     name, 
    //     category, 
    //     contractAddress,
    //     web3imageprofile,
    //     web3imagebanner,
    //     description,
    //     chainId,
    //     floorPrice,
    //     volumeTraded,
    //     "creator": createdBy->userName,
    //     "creatorAddress" : createdBy->walletAddress,
    //     "allOwners" : owners[]->
    // }`
    // const res = await config.fetch(query)
    const result = await axios.get(`${HOST}/api/getNFTCollectionsByCategory/${categoryName}`)
    return result?.data
  }
export const getCollectionReferralSettings = 
() => async({ queryKey }) =>{
  try{
    const [_, id] = queryKey
    const query = `*[_type == "nftCollection" && _id == "${id}"]{referralrate_one, referralrate_two, referralrate_three, referralrate_four, referralrate_five, payablelevel}`
    const res = await config.fetch(query);
    return res[0];

  }catch(err){
    return null;
  }
}
export const getMyCollections =
  () =>
  async ({ queryKey }) => {
    const [_, address, chainId] = queryKey;

    const query = `*[_type == "nftCollection" && createdBy->walletAddress match "${address}" && chainId == "${chainId}"] {
        _id,
        web3imageprofile,
        web3imagebanner,
        volumeTraded,
        createdBy,
        chainId,
        contractAddress,
        "creator": createdBy->userName,
        "creatorAddress" : createdBy->walletAddress,
        name, 
        floorPrice,
      } | order(floorPrice asc)`
    const res = await config.fetch(query)
    return res
  }

export const getTopTradedNFTCollections = 
() => async ({queryKey}) => {
  const [_, blockchain] = queryKey;

  const collections = await axios.get(`${HOST}/api/topTradedCollections/${blockchain}`);
    return JSON.parse(collections.data);
}
export const getNewNFTCollection =
  (chainId) =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey;
    const query = `*[_type == "nftCollection" && contractAddress match "${collectionid}" && chainId == "${chainId}"] {
        _id,
        web3imageprofile,
        web3imagebanner,
        volumeTraded,
        createdBy,
        chainId,
        revealtime,
        contractAddress,
        "creator": createdBy->,
        name, floorPrice,
        "allOwners": owners[]->,
        description,
        showUnlisted,
        external_link,
        category,
        referralrate_one,
        referralrate_two,
        referralrate_three,
        referralrate_four,
        referralrate_five,
        payablelevel,
      }`;
    const res = await config.fetch(query)

    if(res.length == 0) {
      //get data from INFURA, if the collection is not deployed in this platform
      const data = await axios.get(`${HOST}/api/infura/getCollectionMetadata/${chainId}/${collectionid}`);
      

      // get minter/creator address details from any token
      const minterData = await axios.get(`${HOST}/api/infura/getNFTOwnerData/${chainId}/${collectionid}/1`);

      const owner = minterData?.data?.owners[0]?.ownerOf;

      //get yesterdays date for reveal time, other wise all collection will show not revealed
      let today = new Date();
      today.setDate(today.getDate() - 1);

      const contractObj = {
        name: data.data.name,
        contractAddress: data.data.contract,
        creator: {
          userName: 'Unnamed',
          walletAddress: owner,
        },
        chainId,
        description: '',
        revealtime: today.toString(),
        createdBy: {
          _ref: ''
        },
        collectionData: 0,
      }

      return contractObj;
    }
    return res[0];
  }

//this is old way
export const getNFTCollection =
  () =>
  async ({ queryKey }) => {
    const [_, collectionid] = queryKey
    const query = `*[_type == "nftCollection" && _id == "${collectionid}" ] {
        _id,
        web3imageprofile,
        web3imagebanner,
        volumeTraded,
        createdBy,
        chainId,
        revealtime,
        contractAddress,
        "creator": createdBy->,
        name, floorPrice,
        "allOwners": owners[]->,
        description,
        showUnlisted,
        external_link,
        category,
        referralrate_one,
        referralrate_two,
        referralrate_three,
        referralrate_four,
        referralrate_five,
        payablelevel,
      }`
    const res = await config.fetch(query)
    return res
  }
export const getActivities =
  (tokenid) =>
  async ({ queryKey }) => {
    // const [_, collectionAddress] = queryKey
    const query = `*[_type == "activities" && "${tokenid}" in nftItems[]._ref] {...} | order(dateTime(_createdAt) desc)`
    const res = await config.fetch(query)
    return res
  }
export const getMintedNFTs =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftItem" && createdBy._ref == "${address}"]
    {
      _id, chainId, id, listed, name, ownedBy->, collection->, createdBy->, listingid,
    }`
    const res = await config.fetch(query)
    return res
  }
export const getCollectedNFTs =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftItem" && ownedBy._ref == "${address}" && createdBy._ref != "${address}"]
    {
      _id, chainId, id, listed, name, ownedBy->, collection->, createdBy->, listingid,
    }`
    const res = await config.fetch(query)
    return res
  }
export const getFavouriteNFTs =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey;
    const query = `*["${address}" in likedBy[]._ref] {...,collection->}`;
    const res = await config.fetch(query);
    return res;
  }

export const getAllUsers =
() => async ({ querykey }) => {
  const query = `*[_type == "users"]{..., referrer->, directs[]->} | order(_createdAt desc)`;
  const res = await config.fetch(query);
  return res;
}
export const getAllOwners =
  () =>
  async ({ queryKey }) => {
    const [_, address] = queryKey
    const query = `*[_type == "nftItem" && ownedBy != null && contractAddress=="${address}"]{ownedBy}`
    const res = await config.fetch(query)
    return res
  }

export const getBlockedItems = 
() => async () => {
  const blockeditems = await axios.get(`${HOST}/api/blockeditems`);
  return JSON.parse(blockeditems.data);
}

export const getCoinPrices = 
() => async () => {
  // const query = `*[_type == "settings"]{ethprice, maticprice, bnbprice, avaxprice, _updatedAt}`
  // const res = await config.fetch(query)
  const result = await axios.get(`${HOST}/api/getcoinsprice`);
  return result.data;
}

export const getAllNFTsforDashboard = 
() => async () => {
  const query = `*[_type == "nftItem"]{name, _id}`;
  const result = await config.fetch(query);
  return result;
}

export const getAllCollectionsforDashboard = 
() => async () => {
  const query = `*[_type == "nftCollection"]{name, _id}`;
  const result = await config.fetch(query);
  return result;
}

export const getAllCategories =
() => async () => {
  const query = `*[_type == "category"]`;
  const result = await config.fetch(query);
  return result;
}

export const getTotals = 
(chainid) => async() => {
  let query1 = ''; let query2 = ''; let query3 = ''; let query4 = ''; let query5 = ''; let query6 = ''; let query7 = '';
  if(chainid){
    query1 = `count(*[_type == "nftItem" && chainId == ${chainid}])`;
    query2 = `count(*[_type == "nftCollection" && chainId == ${chainid}])`;
    query3 = 'count(*[_type == "users"])';
    query4 = '*[_type == "users" && volumeTraded != null]{userName, walletAddress, _id, web3imageprofile, volumeTraded} | order(volumeTraded desc) [0..9]';
    query5 = `*[_type == "nftCollection" && volumeTraded != null && chainId == ${chainid}]{name, chainId, floorPrice, walletAddress, _id, contractAddress, volumeTraded, web3imageprofile} | order(volumeTraded desc) [0..9]`;
    query6 = `*[_type == "nftItem" && likedBy != null && collection!= null && chainId == ${chainid}]{"likers": count(likedBy), name, _id, chainId, id, collection->} | order(likers desc) [0..9]`;
    query7 = '*[_type == "settings"] {platformfee}';
  }else{
    query1 = 'count(*[_type == "nftItem"])';
    query2 = 'count(*[_type == "nftCollection"])';
    query3 = 'count(*[_type == "users"])';
    query4 = '*[_type == "users" && volumeTraded != null]{userName, walletAddress, _id, web3imageprofile, volumeTraded} | order(volumeTraded desc) [0..9]';
    query5 = '*[_type == "nftCollection" && volumeTraded != null]{name, chainId, floorPrice, walletAddress, _id, contractAddress, volumeTraded, web3imageprofile} | order(volumeTraded desc) [0..9]';
    query6 = '*[_type == "nftItem" && likedBy != null && collection!= null]{"likers": count(likedBy), name, _id, chainId, id, collection->} | order(likers desc) [0..9]';
    query7 = '*[_type == "settings"] {platformfee}';
  }

  const totalNfts = await config.fetch(query1);

  const totalCollections = await config.fetch(query2);

  const totalUsers = await config.fetch(query3);

  const topActiveUsers =  await config.fetch(query4);
 
  const topCollections =  await config.fetch(query5);
  
  const popularNfts =  await config.fetch(query6);

  const platformfee = await config.fetch(query7);

  const res = { totalNfts, totalCollections, totalUsers, topActiveUsers, topCollections, popularNfts, platformfee: platformfee[0]};

  return res
}

export const getReferralPayingCollections = async() => {
  const query = `*[_type == "settings"] {referralcollections}`;
  const result = await config.fetch(query);
  console.log(result)
}

export const getMyNetwork = (address) => async() => {
  const query = `*[_type == "users" && referrer->walletAddress == "${address}"]{
    userName, walletAddress, web3imageprofile, payablelevel,
    "level1Friends": directs[]->{
      userName, walletAddress, web3imageprofile, payablelevel,
      "level2Friends": directs[]->{
        userName, walletAddress, web3imageprofile, payablelevel,
        "level3Friends": directs[]->{
          userName, walletAddress, web3imageprofile, payablelevel,
          "level4Friends": directs[]->{
            userName, walletAddress, web3imageprofile, payablelevel,
            "level5Friends": directs[]->{
              userName, walletAddress, web3imageprofile, payablelevel,
            }
          }
        }
      }
    }
  }`;
  const result = await config.fetch(query);
  return result;
}

export const getMyPayingNetwork = async (address) => {

  const query = `*[_type == "users" && walletAddress == "${address}"]{
    userName, walletAddress, "level" : 0, payablelevel, boughtnfts,
    "sponsor": referrer->{
      userName, walletAddress, "level" : 1, payablelevel, boughtnfts,
      "sponsor": referrer->{
        userName, walletAddress, "level" : 2, payablelevel, boughtnfts,
        "sponsor": referrer->{
          userName, walletAddress, "level" : 3, payablelevel, boughtnfts,
          "sponsor": referrer->{
            userName, walletAddress, "level" : 4, payablelevel, boughtnfts,
            "sponsor": referrer->{
              userName, walletAddress, "level" : 5, payablelevel, boughtnfts,
            }
          }
        }
      }
    }
  }`;
  const result = await config.fetch(query);
  return result;
}

export const getReferralRate = () => async() => {
  const query = `*[_type == "settings"] {referralrate_one, referralrate_two, referralrate_three, referralrate_four, referralrate_five}`;
  const rates = await config.fetch(query);
  return rates[0];
}

export const getReferralPayment = (address) => async() => {
  const query = `*[_type == "referrals" && to._ref == "${address}"] | order(_createdAt desc)`;
  const result = await config.fetch(query);
  return result;
}

export const getAirDrops = () => async() => {
  const { data } = await axios.get(`${HOST}/api/getAirdrops`);
  return data;
}

export const getReferralBonuses = () => async() => {
  const query = `*[_type == "users" && referralbonus != undefined]{referralbonus, userName, _id}`;
  const bonuses = await config.fetch(query);
  return bonuses;
}

export const getSearchValue = async(searchText, token) => {
  return axios
    .get(`${HOST}/api/search/?searchText=${searchText}`, {
      cancelToken: token,
    });
}