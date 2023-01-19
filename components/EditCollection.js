import axios from 'axios';
import Select from 'react-select'
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import React, { useEffect } from 'react';
import { config } from '../lib/sanityClient';
import { IconLoading } from './icons/CustomIcons';
import { useMutation, useQueryClient } from 'react-query';
import { useThemeContext } from '../contexts/ThemeContext';
import { useSettingsContext } from '../contexts/SettingsContext';
import { updateCollectionMetaData } from '../mutators/Web3Mutators';
import { useSigner } from '@thirdweb-dev/react';
import { BsUpload } from 'react-icons/bs';
import { getImagefromWeb3 } from '../fetchers/s3';

const style = {
    formRow: 'flex flex-wrap w-full md:w-auto flex-row md:gap-3 items-center mt-3',
    input: 'm-2 outline-none p-3 border rounded-xl transition linear',
    inputgroup: 'p-3 border rounded-xl transition linear',
    label: 'm-2 w-[8rem]',
    smallText: 'text-sm m-2 text-slate-400 mt-0',
    previewImage: 'previewImage relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400',
    button: 'accentBackground flex gap-3 justify-center items-center rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold w-[9rem] ease-linear transition duration-500',
    profilePreview: 'aspect-video relative mr-[1rem] h-[200px] w-[250px] overflow-hidden m-[10px] rounded-lg border-dashed border border-slate-400 flex items-center',
    bannerPreview: 'aspect-video flex-grow relative mr-[1rem] h-[250px] overflow-hidden m-[10px] rounded-lg flex items-center justify-center border-dashed border border-slate-400',
}

