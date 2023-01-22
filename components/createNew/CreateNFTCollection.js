import Select from 'react-select'
import { BiCollection } from 'react-icons/bi'
import { config } from '../../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import {
  useAddress,
  useNetwork,
  useSigner,
  useChainId,
} from '@thirdweb-dev/react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { BsUpload } from 'react-icons/bs'
import { useMutation } from 'react-query'
import { useQueryClient } from 'react-query'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { ConnectWallet } from '@thirdweb-dev/react'
import { IconLoading } from '../icons/CustomIcons'
import React, { useState, useEffect, useRef } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import { useThemeContext } from '../../contexts/ThemeContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { sendNotificationFrom } from '../../mutators/SanityMutators'

const style = {
  container: 'my-[3rem] container mx-auto p-1 pt-0 text-gray-200',
  formWrapper: 'flex flex-wrap flex-col mt-4',
  pageTitle: 'm-4 ml-1 font-bold text-3xl text-gray-200 flex gap-[15px]',
  smallText: 'text-sm m-2 text-slate-400 mt-0',
  subHeading:
    'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
  input:
    'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
  label: 'm-2 text-small mt-4',
  button:
    'gradBlue rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
  previewImage:
    'previewImage relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400',
  notConnectedWrapper: 'flex justify-center items-center h-screen',
  traitsButtons:
    'p-[0.65rem] rounded-[0.4rem] cursor-pointer m-3 font-bold round border-dashed border border-slate-400 ease-linear transition duration-300 text-white',
  secondaryButton:
    'rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white border border-slate-400 hover:border-slate-600',
}

