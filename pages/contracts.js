import { v4 as uuidv4 } from 'uuid'
import { MdClose } from 'react-icons/md'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { GoPackage } from 'react-icons/go'
import { BiCollection } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiImage, FiVideo } from 'react-icons/fi'
import { HiCubeTransparent } from 'react-icons/hi'
import React, { useState, useReducer } from 'react'
import { BsDroplet, BsDropletHalf } from 'react-icons/bs'
import CreateNFT from '../components/createNew/CreateNFT'
import { useThemeContext } from '../contexts/ThemeContext'
import CreateAVNFT from '../components/createNew/CreateAVNFT'
import CreateNFTDrop from '../components/createNew/CreateNFTDrop'
import CreateEdition from '../components/createNew/CreateEdition'
import CreateNFTBatch from '../components/createNew/CreateNFTBatch'
import { OffCanvas, OffCanvasMenu, OffCanvasBody} from 'react-offcanvas'
import CreateEditionDrop from '../components/createNew/CreateEditionDrop'
import CreateNFTCollection from '../components/createNew/CreateNFTCollection'

const style = {
  wrapper: ' max-w-[1000px] mx-auto mt-[4rem] p-[2rem] pb-[4rem] rounded-xl',
  pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
  pageTitle: 'text-4xl text-center font-bold my-4 text-white',
  contractsWrapper: 'flex flex-wrap justify-center gap-[40px] pt-4',
  contractItem: 'flex justify-center flex-col text-center hover:opacity-80 cursor-pointer py-[2rem] px-[1rem] md:w-1/3 sm:w-full flex justify-start rounded-xl border',
  contractItemIcon: 'mb-[1rem] text-5xl mx-auto',
  contractTitle: 'font-bold text-xl mb-2',
  contractDescription: 'text-sm',
  canvasMenu: 'bg-[#0f172a] h-[100vh] shadow-xl px-[2rem] overflow-y-scroll',
  blur: 'filter: blur(1px)',
  smallText: 'text-sm text-center mb-[2rem] text-white',
  noPointer: ' pointer-events-none',
  closeButton : 'sticky top-3 transition duration-[300] top-[20px] left-[100%] z-20 rounded-[7px] bg-[#ef4444] text-white p-2 hover:opacity-70'
}