const EditCollection = ({collection, setShowModal}) => {
  const signer = useSigner();
  const qc = useQueryClient();
  const bannerInputRef = useRef();
  const profileInputRef = useRef();
  const { HOST } = useSettingsContext();
  const [banner, setBanner] = useState();
  const [profile, setProfile] = useState();
  const [categories, setCategories] = useState([]);
  const { dark, errorToastStyle, successToastStyle } = useThemeContext();
  const [newCollectionData, setNewCollectionData] = useState(collection[0]);
  const [selectedCategory, setSelectedCategory] = useState({"value": collection[0].category, "label": collection[0].category});

  const { mutate: updateMetadata, status: updateStatus } = useMutation(
      () => updateCollectionMetaData(newCollectionData, signer, profile),
      {
        onSuccess:  (toastHandler = toast) => {
          if(!newCollectionData) return
          ;(async() => {
            // upload profile and banner in IPFS
            var profileLink = "";
            var bannerLink = "";

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
            await config
            .patch(newCollectionData._id)
            .set({
              name: newCollectionData.name,
              web3imagebanner: bannerLink?.data,
              web3imageprofile: profileLink?.data,
              category: newCollectionData.category,
              description: newCollectionData.description,
              external_link: newCollectionData.external_link,
            })
            .commit()
            .then(() => {
              setShowModal(false);
              qc.invalidateQueries('collection'); 
              toastHandler.success('Collection metadata has been updated', successToastStyle);

            })
          })()

        },
        onError: (err) => {
          setShowModal(false);
          toastHandler.error('Error in updating Collection metadata', errorToastStyle);
        }
      }
    )
  const handleEdit = async (e, toastHandler = toast) =>{
      e.preventDefault();
      if (
        newCollectionData.external_link !== '' &&
        !urlPatternValidation(newCollectionData.external_link)
      ) {
        toastHandler.error('External link is not valid.', errorToastStyle);
        return
      }

      updateMetadata() //Mutation function for updating collection metadata
      
  }

  const urlPatternValidation = (URL) => {
  const regex = new RegExp(
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
  )
  return regex.test(URL)
  }

  // function previewImage(target) {
  //     const files = document.getElementById(
  //       target == 'profile' ? 'profileImg' : 'bannerImg'
  //     )
  //     if (files.files.length > 0) {
  //       var reader = new FileReader()
  //       reader.readAsDataURL(files.files[0])
  //       // console.log(files.files[0])
  //       reader.onload = function (e) {
  //         var image = new Image()
  //         image.src = e.target.result
  //         image.onload = function () {
  //           document.getElementById(
  //             target == 'profile' ? 'pImage' : 'bImage'
  //           ).src = image.src
  //         }
  //       }
  //     } else {
  //       // Not supported
  //     }
  // }
  
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      background: '#334155',
      color: '#ffffff',
      borderRadius: '7px',
      border: '0',
      padding: '0.45rem',
      margin: '0.5rem',
      width: '220px'
    }),
    menu: (provided) => ({
      ...provided,
      background: '#334155',
      color: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
    }),
    singleValue: (provided) => ({
      ...provided,
      background: '#334155',
      color: '#ffffff',
      borderRadius: '7px',
      margin: 0,
    }),
    valueContainer: (provided) => ({
      ...provided,
      background: '#334155',
      borderRadiius: '7px',
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: '7px',
      color: state.isFocused ? '#1e293b' : '#ffffff',
      cursor: 'pointer',
    }),
  }

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

  return (
    <div>
      <h2 className="text-center font-bold text-xl mb-[2rem] mt-16 md:mt-0">Collection Metadata</h2>
        <form name="editCollection" onSubmit={handleEdit}>
          <div className="">
            <div className={style.formRow}>
              <p className={style.label}>Name</p>
              <input
                type="text"
                className={
                  dark
                    ? style.input +
                      ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow'
                    : style.input +
                      ' border-neutral-200 hover:bg-neutral-100 flex-grow'
                }
                value={newCollectionData.name}
                onChange={(e) =>
                  setNewCollectionData({ ...newCollectionData, name: e.target.value })
                }
              />
            </div>
            <div className={style.formRow}>
              <p className={style.label}>Description</p>
              <textarea
                rows={10}
                className={
                  dark
                    ? style.input +
                      ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow'
                    : style.input +
                      ' border-neutral-200 hover:bg-neutral-100 flex-grow'
                }
                value={newCollectionData.description}
                onChange={(e) =>
                  setNewCollectionData({ ...newCollectionData, description: e.target.value })
                }
              />
            </div>
            <div className={style.formRow}>
              <p className={style.label}>External Link</p>
              <input
                type="text"
                className={
                  dark
                    ? style.input +
                      ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow'
                    : style.input +
                      ' border-neutral-200 hover:bg-neutral-100 flex-grow'
                }
                value={newCollectionData.external_link}
                onChange={(e) =>
                  setNewCollectionData({ ...newCollectionData, external_link: e.target.value })
                }
              />
            </div>
            <div className={style.formRow}>
              <p className={style.label}>Category</p>
              <Select
                defaultValue={selectedCategory}
                options={categories}
                styles={customSelectStyles}
                onChange={(selectedOption) => {
                  setSelectedCategory(selectedOption.value);
                  setNewCollectionData({ ...newCollectionData, category: selectedOption.value })
                }}
              />
            </div>
            <div className={style.formRow}>
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
                  ) : newCollectionData?.web3imageprofile ? (
                    <img src={getImagefromWeb3(newCollectionData.web3imageprofile)} 
                      className="object-cover cursor-pointer hover:opacity-80" 
                      onClick={e => {profileInputRef.current.click()}}/>
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
            </div>
            <div className={style.formRow}>
              <p className={style.label}>Banner Image</p>
              <div
                className={style.bannerPreview}
                style={{ height: '250px', width: '325px' }}
                onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setBanner(e.dataTransfer.files[0]);
                    }}>
                    {banner ? (
                      <img src={URL.createObjectURL(banner)} className="object-cover cursor-pointer hover:opacity-80" onClick={e => setBanner(undefined)}/>
                    ) : newCollectionData?.web3imagebanner ? (
                      <img src={getImagefromWeb3(newCollectionData.web3imagebanner)} 
                        className="object-cover cursor-pointer hover:opacity-80" 
                        onClick={e => {bannerInputRef.current.click()}}/>
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
              {/* <div className="flex flex-col flex-grow w-full md:w-auto">
                <div className={style.bannerPreview}>
                  {bannerImageUrl && (
                    <img
                      src={bannerImageUrl}
                      id="bImage"
                      className="w-full object-cover"
                    />
                  )}
                </div>
                  <input
                  id="bannerImg"
                  type="file"
                  className="ml-3"
                  onChange={(e) => {
                    setBanner(e.target.files[0])
                    previewImage('banner')
                  }}
                />
              </div> */}
            </div>
            <div className={style.formRow + " flex-start"}>
              <p className={style.label + " hidden md:block"}><span className="invisible">Submit Button</span></p>
              {updateStatus == "loading" ? (
                <button className={style.button + "flex w-[8rem]"}>
                  <IconLoading dark={"inbutton"} /> Saving
                </button>
                ) : (
                  <input type="submit" className={style.button} value="Save" />
                )}
            </div>
          </div>
        </form>
    </div>
  )
}

export default EditCollection