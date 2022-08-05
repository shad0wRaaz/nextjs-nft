import React, { useState, useReducer } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { MdClose } from 'react-icons/md'
import { GoPackage } from 'react-icons/go'
import { BiCollection } from 'react-icons/bi'
import { HiCubeTransparent } from 'react-icons/hi'
import { BsDroplet, BsDropletHalf } from 'react-icons/bs'
import { OffCanvas, OffCanvasMenu, OffCanvasBody} from 'react-offcanvas'
import CreateNFT from '../components/createNew/CreateNFT'
import CreateNFTCollection from '../components/createNew/CreateNFTCollection'
import CreateNFTDrop from '../components/createNew/CreateNFTDrop'
import CreateEdition from '../components/createNew/CreateEdition'
import CreateEditionDrop from '../components/createNew/CreateEditionDrop'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: ' max-w-[1000px] mx-auto mt-[4rem] p-[2rem] pb-[4rem] rounded-xl',
  pageBanner: 'py-[4rem] mb-[2rem]',
  pageTitle: 'text-4xl text-center text-black font-bold my-4 textGradBlue',
  contractsWrapper: 'flex flex-wrap justify-center gap-[40px] pt-4',
  contractItem: 'flex justify-center flex-col text-center hover:opacity-80 cursor-pointer py-[2rem] px-[1rem] md:w-1/3 sm:w-full flex justify-start rounded-xl border',
  contractItemIcon: 'mb-[1rem] text-5xl mx-auto',
  contractTitle: 'font-bold text-xl mb-2',
  contractDescription: 'text-sm',
  canvasMenu: 'bg-[#0f172a] h-[100vh] shadow-xl px-[2rem] overflow-y-scroll',
  blur: 'filter: blur(1px)',
  smallText: 'text-sm text-center mb-[2rem]',
  noPointer: ' pointer-events-none',
  closeButton : 'sticky top-3 transition duration-[300] top-[20px] left-[100%] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70'
}

function reducer(state, action){
  switch (action.type) {
    case 'OPEN_NFT':
      return { isMenuOpened: true, canvasMenu: 'NFT'}
    case 'OPEN_NFT_COLLECTION':
      return { isMenuOpened: true, canvasMenu: 'NFT_COLLECTION'};
    case 'OPEN_NFT_DROP':
      return { isMenuOpened: true, canvasMenu: 'NFT_DROP'};
    case 'OPEN_EDITION':
      return { isMenuOpened: true, canvasMenu: 'EDITION'};
    case 'OPEN_EDITION_DROP':
      return { isMenuOpened: true, canvasMenu: 'EDITION_DROP'};
    default:
      return { isMenuOpened: false, canvasMenu : '' };
  }
}

const contracts = () => {
  const [state, dispatch] = useReducer(reducer, {isMenuOpened: false, canvasMenu: ''});
  const { dark } = useThemeContext();

  return (
    <div className={dark ? 'darkBackground text-neutral-200': '' }>
      <OffCanvas
          width={850}
          transitionDuration={300}
          effect={"parallax"}
          isMenuOpened={state.isMenuOpened}
          position={"right"}
          onClick={() => console.log("test")}
          >
            <OffCanvasBody className={ state.isMenuOpened ? 'blur pointer-events-none ' : 'pointer-events-auto'}>
              <Header />
              <div className={ dark ? style.pageBanner + ' darkGray' : style.pageBanner + ' bg-sky-100'}>
                  <h2 className={style.pageTitle}>Create Contracts</h2>
                  <p className={style.smallText}>List of contracts that you can deploy.</p>
              </div>
              <div className={style.wrapper}>
                <div className={style.contractsWrapper}>
                  <div className={dark ? style.contractItem + ' border-sky-400/20' : style.contractItem} onClick={() => dispatch({type: 'OPEN_NFT'})}>
                    <GoPackage className={style.contractItemIcon} />
                    <span className={style.contractTitle}>NFT</span>
                    <span className={style.contractDescription}>Your unique Non-fungible token</span>
                  </div>
                  <div className={dark ? style.contractItem + ' border-sky-400/20' : style.contractItem} onClick={() => dispatch({type: 'OPEN_NFT_COLLECTION'})}>
                    <BiCollection className={style.contractItemIcon} />
                    <span className={style.contractTitle}>NFT Collection</span>
                    <span className={style.contractDescription}>A collection of one-of-one NFTs</span>
                  </div>
                  <div className={dark ? style.contractItem + ' border-sky-400/20' : style.contractItem} onClick={() => dispatch({type: 'OPEN_NFT_DROP'})}>
                    <BsDroplet className={style.contractItemIcon} />
                    <span className={style.contractTitle}>NFT Drop</span>
                    <span className={style.contractDescription}>Claimable drop of one-of-one NFTs</span>
                  </div>
                  <div className={dark ? style.contractItem + ' border-sky-400/20' : style.contractItem} onClick={() => dispatch({type: 'OPEN_EDITION'})}>
                    <HiCubeTransparent className={style.contractItemIcon} />
                    <span className={style.contractTitle}>Edition</span>
                    <span className={style.contractDescription}>A collection of N-of-one NFTs</span>
                  </div>
                  <div className={dark ? style.contractItem + ' border-sky-400/20' : style.contractItem} onClick={() => dispatch({type: 'OPEN_EDITION_DROP'})}>
                    <BsDropletHalf className={style.contractItemIcon} />
                    <span className={style.contractTitle}>Edition Drop</span>
                    <span className={style.contractDescription}>Claimable drop of N-of-one NFTs</span>
                  </div>
                </div>
              </div>
              <Footer/>
            </OffCanvasBody>
            <OffCanvasMenu className={style.canvasMenu}>
              
              <button
                className={style.closeButton} 
                onClick={() => dispatch({type: 'CLOSE_MENU'})}
              >
                <MdClose fontSize="30px"/>
              </button>

              {state.canvasMenu == "NFT" && 
                <CreateNFT/>
              }
              {state.canvasMenu == "NFT_COLLECTION" && 
                <CreateNFTCollection/>
              }
              {state.canvasMenu == "NFT_DROP" && 
                <CreateNFTDrop/>
              }
              {state.canvasMenu == "EDITION" && 
                <CreateEdition/>
              }
              {state.canvasMenu == "EDITION_DROP" && 
                <CreateEditionDrop/>
              }
            </OffCanvasMenu>
        </OffCanvas>
      
      
    </div>
  )
}

export default contracts