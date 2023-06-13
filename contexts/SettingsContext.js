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

    return (
        <SettingsContext.Provider value={{ 
            coinPrices, 
            setCoinPrices, 
            loadingNewPrice, 
            setLoadingNewPrice, 
            HOST, 
            blockchainName,
            currencyByChainId,
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
            blockchainIdFromName
             }}>
                {children}
        </SettingsContext.Provider>
    )
}

export function useSettingsContext() {
    return useContext(SettingsContext)
}