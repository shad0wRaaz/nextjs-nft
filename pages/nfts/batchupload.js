import { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { BiError } from 'react-icons/bi'
import { BsUpload } from 'react-icons/bs'
import { BsImages } from 'react-icons/bs'
import { RadioGroup } from '@headlessui/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { config } from '../../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import { getImagefromWeb3 } from '../../fetchers/s3'
import { checkValidURL } from '../../utils/utilities'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useUserContext } from '../../contexts/UserContext'
import { useThemeContext } from '../../contexts/ThemeContext'
import React, { useState, useEffect, useReducer } from 'react'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from 'react-icons/ai'
import { useAddress, useChainId, useNetwork, useSigner, ConnectWallet } from '@thirdweb-dev/react'
import { IconLoading } from '../../components/icons/CustomIcons'
import Header from '../../components/Header'

function reducer(state, action) {
  switch (action.type) {
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
          itemtype: 'image',
          tokenid: '',
        },
      }
    default:
      return state
  }
}
const batchupload = () => {

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
      itemtype: 'image',
      tokenid: '',
    },
  });
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState();
  const [fileArray, setFileArray] = useState([]);
  const signer = useSigner();
  const chainid = useChainId();
  const router = useRouter();
  const [fileType, setFileType] = useState();
  const { myCollections } = useUserContext();
  const [itemname, setItemname] = useState('');
  const { errorToastStyle, successToastStyle, dark } = useThemeContext();
  const [thisChainCollection, setThisChainCollection] = useState([]);
  const [propertyKey, setPropertyKey] = useState(['']);

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

  const address = useAddress();
  const [sanityCollection, setSanityCollection] = useState([]); //this is for getting all collections from sanity
  const [selectedCollection, setSelectedCollection] = useState({contractAddress: ''});
  const [nftCollection, setNftCollection] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [batchMetaData, setBatchMetaData] = useState([]);
  const [category, setCategory] = useState('');
  const [propertyTraits, setPropertyTraits] = useState([{ propertyKey: '', propertyValue: ''}])

  const style = {
    wrapper: '',
    pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
    container: 'my-[3rem] container mx-auto p-1 pt-0 lg:px-[10rem]',
    formWrapper: 'flex flex-wrap flex-col ',
    pageTitle: 'text-4xl font-bold text-center text-white',
    smallText: 'text-xs m-2 mt-0 mb-0',
    subHeading:
      'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
    input:
      `m-2 outline-none p-3 rounded-[0.4rem]  transition linear' + ${dark ? ' bg-[#1e293b] hover:bg-[#334155] ' : ' border border-neutral-200 bg-neutral-100 hover:bg-neutral-200'}`,
    label: 'text-small m-2 mt-4',
    button:
      'gradBlue flex gap-2 justify-center rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
    previewImage:
      'relative mr-[1rem] h-[220px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-500 flex items-center justify-center',
    notConnectedWrapper: 'flex justify-center items-center h-screen',
    traitsButtons:
      'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-2 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
    secondaryButton:
      'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
    imageInput:
      'w-[350px] h-[350px] border border-slate-100 border-dashed border-lg flex items-center justify-content-center text-grey mb-4 cursor-pointer rounded-xl',
    imagePreview: 'max-h-[450px] rounded-xl cursor-pointer mb-4 max-w-[350px]'
  }

  //get the NFT Collections created by current user
  const fetchSanityCollectionData = async (sanityClient = config) => {
    if (!chainid || !address) return
    const query = `*[_type == "nftCollection" && chainId == "${chainid}" && createdBy._ref == "${address}"] {
      name, contractAddress, profileImage, createdBy, volumeTraded, web3imageprofile, category,
    }`;

    const res = await sanityClient.fetch(query);
    console.log(res)
    setSanityCollection(res);
  }

  useEffect(() => {
    if (!address) return
    if (myCollections) return
    fetchSanityCollectionData();
    
    return() => {
      //clean up function
    }
  }, [address])


  //handling Create NFT button
  const handleSubmit = async (e, toastHandler = toast, sanityClient = config, contract = nftCollection) => {
    e.preventDefault();

    console.log(e);
    if(!files || files?.length == 0){
      toastHandler.error("Images are not uploaded", errorToastStyle);
      return;
    }
    const f = Array.from(files);

    //build up traits array of all uploaded files
    let itemArray = [];
    let count = 0;
    let name = '', description = '';
    
    for(let k = 0; k < f.length; k++){
      let propsArray = [];
      let traitsArray = [];
      count = k * (propertyKey.length + 2);
      name = e.target[count].value;
      description = e.target[count + 1].value;

      for (let j = 0; j < propertyKey.length; j++){
        propsArray.push({
           "propertyKey": propertyKey[j],
           "propertyValue": e.target[count + j + 2].value,
        })
      }
      traitsArray.push(propsArray);
      itemArray.push({
        name: name,
        description: description,
        image: files[k],
        properties: {
          traits: traitsArray[0],
          category: category,
          itemtype: 'image',
          tokenid: uuidv4(),
        },
      })
    }

    //   let t = []
    //   for(let i = 0; i < f.length; i++){
    //     t.push({ 
    //       name: '', 
    //       description: '', 
    //       image: files[i], 
    //       properties: { 
    //         external_link: '',
    //         traits: propertyTraits,
    //         category: category,
    //         itemtype: 'image',
    //         tokenid: uuidv4(),
    //       },
    //     });
    //   }
    //   setBatchMetaData(t);
    // return

    //get final properties and then add it to batchmetadata
    // const tempMetadata = batchMetaData?.map(item => {return ({...item, properties: {...item.properties, traits: propertyTraits}})})
    if (!files) {
      toastHandler.error('Fields marked * are required', errorToastStyle)
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
    if(!address){
      toastHandler.error('Wallet is not connected.', errorToastStyle);
      return;
    }
    
    try {
      setIsMinting(true);
      const sdk = new ThirdwebSDK(signer);
      const nftCollection = await sdk.getContract(selectedCollection.contractAddress);
      const tx = await nftCollection.erc721.mintBatchTo(address, itemArray);

      const docs = tx?.map((tr, index) => {
        const nftItem = {
          _type: 'nftItem',
          _id: itemArray[index].properties.tokenid,
          id: tr.id.toString(),
          collection: { 
            _ref: selectedCollection._id, 
            _type: 'reference'
          },
          listed: false,
          chainId: chainid,
          createdBy: { 
            _ref: address, 
            _type: 'reference' 
          },
          ownedBy: { 
            _ref: address, 
            _type: 'reference' 
          },
          featured: false,
          name: itemArray[index].name,
        }
        return nftItem
      });
      Promise.all(
        docs.map(
          document => 
            sanityClient.createIfNotExists(document)))
                        .then(async (res) => {

                          const newItems = res?.map(item => {
                            const itemref = { _ref: item._id, _type: 'reference', _key: uuidv4() };
                            return itemref;
                          });

                          const transaction = {
                            _type: 'activities',
                            _id: tx[0].receipt.transactionHash, 
                            transactionHash: tx[0].receipt.transactionHash,
                            nftItems: newItems,
                            from: tx[0].receipt.from,
                            to: tx[0].receipt.to,
                            event: 'Mint',
                            price: '-',
                            chainId: chainid,
                            dateStamp: new Date(),
                          }
                        
                        await sanityClient.createIfNotExists(transaction);
                        })
                        .catch(err => console.log(err));
      toastHandler.success('NFT minted successfully', successToastStyle);
      dispatch({ type: 'CLEAR_OUT_ALL' });
      removeItem(null, null, true);
      setIsMinting(false);
      router.push(`/collections/${selectedCollection._id}`);
      
      
    } catch (error) {
      console.log(error);
      toastHandler.error("Error in minting NFT.", errorToastStyle);
      setIsMinting(false);
    }
  }

  //handling input change
  const handlePropertyChange = (e, index) => {
    let tempProps = [...propertyKey];
    tempProps[index] = e.target.value
    setPropertyKey(tempProps);
    // const { name, value } = e.target;
    // const list = [...state.properties.traits];
    // list[index][name] = value;
    // dispatch({ type: 'CHANGE_TRAITS', payload: { traits: list } });
    // setPropertyTraits(list);
  }

  //handling remove button of remove button
  const handleRemoveProperty = (name) => {
    let tempProps = propertyKey?.filter(p => p != name);
    if(tempProps?.length == 0){
      setPropertyKey([''])
    }else{
      setPropertyKey(tempProps);
    }
    // const list = [...state.properties.traits]
    // list.splice(index, 1)
    // dispatch({ type: 'CHANGE_TRAITS', payload: { traits: list } });
    // setPropertyTraits(list);
  }

  //handle add button of add button
  const handleAddProperty = () => {
    setPropertyKey(current => [...current, ''])
    // dispatch({
    //   type: 'CHANGE_TRAITS',
    //   payload: {
    //     traits: [
    //       ...state.properties.traits,
    //       { propertyKey: '' },
    //     ],
    //   },
    // })
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
    const query = `*[_type == "nftCollection" && name == "${collectionName}"]{category}`;
    const res = await config.fetch(query);
    setCategory(res[0].category);
    return res[0].category;
  }
  const handleBatchDrop = async(e) => {
    e.preventDefault();
    e.stopPropagation(); 
    const files = e.dataTransfer.files;
    if(files && files[0]){
      setFiles(files);
      setFileArray([...files]);
    }
  }
  const handleBatchUpload = async(e) => {
    e.preventDefault();
    // console.log(e.target.files);
    const files = e.target.files;
    if(files && files[0]){
      setFiles(files);
      setFileArray([...files]);
    }
  }
  const removeItem = (i, n, removeAll = false) => {

    if(!removeAll){
      const currentArray = fileArray.filter(item => item.name != n);

      setFileArray(currentArray);
    }else{
      setFileArray([]);
    }
  }
  // const updateName = (e, index) => {
  //   let curval = {...batchMetaData[index], name: e.target.value};
  //   // console.log(curval)
  //   let temp = batchMetaData?.map((item, i) => i != index ? item : curval );
  //   // console.log(temp)
  //   setBatchMetaData(temp);
  // }
  // const updateDescription = (e, index) => {
  //   let curval = {...batchMetaData[index], description: e.target.value};
  //   console.log(curval)
  //   let temp = batchMetaData?.map((item, i) => i != index ? item : curval );
  //   // console.log(temp)
  //   setBatchMetaData(temp);
    
  // }

  return (
    <div className={`overflow-hidden ${dark ? 'darkBackground text-neutral-100' : ' gradSky-vertical-white text-slate-900'}`}>
        <Header />
        <div className={style.wrapper}>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className={style.pageBanner}>
                <h2 className={style.pageTitle}> Batch Mint NFTs</h2>
            </div>
            {!isNaN(address) ? (
                <div className={style.container}>
                    
                        <div className={style.formWrapper}>
                            <p className={style.label}>Collection*</p>
                            <p className={style.smallText}>
                                Select your collection where NFTs will be minted. Only Collections from currently connected chain are shown.
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
                                                linear relative flex w-full grow cursor-pointer rounded-lg px-5 py-4 shadow-md transition duration-300 focus:outline-none`
                                            }
                                        >
                                            {({ active, checked }) => (
                                            <>
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex items-center flex-grow">
                                                        <div className="flex flex-col flex-grow justify-center space-y-3 text-sm items-center">
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
                        
                            <p className={style.label}>Properties</p>
                            <p className={style.smallText}>
                                The Properties will be applied to all the NFT Items.
                            </p>
                            {propertyKey?.map((x, index) => (
                                <div className="ml-[2rem] flex gap-[10px]" key={index}>
                                    <input
                                    name="propertyKey"
                                    placeholder="Property Name"
                                    className={style.input}
                                    value={x}
                                    onChange={(e) => handlePropertyChange(e, index)}
                                    />
                                    <div className="flex">
                                        {propertyKey.length !== 1 && (
                                            <button
                                            className={style.traitsButtons + `${dark ? ' hover:bg-sky-700/30' : ' hover:bg-neutral-100'}`}
                                            type="button"
                                            onClick={() =>handleRemoveProperty(x)}
                                            >
                                                <AiOutlineMinus fontSize="20px" color={dark ? 'white' : '#1d1d1f'}/>
                                            </button>
                                        )}
                                        {propertyKey.length - 1 === index && (
                                            <button
                                            className={style.traitsButtons + `${dark ? ' hover:bg-sky-700/30' : ' hover:bg-neutral-100'}`}
                                            type="button"
                                            onClick={handleAddProperty}
                                            >
                                                <AiOutlinePlus fontSize="20px" color={dark ? 'white' : '#1d1d1f'}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                )
                            )}
                            {/* {state.properties.traits.map((x, i) => (
                                <div className="ml-[2rem] flex gap-[10px]" key={i}>
                                    <input
                                    name="propertyKey"
                                    placeholder="Property Name"
                                    className={style.input}
                                    value={x.propertyKey}
                                    onChange={(e) => handlePropertyChange(e, i)}
                                    />
                                    <div className="flex">
                                        {state.properties.traits.length !== 1 && (
                                            <button
                                            className={style.traitsButtons}
                                            type="button"
                                            onClick={(i) => handleRemoveProperty(i)}
                                            >
                                                <AiOutlineMinus fontSize="20px" color={dark ? 'white' : '#1d1d1f'}/>
                                            </button>
                                        )}
                                        {state.properties.traits.length - 1 === i && (
                                            <button
                                            className={style.traitsButtons}
                                            type="button"
                                            onClick={handleAddProperty}
                                            >
                                                <AiOutlinePlus fontSize="20px" color={dark ? 'white' : '#1d1d1f'}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                )
                            )} */}

                            <p className={style.label}>Item Name Generator</p>
                            <p className={style.smallText}>
                                Generate name for all uploaded NFTs. eg. {itemname ? itemname : 'NFTNAME'} #1, {itemname ? itemname : 'NFTNAME'} #2, {itemname ? itemname : 'NFTNAME'} #3. '#&lt;number&gt;' will be added automatically
                            </p>
                            <div className="w-full p-2 md:w-1/2">
                              <input type="text"
                                  className={style.input + ' m-0 w-full'}
                                  value={itemname}
                                  onChange={(e) => setItemname(e.target.value)}/>
                            </div>
                            <form name="createNFTForm" onSubmit={handleSubmit}>
                                <div className="flex justify-between gap-2">
                                    <div className="w-full">
                                        <div className="flex justify-between">
                                          <p className={style.label}>Images *</p>
                                          {fileArray.length > 0 ? 
                                            <div className="mt-4 p-2 px-2 mr-2 gradBlue text-white rounded-lg  flex"
                                                onClick={() => removeItem(null,null,true)}>
                                                <div className="flex cursor-pointer gap-1 text-sm">
                                                <AiOutlineDelete fontSize={20}/> <span>Delete All</span>
                                                </div>
                                            </div>
                                          : ''}
                                          </div>
                                        {fileArray.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-scroll p-2 mt-4 border-dashed rounded-lg">
                                                {fileArray?.map((image,index) => 
                                                  <div className={`flex flex-col gap-2 p-4 rounded-md border ${dark ? 'border-slate-800' : ' border-neutral-100 shadow-md'}`} key={image.name}>
                                                    <div className="flex flex-row">
                                                      <div className="flex flex-col flex-1">
                                                          <input 
                                                              type="text" 
                                                              className={style.input}
                                                              placeholder="Name of Item*" name={`itemName${index}`} 
                                                              value={itemname != '' ?  itemname + ' #' + index : ''}
                                                              />
                                                          <textarea 
                                                              className={style.input}
                                                              placeholder="Item Description" 
                                                              name={`itemDescription${index}`}
                                                              ></textarea>
                                                      </div>
                                                      <div className="relative outline-2 singleImageHolder">
                                                        <div className="deleteButton hidden absolute -top-1 -right-1 bg-red-500 rounded-full p-1 cursor-pointer hover:-rotate-12 hover:scale-110 transition"
                                                            onClick={() => removeItem(index, image.name)}>
                                                            <AiOutlineDelete fontSize={20} color='white' />
                                                        </div>
                                                        <img src={URL.createObjectURL(image)} className="w-[100px] h-[110px] object-cover outline outline-offset-2 outline-2 outline-slate-600 m-2 rounded-md"/>
                                                      </div>
                                                    </div>

                                                    <div>
                                                    {propertyKey.length > 0 && <p className="p-3 pb-0">Properties:</p>}
                                                      <div className="properties p-3">
                                                        {propertyKey.length >= 1 && propertyKey.map(property => (
                                                            <div className="grid grid-cols-2 gap-2 items-center">
                                                              <p class="text-sm">{property === '' ? 'Not defined' : property}: </p>
                                                              <input type="text" className={style.input}/>
                                                            </div>
                                                        ))}
                                                      </div>
                                                  </div>
                                                  </div>
                                                )}
                                            </div>
                                            ) : (
                                            <div
                                                className={style.previewImage + `${dark ? ' hover:bg-slate-800' : ' hover:bg-neutral-100'}`}
                                                onDragOver={(e) => e.preventDefault()}
                                                    onDrop={ (e) => handleBatchDrop(e) } >
                                                
                                                    <div 
                                                        onClick={() => {fileInputRef.current.click()}} 
                                                        className="rounded-lg cursor-pointer flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 px-4"
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={ (e) => handleBatchDrop(e) }>
                                                            <BsUpload fontSize={50} />
                                                            Drag & Drop Image
                                                            <p className={style.smallText + " text-center"}>
                                                                Supported file types: JPG, PNG, GIF, WEBP, JFIF.
                                                            </p>
                                                    </div>
                                            </div>
                                        )}

                                    <div className="imageUploader mb-4 ml-3">
                                        <input
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                                        id="nftImage"
                                        ref={fileInputRef}
                                        onChange={ (e) => handleBatchUpload(e) }
                                        style={{ display: "none"}}
                                        multiple
                                        />
                                    </div>

                                    </div>
                                </div>
                        
                                {/* <p className={style.label}>Items Description</p>
                                <p className={style.smallText}>
                                    The item description will be added to all of the NFT items.
                                </p>
                                <textarea
                                    className={style.input}
                                    name="itemDescription"
                                ></textarea> */}

                        

                                <p className={style.label}>Blockchain: <span className="rounded-md p-1 border border-slate-700 px-3 ml-3">{chain?.name}</span></p>

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
                            </form>
                    </div>
                </div>
            ) : (
                <div className={style.notConnectedWrapper}>
                <ConnectWallet accentColor="#0053f2" colorMode={dark ? "dark": "light"} className=" ml-4" style={{ borderRadius: '50% !important'}} />
                </div>
            )}
        </div>
    </div>
  )
}

export default batchupload
