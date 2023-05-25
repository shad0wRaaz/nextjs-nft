import Head from 'next/head'
import '../styles/globals.css'
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import icon32 from '../assets/favicon/favicon-32x32.png'
import icon16 from '../assets/favicon/favicon-16x16.png'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SearchProvider } from '../contexts/SearchContext'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SettingsProvider } from '../contexts/SettingsContext'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import { MarketplaceProvider } from '../contexts/MarketPlaceContext'
import { CollectionFilterProvider } from '../contexts/CollectionFilterContext'


function MyApp({ Component, pageProps }) {
  const client = new QueryClient()
  return (
    // <ThirdwebProvider activeChain="ethereum">
    <ThirdwebProvider activeChain={process.env.NODE_ENV == 'production' ? 'binance': 'binance-testnet'}>
      <ThemeProvider>
        <UserProvider>
          <SearchProvider>
            <QueryClientProvider client={client}>
              <MarketplaceProvider>
                <Head>
                  <title>Nuva NFT: A Multichain NFT Marketplace</title>
                  <link rel="icon" type="image/png" sizes="32x32" href={icon32.src} key={'icon-32x32'} />
                  <link rel="icon" type="image/png" sizes="16x16" href={icon16.src} key={'icon-16x16'} />
                </Head>
                <SettingsProvider>
                  <CollectionFilterProvider>
                    <Component {...pageProps} />
                  </CollectionFilterProvider>
                </SettingsProvider>
                <ReactQueryDevtools />
              </MarketplaceProvider>
            </QueryClientProvider>
          </SearchProvider>
        </UserProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
