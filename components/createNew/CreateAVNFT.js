import { useRouter } from 'next/router'
import FileBase from 'react-file-base64'
import { BiError } from 'react-icons/bi'
import { GoPackage } from 'react-icons/go'
import { RadioGroup } from '@headlessui/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import noProfileImage from '../../assets/noProfileImage.png'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import React, { useState, useEffect, useReducer } from 'react'
import {
  useAddress,
  useNFTCollection,
  useMetamask,
  useChainId,
  useNetwork,
  useMintNFT,
  MediaRenderer,
  useSigner,
} from '@thirdweb-dev/react'
import { IconLoading } from '../icons/CustomIcons'
import { getUnsignedImagePath } from '../../fetchers/s3'
import { useUserContext } from '../../contexts/UserContext'
import Image from 'next/image'

const style = {
  wrapper: 'pr-[2rem]',
  container: 'my-[3rem] container mx-auto p-1 pt-0 text-gray-200',
  formWrapper: 'flex flex-wrap flex-col ',
  pageTitle: 'm-4 ml-1 font-bold text-3xl text-gray-200 flex gap-[15px]',
  smallText: 'text-sm m-2 text-[#bbb] mt-0 mb-0',
  subHeading:
    'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
  input:
    'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
  label: 'text-small m-2 mt-4',
  button:
    'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
  previewImage:
    'relative mr-[1rem] h-[200px] w-[300px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-400',
  notConnectedWrapper: 'flex justify-center items-center h-screen',
  traitsButtons:
    'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-3 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
  secondaryButton:
    'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
}

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
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
        },
      }
    default:
      return state
  }
}

