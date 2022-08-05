import '../styles/globals.css'
import Head from 'next/head'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import { SearchProvider } from '../contexts/SearchContext'
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { MarketplaceProvider } from '../contexts/MarketPlaceContext'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const desiredChainId = ChainId.Mumbai
const connectors = [
  'metamask',
  'walletConnect',
  'walletLink',
  {
    name: 'magic',
    options: {
      apiKey: 'your-magic-api-key',
    },
  },
]

function MyApp({ Component, pageProps }) {
  const client = new QueryClient()
  return (
    <ThirdwebProvider
      desiredChainId={desiredChainId}
      walletConnectors={connectors}
    >
      <ThemeProvider>
        <UserProvider>
          <SearchProvider>
            <QueryClientProvider client={client}>
              <MarketplaceProvider>
                <Head>
                  <title>Nuva NFT</title>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                  <meta
                    name="description"
                    content="Nuva Nft is one of the largest NFT marketplace out there in the defi market."
                  />
                  <meta
                    name="keywords"
                    content="nft, marketplace, nft marketplace, metamask, coinbase wallet, ethereum, matic, avalance, fantom, eth, avax, ftm"
                  />
                </Head>
                <Component {...pageProps} />
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
