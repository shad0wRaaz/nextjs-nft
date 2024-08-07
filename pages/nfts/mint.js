import { useRef } from 'react'
// import { v4 as uuidv4 } from 'uuid'
import SEO from '../../components/SEO'
import { useRouter } from 'next/router'
import { BiError } from 'react-icons/bi'
import { BsUpload } from 'react-icons/bs'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { RadioGroup } from '@headlessui/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { checkValidURL } from '../../utils/utilities'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useUserContext } from '../../contexts/UserContext'
import SkeletonLoader from '../../components/SkeletonLoader'
import { useThemeContext } from '../../contexts/ThemeContext'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import React, { useState, useEffect, useReducer } from 'react'
import { IconLoading } from '../../components/icons/CustomIcons'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useAddress, useSigner, ConnectWallet, useActiveChain, useChain } from '@thirdweb-dev/react'

const style = {
  wrapper: '',
  pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
  container: 'my-[3rem] container mx-auto p-1 pt-0  max-w-5xl',
  formWrapper: 'flex flex-wrap flex-col ',
  pageTitle: 'text-4xl font-bold text-center text-white',
  smallText: 'text-sm m-2 text-[#bbb] mt-0 mb-0',
  subHeading:
    'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
  input:
    'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
  label: 'text-small m-2 mt-4',
  button:
    'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
  previewImage:
    'relative mr-[1rem] h-[200px] w-[300px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-500 flex items-center justify-center hover:bg-slate-800',
  notConnectedWrapper: 'flex justify-center items-center h-screen',
  traitsButtons:
    'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-3 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
  secondaryButton:
    'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
  imageInput:
    'w-[350px] h-[350px] border border-slate-100 border-dashed border-lg flex items-center justify-content-center text-grey mb-4 cursor-pointer rounded-xl',
  imagePreview: 'max-h-[450px] rounded-xl cursor-pointer mb-4 max-w-[350px]'
}

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE_NAME':
      return { ...state, name: action.payload.name }
    case 'CHANGE_IMAGE':
      return { ...state, image: action.payload.image }
    case 'CHANGE_DESCRIPTION':
      return { ...state, description: action.payload.description }
    case 'CHANGE_EXTERNAL_LINK':
      return {
        ...state,
        properties: {
          ...state.properties,
          external_link: action.payload.extLink,
        },
      }
    case 'CHANGE_TRAITS':
      return {
        ...state,
        properties: { ...state.properties, traits: action.payload.traits },
      }
    case 'CHANGE_CATEGORY':
      return {
        ...state,
        properties: { ...state.properties, category: action.payload.category },
      }
    // case 'ADD_TOKENID':
    //   return {
    //     ...state,
    //     properties: { ...state.properties, tokenid: action.payload.tokenid }
    //   }
    case 'CLEAR_OUT_ALL':
      return {
        name: '',
        description: '',
        image: '',
        properties: {
          external_link: '',
          traits: [
            {
              propertyKey: '',
              propertyValue: '',
            },
          ],
          category: '',
        },
      }
    default:
      return state
  }
}

// const uuid = uuidv4();

