import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { config } from '../lib/sanityClient'
import toast from 'react-hot-toast'
import { useAddress } from '@thirdweb-dev/react'
import FileBase from 'react-file-base64'
import Loader from '../components/Loader'
import { useRouter } from 'next/router'
import { useThemeContext } from '../contexts/ThemeContext'
import { useUserContext } from '../contexts/UserContext'
import { IconLoading } from '../components/icons/CustomIcons'
import { QueryClient } from 'react-query'
import axios from 'axios'
import { getUnsignedImagePath } from '../fetchers/s3'
import noProfileImage from '../assets/noProfileImage.png'
import noBannerImage from '../assets/noBannerImage.png'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'

const style = {
  wrapper: '',
  pageBanner: 'py-[4rem] mb-[2rem]',
  container:
    'container mx-auto p-3 pt-[2rem] px-[1.2rem] max-w-[700px] rounded-xl',
  formWrapper: 'flex flex-wrap flex-col gap-3',
  pageTitle: 'text-4xl font-bold text-center textGradBlue',
  input: 'm-2 outline-none p-3 border rounded-xl transition linear',
  inputgroup: 'p-3 border rounded-xl transition linear',
  label: 'font-bold m-2 ',
  button:
    'accentBackground rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold max-w-[12rem] ease-linear transition duration-500',
  profileImageContainer:
    'aspect-square relative mr-[1rem] h-[200px] overflow-hidden m-[10px] rounded-lg border-dashed border-2 border-sky-500 flex items-center',
  bannerImageContainer:
    'aspect-video w-[97%] relative mr-[1rem] h-[200px] overflow-hidden m-[10px] rounded-lg flex items-center border-dashed border-2 border-sky-500',
}

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const profile = () => {
  const address = useAddress()
  const [userDoc, setUserDoc] = useState()
  const [isSaving, setIsSaving] = useState(false)
  const { dark } = useThemeContext()
  const { myUser, setMyUser } = useUserContext()
  const queryClient = new QueryClient()
  const [profile, setProfile] = useState()
  const [banner, setBanner] = useState()
  const [profileImageUrl, setProfileImageUrl] = useState()
  const [bannerImageUrl, setBannerImageUrl] = useState()

  useEffect(async () => {
    if (!myUser) return
    setUserDoc({ ...myUser })
    if(myUser.profileImage) {
      setProfileImageUrl(await getUnsignedImagePath(myUser.profileImage))
    }
    if(myUser.bannerImage){
      setBannerImageUrl(await getUnsignedImagePath(myUser.bannerImage))
    }
  }, [myUser])

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
  const handleSubmit = async (
    e,
    toastHandler = toast,
    sanityClient = config
  ) => {
    e.preventDefault()
    if (!address) return
    setIsSaving(true)
    try {
      //saving profile image
      
      const files = document.getElementById('profileImg')
      if (files.files.length > 0) {
        var reader = new FileReader()
        reader.readAsDataURL(files.files[0])
        // console.log(files.files[0])
        reader.onload = function (e) {
          var image = new Image()
          image.src = e.target.result
          image.onload = async function () {
            //upload to IPFS Function here
            const sdk = new ThirdwebSDK()
            // const fetch = await sdk.storage.fetch("ipfs://QmU2bj83u6hGRe9EXzqE5ZNMacD9zQLDiaqDt4omMHLxnC/")
            const hash = await sdk.storage.upload(image.src)
            console.log(hash)

            const fetch = await sdk.storage.fetch(hash)
            console.log(fetch)
          }
        }
      } else {
        // Not supported
      }

      
      if(profile){
        const formdata = new FormData()
        formdata.append('profile', profile)
        formdata.append('userAddress', address)
  
        const result = await axios.post(
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
      if(banner){
        const bannerData = new FormData()
        bannerData.append('banner', banner)
        bannerData.append('userAddress', address)
  
        const result2 = await axios.post(
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
    try {
      await sanityClient
        .patch(address)
        .set({
          userName: userDoc.userName,
          biography: userDoc.biography,
          twitterHandle: userDoc.twitterHandle,
          igHandle: userDoc.igHandle,
          fbhHandle: userDoc.fbhHandle,
          bannerImage: 'bannerImage-'.concat(address),
          profileImage: 'profileImage-'.concat(address),
        })
        .commit()
        .then(() => {
          queryClient.invalidateQueries(['user'])
          toastHandler.success('Profile has been updated.', successToastStyle)
        })
    } catch (error) {
      console.log(error)
    }
    setIsSaving(false)
  }

  // useEffect(() => {
  //   console.log(profile)
  // }, [profile])
  return (
    <div
      className={`overflow-hidden ${dark && 'darkBackground text-neutral-100'}`}
    >
      <Header />
      <div className={style.wrapper}>
        <div
          className={
            dark
              ? style.pageBanner + ' darkGray'
              : style.pageBanner + ' bg-sky-100'
          }
        >
          <h2 className={style.pageTitle}>Profile</h2>
        </div>
        {myUser && (
          <div className={style.container}>
            {address ? (
              <form
                name="userForm"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <div className={style.formWrapper}>
                  <p className={style.label}>User Name</p>
                  <input
                    type="text"
                    className={
                      dark
                        ? style.input +
                          ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                        : style.input +
                          ' border-neutral-200 hover:bg-neutral-100 '
                    }
                    value={userDoc?.userName}
                    onChange={(e) =>
                      setUserDoc({ ...userDoc, userName: e.target.value })
                    }
                  />
                  <p className={style.label}>Biography</p>
                  <input
                    type="text"
                    className={
                      dark
                        ? style.input +
                          ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                        : style.input +
                          ' border-neutral-200 hover:bg-neutral-100 '
                    }
                    value={userDoc?.biography}
                    onChange={(e) =>
                      setUserDoc({ ...userDoc, biography: e.target.value })
                    }
                  />
                  <p className={style.label}>Wallet Address</p>
                  <input
                    type="text"
                    className={
                      dark
                        ? style.input +
                          ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                        : style.input +
                          ' border-neutral-200 hover:bg-neutral-100 '
                    }
                    value={userDoc?.walletAddress}
                    disabled
                  />
                  <p className={style.label}>Profile Image</p>
                  <div
                    className={style.profileImageContainer}
                    style={{ height: '200px', width: '300px' }}
                  >
                    {/* <img src={`${myUser.profileImage}`} id="pImage" /> */}
                      <img
                        src={profileImageUrl ? profileImageUrl?.data?.url : noProfileImage.src}
                        id="pImage"
                        className="w-full object-cover"
                      />
                    {/* <img
                      src={myUser?.profileImage ? myUser?.profileImage : ' '}
                    /> */}
                  </div>
                  <input
                    id="profileImg"
                    type="file"
                    onChange={(e) => {
                      setProfile(e.target.files[0])
                      previewImage('profile')
                    }}
                  />
                  {/* <FileBase
                    type="file"
                    id="profileImg"
                    multiple={false}
                    onDone={({ base64 }) =>
                      setUserDoc({ ...userDoc, profileImage: base64 })
                    }
                  /> */}
                  <p className={style.label}>Banner Address</p>
                  <div className={style.bannerImageContainer}>
                      <img
                        id="bImage"
                        src={bannerImageUrl ? bannerImageUrl?.data?.url : noBannerImage.src}
                        className="w-full object-cover"
                      />
                  </div>
                  <input
                    id="bannerImg"
                    type="file"
                    onChange={(e) => {
                      setBanner(e.target.files[0])
                      previewImage('banner')
                    }}
                  />
                  {/* <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) =>
                      setUserDoc({ ...userDoc, bannerImage: base64 })
                    }
                  /> */}
                  <p className={style.label}>Twitter Link</p>
                  <div className="flex w-full">
                    <div className={
                        dark
                          ? style.inputgroup +
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                          : style.inputgroup +
                            ' border-neutral-200 bg-neutral-100 '
                      } style={{ borderTopRightRadius : '0', borderBottomRightRadius : '0'}}>
                      <span>https://twitter.com/</span>
                    </div>
                    <input
                      type="text"
                      className={
                        dark
                          ? style.inputgroup +
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600 w-full'
                          : style.inputgroup +
                            ' border-neutral-200 hover:bg-neutral-100 w-full'
                      }
                      value={userDoc?.twitterHandle ? userDoc?.twitterHandle : ''}
                      onChange={(e) =>
                        setUserDoc({ ...userDoc, twitterHandle: e.target.value })
                      } style={{ borderTopLeftRadius : '0', borderBottomLeftRadius : '0', borderLeft: '0'}}
                    />
                  </div>
                  <p className={style.label}>Instagram Link</p>
                  <div className="flex w-full">
                    <div className={
                        dark
                          ? style.inputgroup +
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                          : style.inputgroup +
                            ' border-neutral-200 bg-neutral-100 '
                      } style={{ borderTopRightRadius : '0', borderBottomRightRadius : '0'}}>
                      <span>https://instagram.com/</span>
                    </div>
                    <input
                      type="text"
                      className={
                        dark
                          ? style.inputgroup +
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600 w-full'
                          : style.inputgroup +
                            ' border-neutral-200 hover:bg-neutral-100 w-full'
                      }
                      value={userDoc?.igHandle ? userDoc?.igHandle : ''}
                      onChange={(e) =>
                        setUserDoc({ ...userDoc, igHandle: e.target.value })
                      } style={{ borderTopLeftRadius : '0', borderBottomLeftRadius : '0', borderLeft: '0'}}
                    />
                  </div>
                  <p className={style.label}>Facebook Link</p>
                  <div className="flex w-full">
                    <div className={
                        dark
                          ? style.inputgroup +
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                          : style.inputgroup +
                            ' border-neutral-200 bg-neutral-100'
                      } style={{ borderTopRightRadius : '0', borderBottomRightRadius : '0'}}>
                      <span>https://facebook.com/</span>
                    </div>
                    <input
                      type="text"
                      className={
                        dark
                          ? style.inputgroup +
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600 w-full'
                          : style.inputgroup +
                            ' border-neutral-200 hover:bg-neutral-100 w-full'
                      }
                      value={userDoc?.fbhHandle ? userDoc?.fbhHandle : ''}
                      onChange={(e) =>
                        setUserDoc({ ...userDoc, fbhHandle: e.target.value })
                      } style={{ borderTopLeftRadius : '0', borderBottomLeftRadius : '0', borderLeft: '0'}}
                    />
                  </div>
                  {isSaving ? (
                    <button
                      type="button"
                      className={style.button + ' flex justify-center gap-2 ml-0'}
                      disabled
                    >
                      <IconLoading dark={'inbutton'} />
                      Saving...
                    </button>
                  ) : (
                    <input
                      type="submit"
                      className={style.button + ' ml-0'}
                      value="Save"
                    />
                  )}
                </div>
              </form>
            ) : (
              <Loader />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default profile
