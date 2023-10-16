import React from 'react'
import nuvanftLogo from '../assets/nuvanft.png'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useThemeContext } from '../contexts/ThemeContext'

const ConnectButton = ({ className }) => {
    const { dark } = useThemeContext();
  return (
    <>
        <ConnectWallet 
            accentColor="#0053f2"
            colorMode={dark ? "dark": "light"}
            className={ className ? className : 'ml-4'}
            modalTitle={"Connect to Nuva NFT"}
            modalSize={"wide"}
            welcomeScreen={{
              title: "Your gateway to Nuva NFT",
              subtitle: "Connect a wallet to mint, buy, sell, refer and get rewarded.",
            }}
            modalTitleIconUrl={nuvanftLogo.src}
            termsOfServiceUrl={'/termsandconditions'}
            privacyPolicyUrl={'/privacypolicy'}
          />
    </>
  )
}

export default ConnectButton