import ethLogo from '../assets/ethereum.png'
import maticLogo from '../assets/matic.png'

export const ChainLogo = ({chainid}) => {
    if(chainid == "1" || chainid == "4"){
        return ethLogo;
    }
    else if(chainid == "137" || chainid == "80001"){
        return maticLogo;
    }
    else {
        return null;
    }
}