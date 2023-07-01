import { createContext, useContext, useState } from "react";
import { IconAvalanche, IconBNB, IconEthereum, IconPolygon } from "../components/icons/CustomIcons";

const SettingsContext = createContext();

export function SettingsProvider({children}) {
    const [coinPrices, setCoinPrices] = useState();
    const [loadingNewPrice, setLoadingNewPrice] = useState(false);
    const [blockedNfts, setBlockedNfts] = useState([]);
    const [blockedCollections, setBlockedCollections] = useState([]);
    const [testnet, setTestnet] = useState(false);
    const [referralCommission, setReferralCommission] = useState([]); //this is coming out of royalty commission; this is ongoing everytime for all collections and nfts
    const [referralAllowedCollections, setReferralAllowedCollections] = useState([]); // this commission will be for initial purchase, this is only for company collections and nfts
    const blockchainName = { 
        '1': 'mainnet',
        '5': 'goerli',
        '43114': 'avalanche',
        '43113': 'avalanche-fuji',
        '137': 'polygon',
        '80001': 'mumbai',
        '56': 'binance',
        '97': 'binance-testnet',
        '421563': 'arbitrum-goerli',
        '421564': 'arbitrum',
    }
    const blockchainIdFromName = { 
        'mainnet' : '1',
        'goerli': '5',
        'avalanche': '43114',
        'avalanche-fuji': '43113',
        'polygon': '137',
        'mumbai': '80001',
        'binance': '56',
        'binance-testnet': '97',
        'arbitrum-goerli': '421563',
        'arbitrum': '421564',
    }
    const marketplace = {
        '80001': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
        '5': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
        '43114': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
        '97': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE,
        '421563': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
        '1': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
        '137': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
        '56': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
      }
      const currencyByChainId = {
        "97": "TBNB",
        "56": "BNB",
        "5": "ETH",
        "1": "ETH",
        "137": "MATIC",
        "80001": "MATIC",
        "43113": "AVAX",
        "43114": "AVAX",
    }

    const currencyByChainName = {
        "binance-testnet": "TBNB",
        "binance": "BNB",
        "goerli": "ETH",
        "mainnet": "ETH",
        "polygon": "MATIC",
        "mumbai": "MATIC",
        "avalanche-fuji": "AVAX",
        "avalanche": "AVAX",
    }
    const chainExplorer = {
        '97': process.env.NEXT_PUBLIC_EXPLORER_TBNB,
        '56': process.env.NEXT_PUBLIC_EXPLORER_BNB,
        '80001': process.env.NEXT_PUBLIC_EXPLORER_MUMBAI,
        '137': process.env.NEXT_PUBLIC_EXPLORER_POLYGON,
        '5': process.env.NEXT_PUBLIC_EXPLORER_GOERLI,
        '4': process.env.NEXT_PUBLIC_EXPLORER_RINKEBY,
        '1': process.env.NEXT_PUBLIC_EXPLORER_MAINNET,
        '43113': process.env.NEXT_PUBLIC_EXPLORER_AVALANCHE_FUJI,
        '43114': process.env.NEXT_PUBLIC_EXPLORER_AVALANCHE,
      }
    const chainIcon = {
        '97': <IconBNB/>,
        '56': <IconBNB/>,
        '80001': <IconPolygon/>,
        '137': <IconPolygon/>,
        '5': <IconEthereum/>,
        '4': <IconEthereum/>,
        '1': <IconEthereum/>,
        '43113': <IconAvalanche/>,
        '43114': <IconAvalanche/>,
    }

    const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080'

    const refs = [
        '0xa80bc68E1Af4201Ea84Dd83b87793D11B42a73e4',
        '0xB753F953A3D9843902448926db8a2E0Ec6a8273a',
        '0x8B7c1F7445e8f8fC67c3d880d0FDA07df0faAE9B',
        '0xC2f870e2Cb3Bda7CC4864aD195394b4A2Ad711E7',
        '0x792fdC3c8DBE740A3810d8291C3623A85F0dcEC9',
        '0x0a13a7996870cDD480B68a8c2135C6635f28aA35',
        '0x9cB0b5Ba3873b4E4860A8469d66998059Af79eA6',
        '0xC3e76653D5A9eE8Ab36FcD51964c2D4522c8e58E',
        '0xf0D6D62b7292087a229Cb487D081784C63B45194',
        '0x9C021ef84528b1a5B84577C9327c6C6597Dc3791',
    ]

    return (
        <SettingsContext.Provider value={{ 
            coinPrices, 
            setCoinPrices, 
            loadingNewPrice, 
            setLoadingNewPrice, 
            HOST, 
            blockchainName,
            currencyByChainId,
            currencyByChainName,
            chainExplorer,
            marketplace,
            blockedCollections,
            setBlockedCollections,
            blockedNfts,
            setBlockedNfts,
            testnet,
            setTestnet,
            referralCommission, 
            setReferralCommission,
            referralAllowedCollections, 
            setReferralAllowedCollections,
            chainIcon,
            blockchainIdFromName,
            refs,
             }}>
                {children}
        </SettingsContext.Provider>
    )
}

export function useSettingsContext() {
    return useContext(SettingsContext)
}