function reducer(state, action){
  switch (action.type) {
    case 'OPEN_NFT':
      return { isMenuOpened: true, canvasMenu: 'NFT'}
    case 'OPEN_NFT_BATCH':
      return { isMenuOpened: true, canvasMenu: 'NFT_BATCH'}
    case 'OPEN_NFT_AUDIOVIDEO':
      return {isMenuOpened: true, canvasMenu: 'NFT_AUDIOVIDEO'}
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
  const [showModal, setShowModal] = useState(false)
  const nftId = uuidv4() //for image nft
  const nftAVId = uuidv4() //for audio/video nft

  return (
    <div className={dark ? 'darkBackground text-neutral-200': '' }>
      {/* Modal window*/}
      {showModal && (
        <div className="fixed top-0 flex items-center justify-center p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-10">
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-10 rounded-3xl max-w-2xl z-50 relative overflow-hidden`}>
            <div
              className={`absolute rotate-45 text-md top-5 right-5 ${dark ? 'bg-slate-600 hover:bg-slate-500' : ' bg-gray-300 hover:bg-gray-400'} p-3 rounded-full transition-all cursor-pointer`}
              onClick={() => setShowModal(false)}
            >
              <AiOutlinePlus />
            </div>
            <h2 className="text-center font-bold text-2xl">Mint</h2>
            <p className="mb-[2rem] text-center">Mint a single NFT</p>
            <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 gap-[2rem]">
              <div 
                className={`flex flex-col cursor-pointer justify-center items-center p-[3rem] rounded-xl border ${dark ? 'border-sky-700/30 hover:bg-slate-700': 'hover:bg-neutral-50'}`}
                onClick={() => {
                  setShowModal(curVal => !curVal)
                  dispatch({ type: 'OPEN_NFT'})
                }}
                >
                <FiImage size={40} className="mb-3"/>
                <span>Image NFT</span>
              </div>
              <div 
                className={`flex flex-col cursor-pointer justify-center items-center p-[3rem] rounded-xl border ${dark ? 'border-sky-700/30 hover:bg-slate-700': 'hover:bg-neutral-50'}`}
                onClick={() => {
                  setShowModal(curVal => !curVal)
                  dispatch({ type: 'OPEN_NFT_AUDIOVIDEO'})
                }}
                >
                <FiVideo size={40} className="mb-3" />
                <span>Audio/Video NFT</span>
              </div>
            </div>
            <h2 className="text-center font-bold text-2xl mt-[3rem]">Mint Multiple Items</h2>
            <p className="mb-[2rem] text-center">Mint multiple NFTs at once</p>
            <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 gap-[2rem]">
              <div 
                className={`flex flex-col cursor-pointer justify-center items-center p-[3rem] rounded-xl border ${dark ? 'border-sky-700/30 hover:bg-slate-700': 'hover:bg-neutral-50'}`}
                onClick={() => {
                  setShowModal(curVal => !curVal)
                  dispatch({ type: 'OPEN_NFT_BATCH'})
                }}
                >
                <FiImage size={40} className="mb-3"/>
                <span>Image NFTs</span>
              </div>
              <div 
                className={`flex flex-col cursor-pointer justify-center items-center p-[3rem] rounded-xl border ${dark ? 'border-sky-700/30 hover:bg-slate-700': 'hover:bg-neutral-50'}`}
                
                >
                <FiVideo size={40} className="mb-3" />
                <span>Audio/Video NFTs</span>
                <p className="text-center text-xs">Coming Soon</p>
              </div>
            </div>
            
          </div>
        </div>
      )}
      {/* End of Modal window*/}
      <OffCanvas
          width={850}
          transitionDuration={300}
          effect={"parallax"}
          isMenuOpened={state.isMenuOpened}
          position={"right"}
          >
            <OffCanvasBody className={ state.isMenuOpened ? 'blur pointer-events-none ' : 'pointer-events-auto'}>
              <Header />
              <div className={ dark ? style.pageBanner + ' darkGray' : style.pageBanner + ' bg-sky-100'}>
                  <h2 className={style.pageTitle}>Create Contracts</h2>
                  <p className={style.smallText}>List of contracts that you can deploy.</p>
              </div>
              <div className={style.wrapper}>
                <div className={style.contractsWrapper}>
                  <div className={dark ? style.contractItem + ' border-slate-400/20 bg-slate-800' : style.contractItem} onClick={() => setShowModal(curVal => !curVal)}>
                    <GoPackage className={style.contractItemIcon} />
                    <span className={style.contractTitle}>NFT</span>
                    <span className={style.contractDescription}>Your unique Non-fungible token</span>
                  </div>
                  <div className={dark ? style.contractItem + ' border-slate-400/20 bg-slate-800' : style.contractItem} onClick={() => dispatch({type: 'OPEN_NFT_COLLECTION'})}>
                    <BiCollection className={style.contractItemIcon} />
                    <span className={style.contractTitle}>NFT Collection</span>
                    <span className={style.contractDescription}>A collection of one-of-one NFTs</span>
                  </div>
                  {/* <div className={dark ? style.contractItem + ' border-sky-400/20' : style.contractItem} onClick={() => dispatch({type: 'OPEN_NFT_DROP'})}>
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
                  </div> */}
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
                <CreateNFT uuid={nftId}/>
              }
              {state.canvasMenu == "NFT_BATCH" &&
                <CreateNFTBatch />
              }
              {state.canvasMenu == "NFT_AUDIOVIDEO" && 
                <CreateAVNFT uuid={nftAVId}/>
              }
              {state.canvasMenu == "NFT_COLLECTION" && 
                <CreateNFTCollection/>
              }
              {/* {state.canvasMenu == "NFT_DROP" && 
                <CreateNFTDrop/>
              }
              {state.canvasMenu == "EDITION" && 
                <CreateEdition/>
              }
              {state.canvasMenu == "EDITION_DROP" && 
                <CreateEditionDrop/>
              } */}
            </OffCanvasMenu>
        </OffCanvas>
      
      
    </div>
  )
}

export default contracts