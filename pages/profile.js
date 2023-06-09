import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { BsUpload } from 'react-icons/bs'
import { MdVerified } from 'react-icons/md'
import { config } from '../lib/sanityClient'
import { GoUnverified } from 'react-icons/go'
import { BiChevronDown } from 'react-icons/bi'
import { useAddress } from '@thirdweb-dev/react'
import { QueryClient, useMutation } from 'react-query'
import { Dialog, Transition } from '@headlessui/react'
import { useUserContext } from '../contexts/UserContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { getImagefromWeb3, saveImageToWeb3 } from '../fetchers/s3'
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { checkValidEmail, generateRandomCode } from '../utils/utilities'
import { IconCopy, IconLoading, IconVerified } from '../components/icons/CustomIcons'
import { saveEmailVerificationCode, activateReferral, sendToken } from '../mutators/SanityMutators'
import { checkDuplicateEmail, checkReferralUser, checkUsername, getUser } from '../fetchers/SanityFetchers'
import SEO from '../components/SEO'

const style = {
  wrapper: '',
  pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
  container:
    'container mx-auto p-3 pt-[2rem] px-[1.2rem] max-w-[700px] rounded-xl',
  formWrapper: 'flex flex-wrap flex-col',
  pageTitle: 'text-4xl font-bold text-center text-white',
  smallText: 'text-sm m-2 text-slate-400 mt-0',
  input: 'my-1 w-full outline-none p-3 border rounded-xl transition linear',
  inputgroup: 'p-3 border rounded-xl transition linear',
  label: 'font-bold m-2 mt-6',
  button:
    'accentBackground rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold max-w-[12rem] ease-linear transition duration-500',
  profileImageContainer:
    'aspect-square relative h-[200px] overflow-hidden rounded-lg border-dashed border border-slate-400 flex items-center',
  bannerImageContainer:
    'aspect-video w-[97%] relative h-[200px] overflow-hidden rounded-lg flex items-center border-dashed border-2 border-sky-500',
}

