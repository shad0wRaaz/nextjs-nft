import { createContext, useContext, useState } from 'react'

const MarketplaceContext = createContext()

export function MarketplaceProvider({ children }) {
  const [marketplaceAddress, setMarketplaceAddress] = useState(
    '0x9a9817a85E5d54345323e381AC503F3BDC1f01f4'
  )
  //('0x75c169b13A35e1424EC22E099e30cE9E01cF4E3D')
  const [activeListings, setActiveListings] = useState()
  const [auctionListings, setAuctionListings] = useState()
  const [latestNfts, setLatestNfts] = useState()

  const [rpcUrl, setRpcUrl] = useState(
    process.env.NEXT_PUBLIC_INFURA_POLYGON_URL
  )
  const [selectedChain, setSelectedChain] = useState('Polygon')
  const [topTradedCollections, setTopTradedCollections] = useState()
  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceAddress,
        setMarketplaceAddress,
        rpcUrl,
        setRpcUrl,
        activeListings,
        setActiveListings,
        auctionListings,
        setAuctionListings,
        selectedChain,
        setSelectedChain,
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
