import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { BiChevronUp, BiWallet } from 'react-icons/bi'
import { Disclosure } from '@headlessui/react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { type } from 'os'
import { BsCollection, BsImage } from 'react-icons/bs'
import { AiOutlineTags } from 'react-icons/ai'



const getstarted = () => {
    const { dark } = useThemeContext();
    const style = {
        wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-4 lg:pb-0 max-w-5xl',
        pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
        pageTitle: 'text-4xl font-bold text-center text-white',
        section: 'p-2 lg:p-8 mb-8 rounded-xl border-sky-700/30 border transition',
        header: 'font-bold text-lg lg:text-xl mb-2',
        table: `rounded-3xl border ${dark ? 'border-slate-700' : 'border-neutral-100'} w-[56] p-4 mt-4`,
        tableRow: `flex gap-4 flex-col md:flex-row items-center border-b ${dark ? 'border-slate-700' : 'border-neutral-100'} p-8`,
        tableColFirst: 'w-full md:w-[100px] md:min-w-[100px] text-center font-bold',
        anothertableColFirst: 'w-full md:w-[250px] md:min-w-[250px] text-center font-bold',
        tableColSecond: 'grow',
        button: 'rounded-md border border-sky-700/40 p-1 px-2 text-sm bg-sky-900/60',
      }
  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' bg-slate-800'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Getting Started</h2>
      </div>
      <div className={style.wrapper}>
        <div className="w-full">
            <div className="mx-auto w-full rounded-2xl">
                <Disclosure as="div" className={style.section}>
                {({ open }) => (
                    <>
                    <Disclosure.Button className="font-bold text-xl lg:text-3xl flex w-full justify-between rounded-lg px-4 py-2 text-left focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                        <div><BiWallet className="inline-block" /><span> Create a crypto Wallet</span></div>
                        <BiChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 transition`} fontSize={30}/>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm leading-6">
                        There are lots of crypto wallets available. The most preferred ones are Metamask and Coinbase Wallet. These two wallets can directly be added in Google Chrome browser. So, it makes whole process of NFT lot easier. You can choose any one of them to get started with or any other wallet.<br/>
                    <ol className="mt-4 leading-10 pl-3" style={{'list-style-type': 'lower-alpha'}}>
                        <li>
                            Go to <a href="https://metamask.io" target="_blank">https://metamask.io</a> and click on Download. It will download the extension or app based on the device you are browsing.
                            <br/>Or, if you want to use Coinbase Wallet, you can download Coinbase chrome extension <a href="https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en" target="_blank" className="border border-md border-sky-700/50 rounded-lg py-1 px-2 hover:bg-blue-700 bg-blue-800">Download</a>
                        </li>
                        <li>Once it is installed, click on <span className={style.button}>Get Started</span></li>
                        <li>Click on <span className={style.button}>Create Wallet</span></li>
                        <li>Click on <span className={style.button}>I Agree</span> This means you are opting in to share some of your data to Metamask to make their service better, but it is not going to take your personal/senstive information.</li>
                        <li>Create your password. This password will be used to login to the Metamask wallet.</li>
                        <li>Back up your secret seed phrase. Copy and paste this seed phrase somewhere safe. If you lose this, you may not be able to recover your wallet and funds in it, if you happen to lose the wallet. If you keep the secret seed phrase safe, even if you lost your wallet or device, you can always import the whole wallet and funds in it, in some other devices.</li>
                        <li>In next page, Metamask will ask you to enter the secret seed phrase. The phrase needs to be entered/selected in the same order as it was shown in before.</li>
                        <li>Once seed phrase confirmation is done, you will be taken to Metamask dashboard.</li>
                    </ol>

                    </Disclosure.Panel>
                    </>
                )}
                </Disclosure>

                <Disclosure as="div" className={style.section}>
                {({ open }) => (
                    <>
                    <Disclosure.Button className="font-bold text-xl lg:text-3xl flex w-full justify-between rounded-lg px-4 py-2 text-left focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                        <div><BsCollection className="inline-block" /><span> Create NFT Collection(s)</span></div>
                        <BiChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 transition`} fontSize={30}/>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm leading-6">
                        You wallet needs to have funds to create NFT Collection as you have to pay for the gas fees required to put the NFT(s) and NFT Collection(s) in the blockchain. Before creating NFT collection, make sure you are connected to the desired blockchain/network. The gas fees may be higher or lower depending on the network congestion and the blockchain.
                        <ol className="mt-4 leading-10 pl-3" style={{'list-style-type': 'lower-alpha'}}>
                            <li>Click on <span className={style.button}>Connect Wallet</span> and choose Metamask wallet.</li> 
                            <li>Once the wallet is connected, your profile will get created automatically. <a href={'/profile'} className="underline hover:no-underline hover:text-blue-600 transition">You can check your profile from here.</a> Alternatively, your profile is accesible from <span className={style.button}>My Account</span> menu on the top and then <span className={style.button}>My Profile</span> menu.</li>
                            <li>Click on <span className={style.button}>Mint</span> button on the top. You will be taken to Create Contracts page, and click on <span className={style.button}>NFT Collection</span></li>
                            <li>Enter all information about the NFT Collection. Once finished, click on <span className={style.button}>Create</span> button.</li>
                            <li>You will be taken to the newly created NFT Collection's page. From this page, you can edit the collection's setting. This page can be visited from <span className={style.button}>My Account</span> and then <span className={style.button}>My NFTs and Collections</span> menu.</li>
                        </ol>
                    </Disclosure.Panel>
                    </>
                )}
                </Disclosure>

                <Disclosure as="div" className={style.section}>
                {({ open }) => (
                    <>
                    <Disclosure.Button className="font-bold text-xl lg:text-3xl flex w-full justify-between rounded-lg px-4 py-2 text-left focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                        <div><BsImage className="inline-block" /><span> Mint NFT(s)</span></div>
                        <BiChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 transition`} fontSize={30}/>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                        Make sure the connected wallet has necessary funds to pay for gas fees while minting NFT(s).
                        <ol className="mt-4 leading-10 pl-3" style={{'list-style-type': 'lower-alpha'}}>
                            <li>Click on <span className={style.button}>Mint</span> button on the top. You will be taken to Create Contracts page, and click on <span className={style.button}>NFT</span></li>
                            <li>From the given choices, you can mint single NFT (image or audio/video) or multiple NFTs(images for now) at once.</li>
                            <li>Enter all required information about the NFT. Choose the collection where you want to mint NFT. Once all necessary information are entered, click on <span className={style.button}>Mint</span></li>
                            <li>The connected wallet will ask you to confirm the interaction with the smart contract of the NFT Colleciton. Click on <span className={style.button}>Confirm</span></li>
                            <li>Once the NFT is minted, it will take you to the NFT page.</li>
                        </ol>
                    </Disclosure.Panel>
                    </>
                )}
                </Disclosure>

                <Disclosure as="div" className={style.section}>
                {({ open }) => (
                    <>
                    <Disclosure.Button className="font-bold text-xl lg:text-3xl flex w-full justify-between rounded-lg px-4 py-2 text-left focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                        <div><AiOutlineTags className="inline-block" /><span> List/Sell NFT(s) in Direct/Auction Marketplace</span></div>
                        <BiChevronUp className={`${ open ? 'rotate-180 transform' : ''} h-5 w-5 transition`} fontSize={30}/>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                        <ol className="mt-4 leading-10 pl-3" style={{'list-style-type': 'lower-alpha'}}>
                            <li>From the NFT page, click on <span class={style.button}>Sell</span></li>
                            <li>Choose type of listing. Direct listing is placing NFTs directly in the NFT marketplace where anyone can buy or offer to buy. Auction listing is allowing the NFT to be bought from bidding process.</li>
                            <li>Enter the listing price for the NFT and select the duration till when the NFT should be made available to buy. Choosing duration is optional.</li>
                            <li>Click on <span className={style.button}>Complete Listing</span></li> You will need to click on <span className={style.button}>Confirm</span> in Metamask wallet whenever it prompts. It will ask to confirm at two instances. One is to interact with the marketplace contract and one is to interact with the collection contract.
                        </ol>
                    </Disclosure.Panel>
                    </>
                )}
                </Disclosure>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default getstarted