const mint = () => {
    const [state, dispatch] = useReducer(reducer, {
        name: '',
        description: '',
        image: '',
        properties: {
        external_link: '',
        traits: [
            {
            propertyKey: '',
            propertyValue: '',
            },
        ],
        category: '',
        },
     })
  const { HOST, blockchainName } = useSettingsContext();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState();
  const signer = useSigner();
  const router = useRouter();
  const [fileType, setFileType] = useState();
  const { myCollections, myUser } = useUserContext();
  const { errorToastStyle, successToastStyle } = useThemeContext();
  const [thisChainCollection, setThisChainCollection] = useState([]);
  const connectedChain = useChain();
  const [chainImg, setChainImg] = useState();
  const address = useAddress();
  const { dark } = useThemeContext();
  const [sanityCollection, setSanityCollection] = useState([]) //this is for getting all collections from sanity
  const [selectedCollection, setSelectedCollection] = useState({contractAddress: ''})
  const [nftCollection, setNftCollection] = useState()
  const [isMinting, setIsMinting] = useState(false)

  useEffect(() => {
    if(!connectedChain) return;

    ;(async() => {
      const imgPath = await getImagefromWeb3(connectedChain.icon.url)
      setChainImg(imgPath?.data);

    })()

    return() => {}

  }, [connectedChain])

  useEffect(() => {
    //get only collection from this currently connected chain to show in Collection Selection Area
    if(!myCollections) return
    let tempCollection = myCollections.filter((collection) => collection.chainId == connectedChain.chainId);

    const updatedCollection = tempCollection.map(async coll => {

     const temp = {
      ...coll,
      web3imageprofile: await getImagefromWeb3(coll.web3imageprofile),
      web3imagebanner: await getImagefromWeb3(coll.web3imagebanner),
     }
     return temp;
    });

    ;(async() => {
      const a = await Promise.all(updatedCollection);
      const b = a.map(c => {
        const d = {
          ...c,
          web3imagebanner: c.web3imagebanner?.data,
          web3imageprofile: c.web3imageprofile?.data,
        }
        return d;
      });

      setThisChainCollection(b);
    })()



    return() => {
      //clean up function
    }
  }, [myCollections, connectedChain])

  //get the NFT Collections created by current user
  const fetchSanityCollectionData = async (sanityClient = config) => {
    if (!connectedChain || !address) return
    const query = `*[_type == "nftCollection" && chainId == "${connectedChain.chainId}" && createdBy._ref == "${address}"] {
      name, contractAddress, profileImage, createdBy, volumeTraded, web3imageprofile
    }`

    const res = await sanityClient.fetch(query);
    setSanityCollection(res);
  }

  useEffect(() => {
    if (!address) return
    if (myCollections) return
    fetchSanityCollectionData();
    
    return() => {
      //clean up function
    }
  }, [address]);

  //handling Create NFT button
  const handleSubmit = async (e, toastHandler = toast, sanityClient = config, contract = nftCollection) => {
    e.preventDefault();

    // if(!uuid){
    //   toastHandler.error("ID could not be defined. Refresh and try again.", errorToastStyle);
    // }
    if (state.name == '' || !file) {
      toastHandler.error('Fields marked * are required', errorToastStyle)
      return
    }
    if (
      !checkValidURL(state.properties.external_link) &&
      state.properties.external_link !== '') {
      toastHandler.error('External link is not valid.', errorToastStyle)
      return
    }
    if (selectedCollection.contractAddress == '') {
      toastHandler.error('Collection is not selected. Select a collection to mint this NFT to.', errorToastStyle)
      return
    }
    
    if (!(nftCollection)) {
      //Some issue is there
      toastHandler.error('Error in minting. Cannot find NFT Collection', errorToastStyle)
      return
    }
    
    try {
      setIsMinting(true)
      const sdk = new ThirdwebSDK(signer,  {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY
      })
      const nftCollection = await sdk.getContract(selectedCollection.contractAddress)
      const tx = await nftCollection.erc721.mintTo(address, {...state, image: file})


      setIsMinting(false);

      toastHandler.success('NFT minted successfully', successToastStyle);
      dispatch({ type: 'CLEAR_OUT_ALL' });
      setIsMinting(false);
      
      router.push(`/nft/${blockchainName[connectedChain.chainId]}/${selectedCollection.contractAddress}/${tx.id.toString()}`);
    } catch (error) {
      toastHandler.error("Error in minting NFT.", errorToastStyle)
      setIsMinting(false)
    }
  }

  //handling input change
  const handlePropertyChange = (e, index) => {
    const { name, value } = e.target
    const list = [...state.properties.traits]
    list[index][name] = value
    dispatch({ type: 'CHANGE_TRAITS', payload: { traits: list } })
  }

  //handling remove button of remove button
  const handleRemoveProperty = (index) => {
    const list = [...state.properties.traits]
    list.splice(index, 1)
    dispatch({ type: 'CHANGE_TRAITS', payload: { traits: list } })
  }

  //handle add button of add button
  const handleAddProperty = () => {
    dispatch({
      type: 'CHANGE_TRAITS',
      payload: {
        traits: [
          ...state.properties.traits,
          { propertyKey: '', propertyValue: '' },
        ],
      },
    })
  }

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      background: '#1e293b',
      color: '#ffffff',
      borderRadius: '7px',
      border: '0',
      padding: '0.45rem',
      margin: '0.5rem',
    }),
    menu: (provided) => ({
      ...provided,
      background: '#1e293b',
      color: '#ffffff',
    }),
    singleValue: (provided) => ({
      ...provided,
      background: '#1e293b',
      color: '#ffffff',
      margin: 0,
    }),
    valueContainer: (provided) => ({
      ...provided,
      background: '#1e293b',
      borderRadiius: '10px',
    }),
  }

  const updateCategory = async (collectionName) => {
    const query = `*[_type == "nftCollection" && name == "${collectionName}"]{category}`
    const res = await config.fetch(query)
    if (res) {
      dispatch({
        type: 'CHANGE_CATEGORY',
        payload: { category: res[0].category },
      })
    }
  }

  // const checkFileType = (base64) => {
  //   let start = base64.indexOf(':') + 1
  //   let end = base64.indexOf('/') - start
  //   const currentFileType = base64.substr(start,end)

  //   if(currentFileType != "audio" && currentFileType != "video" && currentFileType != "image"){
  //     toast.error('Only Image, Audio and Video are currently supported.', errorToastStyle)
  //     setFileType(undefined)
  //     return
  //   }
  //   setFileType(currentFileType)
  // }
  
  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white text-slate-900'}`}>
        <Header />
        <SEO 
        title="Mint NFT"
        description="Mint NFT"
        image=""
        currentUrl={`https://nuvanft.io/nfts/mint `} />
        <div className={style.wrapper}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <div className={style.pageBanner}>
            <h2 className={style.pageTitle}> Mint NFT</h2>
        </div>
        {!isNaN(address) ? (
            <div className={style.container}>
            
            <form name="createNFTForm" onSubmit={handleSubmit}>
                <div className={style.formWrapper}>
                <p className={style.label}>Item Name*</p>
                <input
                    className={style.input}
                    type="text"
                    name="itemName"
                    value={state.name}
                    onChange={(e) =>
                    dispatch({
                        type: 'CHANGE_NAME',
                        payload: { name: e.target.value },
                    })
                    }
                />
                <div className="flex justify-between gap-2">
                    <div className="w-[1/2]">
                    <p className={style.label}>Image *</p>

                    <div
                        className={style.previewImage}
                        style={{ height: '350px', width: '300px' }}
                        onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                            e.preventDefault();
                            setFile(e.dataTransfer.files[0]);
                            }}
                    >
                        {/* {isNaN(state.image) && <MediaRenderer src={state.image} />} */}
                        {file ? (
                        <img src={URL.createObjectURL(file)} className="object-cover cursor-pointer hover:opacity-80" onClick={e => setFile(undefined)}/>
                        ) : (
                        <div 
                            onClick={() => {fileInputRef.current.click()}} 
                            className="rounded-lg cursor-pointer flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 px-4"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                            e.preventDefault();
                            setFile(e.dataTransfer.files[0]);
                            }}><BsUpload fontSize={50} />
                            Drag & Drop Image
                            <p className={style.smallText + " text-center"}>
                                Supported file types: JPG, PNG, GIF, WEBP, JFIF.
                            </p>
                            </div>
                        )}
                    </div>
                    <div className="imageUploader mb-4 ml-3">
                        <input
                        type="file"
                        accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                        id="nftImage"
                        ref={fileInputRef}
                        onChange={e => setFile(e.target.files[0])}
                        style={{ display: "none"}}
                        />
                    </div>

                    </div>
                </div>
                
                <p className={style.label}>Item Description</p>
                <p className={style.smallText}>
                    The item description will be added in this NFT's detail page.
                </p>
                <textarea
                    className={style.input}
                    name="itemDescription"
                    value={state.description}
                    onChange={(e) => {
                    dispatch({
                        type: 'CHANGE_DESCRIPTION',
                        payload: { description: e.target.value },
                    })
                    }}
                ></textarea>

                <p className={style.label}>Collection*</p>
                <p className={style.smallText}>
                    Select your collection where this NFT will be minted. Only Collections from currently connected chain are shown.
                </p>
                <div className="flex w-full px-4 py-4">
                    <div className="mx-auto w-full">
                        {thisChainCollection?.length > 0 ? (
                            <RadioGroup
                            value={selectedCollection}
                            onChange={(e) => {
                                updateCategory(e.name);
                                setSelectedCollection(e);
                                setNftCollection(e.contractAddress)
                            }}
                            >
                            <RadioGroup.Label className="sr-only">
                                Server size
                            </RadioGroup.Label>
                            <div className="grid grid-cols-2 place-items-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:max-h-[320px] overflow-y-scroll p-4">
                                {thisChainCollection?.map((collection, index) => (
                                <RadioGroup.Option
                                    key={collection.name + index}
                                    value={collection}
                                    className={({ active, checked }) =>
                                    `${
                                        checked
                                        ? (dark ? 'bg-sky-900 bg-opacity-75 ring-2 ring-sky-600': 'ring-sky-600 ring-2 bg-sky-100')
                                        : (dark ? 'bg-[#1e293b] hover:bg-slate-700' : ' border border-neutral-100')
                                    }
                                        linear relative flex w-full h-full grow cursor-pointer rounded-lg px-5 py-4 shadow-md transition duration-300 focus:outline-none`
                                    }
                                >
                                    {({ active, checked }) => (
                                    <>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center flex-grow">
                                                <div className="flex flex-col flex-grow justify-center space-y-3 text-sm items-center">
                                                    <div className="">
                                                      {collection.web3imageprofile ? (
                                                        <img
                                                        src={collection.web3imageprofile}
                                                        alt={collection.name}
                                                        className="aspect-video h-[50px] w-[50px] rounded-full ring-2 ring-white"
                                                        />)
                                                        :
                                                        <div className="relative aspect-video h-[50px] w-[50px] rounded-full ring-2 ring-white overflow-hidden">
                                                          <SkeletonLoader roundness="lg" />
                                                        </div>
                                                      }
                                                    </div>
                                                    <div className="grow">
                                                        <RadioGroup.Label
                                                            as="p"
                                                            className="font-bold text-center"
                                                            >
                                                                {collection.name}
                                                        </RadioGroup.Label>
                                                        <RadioGroup.Description
                                                            as="span"
                                                            className={`inline ${
                                                                checked
                                                                ? (dark ? 'text-sky-100' : '')
                                                                : (dark ? 'text-sky-100' : '')
                                                            }`}
                                                            >
                                                                <p className="text-center">{collection.contractAddress.slice(0,6)}...{collection.contractAddress.slice(-6)}</p>
                                                        </RadioGroup.Description>
                                                    </div>
                                                </div>
                                            </div>
                                        {checked && (
                                            <div className={`absolute top-2 right-2 shrink-0 ${dark ? 'text-white': 'text-sky-600'}`}>
                                                <BsFillCheckCircleFill className={`h-6 w-6 ${dark ? 'text-white': 'text-sky-600'}`} />
                                            </div>
                                        )}
                                        </div>
                                    </>
                                    )}
                                </RadioGroup.Option>
                                ))}
                            </div>
                            </RadioGroup>
                        ) : (
                            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#ef4444] p-4 text-center text-white">
                            <BiError className="text-white" fontSize={20} />
                            Collection not found in this chain. Create an NFT Collection first.
                            </div>
                        )}
                    </div>
                </div>

                <p className={style.label}>External Link</p>
                <p className={style.smallText}>
                    Nuva NFT will include a link to this URL on this NFT's detail
                    page. For example your showcase website of this NFT.
                </p>
                <input
                    type="text"
                    className={style.input}
                    name="itemLink"
                    value={state.properties.external_link}
                    placeholder="https://yourlink.to"
                    onChange={(e) => {
                    dispatch({
                        type: 'CHANGE_EXTERNAL_LINK',
                        payload: { extLink: e.target.value },
                    })
                    }}
                />

                <p className={style.label}>Properties</p>
                {state.properties.traits.map((x, i) => (
                    <div className="ml-[2rem] flex gap-[10px]" key={i}>
                        <input
                        name="propertyKey"
                        placeholder="Property Name"
                        className={style.input}
                        value={x.propertyKey}
                        onChange={(e) => handlePropertyChange(e, i)}
                        />
                        <input
                        name="propertyValue"
                        placeholder="Property Value"
                        className={style.input}
                        value={x.propertyValue}
                        onChange={(e) => handlePropertyChange(e, i)}
                        />
                        <div className="flex">
                        {state.properties.traits.length !== 1 && (
                            <button
                            className={style.traitsButtons}
                            type="button"
                            onClick={(i) => handleRemoveProperty(i)}
                            >
                            <AiOutlineMinus fontSize="20px" />
                            </button>
                        )}
                        {state.properties.traits.length - 1 === i && (
                            <button
                            className={style.traitsButtons}
                            type="button"
                            onClick={handleAddProperty}
                            >
                            <AiOutlinePlus fontSize="20px" />
                            </button>
                        )}
                        </div>
                    </div>
                    )
                )}

                <div className={`text-small mx-auto !mt-6 text-center border ${dark ? 'border-slate-700': 'border-neutral-100'} rounded-lg p-3 w-fit`}>
                    This NFT will be minted on 
                    <img src={chainImg} height="20px" width="20px" className="inline-block ml-4 mr-2" />
                    {connectedChain?.name}
                </div>

                <div className="flex justify-center">
                    {isMinting ? (
                    <button type="button" className={style.button} disabled>
                        <IconLoading dark="inbutton" />
                        Minting...
                    </button>
                    ) : (
                    <input type="submit" className={style.button} value="Mint" />
                    )}
                    {/* <button type="button" className={style.secondaryButton} onClick={() => dispatch({type: 'CLEAR_OUT_ALL'})}>Reset</button> */}
                </div>
                </div>
            </form>
            </div>
        ) : (
            <div className={style.notConnectedWrapper}>
            <ConnectWallet accentColor="#0053f2" colorMode={dark ? "dark": "light"} className=" ml-4" style={{ borderRadius: '50% !important'}} />
            </div>
        )}
        </div>
        <Footer/>
    </div>
  )
}

export default mint
