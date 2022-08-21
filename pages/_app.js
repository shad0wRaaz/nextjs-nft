import '../styles/globals.css'
import Head from 'next/head'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import { SearchProvider } from '../contexts/SearchContext'
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { MarketplaceProvider } from '../contexts/MarketPlaceContext'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import appletouchicon from '../assets/favicon/apple-touch-icon.png'
import icon32 from '../assets/favicon/favicon-32x32.png'
import icon16 from '../assets/favicon/favicon-16x16.png'
// import manifest from '../assets/favicon/site.webmanifest'

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
                  <link rel="apple-touch-icon" sizes="180x180" href={appletouchicon.src} key={'apple-touch-icon'} />
                  <link rel="icon" type="image/png" sizes="32x32" href={icon32.src} key={'icon-32x32'} />
                  <link rel="icon" type="image/png" sizes="16x16" href={icon16.src} key={'icon-16x16'} />
                  {/* <link rel="manifest" href={manifest} key={'manifest'}></link> */}
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
