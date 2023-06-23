import Head from 'next/head'
import '../styles/globals.css'
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import icon32 from '../assets/favicon/favicon-32x32.png'
import icon16 from '../assets/favicon/favicon-16x16.png'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SearchProvider } from '../contexts/SearchContext'
import { AdminUserProvider } from '../contexts/AdminContext'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SettingsProvider } from '../contexts/SettingsContext'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import { MarketplaceProvider } from '../contexts/MarketPlaceContext'
import { CollectionFilterProvider } from '../contexts/CollectionFilterContext'


function MyApp({ Component, pageProps }) {
  const client = new QueryClient()
  return (
    // <ThirdwebProvider activeChain="ethereum">
    <ThirdwebProvider 
      activeChain={process.env.NODE_ENV == 'production' ? 'binance': 'binance-testnet'}
      dAppMeta={{
        name: 'Nuva NFT',
        description: 'A Multichain NFT Marketplace',
        logoUrl: 'https://nuvanft.io/assets/nuvanft.png',
        url: 'https://nuvanft.io'
      }}>
      <ThemeProvider>
        <UserProvider>
          <AdminUserProvider>
            <SearchProvider>
              <QueryClientProvider client={client}>
                <MarketplaceProvider>
                  <SettingsProvider>
                    <CollectionFilterProvider>
                      <Component {...pageProps} />
                    </CollectionFilterProvider>
                  </SettingsProvider>
                  <ReactQueryDevtools />
                </MarketplaceProvider>
              </QueryClientProvider>
            </SearchProvider>
          </AdminUserProvider>
        </UserProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
