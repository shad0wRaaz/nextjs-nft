import '../styles/globals.css'
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import icon32 from '../assets/favicon/favicon-32x32.png'
import icon16 from '../assets/favicon/favicon-16x16.png'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SearchProvider } from '../contexts/SearchContext'
import GoogleAnalytics from '../components/GoogleAnalytics'
import CookieBanner from '../components/CookieBanner'
import { AdminUserProvider } from '../contexts/AdminContext'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SettingsProvider } from '../contexts/SettingsContext'
import { MarketplaceProvider } from '../contexts/MarketPlaceContext'
import { CollectionFilterProvider } from '../contexts/CollectionFilterContext'
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect, safeWallet } from '@thirdweb-dev/react'
import { Arbitrum, ArbitrumGoerli, Avalanche, AvalancheFuji, Binance, BinanceTestnet, Ethereum, Goerli, Mumbai, Polygon } from '@thirdweb-dev/chains'
// import TransitionLayout from '../components/TransitionLayout'

function MyApp({ Component, pageProps }) {
  const client = new QueryClient();

  return (
    <>
      <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEAUSREMENT_ID} />
      <CookieBanner />
      <ThirdwebProvider
        activeChain="ethereum"
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY}
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect(),
          safeWallet(),
        ]}
        supportedChains={process.env.NODE_ENV == 'production' ? [Ethereum, Binance, Polygon, Avalanche, Arbitrum] : [Ethereum, Goerli, Polygon, Mumbai, Arbitrum, ArbitrumGoerli, Avalanche, AvalancheFuji, Binance, BinanceTestnet]}
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
                        {/* <TransitionLayout> */}
                          <Component {...pageProps} />
                        {/* </TransitionLayout> */}
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
    </>
  )
}

export default MyApp
