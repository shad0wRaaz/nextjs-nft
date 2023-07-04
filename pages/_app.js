import Head from 'next/head'
import '../styles/globals.css'
import Script from 'next/script'
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import icon32 from '../assets/favicon/favicon-32x32.png'
import icon16 from '../assets/favicon/favicon-16x16.png'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SearchProvider } from '../contexts/SearchContext'
import { AdminUserProvider } from '../contexts/AdminContext'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SettingsProvider } from '../contexts/SettingsContext'
import { ThirdwebProvider, ChainId, metamaskWallet, coinbaseWallet, walletConnect, safeWallet, magicLink } from '@thirdweb-dev/react'
import { MarketplaceProvider } from '../contexts/MarketPlaceContext'
import { CollectionFilterProvider } from '../contexts/CollectionFilterContext'


function MyApp({ Component, pageProps }) {
  const client = new QueryClient()
  return (
    <>
      <Script strategy='afterInteractive' src="https://www.googletagmanager.com/gtag/js?id=G-BBEXJ0P1FY"/>
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BBEXJ0P1FY', {
              page_path: window.location.pathname,
            });
          `,
          }}
      />
      <ThirdwebProvider 
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect(),
          safeWallet(),
          magicLink({
            apiKey: process.env.NEXT_PUBLIC_MAGIC_CONNECT_API_KEY,
            type: 'connect',
          }),
        ]}
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
    </>
  )
}

export default MyApp