const CreateNFTCollection = () => {
  const network = useNetwork();
  const chain = useChainId();
  const { HOST } = useSettingsContext();
  const {dark, successToastStyle, errorToastStyle} = useThemeContext();
  const address = useAddress();
  const { myUser } = useUserContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [profile, setProfile] = useState();
  const [banner, setBanner] = useState();
  const queryClient = new useQueryClient();
  const router = useRouter();
  const signer = useSigner();
  const profileInputRef = useRef();
  const bannerInputRef = useRef();
  const sdk = new ThirdwebSDK(signer);

  const { mutate: sendNotification } = useMutation(
    async ({ address, contractAddress, type }) =>
      sendNotificationFrom({
        address,
        contractAddress,
        type,
        followers: myUser.followers,
      })
  )

  const { data, mutate, status, isLoading } = useMutation(
    async (form) => {
      
      var profileLink = "";
      var bannerLink = "";
      
      try{
        // upload profile and banner in IPFS
        if(profile){
          const pfd = new FormData();
          pfd.append("imagefile", profile);
          profileLink = await axios.post(
            `${HOST}/api/saveweb3image`,
            pfd,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
            )
          }
          
        if(banner){
          const bfd = new FormData();
          bfd.append("imagefile", banner);
          bannerLink = await axios.post(
            `${HOST}/api/saveweb3image`,
            bfd,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
            )
          }
            
        const metadata = {
          name: form.itemName.value,
          image: profileLink?.data,
          description: form.itemDescription.value,
          symbol: form.symbol.value,
          fee_recipient: form.fee_recipient.value,
          primary_sale_recipient: form.primary_sale_recipient.value,
          seller_fee_basis_points: form.seller_fee_basis_points.value * 100,
          platform_fee_basis_points: 500,
          platform_fee_recipient: '0xa22d92ee43C892eebD01fa1166e1e45F67E28311',
          trusted_forwarders: [],
        }
        const itemID = uuidv4();
        // console.log(profileLink, bannerLink)
        // console.log(metadata)
        // console.log(itemID)
      
        //deploy NFT Collection
        const res = await sdk.deployer.deployNFTCollection(metadata);

        //save in database

        const collectionDoc = {
          _type: 'nftCollection',
          _id: itemID,
          name: form.itemName.value,
          contractAddress: res,
          description: form.itemDescription.value,
          web3imageprofile: profileLink?.data,
          web3imagebanner: bannerLink?.data,
          chainId: chain.toString(),
          createdBy: {
            _type: 'reference',
            _ref: address,
          },
          external_link: form.external_link.value,
          volumeTraded: 0,
          floorPrice: 0,
          category: selectedCategory,
        }
          
        await config.createIfNotExists(collectionDoc);
        
        const categoryId = await config.fetch(`*[_type == "category" && name == "${selectedCategory}"]{_id}`);
        
        await config.patch(categoryId[0]._id)
          .inc({totalCollection : 1})
          .commit()
          .catch((err) => {})

          // await config.patch(res).

          queryClient.invalidateQueries('myCollections');
          
          //send out notification to all followers
          sendNotification({
            address: myUser.walletAddress,
            contractAddress: res,
            id: itemID,
            type: 'TYPE_ONE',
          })

        toast.success('Collection created successfully', successToastStyle);
        
        router.push(`/collections/${itemID}`);

      } catch(err){
          toast.error(err, errorToastStyle);
      }
      
    },
      {
        onError: (error) => {
          toast.error(error.message, errorToastStyle)
        },
    }
  )

  //getting Collection Categories to put in Select control, from Sanity
  const fetchCategoryData = async (sanityClient = config) => {
    const query = `*[_type == "category"]  {
    name,
  }`
    await sanityClient.fetch(query).then((categories) => {
      const options = categories.map((d) => ({
        value: d.name,
        label: d.name,
      }))
      setCategories(options)
    })
  }
  useEffect(() => {
    fetchCategoryData();
    
    return() => {
      //do nothing
    }
  }, [])

  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    )
    return regex.test(URL)
  }

  //handling Create NFT Collection button
  const handleDeployNFTCollection = (e, toastHandler = toast) => {
    e.preventDefault()
    const form = e.target;
    // console.log(form)

    if (
      form.itemName.value == '' ||
      form.primary_sale_recipient.value == '' ||
      typeof selectedCategory == 'undefined'
    ) {
      toastHandler.error('Fields marked * are required', errorToastStyle)
      return
    }

    if (
      form.external_link.value !== '' &&
      !urlPatternValidation(form.external_link.value)
    ) {
      toastHandler.error('External link is not valid.', errorToastStyle)
      return
    }

      // setIsDeploying(true)
      mutate(form);

      if (status === 'success') {
        e.target.reset()
        setSelectedCategory('')
        setProfile()
        setBanner()
      }
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
      borderRadius: '20px',
      padding: '20px',
    }),
    singleValue: (provided) => ({
      ...provided,
      background: '#1e293b',
      color: '#ffffff',
      borderRadius: '7px',
      margin: 0,
    }),
    valueContainer: (provided) => ({
      ...provided,
      background: '#1e293b',
      borderRadiius: '10px',
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: '7px',
      color: state.isFocused ? '#1e293b' : '#ffffff',
      cursor: 'pointer',
    }),
  }

  function previewImage(target) {
    const files = document.getElementById(
      target == 'profile' ? 'profileImg' : 'bannerImg'
    )
    if (files.files.length > 0) {
      var reader = new FileReader()
      reader.readAsDataURL(files.files[0])
      // console.log(files.files[0])
      reader.onload = function (e) {
        var image = new Image()
        image.src = e.target.result
        image.onload = function () {
          document.getElementById(
            target == 'profile' ? 'pImage' : 'bImage'
          ).src = image.src
        }
      }
    } else {
      // Not supported
    }
  }
  return (
    <div className={style.wrapper}>
      <Toaster position="bottom-right" reverseOrder={false} />
      {!isNaN(address) ? (
        <div className={style.container}>
          <h1 className={style.pageTitle}>
            <BiCollection className={style.contractItemIcon} />
            Create NFT Collection
          </h1>
          <p className={style.smallText}>
            Settings to organize and distinguish between your different NFT
            collections.
          </p>
          {/* <button
            onClick={() =>
              sendNotification({
                address: address,
                contractAddress: '0x107E3947C2ff89af2DD3d07bDb0515e4af97593a',
                type: 'TYPE_ONE',
              })
            }
          >
            Send Notification
          </button> */}
          <form
            name="CreateNFTCollectionForm"
            onSubmit={handleDeployNFTCollection}
          >
            <div className={style.formWrapper}>
              <div className="flex gap-[40px]">
                <div className="grow">
                  <p className={style.label}>Collection Name*</p>
                  <input
                    className={style.input}
                    style={{ width: '98%' }}
                    type="text"
                    name="itemName"
                  />

                  <p className={style.label}>Description</p>
                  <textarea
                    rows={7}
                    className={style.input}
                    style={{ width: '98%' }}
                    name="itemDescription"
                  ></textarea>

                  <p className={style.label}>External Link</p>
                  <input
                    type="text"
                    style={{ width: '98%' }}
                    className={style.input}
                    name="external_link"
                    placeholder="https://yourlink.to"
                  />

                  <p className={style.label}>Symbol</p>
                  <input
                    type="text"
                    style={{ width: '98%' }}
                    className={style.input}
                    name="symbol"
                  />

                  <p className={style.label}>Category*</p>
                  <p className={style.smallText}>
                    Give this Collection a category. Useful when people browse
                    by category.
                  </p>
                  <Select
                    options={categories}
                    styles={customSelectStyles}
                    onChange={(selectedOption) => {
                      setSelectedCategory(selectedOption.value)
                    }}
                  />
                </div>
                <div>
                  <p className={style.label}>Profile Image</p>
                  
                  <div
                    className={style.previewImage}
                    style={{ height: '250px', width: '325px' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setProfile(e.dataTransfer.files[0]);
                    }}>
                    {profile ? (
                      <img src={URL.createObjectURL(profile)} className="object-cover cursor-pointer hover:opacity-80" onClick={e => setProfile(undefined)}/>
                    ) : (
                      <div 
                        onClick={() => {profileInputRef.current.click()}} 
                        className="cursor-pointer flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 hover:bg-slate-800 px-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setProfile(e.dataTransfer.files[0]);
                        }}><BsUpload fontSize={50} />
                          Drag & Drop Image
                          <p className={style.smallText}>
                            Supported file types: JPG, PNG, GIF, WEBP, JFIF.
                          </p>
                      </div>
                    )}
                  </div>
                  <div className="imageUploader mb-4 ml-3">
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                      id="profileImg"
                      ref={profileInputRef}
                      onChange={e => setProfile(e.target.files[0])}
                      style={{ display: "none"}}
                    />
                  </div>
                  <p className={style.label} style={{marginTop: '40px'}}>Banner Image</p>
                  <div
                    className={style.previewImage}
                    style={{ height: '250px', width: '325px' }}
                    onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setBanner(e.dataTransfer.files[0]);
                        }}>
                    {banner ? (
                      <img src={URL.createObjectURL(banner)} className="object-cover cursor-pointer hover:opacity-80" onClick={e => setBanner(undefined)}/>
                    ) : (
                      <div 
                        onClick={() => {bannerInputRef.current.click()}} 
                        className="cursor-pointer flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 hover:bg-slate-800 px-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setBanner(e.dataTransfer.files[0]);
                        }}><BsUpload fontSize={50} />
                          Drag & Drop Image
                          <p className={style.smallText}>
                            Supported file types: JPG, PNG, GIF, WEBP, JFIF.
                          </p>
                      </div>
                    )}
                  </div>
                  <div className="imageUploader mb-4 ml-3">
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                      id="bannerImg"
                      ref={bannerInputRef}
                      onChange={e => setBanner(e.target.files[0])}
                      style={{ display: "none"}}
                    />
                  </div>
                </div>
              </div>

              <p className={style.subHeading}>Payout Settings</p>
              <p className={style.smallText} style={{ marginBottom: '1rem' }}>
                Where should any funds generated by this contract flow to.
              </p>

              <p className={style.label} style={{ fontSize: '18px' }}>
                Primary Sales
              </p>
              <p className={style.smallText}>
                Determine the address that should receive the revenue from
                initial sales of the assets.
              </p>

              <p className={style.label}>Recipient Address *</p>
              <input
                className={style.input}
                type="text"
                name="primary_sale_recipient"
                value={address}
                onChange={(e) => {}}
              />

              <p
                className={style.label}
                style={{ fontSize: '18px', marginTop: '2rem' }}
              >
                Royalties
              </p>
              <p className={style.smallText}>
                Determine the address that should receive the revenue from
                royalties earned from secondary sales of the assets.
              </p>
              <div className="space-between flex">
                <div className="grow">
                  <p className={style.label}>Recipient Address</p>
                  <input
                    className={style.input}
                    style={{ width: '98%' }}
                    type="text"
                    name="fee_recipient"
                    value={address}
                    onChange={(e) => {}}
                  />
                </div>
                <div>
                  <p className={style.label}>Percentage (%)</p>
                  <input
                    className={style.input}
                    type="text"
                    style={{ width: '120px' }}
                    placeholder="0.00"
                    name="seller_fee_basis_points"
                  />
                </div>
              </div>

              <p className={style.subHeading}>Network/Chain</p>
              <p className={style.smallText} style={{ marginBottom: '1rem' }}>
                The NFT Collection will be deployed on following network/chain.
              </p>
              
              <div className="flex justify-between">
                {/* <p className={style.label}>Network/Chain : {network[0].data.chain.name}</p> */}
                <input
                  type="text"
                  className={style.input + ' grow'}
                  name="itemBlockchain"
                  disabled
                  value={ network[0].data.chain.name}
                ></input>
              </div>

              <div className="flex mt-4">
                {isLoading ? (
                  <button
                    type="button"
                    className={style.button + ' flex gap-2'}
                    style={{ pointerEvents: 'none', opacity: '0.8' }}
                    disabled
                  >
                    <IconLoading dark="inbutton" />
                   Processing...
                  </button>
                ) : (
                  <input
                    type="submit"
                    className={style.button}
                    value="Create"
                  />
                )}
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

export default CreateNFTCollection
