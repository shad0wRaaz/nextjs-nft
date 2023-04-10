import { useRouter } from 'next/router'
import FileBase from 'react-file-base64'
import { BiError } from 'react-icons/bi'
import { GoPackage } from 'react-icons/go'
import { RadioGroup } from '@headlessui/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import { IconLoading } from '../icons/CustomIcons'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { useUserContext } from '../../contexts/UserContext'
import noProfileImage from '../../assets/noProfileImage.png'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { BsFillCheckCircleFill, BsUpload } from 'react-icons/bs'
import React, { useState, useEffect, useReducer, useRef } from 'react'
import { useAddress, useMetamask, useChainId, useNetwork, useSigner, ConnectWallet } from '@thirdweb-dev/react'
import { useSettingsContext } from '../../contexts/SettingsContext'

const style = {
  wrapper: 'pr-[2rem]',
  container: 'my-[3rem] container mx-auto p-1 pt-0 text-gray-200',
  formWrapper: 'flex flex-wrap flex-col ',
  pageTitle: 'm-4 ml-1 font-bold text-3xl text-gray-200 flex gap-[15px]',
  smallText: 'text-sm m-2 text-slate-400 mt-0 mb-0',
  subHeading:
    'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
  input:
    'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
  label: 'text-small m-2 mt-4',
  button:
    'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
  previewImage:
    'relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400 hover:bg-slate-800',
  notConnectedWrapper: 'flex justify-center items-center h-screen',
  traitsButtons:
    'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-3 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
  secondaryButton:
    'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
}

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE_NAME':
      return { ...state, name: action.payload.name }
    case 'CHANGE_IMAGE':
      return { ...state, image: action.payload.image }
    case 'CHANGE_DESCRIPTION':
      return { ...state, description: action.payload.description }
    case 'CHANGE_AV':
      return { ...state, animation_url: action.payload.animation_url }
    case 'CHANGE_ITEMTYPE':
      return { 
        ...state, 
        properties: {
          ...state.properties, 
          itemtype: action.payload.itemtype
        }
      }
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
    case 'ADD_TOKENID':
    return {
      ...state,
      properties: { ...state.properties, tokenid: action.payload.tokenid }
    }
    case 'CLEAR_OUT_ALL':
      return {
        name: '',
        animation_url: '',
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
          itemtype: '',
          tokenid: '',
        },
      }
    default:
      return state
  }
}

