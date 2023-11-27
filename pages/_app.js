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
import { CookiesProvider } from 'react-cookie'
import { ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  trustWallet,
  zerionWallet,
  bloctoWallet,
  magicLink,
  frameWallet,
  rainbowWallet,
  phantomWallet, } from '@thirdweb-dev/react'
// import { Arbitrum, ArbitrumGoerli, Avalanche, AvalancheFuji, Binance, BinanceTestnet, Ethereum, Goerli, Mumbai, Polygon } from '@thirdweb-dev/chains'
// import TransitionLayout from '../components/TransitionLayout'

function MyApp({ Component, pageProps }) {
  const client = new QueryClient();

  return (
    <>
      <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEAUSREMENT_ID} />
      <CookiesProvider>
        <CookieBanner />
        <ThirdwebProvider
          activeChain="binance"
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY}
          supportedWallets={[
            metamaskWallet(),
            coinbaseWallet({ recommended: true }),
            walletConnect(),
            safeWallet({
              personalWallets: [
                metamaskWallet(),
                coinbaseWallet({ recommended: true }),
                walletConnect(),
                trustWallet(),
                zerionWallet(),
                bloctoWallet(),
                magicLink({
                  apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_KEY,
                  oauthOptions: {
                    providers: [
                      "google"
                    ],
                  },
                }),
                frameWallet(),
                rainbowWallet(),
                phantomWallet(),
              ],
            }),
            trustWallet(),
            zerionWallet(),
            bloctoWallet(),
            magicLink({
              apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_KEY,
              oauthOptions: {
                providers: [
                  "google"
                ],
              },
            }),
            frameWallet(),
            rainbowWallet(),
            phantomWallet(),
          ]}
          // supportedWallets={[
          //   metamaskWallet(),
          //   coinbaseWallet(),
          //   walletConnect({
          //     projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_V2_PROJECT_ID
          //   }),
          //   safeWallet(),
          // ]}
          // supportedChains={process.env.NODE_ENV == 'production' ? [Ethereum, Binance, Polygon, Avalanche, Arbitrum] : [Ethereum, Goerli, Polygon, Mumbai, Arbitrum, ArbitrumGoerli, Avalanche, AvalancheFuji, Binance, BinanceTestnet]}
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
      </CookiesProvider>
    </>
  )
}

export default MyApp
