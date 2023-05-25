import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { IconLoading } from './icons/CustomIcons';
import { useThemeContext } from '../contexts/ThemeContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { updateCollectionReferral } from '../mutators/SanityMutators';

const CollectionReferral = ({collectionData, setShowReferralModal}) => {
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const qc = useQueryClient();
    const [level1, setLevel1] = useState(collectionData.referralrate_one);
    const [level2, setLevel2] = useState(collectionData.referralrate_two);
    const [level3, setLevel3] = useState(collectionData.referralrate_three);
    const [level4, setLevel4] = useState(collectionData.referralrate_four);
    const [level5, setLevel5] = useState(collectionData.referralrate_five);
    const [payableLevel, setPayableLevel] = useState(collectionData.payablelevel);
    
    const style = {
        formRow: 'flex flex-wrap w-full md:w-auto flex-row md:gap-3 items-center mt-3',
        input: `my-2 w-full outline-none p-3 border rounded-xl transition linear ${dark ? 'border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow': 'border-neutral-200 hover:bg-neutral-100 flex-grow'}`,
        inputgroup: 'p-3 border rounded-xl transition linear',
        label: 'm-2 w-[8rem]',
        smallText: 'text-sm m-2 text-slate-400 mt-0',
        previewImage: 'previewImage relative mb-[10px] flex justify-center items-center text-center overflow-hidden rounded-lg border-dashed border border-slate-400',
        button: 'accentBackground flex gap-3 justify-center items-center rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-3 font-bold w-[9rem] ease-linear transition duration-500',
    }
    
    const {mutate: updateReferral, status: updateStatus} = useMutation(
        () => updateCollectionReferral(collectionData._id, level1, level2, level3, level4, level5, payableLevel),
        {
            onError:(err) =>{
                toast.error('Referral settings could not be saved.', errorToastStyle);
            },
            onSuccess:(res) => {
                toast.success('Referral settings saved', successToastStyle);
                setShowReferralModal(false);
                qc.invalidateQueries('collection');
            }
        }
    )

    const handleEdit = (e) => {
        e.preventDefault();
        updateReferral();
    }
    

  return (
    <div>
        <h2 className="text-center font-bold text-xl mb-[2rem] mt-16 md:mt-0">Referral Commission Rate</h2>
        <form name="editCollection" onSubmit={handleEdit}>
            <div className={style.formRow}>
                <div className="w-full flex items-center">
                    <p className={style.label}>Payable Levels</p>
                    <div className="relative flex-grow">
                        <input
                            type="number"
                            className={style.input}
                            value={payableLevel}
                            onChange={(e) =>
                            setPayableLevel(e.target.value)
                            }
                        />

                    </div>
                </div>

                <div className="w-full flex items-center">
                    
                    <p className={style.label}>Level 1</p>
                    <div className="relative flex-grow">
                        <span className="absolute top-4 right-2 text-xl">%</span>
                        <input
                            type="number"
                            className={style.input}
                            value={level1}
                            onChange={(e) =>
                            setLevel1(e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex items-center">
                    <p className={style.label}>Level 2</p>
                    <div className="relative flex-grow">
                        <span className="absolute top-4 right-2 text-xl">%</span>
                        <input
                            type="number"
                            className={style.input}
                            value={level2}
                            onChange={(e) =>
                            setLevel2(e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex items-center">
                    <p className={style.label}>Level 3</p>
                    <div className="relative flex-grow">
                        <span className="absolute top-4 right-2 text-xl">%</span>
                        <input
                            type="number"
                            className={style.input}
                            value={level3}
                            onChange={(e) =>
                            setLevel3(e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex items-center">
                    <p className={style.label}>Level 4</p>
                    <div className="relative flex-grow">
                        <span className="absolute top-4 right-2 text-xl">%</span>
                        <input
                            type="number"
                            className={style.input}
                            value={level4}
                            onChange={(e) =>
                            setLevel4(e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex items-center">
                    <p className={style.label}>Level 5</p>
                    <div className="relative flex-grow">
                        <span className="absolute top-4 right-2 text-xl">%</span>
                        <input
                            type="number"
                            className={style.input}
                            value={level5}
                            onChange={(e) =>
                            setLevel5(e.target.value)
                            }
                        />

                    </div>
                </div>
                
                <div className={style.formRow + " flex-start"}>
                    <p className={style.label + " hidden md:block"}><span className="invisible">Submit Button</span></p>
                    {updateStatus == "loading" ? (
                        <button className={style.button + "flex w-[8rem]"} disabled>
                        <IconLoading dark={"inbutton"} /> Updating
                        </button>
                        ) : (
                        <input type="submit" className={style.button} value="Update"/>
                        )}
                </div>
            </div>
        </form>
    </div>
  )
}

export default CollectionReferral