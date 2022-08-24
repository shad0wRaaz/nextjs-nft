import React, { useState, useEffect, useReducer } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BiCollection } from 'react-icons/bi'
import FileBase from 'react-file-base64'
import { config } from '../../lib/sanityClient'
import {
  useAddress,
  useNFTCollection,
  useMetamask,
  useNetwork,
  MediaRenderer,
  useSigner,
  useChainId,
} from '@thirdweb-dev/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import Select from 'react-select'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { useUserContext } from '../../contexts/UserContext'
import { sendNotificationFrom } from '../../mutators/SanityMutators'
import { useQueryClient } from 'react-query'
import axios from 'axios'
import { IconLoading } from '../icons/CustomIcons'

const style = {
  container: 'my-[3rem] container mx-auto p-1 pt-0 text-gray-200',
  formWrapper: 'flex flex-wrap flex-col mt-4',
  pageTitle: 'm-4 ml-1 font-bold text-3xl text-gray-200 flex gap-[15px]',
  smallText: 'text-sm m-2 text-[#bbb] mt-0',
  subHeading:
    'text-xl font-bold m-2 mt-[2.5rem] mb-2 pt-[2rem] border-t-slate-700 border-t border-dashed',
  input:
    'm-2 outline-none p-3 bg-[#1e293b] rounded-[0.4rem] hover:bg-[#334155] transition linear',
  label: 'm-2 text-small mt-4',
  button:
    'gradBlue rounded-[0.4rem] cursor-pointer p-4 m-3 font-bold max-w-[12rem] w-[10rem] ease-linear transition duration-300 text-white',
  previewImage:
    'previewImage relative mb-[10px] h-[200px] w-[320px] overflow-hidden rounded-lg border-dashed border border-slate-400',
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

const CreateNFTCollection = () => {
  const connectWithMetamask = useMetamask()
  const network = useNetwork()
  const chain = useChainId()
  const address = useAddress()
  const signer = useSigner()
  const router = useRouter()
  const sdk = new ThirdwebSDK(signer)
  const { myUser } = useUserContext()
  const [newCollectionAddress, setNewCollectionAddress] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploy, setDeploy] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()
  const [profileImage, setProfileImage] = useState()
  const [bannerImage, setBannerImage] = useState()
  const [profile, setProfile] = useState()
  const [banner, setBanner] = useState()
  const queryClient = new useQueryClient()

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
      const metadata = {
        name: form.itemName.value,
        image: profileImage,
        description: form.itemDescription.value,
        symbol: form.symbol.value,
        fee_recipient: form.fee_recipient.value,
        primary_sale_recipient: form.primary_sale_recipient.value,
        seller_fee_basis_points: form.seller_fee_basis_points.value * 100,
        platform_fee_basis_points: 200,
        platform_fee_recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        trusted_forwarders: [],
      }
      return await sdk.deployer.deployNFTCollection(metadata)
    },
    {
      onError: (error) => {
        console.log(error)
        toast.error(error.message, errorToastStyle)
      },
      onSuccess: async (res, form, toastHandler = toast) => {
        const collectionDoc = {
          _type: 'nftCollection',
          _id: res,
          name: form.itemName.value,
          contractAddress: res,
          description: form.itemDescription.value,
          profileImage: 'profileImage-'.concat(res),
          chainId: chain.toString(),
          createdBy: {
            _type: 'reference',
            _ref: address,
          },
          external_link: form.external_link.value,
          bannerImage: 'bannerImage-'.concat(res),
          volumeTraded: 0,
          floorPrice: 0,
          category: selectedCategory,
        }
        // config.delete({query: `*[_type == "nftCollection" && _id=="${collectionAddress}"]`})
        const result = await config
          .createIfNotExists(collectionDoc)
          .then(async () => {
            try {
              //saving profile image
              if (profile) {
                const formdata = new FormData()
                formdata.append('profile', profile)
                formdata.append('userAddress', res)

                await axios.post(
                  'http://localhost:8080/api/saveS3Image',
                  formdata,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }
                )
              }
              //saving banner image
              if (banner) {
                const bannerData = new FormData()
                bannerData.append('banner', banner)
                bannerData.append('userAddress', res)

                await axios.post(
                  'http://localhost:8080/api/saveS3Banner',
                  bannerData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }
                )
              }
            } catch (error) {
              console.log(error)
            }

            //increment number of collection in category
            
            const categoryId = await config.fetch(`*[_type == "category" && name == "${selectedCategory}"]{_id}`)
            await config.patch(categoryId[0]._id)
            .inc({totalCollection : 1})
            .commit()
            .catch((err) => {})
            // await config.patch(res).

            queryClient.invalidateQueries('myCollections')
            //send out notification to all followers
            sendNotification({
              address: myUser.walletAddress,
              contractAddress: res,
              type: 'TYPE_ONE',
            })

            toastHandler.success(
              'Collection created successfully',
              successToastStyle
            )
          })
        router.push('/collections/myCollection')
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
    fetchCategoryData()
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
    const form = e.target

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

    if (!sdk) {
      //Some issue is there
      toastHandler.error('Error in deploying NFT collection', errorToastStyle)
      return
    } else {
      console.log('Starting to deploy NFT Collection')

      // setIsDeploying(true)
      mutate(form)

      if (status === 'success') {
        e.target.reset()
        setSelectedCategory('')
        setProfileImage()
        setBannerImage()
      }
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
      <Toaster position="bottom-center" reverseOrder={false} />
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
          <button
            onClick={() =>
              sendNotification({
                address: address,
                contractAddress: '0x107E3947C2ff89af2DD3d07bDb0515e4af97593a',
                type: 'TYPE_ONE',
              })
            }
          >
            Send Notification
          </button>
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
                    style={{ height: '200px', width: '325px' }}
                  >
                    {/* {Boolean(profileImage) && (
                      <MediaRenderer src={profileImage} />
                    )} */}
                    <img
                      src={profile?.data?.url}
                      id="pImage"
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="imageUploader">
                    {/* <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => setProfileImage(base64)}
                    /> */}
                    <input
                      id="profileImg"
                      type="file"
                      onChange={(e) => {
                        setProfile(e.target.files[0])
                        previewImage('profile')
                      }}
                    />
                  </div>
                  <p className={style.label}>Banner Image</p>
                  <div
                    className={style.previewImage}
                    style={{ height: '200px', width: '325px' }}
                  >
                    {/* {Boolean(bannerImage) && (
                      <MediaRenderer src={bannerImage} />
                    )} */}
                    <img
                      id="bImage"
                      src={banner?.data?.url}
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="imageUploader">
                    {/* <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => setBannerImage(base64)}
                    /> */}
                    <input
                      id="bannerImg"
                      type="file"
                      onChange={(e) => {
                        setBanner(e.target.files[0])
                        previewImage('banner')
                      }}
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

              <p className={style.subHeading}>Network/Chain Setting</p>
              <p className={style.smallText} style={{ marginBottom: '1rem' }}>
                Select which chain this collection should be deployed on.
              </p>

              <p className={style.label}>Network/Chain</p>
              <input
                type="text"
                className={style.input}
                name="itemBlockchain"
                disabled
                value={network[0].data.chain.name}
              ></input>

              <div className="flex">
                {isLoading ? (
                  <button
                    type="button"
                    className={style.button}
                    style={{ pointerEvents: 'none', opacity: '0.8' }}
                    disabled
                  >
                    <IconLoading dark="inbutton" />
                    Deploying...
                  </button>
                ) : (
                  <input
                    type="submit"
                    className={style.button}
                    value="Deploy"
                  />
                )}
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

export default CreateNFTCollection
