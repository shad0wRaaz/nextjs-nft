import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({children}) {
    const [coinPrices, setCoinPrices] = useState();
    const [loadingNewPrice, setLoadingNewPrice] = useState(false);
    const blockchainName = { '80001': 'mumbai',
        '5': 'goerli',
        '43113': 'avalanche-fuji',
        '43114': 'avalanche',
        '97': 'binance-testnet',
        '421563': 'arbitrum-goerli',
        '1': 'mainnet',
        '137': 'polygon',
        '56': 'binance',
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

    const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io/8888' : 'http://localhost:8080'

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
            marketplace }}>
                {children}
        </SettingsContext.Provider>
    )
}

export function useSettingsContext() {
    return useContext(SettingsContext)
}