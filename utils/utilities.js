import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

export const checkValidEmail = (email) => {
    //check email pattern first
    const regex = new RegExp(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      )
      const testemail = regex.test(email);
      if(!testemail) {
        return false;
      }
    return true
}

export const checkValidURL = (URL) => {
    const regex = new RegExp(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
      )
      return regex.test(URL)
}

export const generateRandomCode = () => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 16;

    let code = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < codeLength; i++ ) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return code;

}

export const sortCategory = (arr) => {
  return arr.sort((a,b) => {
    let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
  })
}

export const createAwatar = (seed) => {
  const awatar = createAvatar( botttsNeutral, {
      size: 60,
      seed,
    }).toDataUriSync();

  return awatar
}

export const updateSingleUserDataToFindMaxPayLevel = (user, refs) => {
  if(!refs) return;
  if(refs.includes(user.walletAddress)){
    const newObj = { ...user, paylevel: 5 }
    return newObj;
  }
  
  if(!user.boughtnfts){
      const newObj = { ...user, paylevel: 1}
      return newObj
  }else{

      const data = JSON.parse(user.boughtnfts);
      const allPayLevels = data?.map(nft => Number(nft.payablelevel));
      
      const maxLevel = Math.max(...allPayLevels);
      const newObj = {
          ...user,
          paylevel: Boolean(maxLevel) ? maxLevel : 1
      }
      return newObj;
  }
}

export const updateUserDataToFindMaxPayLevel = (allusers) => {
  const updatedUsers = allusers.map(user => {
    if(!user.boughtnfts){
        const newObj = { ...user, paylevel: 1}
        return newObj
    }else{
        const data = JSON.parse(user.boughtnfts);
        const allPayLevels = data?.map(nft => Number(nft.payablelevel));
        
        const maxLevel = Math.max(...allPayLevels);
        const newObj = {
            ...user,
            paylevel: Boolean(maxLevel) ? maxLevel : 1
        }
        return newObj;

    }
  });

  return updatedUsers;
}

export const isCompanyWallet = (walletAddress) => {
  const wallets = [
    String(process.env.NEXT_PUBLIC_RENDITIONS_WALLET_ADDRESS).toLowerCase(),
    String(process.env.NEXT_PUBLIC_GRACE_WALLET_ADDRESS).toLowerCase(),
    String(process.env.NEXT_PUBLIC_VISIONS_WALLET_ADDRESS).toLowerCase(),
    String(process.env.NEXT_PUBLIC_CREATIONS_WALLET_ADDRESS).toLowerCase(),
    String(process.env.NEXT_PUBLIC_MUSHROOM_KINGDOM_WALLET_ADDRESS).toLowerCase(),
    String(process.env.NEXT_PUBLIC_METAMASK_WALLET_ADDRESS).toLowerCase(),
  ]
  return wallets.includes(walletAddress.toLowerCase()) ? true : false;

}

export const pageview = (GA_MEASUREMENT_ID, url) => {
  window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
  });
};

export const sortObjects = (data, key, direction) => {
  const sortedData = data.sort(function(a,b){
    if(direction == 'ASC'){
      return a[key] - b[key];
    }else {
      return b[key] - a[key];
    }
  })
  return sortedData
}