import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { createContext, useContext, useEffect, useState } from 'react'

const MarketplaceContext = createContext();

const marketplace = {
  'mumbai': process.env.NEXT_PUBLIC_MUMBAI_MARKETPLACE,
  'goerli': process.env.NEXT_PUBLIC_GOERLI_MARKETPLACE,
  'avalanche-fuji': process.env.NEXT_PUBLIC_AVALANCE_FUJI_MARKETPLACE,
  'binance-testnet': process.env.NEXT_PUBLIC_BINANCE_TESTNET_MARKETPLACE_V3,
  'arbitrum-goerli': process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_MARKETPLACE,
  'avalanche': process.env.NEXT_PUBLIC_AVALANCE_MARKETPLACE,
  'binance': process.env.NEXT_PUBLIC_BINANCE_SMARTCHAIN_MARKETPLACE,
  'mainnet': process.env.NEXT_PUBLIC_MAINNET_MARKETPLACE,
  'polygon': process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE,
}

export function MarketplaceProvider({ children }) {
  const [latestNfts, setLatestNfts] = useState();
  const [marketContract, setMarketContract] = useState();
  const [activeListings, setActiveListings] = useState();
  const [auctionListings, setAuctionListings] = useState();
  const [selectedBlockchain, setSelectedBlockchain] = useState('binance');
  const [topTradedCollections, setTopTradedCollections] = useState();
  const [marketAddress, setMarketAddress] = useState(marketplace['binance']); //this is mumbai marketplace contract address

  useEffect(() => {
    if(!selectedBlockchain) return
      ;(async() => {
        const sdk = new ThirdwebSDK(selectedBlockchain);
        const contract = await sdk.getContract(marketplace[selectedBlockchain], "marketplace-v3");
        setMarketAddress(marketplace[selectedBlockchain]);
        setMarketContract(contract);
      })()
      return() => {
        //do nothing. only cleanup function
      }
  }, [selectedBlockchain])

  return (
    <MarketplaceContext.Provider
      value={{
        marketContract,
        marketAddress,
        setMarketAddress,
        activeListings,
        setActiveListings,
        auctionListings,
        setAuctionListings,
        selectedBlockchain,
        setSelectedBlockchain,
        topTradedCollections,
        setTopTradedCollections,
        latestNfts,
        setLatestNfts
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  )
}

//Export useContext Hook
export function useMarketplaceContext() {
  return useContext(MarketplaceContext)
}