const profile = () => {
  const router = useRouter();
  const address = useAddress();
  const bannerInputRef = useRef();
  const profileInputRef = useRef();
  const queryClient = new QueryClient();
  const { HOST } = useSettingsContext();
  const [banner, setBanner] = useState('');
  const [profile, setProfile] = useState('');
  const [userDoc, setUserDoc] = useState('');
  const [referrer, setReferrer] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const { myUser, setMyUser } = useUserContext();
  const [isSaving, setIsSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!myUser) return
    setUserDoc({ ...myUser });

    if(myUser.referrer){
      ;(async() => {
        const ref = await getUser(myUser.referrer?._ref);
        setReferrer(ref);
      })()
    }

    return() => {
      //nothing, just a clean up code
    }
  }, [myUser])

  const handleSubmit = async (
    e,
    toastHandler = toast,
    sanityClient = config
  ) => {
    e.preventDefault();
    
    if (!address) return
    
    //check for duplicate username
    const res =  await checkUsername(userDoc.userName, userDoc.walletAddress);
    if(res) {
      toastHandler.error('Username is already taken.', errorToastStyle);
      return
    }
    
    //check for correct email address and duplicate email address
    const res2 = await checkDuplicateEmail(userDoc.email, userDoc.walletAddress);

    if(res2){
      toastHandler.error('Duplicate email address is not allowed.', errorToastStyle);
      return
    }

    //check existence of referral user

    if(userDoc.referrer && userDoc.referrer._ref != ""){
      const userExist = await checkReferralUser(userDoc.referrer._ref);
  
      if(!userExist || userExist.length == 0){
        toastHandler.error('Unknown referral wallet address.', errorToastStyle);
        return;
      }
      //check if referral address is the same user
      if(userDoc.referrer._ref == address){
        toastHandler.error('Cannot put yourself as your own referral.', errorToastStyle);
        referrerPresent = false;
        return;
      }
    }


    setIsSaving(true);
    
    var profileLink = { data : userDoc?.web3imageprofile ? userDoc?.web3imageprofile : '' };
    var bannerLink =  { data: userDoc?.web3imagebanner ? userDoc?.web3imagebanner : '' } ;
    

    try {
      if(profile){
        const pfd = new FormData();
        pfd.append('imagefile', profile);

        profileLink = await axios.post(
          `${HOST}/api/saveweb3image`,
          pfd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        ).catch(err => {})
        // setUserDoc({...userDoc, web3imageprofile: profileLink?.data});
      }
      
      //saving banner image
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
          ).catch(err => {})
          // setUserDoc({...userDoc, web3imagebanner: bannerLink?.data});
        }
    } catch (error) {
      console.log(error)
    }

    try {
      let obj = '';
      if(Boolean(userDoc.referrer) && userDoc.referrer._ref != '' ){
        obj = {
        userName: userDoc.userName,
        biography: userDoc.biography,
        email: userDoc.email,
        igHandle: userDoc.igHandle,
        fbhHandle: userDoc.fbhHandle,
        twitterHandle: userDoc.twitterHandle,
        web3imagebanner: bannerLink.data,
        web3imageprofile: profileLink.data,
        referrer: userDoc.referrer
      }
     }else{
      obj = {
        userName: userDoc.userName,
        biography: userDoc.biography,
        email: userDoc.email,
        igHandle: userDoc.igHandle,
        fbhHandle: userDoc.fbhHandle,
        twitterHandle: userDoc.twitterHandle,
        web3imagebanner: bannerLink.data,
        web3imageprofile: profileLink.data,
      }
    }
      await sanityClient
        .patch(address)
        .set(obj)
        .commit()
        .then(() => {
          
          //send out referral bonus; all required checking will be done in the same function
          //send only if token has not been sent previously
          if(!userDoc.tokensent && referrer){
            //console.log(userDoc.walletAddress, userDoc.referrer._ref);
            sendToken(userDoc.walletAddress, userDoc.referrer._ref);
          }
          setIsSaving(false)
        });

        if(Boolean(userDoc.referrer) && userDoc?.referrer?._ref != ""){
          //save this user as direct referrals of the referred by user
          //need to check wallet address before adding in
          
          try{
            await sanityClient
              .patch(userDoc.referrer._ref)
              .setIfMissing({ directs: [] })
              .insert('after', 'directs[-1]', [{ _type: 'reference', _ref: userDoc.walletAddress }])
              .commit({ autoGenerateArrayKeys: true });
          }catch(err){
            console.log(err)
            toastHandler.error('Error updating referred by.', errorToastStyle);
          }
  
        }
        queryClient.invalidateQueries(['user']);
        toastHandler.success('Profile has been updated.', successToastStyle);

    } catch (error) {
      console.log(error)
      setIsSaving(false)
    }
  }

  const initiateEmailVerification = async (email, toastHandler = toast) => {
    //check email pattern first
    
    if(!checkValidEmail(email)){
      toastHandler.error("Invalid email address", errorToastStyle);
      return
    }

    try{
      setSendingEmail(true);
      //send verification code in email
      const randomCode = generateRandomCode();
      
      //save this code in database and send the link to user
      const saveinDb = await saveEmailVerificationCode(userDoc._id, randomCode);
      if(!saveinDb){
        //if code is not saved in database
        toastHandler.error('Error in saving verification code. Please try again later', errorToastStyle);
        return;
      }
      //send email now with code
      const sendEmail = await axios.post(
        `${HOST}/api/sendconfirmationemail`,
        {email, randomCode, id: userDoc._id}
        ).catch(err => {});

      if(sendEmail.data.message == "success"){
        toastHandler.success('Verification email sent. Click the link the email to verify the email address.', successToastStyle);
      }

      setSendingEmail(false);
    }catch(error){
      setSendingEmail(false);
    } 
  }

  // const { mutate: activate } = useMutation(
  //   () => activateReferral(address), {
  //     onError: (err) => {
  //       console.log(err)
  //     },
  //     onSuccess: (res) => {
  //       console.log(res)
  //     }
  //   }
  // )

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground text-neutral-100'}`}>
      <SEO title="Profile"/>
      <Header />
      <div className={style.wrapper}>
        <div
          className={
            dark
              ? style.pageBanner + ' darkGray'
              : style.pageBanner + ' bg-sky-100'
          }
        >
          <h2 className={style.pageTitle}>My Profile</h2>
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
                  {/* disable referal field if already present */}
                  {referrer ? (
                    <></>
                    // <div className="flex justify-between items-center mt-6">
                    //   <p className="font-bold w-[140px] m-2">Referred By</p>
                    //   {/* <Link href={`/user/${referrer?.walletAddress}`} className="flex-grow cursor-pointer"> */}
                    //     <div className="flex flex-grow items-center">
                    //       <div className="wil-avatar relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-neutral-100 shadow-inner ring-1 ring-white">
                    //         {referrer?.web3imageprofile ? (
                    //           <img
                    //             className="absolute inset-0 h-full w-full rounded-full object-cover"
                    //             src={getImagefromWeb3(referrer?.web3imageprofile)}
                    //             alt={referrer?.userName}
                    //           />
                    //         ) :(
                    //           <img src="https://api.dicebear.com/6.x/bottts/svg?seed=Charlie" alt="Avatar"/>
                    //         )}
                    //       </div>
                    //       <div>
                    //         <span className="ml-2.5 flex flex-col">
                    //           <span className="flex items-center font-medium">
                    //             {/* <span>{referrer?.userName}</span> */}
                    //             {referrer?.verified ? (
                    //               <IconVerified />
                    //             ) : ''}
                    //           </span>
                    //         </span>
                    //         <span className="ml-2.5 text-sm hidden md:block">{referrer.walletAddress}</span>
                    //         <span className="ml-2.5 text-sm md:hidden">{referrer.walletAddress.slice(0,4)}...{referrer.walletAddress.slice(-4)}</span>
                    //       </div>
                    //     </div>
                    //   {/* </Link> */}
                    // </div>
                    ) : (
                      <>
                        <p className={style.label}>Referred By</p>
                        <input
                          type="text"
                          className={
                            dark
                            ? style.input + 
                            ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                            : style.input +
                            ' border-neutral-200 hover:bg-neutral-100 '
                          }
                          value={userDoc?.referrer ? userDoc?.referrer._ref : ''}
                          onChange={(e) => setUserDoc({ ...userDoc, referrer: { _type: 'reference', _ref: e.target.value }})}
                          />
                      </>
                  )}
                  <div className="flex justify-between items-center mt-6 pb-5">
                    <p className="font-bold w-[140px] m-2">Referral Bonus</p>
                    <div className="relative flex-grow">
                      {userDoc?.refactivation ? (
                        <div 
                          className={
                          `text-xs border p-1 px-2 w-fit text-right rounded-md 
                          ${dark ? 'bg-green-700 border-green-600' : 'bg-green-500 border-green-600 text-white'}`}>
                            {userDoc?.refactivation ? 'Activated': 'Not Activated'}
                      </div>
                      ) : (
                        <div 
                          className={
                          `text-xs cursor-pointer border p-1 px-2 w-fit text-right rounded-md 
                          ${dark ? 'bg-slate-700 border-slate-600/30' :'border-neutral-200 bg-neutral-100'}`}
                            onClick={() => setIsOpen(true)}>
                        {userDoc?.refactivation ? 'Activated': 'Not Activated'}
                      </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start flex-col md:flex-row  md:items-center mt-0 pb-5">
                    <p className="font-bold w-[140px] m-2 flex justify-between">Referral Link <span 
                        className="cursor-pointer md:hidden"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://nuvanft.io/?w=${address}`);
                          toast.success('Referral link copied', successToastStyle);
                        }}>
                        <IconCopy />
                      </span></p>
                    <div className="flex flex-grow items-center justify-start gap-2">
                      <span className={`px-[1rem] py-[0.7rem] ${dark ? 'ring-1 ring-inset ring-[#9ca3af33] text-[#c5ccd7] bg-slate-800' : 'bg-[#f3f4f6] text-[#4b5563]' } rounded-xl text-[0.75rem] `}>
                        {`https://nuvanft.io/?w=${address}`}
                      </span>
                      <span 
                        className="cursor-pointer hidden md:block"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://nuvanft.io/?w=${address}`);
                          toast.success('Referral link copied', successToastStyle);
                        }}>
                        <IconCopy />
                      </span>
                    </div>
                  </div>

                  <p className={style.label}>Name (Alias)</p>
                  <input
                    type="text"
                    className={
                      dark
                        ? style.input +
                          ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                        : style.input +
                          ' border-neutral-200 hover:bg-neutral-100 '
                    }
                    value={userDoc?.userName ? userDoc?.userName : ''}
                    onChange={(e) =>
                      setUserDoc({ ...userDoc, userName: e.target.value })
                    }
                  />
                  <p className={style.label}>Wallet Address</p>
                  <input
                    type="text"
                    className={
                      dark
                        ? style.input +
                          ' border-slate-700 bg-slate-900 text-xs md:text-base cursor-not-allowed'
                        : style.input +
                          ' border-neutral-200 bg-neutral-100 text-xs md:text-base cursor-not-allowed'
                    }
                    value={userDoc?.walletAddress ? userDoc?.walletAddress : ''}
                    disabled
                  />

                  <div className="flex justify-center">
                    {isSaving ? (
                      <button
                        type="button"
                        className={style.button + ' w-[200px] flex justify-center gap-2 ml-0 mt-8'}
                        disabled
                      >
                        <IconLoading dark={'inbutton'} />
                        Saving...
                      </button>
                    ) : (
                      <input
                        type="submit"
                        className={style.button + ' w-[200px] ml-0 mt-8'}
                        value="Save"
                      />
                    )}
                  </div>
                  <div 
                    className="text-center py-5 flex justify-center cursor-pointer "
                    onClick={() => setShowMore(cur => !cur)}>More Settings <div className={`inline transition ${showMore ? 'rotate-180' : ''}`}><BiChevronDown fontSize={25}/></div>
                  </div>
                  
                  <div className={`${showMore ? 'block': 'hidden'}`}>
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
                      value={userDoc?.biography ? userDoc?.biography : ''}
                      onChange={(e) =>
                        setUserDoc({ ...userDoc, biography: e.target.value })
                      }
                    />
                    
                    <p className={style.label}>Email Address</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className={
                          dark
                            ? style.input +
                              ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                            : style.input +
                              ' border-neutral-200 hover:bg-neutral-100 '
                        }
                        value={userDoc?.email ? userDoc?.email : ''}
                        onChange={(e) =>
                          setUserDoc({ ...userDoc, email: e.target.value })
                        }
                      />
                      {userDoc.verified ? (
                        <div className="bg-green-400 py-2 px-4 my-1 text-green-700 rounded-lg text-sm flex justify-center items-center w-32 font-bold">
                          <MdVerified fontSize={20} /> Verified
                        </div>
                      ) : (
                        <div 
                          className={
                            `${sendingEmail ? 'pointer-events-none' : ''}
                            bg-yellow-400 py-2 px-4 my-1 text-yellow-700 rounded-lg text-xs flex justify-center items-center w-44 font-bold gap-1
                            ${myUser?.email == undefined ? ' opacity-80 pointer-events-none cursor-not-allowed': ' cursor-pointer'}
                            `}
                          onClick={() => initiateEmailVerification(userDoc?.email)}>
                            <GoUnverified fontSize={20}/> {sendingEmail ? ' Sending Email' : 'Verify Email'}
                        </div>
                      )}
                    </div>
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
                            <div className={`overlay absolute h-full transition w-full top-0 left-0 hover:bg-slate-800/90 text-center flex justify-center flex-wrap flex-col items-center gap-2`}>
                              <BsUpload fontSize={50} color="white"/>
                              <span className={dark ? '' : 'text-slate-700' }>Drag & Drop Image</span>
                              <p className={style.smallText}>
                                <span className={dark ? '' : 'text-slate-700' }>Supported file types: JPG, PNG, GIF, WEBP, JFIF.</span>
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

                    <p className={style.label}>Twitter Link</p>
                    <div className="flex w-full">
                      <div className={
                          dark
                            ? style.inputgroup +
                              ' border-slate-600 bg-slate-700 hover:bg-slate-600'
                            : style.inputgroup +
                              ' border-neutral-200 bg-neutral-100 '
                        } style={{ borderTopRightRadius : '0', borderBottomRightRadius : '0'}}>
                        <span className="text-sm">https://twitter.com/</span>
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
                        <span className="text-sm">https://instagram.com/</span>
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
                        <span className="text-sm">https://facebook.com/</span>
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
                    
                    <div className="flex justify-center">
                      {isSaving ? (
                        <button
                          type="button"
                          className={style.button + ' w-[200px] flex justify-center gap-2 ml-0 mt-8'}
                          disabled
                        >
                          <IconLoading dark={'inbutton'} />
                          Saving...
                        </button>
                      ) : (
                        <input
                          type="submit"
                          className={style.button + ' w-[200px] ml-0 mt-8'}
                          value="Save"
                        />
                      )}
                    </div>
                  </div>
                  
                </div>
              </form>
            ) : (
              <Loader />
            )}
          </div>
        )}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Referral Qualification
                    </Dialog.Title>
                    <div className="mt-2 text-gray-700">
                      <p className="text-sm">This will automatically activate once all the requirements listed below are met.</p>
                      <ul className="text-sm">
                        <li>1. At least one NFT Collection in any chain.</li>
                        <li>2. At least one NFT minted in any chain.</li>
                        <li>3. At least one NFT listed in any marketplace in any chain.</li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      <Footer />
    </div>
  )
}

export default profile