const CreateAVNFT = ({uuid}) => {

  const [state, dispatch] = useReducer(reducer, {
    name: '',
    animation_url: '',
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
      itemtype: '',
      tokenid: '',
    },
  })
  const {dark, errorToastStyle, successToastStyle } = useSettingsContext()
  const signer = useSigner();
  const chainid = useChainId();
  const router = useRouter();
  const address = useAddress();
  const [fileType, setFileType] = useState();
  const { myCollections } = useUserContext();
  const [thisChainCollection, setThisChainCollection] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({ contractAddress: '' });
  const [nftCollection, setNftCollection] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [file, setFile] = useState();
  const [animatedFile, setAnimatedFile] = useState();
  const fileInputRef = useRef();
  const animatedFileInputRef = useRef();

  useEffect(() => {
    if(!file) return
    console.log(file.type)
      if(file.size > 2097152) { //file limit is 2MB
        toast.error("File is too large.", errorToastStyle);
        setFile(undefined);
      }
    return() => {

    }
  },[file])

  useEffect(() => {
    if(!animatedFile) return
    console.log(animatedFile.type)
      if(animatedFile.type.search(/ideo/) > 0) { setFileType("video"); } 
      if(animatedFile.type.search(/udio/) > 0) { setFileType("audio"); } 
      if(animatedFile.size > 5097152) { //file limit is 2MB
        toast.error("File is too large.", errorToastStyle)
        setAnimatedFile(undefined);
      }
    return() => {

    }
  },[animatedFile])

  useEffect(() => {
    //get only collection from this currently connected chain to show in Collection Selection Area
    if(!myCollections) return
    if(!chainid) return
    let tempCollection = myCollections.filter((collection) => collection.chainId == chainid)
    setThisChainCollection(tempCollection)

    return() => {
      //clean up function
    }
  }, [myCollections, chainid])

  const [
    {
      data: { chain, chains },
      loading,
      error,
    },
    switchNetwork,
  ] = useNetwork();

  useEffect(() => {
    if(!uuid) return
    dispatch({
      type: 'ADD_TOKENID',
      payload: { tokenid: uuid}
    })

    return() => {
      //cleanup function
    }
  }, [uuid])

  // useEffect(() => {
  //   ;async(() => {
  //     const sdk = new ThirdwebSDK(signer);
  //     const contract = await sdk.getContract(selectedCollection.contractAddress, "nft-collection");
  //     setNftCollection(contract);
  //   })()

  //   return() => {
  //     //cleanup function
  //   }
  // }, [selectedCollection])

  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    )
    return regex.test(URL)
  }

  //handling Create NFT button
  const handleSubmit = (e, toastHandler = toast) => {
    e.preventDefault()

    if (state.name == '' || file == undefined || animatedFile == undefined) {
      toastHandler.error('Fields marked * are required.', errorToastStyle)
      return
    }
    if (
      !urlPatternValidation(state.properties.external_link) &&
      state.properties.external_link !== ''
    ) {
      toastHandler.error('External link is not valid.', errorToastStyle)
      return
    }
    if (selectedCollection.contractAddress == '') {
      toastHandler.error(
        'Collection is not selected. Select a collection to mint this NFT to.',
        errorToastStyle
      )
      return;
    }

    if (!nftCollection) {
      //Some issue is there
      toastHandler.error(
        'Error in minting. Cannot find NFT Collection.',
        errorToastStyle
      )
      return;
    }
    if(fileType != "audio" && fileType != "video") {
      toastHandler.error("Audio or Video file is required.", errorToastStyle)
      return
    }

    else {
      ;(async (sanityClient = config) => {
        try {
          setIsMinting(true)
          const sdk = new ThirdwebSDK(signer);
          const nftCollection = await sdk.getContract(selectedCollection.contractAddress);

          const tx = await nftCollection.erc721.mintTo(address, {...state, image: file, animation_url: animatedFile});

          const receipt = tx.receipt
          const tokenId = tx.id

          //save NFT data into Sanity
          const nftItem = {
            _type: 'nftItem',
            _id: uuid,
            id: tx.id.toString(),
            collection: {
              _ref: selectedCollection._id,
              _type: 'reference'
            },
            listed: false,
            chainId: chainid,
            createdBy: { _ref: address, _type: 'reference' },
            ownedBy: { _ref: address, _type: 'reference' },
            featured: false,
            name: state.name,
          }
          await sanityClient
            .createIfNotExists(nftItem)
            .then()
            .catch((err) => {
              toastHandler.error(
                'Error saving NFT data. Please contact administrator.',
                errorToastStyle
              )
            })

          //save Transaction Data into Sanity
          const transactionData = {
            _type: 'activities',
            _id: receipt.transactionHash,
            nftItems: [{ _ref: uuid, _type: 'reference', _key: uuid }],
            transactionHash: receipt.transactionHash,
            from: receipt.from,
            to: receipt.to,
            tokenid: tx.id.toString(),
            event: 'Mint',
            price: '-',
            chainId: chainid,
            dateStamp: new Date(),
          }
          await sanityClient
            .createIfNotExists(transactionData)
            .then()
            .catch((err) => {
              toastHandler.error(
                'Error saving NFT Transaction data. Please contact administrator.',
                errorToastStyle
              )
            })

          setIsMinting(false)

          toastHandler.success('NFT minted successfully.', successToastStyle)
          dispatch({ type: 'CLEAR_OUT_ALL' })

          router.push(
            `/nfts/${uuid}`
          )
        } catch (error) {
          toastHandler.error("Error in minting NFT.", errorToastStyle)
          // console.log(error.message)
          setIsMinting(false)
        }
      })()
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

  const checkFileType = (base64) => {
   
    let start = base64.indexOf(':') + 1
    let end = base64.indexOf('/') - start
    const currentFileType = base64.substr(start,end)
    // console.log(currentFileType)

    if(currentFileType != "audio" && currentFileType != "video" && currentFileType != "image"){
      toast.error('Only Image, Audio and Video are currently supported.', errorToastStyle)
      setFileType(undefined)
      return
    }
    setFileType(currentFileType)
  }

  useEffect(() => {
    // console.log(fileType)
    if(!fileType) return
    // console.log(fileType)
    dispatch({
      type: 'CHANGE_ITEMTYPE',
      payload: { itemtype: fileType }
    })
    return() => {

    }
  }, [fileType])

  // useEffect(() => {
  // console.log(state)
  // }, [state])

  return (
    <div className={style.wrapper}>
      <Toaster position="bottom-center" reverseOrder={false} />
      {!isNaN(address) ? (
        <div className={style.container}>
          <h1 className={style.pageTitle}>
            <GoPackage className={style.contractItemIcon} />
            Mint Audio/Video NFT
          </h1>
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
                  <p className={style.label}>Audio/Video*</p>
                  <div
                    className={style.previewImage}
                    style={{ height: '250px', width: '325px' }}
                    onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setAnimatedFile(e.dataTransfer.files[0]);
                        }}>
                    {animatedFile ? (
                      <video id="itemVideo" width="300px" height="200px" className="object-cover cursor-pointer hover:opacity-80" onClick={e => setAnimatedFile(undefined)}>
                        <source src={URL.createObjectURL(animatedFile)}/>
                        Your browser does not support video tag. Upgrade your browser.
                      </video>
                      // <img src={URL.createObjectURL(file)} className="object-cover cursor-pointer hover:opacity-80" onClick={e => setFile(undefined)}/>
                    ) : (
                      <div 
                        onClick={() => {animatedFileInputRef.current.click()}} 
                        className="cursor-pointer flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 px-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setAnimatedFile(e.dataTransfer.files[0]);
                        }}><BsUpload fontSize={50} />
                          Drag & Drop Image
                          <p className={style.smallText}>
                            Supported file types: MP3, MPEG, WAV, MPG, WEBM. Max size: 2MB.
                          </p>
                      </div>
                    )}
                  </div>
                  <div className="imageUploader mb-4 ml-3">
                    <input
                      type="file"
                      accept="video/mp4, video/x-m4v, video/*, audio/*"
                      id="profileImg"
                      ref={animatedFileInputRef}
                      onChange={e => setAnimatedFile(e.target.files[0])}
                      style={{ display: "none"}}
                    />
                  </div>


                  {/* <p className={style.smallText}>
                    Supported file types: MP3, MPEG, WAV, MPG, WEBM. Max size: 5MB
                  </p> */}
                  {/* <div
                    className={style.previewImage}
                    style={{ height: '200px', width: '300px' }}
                  >
                    {isNaN(state.animation_url) && fileType == "video" && (
                      <video id="itemVideo" width="300px" height="200px">
                        <source src={state.animation_url}/>
                        Your browser does not support video tag. Upgrade your browser.
                      </video>
                    )}
                    {isNaN(state.animation_url) && fileType == "audio" && (
                      <audio id="itemVideo" width="300px" height="200px" controls>
                        <source src={state.animation_url}/>
                        Your browser does not support audio tag. Upgrade your browser.
                      </audio>
                    )}
                  </div> */}
                  {/* <div className="imageUploader mb-4 ml-3"> */}
                    {/* <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => {
                        checkFileType(base64)
                        dispatch({
                          type: 'CHANGE_AV',
                          payload: { animation_url: base64 },
                        })
                      }}
                    /> */}
                    {/* <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                      id="nftImage"
                      ref={fileInputRef}
                      onChange={e => setFile(e.target.files[0])}
                      style={{ display: "none"}}
                    />
                  </div> */}
                </div>

                <div className="w-[1/2]">
                  <p className={style.label}>Cover Image*</p>
                  <div
                    className={style.previewImage}
                    style={{ height: '250px', width: '325px' }}
                    onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setFile(e.dataTransfer.files[0]);
                        }}>
                    {file ? (
                      <img src={URL.createObjectURL(file)} className="object-cover cursor-pointer hover:opacity-80" onClick={e => setFile(undefined)}/>
                    ) : (
                      <div 
                        onClick={() => {fileInputRef.current.click()}} 
                        className="cursor-pointer flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 px-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setFile(e.dataTransfer.files[0]);
                        }}><BsUpload fontSize={50} />
                          Drag & Drop Image
                          <p className={style.smallText}>
                            Supported file types: JPG, PNG, GIF, SVG, WEBP, JFIF, BMP. Max size: 2MB.
                          </p>
                      </div>
                    )}
                  </div>
                  <div className="imageUploader mb-4 ml-3">
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                      id="profileImg"
                      ref={fileInputRef}
                      onChange={e => setFile(e.target.files[0])}
                      style={{ display: "none"}}
                    />
                  </div>

                  {/* <p className={style.smallText}>
                    Supported file types: JPG, PNG, GIF, SVG, WEBP, JFIF, BMP. Max size: 5MB
                  </p> */}
                  {/* <div
                    className={style.previewImage}
                    style={{ height: '200px', width: '300px' }}
                  >
                    {state.image && (
                      <Image src={state.image} layout="fill" objectFit="cover" />
                    )}
                  </div> */}
                  {/* <div className="imageUploader mb-4 ml-3">
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => {
                        dispatch({
                          type: 'CHANGE_IMAGE',
                          payload: { image: base64 },
                        })
                      }}
                    />
                  </div> */}
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
                  // console.log(e.target.value)
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
                        setNftCollection(e.contractAddress);
                      }}
                    >
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 md:max-h-[300px] overflow-y-scroll p-4">
                        {thisChainCollection?.map((collection, index) => (
                          <RadioGroup.Option
                            key={collection.name + index}
                            value={collection}
                            className={({ active, checked }) =>
                              `${
                                checked
                                  ? 'bg-sky-900 bg-opacity-75 text-white ring-2 ring-sky-600'
                                  : 'bg-[#1e293b] hover:bg-slate-700'
                              }
                                linear relative flex w-full grow cursor-pointer rounded-lg px-5 py-4 shadow-md transition duration-300 focus:outline-none`
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex space-x-3 text-sm">
                                      <div className="">
                                        <img
                                          src={getImagefromWeb3(collection.web3imageprofile)}
                                          alt={collection.name}
                                          className="aspect-video h-[50px] w-[50px] rounded-full ring-2 ring-white"
                                        />
                                      </div>
                                      <div className="grow">
                                        <RadioGroup.Label
                                          as="p"
                                          className="font-bold text-white"
                                        >
                                          {collection.name}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                          as="span"
                                          className={`inline ${
                                            checked
                                              ? 'text-sky-100'
                                              : 'text-gray-300'
                                          }`}
                                        >
                                          <p>
                                            Contract Address:{' '}
                                            {collection.contractAddress.slice(
                                              0,
                                              4
                                            )}
                                            ...
                                            {collection.contractAddress.slice(
                                              -4
                                            )}
                                          </p>
                                          <p>
                                            Volume Traded: $
                                            {parseFloat(collection.volumeTraded).toFixed(4)}
                                          </p>
                                        </RadioGroup.Description>
                                      </div>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className="absolute right-[20px] shrink-0 text-white">
                                      <BsFillCheckCircleFill className="h-6 w-6 text-white" />
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
                      Collection not found. Create an NFT Collection first.
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
              {state.properties.traits.map((x, i) => {
                return (
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
              })}

              <p className={style.label}>Network*</p>
              <input
                type="text"
                className={style.input}
                name="itemBlockchain"
                disabled
                value={chain?.name}
              />

              <div className="flex">
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
  )
}

export default CreateAVNFT
