import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useSigner } from '@thirdweb-dev/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { IconLoading } from './icons/CustomIcons';
import React, { useEffect, useState } from 'react'
import { updatePayment } from '../mutators/Web3Mutators';
import { useThemeContext } from '../contexts/ThemeContext';

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

const EditCollectionPayment = ({ collection, setPaymentModal }) => {
    const signer = useSigner();
    const [basisPoints, setBasisPoints] = useState(0);
    const [recipient, setRecipient] = useState('');
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const sdk = new ThirdwebSDK(signer);

    useEffect(() => {
        ;(async() => {
            if(collection[0].contractAddress != undefined) {
                const contract = await sdk.getContract(collection[0].contractAddress, "nft-collection");
                const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
                setRecipient(royaltyInfo?.fee_recipient);
                setBasisPoints(Number(royaltyInfo?.seller_fee_basis_points)/100);
            }
        })()
    },[])

    const handleEdit = async (e, toastHandler = toast) => {
      e.preventDefault();

      if (recipient == ''){
        toastHandler.error('Recipient cannot be empty.', errorToastStyle);
        return;
      }
      if(basisPoints < 0){
        toastHandler.error('Invalid royalty set.', errorToastStyle);
        return;
      }
        updateCollection();
    }
    
    const { mutate: updateCollection, status: updateStatus} = useMutation(
        () => updatePayment(collection, signer, basisPoints, recipient),
        {
            onError:(err) => {
                toast.error(err, errorToastStyle);
            },
            onSuccess: () => {
                toast.success("Payout settings updated successfully.", successToastStyle);
                setPaymentModal(false);
            }
        }
    )
  return (
    <div>
        <h2 className="text-center font-bold text-xl mb-[2rem] mt-16 md:mt-0">Payout Settings</h2>
        <form name="editCollection" onSubmit={handleEdit}>
            <div className={style.formRow}>
              <p className={style.label}>Recipient Address</p>
              <input
                type="text"
                className={
                  dark
                    ? style.input +
                      ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow'
                    : style.input +
                      ' border-neutral-200 hover:bg-neutral-100 flex-grow'
                }
                value={recipient}
                onChange={(e) =>
                  setRecipient(e.target.value)
                }
              />
            </div>
            <div className={style.formRow}>
              <p className={style.label}>Royalty %</p>
              <input
                type="number"
                className={
                  dark
                    ? style.input +
                      ' border-slate-600 bg-slate-700 hover:bg-slate-600 flex-grow'
                    : style.input +
                      ' border-neutral-200 hover:bg-neutral-100 flex-grow'
                }
                value={basisPoints ? basisPoints : 0}
                onChange={(e) =>
                  setBasisPoints(e.target.valueAsNumber)
                }
              />
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
        </form>
    </div>
  )
}

export default EditCollectionPayment