const CreateAVNFT = () => {
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
    },
  })

  // useEffect(() => {
  //   console.log(state);
  // }, [state])
  const signer = useSigner()
  const chainid = useChainId()
  const router = useRouter()
  const [fileType, setFileType] = useState()
  // const [fileType, setFileType] = useState('image')
  const connectWithMetamask = useMetamask()
  const { myCollections, setMyCollections } = useUserContext()
  const [
    {
      data: { chain, chains },
      loading,
      error,
    },
    switchNetwork,
  ] = useNetwork()
  const address = useAddress()
  const [sanityCollection, setSanityCollection] = useState([]) //this is for getting all collections from sanity
  const [selectedCollection, setSelectedCollection] = useState({
    contractAddress: '',
  })
  const [nftCollection, setNftCollection] = useState()
  const [isMinting, setIsMinting] = useState(false)

  // const { mutate: mintNFT, isLoading: isMinting, error } = useMintNFT(nftCollection);

  useNFTCollection(selectedCollection.contractAddress)

  //get the NFT COllections created by current user
  const fetchSanityCollectionData = async (sanityClient = config) => {
    if (!chainid || !address) return
    const query = `*[_type == "nftCollection" && chainId == "${chainid}" && createdBy._ref == "${address}"] {
      name, contractAddress, profileImage, createdBy, volumeTraded
    }`

    await sanityClient.fetch(query).then(async (res) => {
      const unresolved = res.map(async (collection) => {
        const obj = {}
        const imgPath = await getUnsignedImagePath(collection.profileImage)
        obj['name'] = collection.name
        obj['profileImage'] = imgPath?.data.url
        obj['contractAddress'] = collection.contractAddress
        obj['createdBy'] = collection.createdBy
        obj['volumeTraded'] = collection.volumeTraded
        return obj
      })

      const resolvedPaths = await Promise.all(unresolved)

      if (resolvedPaths) {
        setSanityCollection(resolvedPaths)
      }
    })
  }

  useEffect(() => {
    if (!address) return
    if (myCollections) return
    fetchSanityCollectionData()
  }, [address])

  useEffect(() => {
    const sdk = new ThirdwebSDK(signer)
    setNftCollection(sdk.getNFTCollection(selectedCollection.contractAddress))
  }, [selectedCollection])

  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    )
    return regex.test(URL)
  }

  //handling Create NFT button
  const handleSubmit = (e, toastHandler = toast) => {
    e.preventDefault()

    if (state.name == '' || state.image == '' || state.animation_url == '') {
      toastHandler.error('Fields marked * are required', errorToastStyle)
      return
    }
    if (
      !urlPatternValidation(state.properties.external_link) &&
      state.properties.external_link !== ''
    ) {
      console.log(state.properties.external_link)
      console.log(urlPatternValidation(state.properties.external_link))
      toastHandler.error('External link is not valid.', errorToastStyle)
      return
    }
    if (selectedCollection.contractAddress == '') {
      toastHandler.error(
        'Collection is not selected. Select a collection to mint this NFT to.',
        errorToastStyle
      )
      return
    }
    if (!isNaN(nftCollection)) {
      //Some issue is there
      toastHandler.error(
        'Error in minting. Cannot find NFT Collection',
        errorToastStyle
      )
    }
    if(fileType != "audio" && fileType != "video") {
      toastHandler.error("Audio or Video file is required.", errorToastStyle)
      return
    }
    // 0xFd7CFAA95Ad1a64081C43721A9398eb0a9165879 <- static use of nft collection address
    else {
      ;(async (sanityClient = config) => {
        try {
          setIsMinting(true)

          const tx = await nftCollection.mintTo(address, state)

          const receipt = tx.receipt
          const tokenId = tx.id

          // console.log(tx)
          // console.log(receipt)
          // console.log(tokenId)

          setIsMinting(false)

          toastHandler.success('NFT minted successfully', successToastStyle)
          dispatch({ type: 'CLEAR_OUT_ALL' })

          //save NFT data into Sanity
          const nftItem = {
            _type: 'nftItem',
            _id: selectedCollection.contractAddress.concat(tx.id.toString()),
            id: tx.id.toString(),
            contractAddress: selectedCollection.contractAddress,
            listed: false,
            chainId: chainid,
            createdBy: { _ref: address },
            ownedBy: { _ref: address },
            featured: false,
            name: state.name,
          }
          await sanityClient
            .createIfNotExists(nftItem)
            .then()
            .catch((err) => {
              toastHandler.error(
                'Error saving NFT data. Contact administrator.',
                errorToastStyle
              )
            })

          //save Transaction Data into Sanity
          const transactionData = {
            _type: 'activities',
            _id: receipt.transactionHash,
            transactionHash: receipt.transactionHash,
            from: receipt.from,
            to: receipt.to,
            contractAddress: selectedCollection.contractAddress,
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
                'Error saving NFT data. Contact administrator.',
                errorToastStyle
              )
            })

          router.push(
            `/nfts/${tx.id.toString()}?c=${selectedCollection.contractAddress}`
          )
        } catch (error) {
          toastHandler.error(error.message, errorToastStyle)
          console.log(error.message)
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
    console.log(currentFileType)

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
    console.log(fileType)
    dispatch({
      type: 'CHANGE_ITEMTYPE',
      payload: { itemtype: fileType }
    })
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
                  <p className={style.smallText}>
                    Supported file types: MP3, MPEG, WAV, MPG, WEBM. Max size: 5MB
                  </p>
                  <div
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
                  </div>
                  <div className="imageUploader mb-4 ml-3">
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => {
                        checkFileType(base64)
                        dispatch({
                          type: 'CHANGE_AV',
                          payload: { animation_url: base64 },
                        })
                      }}
                    />
                  </div>
                </div>

                <div className="w-[1/2]">
                  <p className={style.label}>Cover Image*</p>
                  <p className={style.smallText}>
                    Supported file types: JPG, PNG, GIF, SVG, WEBP, JFIF, BMP. Max size: 5MB
                  </p>
                  <div
                    className={style.previewImage}
                    style={{ height: '200px', width: '300px' }}
                  >
                    {/* {isNaN(state.image) && <MediaRenderer src={state.image} />} */}
                    {state.image && (
                      <Image src={state.image} layout="fill" objectFit="cover" />
                    )}
                  </div>
                  <div className="imageUploader mb-4 ml-3">
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
                  console.log(e.target.value)
                }}
              ></textarea>

              <p className={style.label}>Collection*</p>
              <p className={style.smallText}>
                Select your collection where this NFT will be minted.
              </p>
              <div className="ml-[2rem] flex w-full px-4 py-4">
                <div className="mx-auto w-full">
                  {myCollections?.length > 0 ? (
                    <RadioGroup
                      value={selectedCollection}
                      onChange={(e) => {
                        updateCategory(e.name)
                        setSelectedCollection(e)
                      }}
                    >
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2">
                        {myCollections?.map((collection) => (
                          <RadioGroup.Option
                            key={collection.name}
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
                                          src={collection.profileImage}
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
          <button
            type="button"
            className={style.button}
            onClick={connectWithMetamask}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateAVNFT
