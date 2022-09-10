import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { config } from '../lib/sanityClient';
import { useMutation, useQueryClient } from 'react-query';
import { useThemeContext } from '../contexts/ThemeContext';
import { useMarketplaceContext } from '../contexts/MarketPlaceContext';
import { updateCollectionMetaData } from '../mutators/Web3Mutators'
import axios from 'axios';
import { IconLoading } from './icons/CustomIcons';

const errorToastStyle = {
    style: { background: '#ef4444', padding: '16px', color: '#fff' },
    iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
  }
const successToastStyle = {
style: { background: '#10B981', padding: '16px', color: '#fff' },
iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}

const style = {
    formRow: 'flex flex-wrap flex-row gap-3 items-center mt-3',
    input: 'm-2 outline-none p-3 border rounded-xl transition linear',
    inputgroup: 'p-3 border rounded-xl transition linear',
    label: 'm-2 w-[8rem]',
    button: 'accentBackground flex gap-3 justify-center items-center rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold w-[9rem] ease-linear transition duration-500',
    profilePreview: 'aspect-square relative mr-[1rem] h-[200px] overflow-hidden m-[10px] rounded-lg border-dashed border-2 border-sky-500 flex items-center',
    bannerPreview: 'aspect-video w-full flex-grow relative mr-[1rem] h-[250px] overflow-hidden m-[10px] rounded-lg flex items-center border-dashed border-2 border-sky-500',
}

const EditCollection = ({collection, profileImageUrl, bannerImageUrl}) => {
    const qc = useQueryClient()
    const { dark } = useThemeContext()
    const [banner, setBanner] = useState()
    const [profile, setProfile] = useState()
    const { rpcUrl } = useMarketplaceContext()
    const [isLoading, setIsLoading] = useState(false)
    const [newCollectionData, setNewCollectionData] = useState(collection)
// console.log(collection)
    const { mutate: updateMetadata } = useMutation(
        () => updateCollectionMetaData({newCollectionData, rpcUrl}),
        {
          onSuccess:  (toastHandler = toast) => {
            const itemID = collection.contractAddress.concat(collection.chainId)
            if(!newCollectionData) return
            setIsLoading(true)
            ;(async() => {
              await config
              .patch(itemID)
              .set({
                name: newCollectionData.name,
                description: newCollectionData.description,
                category: newCollectionData.category,
                external_link: newCollectionData.external_link
              })
              .commit()
              .then(async () => {
                if(profile){
                  const formdata = new FormData()
                  formdata.append('profile', profile)
                  formdata.append('userAddress', itemID)
            
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
                  bannerData.append('userAddress', itemID)
            
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

                qc.invalidateQueries('collection')
                toastHandler.success('Collection metadata has been updated', successToastStyle)
              })
            })()
            setIsLoading(false)
          },
          onError: (err) => {
            console.log(err)
            setIsLoading(false)
            toastHandler.error('Error in updating Collection metadata', successToastStyle)
          }
        }
      )

    const handleEdit = async (e) =>{
        e.preventDefault();
        
        updateMetadata() //Mutation function for updating collection metadata
        
    }

    const urlPatternValidation = (URL) => {
    const regex = new RegExp(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    )
    return regex.test(URL)
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
    <div>
        <h2 className="text-center font-bold text-xl mb-[2rem]">Update Collection's Metadata</h2>
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
                  <input
                    type="text"
                    className={
                      dark
                        ? style.input +
                          ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow'
                        : style.input +
                          ' border-neutral-200 hover:bg-neutral-100 flex-grow'
                    }
                    value={newCollectionData.category}
                    onChange={(e) =>
                      setNewCollectionData({ ...newCollectionData, category: e.target.value })
                    }
                  />
                </div>
                <div className={style.formRow}>
                  <p className={style.label}>Profile Image</p>
                    <div>
                      <div
                        className={style.profilePreview}
                      >
                        {profileImageUrl && (
                          <img
                            src={profileImageUrl}
                            id="pImage"
                            className="w-full object-cover"
                          />
                        )}
                      </div>
                      <input
                      id="profileImg"
                      type="file"
                      className="ml-3"
                      onChange={(e) => {
                        setProfile(e.target.files[0])
                        previewImage('profile')
                      }}
                      />
                    </div>
                </div>
                <div className={style.formRow}>
                  <p className={style.label}>Banner Image</p>
                  <div className="flex flex-col flex-grow">
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
                  </div>
                </div>
                <div className={style.formRow}>
                  <p className={style.label}><span className="invisible">Submit Button</span></p>
                  {isLoading && (
                    <button className={style.button + "flex w-[8rem]"}>
                      <IconLoading dark={"inbutton"} /> Saving
                    </button>
                    )}
                  {!isLoading && (
                    <input type="submit" className={style.button} value="Save" />
                  )}
                </div>
              </div>
            </form>
    </div>
  )
}

export default EditCollection