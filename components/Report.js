import axios from 'axios'
import toast from 'react-hot-toast'
import { BsCheck } from 'react-icons/bs'
import { CgSelect } from 'react-icons/cg'
import { useMutation } from 'react-query'
import { useAddress } from '@thirdweb-dev/react'
import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useThemeContext } from '../contexts/ThemeContext'
import { sendNotificationFrom } from '../mutators/SanityMutators'

const reportType = [
    { name: 'Explicit and Sensitive content' },
    { name: 'Fake or possible scam' },
    { name: 'Illegal or drugs' },
    { name: 'Spam' },
    { name: 'Others' },
]
  
const style = {
    label: 'm-2 mt-4',
    inputgroup: 'p-3 border rounded-xl transition linear',
    input: 'outline-none p-3 border rounded-xl transition linear',
    button: 'accentBackground rounded-xl gradBlue text-center text-white cursor-pointer p-4 m-4 ml-0 font-bold max-w-[12rem] ease-linear transition duration-500',
}

const Report = ({ setShowModal, dark, itemType, metaDataFromSanity, nftContractData}) => {
    const { successToastStyle } = useThemeContext()
    const address = useAddress()
    const [selected, setSelected] = useState(reportType[0])
    const [otherDescription, setOtherDescription] = useState()
    const itemID = metaDataFromSanity?._id

    const { mutate: sendNotification } = useMutation(
        async ({ address, type, itemID, eventTitle, description }) =>
          sendNotificationFrom({
            address,
            type,
            itemID,
            followers: [{_ref: nftContractData?.owner}],
            eventTitle,
            description,
          })
      )
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const prefix = itemType == 'Collection' ? 'A' : 'An'
        axios.post('/api/email', {
            email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
            subjectText: prefix + ' ' + itemType + ' has been reported',
            emailBody: `<html>
                            Dear Admin,<br/>
                            ${prefix} ${itemType} has been reported. 
                            <br/><br/>Report Type: ${selected.name} <br/> 
                            Reported by: ${address} <br/>
                            NFT Collection: ${metaDataFromSanity?.collection?.name} <br/>
                            Item Id: ${itemID} <br/>
                            Description: ${otherDescription} <br/><br/>
                            Link to the Item: <a href="https://nuvanft.io/nfts/${itemID}" target="_blank">Click here</a>
                        </html>`,
          })

          //send notification to the owner
          sendNotification({
            address,
            type: 'TYPE_SIX',
            itemID: itemID,
            address : address,
            eventTitle: selected.name,
            description: otherDescription,
          })
          toast.success('This item has been reported.',successToastStyle)
        setShowModal(false)

    }
  return (
    <div className="fixed top-0 flex items-center justify-center p-10 left-0 right-0 bottom-0 bg-opacity-60 bg-black z-10">
        <div className={`${dark ? 'bg-slate-800' : 'bg-white'} p-10 rounded-3xl w-[30rem] z-50 relative`}>
            <div
                className="absolute top-5 right-5 bg-gray-300 p-3 rounded-full hover:bg-gray-400 transition-all cursor-pointer"
                onClick={() => setShowModal(false)}>
                <img
                    src="https://iconape.com/wp-content/png_logo_vector/cross-2.png"
                    className="h-3 w-3"
                />
            </div>
            <h2 className="text-center font-bold text-2xl mb-[2rem]">Report this {itemType}</h2>
            <form name="reportForm" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col">
                    <p className={style.label}>I think this {itemType} is</p>
                    <Listbox value={selected} onChange={setSelected}>
                        <div className="relative mt-1">
                            <Listbox.Button className={`relative w-full cursor-pointer rounded-lg border ${dark ? 'bg-slate-700 border-slate-700' : 'bg-white border-neutral-200'} py-4 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm`}>
                                <span className="block truncate">{selected.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <CgSelect
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0">
                                <Listbox.Options className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md ${dark ? 'bg-slate-700' : 'bg-white'} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                                    {reportType.map((person, personIdx) => (
                                        <Listbox.Option
                                            key={personIdx}
                                            className={({ active }) =>
                                                `relative select-none py-2 pl-10 pr-4 mx-2 rounded-lg cursor-pointer ${
                                                active ? 'bg-red-100 text-amber-900' : dark ? 'text-neutral-100' : 'text-gray-900'
                                                }`
                                            }
                                            value={person}>
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                        selected ? 'font-medium' : 'font-normal'
                                                        }`}>
                                                            {person.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                            <BsCheck className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                    <p className={style.label}>Description</p>
                    <textarea className={`outline-none p-3 border rounded-xl transition linear ${dark ? 'bg-slate-700 border-slate-700' : 'bg-white'}`} rows={5} value={otherDescription} onChange={(e) => setOtherDescription(e.target.value)} placeholder="Please provide any additional information or context that will help us understand and handle the situation."></textarea>
                    <input type="submit" value="Report" className={style.button}/>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Report