import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import FileBase from 'react-file-base64'
import Loader from '../components/Loader'
import Header from '../components/Header'
import { QueryClient } from 'react-query'
import Footer from '../components/Footer'
import { BsUpload } from 'react-icons/bs'
import { config } from '../lib/sanityClient'
import { useAddress } from '@thirdweb-dev/react'
import { useUserContext } from '../contexts/UserContext'
import React, { useState, useEffect, useRef } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconLoading } from '../components/icons/CustomIcons'
import { getImagefromWeb3, saveImageToWeb3 } from '../fetchers/s3'
import { useSettingsContext } from '../contexts/SettingsContext'

const style = {
  wrapper: '',
  pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
  container:
    'container mx-auto p-3 pt-[2rem] px-[1.2rem] max-w-[700px] rounded-xl',
  formWrapper: 'flex flex-wrap flex-col',
  pageTitle: 'text-4xl font-bold text-center text-white',
  smallText: 'text-sm m-2 text-slate-400 mt-0',
  input: 'm-2 outline-none p-3 border rounded-xl transition linear',
  inputgroup: 'p-3 border rounded-xl transition linear',
  label: 'font-bold m-2 mt-6',
  button:
    'accentBackground rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold max-w-[12rem] ease-linear transition duration-500',
  profileImageContainer:
    'aspect-square relative mr-[1rem] h-[200px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-400 flex items-center',
  bannerImageContainer:
    'aspect-video w-[97%] relative mr-[1rem] h-[200px] overflow-hidden m-[10px] rounded-lg flex items-center border-dashed border-2 border-sky-500',
}

const profile = () => {
  const router = useRouter()
  const address = useAddress()
  const bannerInputRef = useRef()
  const profileInputRef = useRef()
  const queryClient = new QueryClient()
  const [banner, setBanner] = useState()
  const [profile, setProfile] = useState()
  const [userDoc, setUserDoc] = useState()
  const { myUser, setMyUser } = useUserContext()
  const [isSaving, setIsSaving] = useState(false)
  const { dark, errorToastStyle, successToastStyle } = useThemeContext()

  useEffect(() => {
    if (!myUser) return
    setUserDoc({ ...myUser })

    return() => {
      //nothing, just a clean up code
    }
  }, [myUser])

  // useEffect(() => {
  //   if(!address) {
  //     router.push('/');
  //   }
  // },[address])

  // function previewImage(target) {
  //   const files = document.getElementById(
  //     target == 'profile' ? 'profileImg' : 'bannerImg'
  //   )
  //   if (files.files.length > 0) {
  //     var reader = new FileReader()
  //     reader.readAsDataURL(files.files[0])
  //     // console.log(files.files[0])
  //     reader.onload = function (e) {
  //       var image = new Image()
  //       image.src = e.target.result
  //       image.onload = function () {
  //         document.getElementById(
  //           target == 'profile' ? 'pImage' : 'bImage'
  //         ).src = image.src
  //       }
  //     }
  //   } else {
  //     // Not supported
  //   }
  // }

  const handleSubmit = async (
    e,
    toastHandler = toast,
    sanityClient = config
  ) => {
    e.preventDefault()
    if (!address) return
    setIsSaving(true);
    try {
      
      if(profile){
        console.log('profile pic changed');
        const formdata = new FormData();
        formdata.append('imagefile', profile);
        
        const uri =  await saveImageToWeb3(formdata);
        console.log(uri);
        setUserDoc({...userDoc, web3imageprofile: uri});
      }
      
      //saving banner image
      if(banner){
        console.log('banner pic changed');
        const bannerData = new FormData();
        bannerData.append('imagefile', banner);
        
        const uri  = await saveImageToWeb3(bannerData);
        console.log(uri);
        setUserDoc({...userDoc, web3imagebanner: uri});
      }
    } catch (error) {
      console.log(error)
    }
    try {
      console.log(userDoc)
      await sanityClient
        .patch(address)
        .set({
          userName: userDoc.userName,
          biography: userDoc.biography,
          twitterHandle: userDoc.twitterHandle,
          igHandle: userDoc.igHandle,
          fbhHandle: userDoc.fbhHandle,
          web3imagebanner: userDoc.web3imagebanner,
          web3imageprofile: userDoc.web3imageprofile,
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
                  <p className={style.label}>Short Intro</p>
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
                        className={`imageContainer relative cursor-pointer w-full h-full text-center flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 hover:bg-slate-${dark ? '800' : '100'} px-4`}
                        style={{ backgroundImage: `url(${getImagefromWeb3(userDoc?.web3imageprofile)})`, backgroundSize: 'cover'}}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setProfile(e.dataTransfer.files[0]);
                        }}>
                          <div className="overlay absolute h-full transition w-full top-0 left-0 hover:bg-slate-800/90 text-center flex justify-center flex-wrap flex-col items-center gap-2">
                            <BsUpload fontSize={50} color="white"/>
                            <span className="text-white">Drag & Drop Image</span>
                            <p className={style.smallText}>
                              <span className="text-white">Supported file types: JPG, PNG, GIF, WEBP, JFIF.</span>
                            </p>
                          </div>
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

                  <p className={style.label}>Banner Image</p>
                  <div
                    className={style.profileImageContainer}
                    style={{ height: '220px', width: '100%' }}
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
                        className={`imageContainer relative cursor-pointer w-full h-full text-center flex justify-center flex-wrap flex-col gap-2 p-3 items-center text-slate-400 hover:bg-slate-${dark ? '800' : '100'} px-4`}
                        style={{ backgroundImage: `url(${getImagefromWeb3(userDoc?.web3imagebanner)})`, backgroundSize: 'cover'}}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setBanner(e.dataTransfer.files[0]);
                        }}>
                          <div className="overlay absolute h-full transition w-full top-0 left-0 hover:bg-slate-800/90 text-center flex justify-center flex-wrap flex-col items-center gap-2">
                            <BsUpload fontSize={50} color="white"/>
                            <span className="text-white">Drag & Drop Image</span>
                            <p className={style.smallText}>
                              <span className="text-white">Supported file types: JPG, PNG, GIF, WEBP, JFIF.</span>
                            </p>
                          </div>
                      </div>
                    )}
                  </div>
                  <div className="imageUploader mb-4 ml-3">
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg, image/webp, image/jfif"
                      id="profileImg"
                      ref={bannerInputRef}
                      onChange={e => setBanner(e.target.files[0])}
                      style={{ display: "none"}}
                    />
                  </div>

                  {/* <div className={style.bannerImageContainer}>
                      <img
                        id="bImage"
                        src={userDoc?.web3imagebanner ? getImagefromWeb3(userDoc?.web3imagebanner) : noProfileImage.src}
                        className="w-full object-cover"
                      />
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
                  /> */}
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
                      className={style.button + ' flex justify-center gap-2 ml-0 mt-8'}
                      disabled
                    >
                      <IconLoading dark={'inbutton'} />
                      Saving...
                    </button>
                  ) : (
                    <input
                      type="submit"
                      className={style.button + ' ml-0 mt-8'}
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
