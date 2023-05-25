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