import { BsChevronUp } from 'react-icons/bs'
import { Disclosure } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useCollectionFilterContext } from '../contexts/CollectionFilterContext'

const Property = ({propertyName, nftData}) => {
    const [propertyValue, setPropertyValue] = useState(); //this is to show the list of available property
    const { selectedPropertyValue, setSelectedPropertyValue } = useCollectionFilterContext(); //this is to store the user selected property
    
    useEffect(() => {
        if(!nftData) return
        const value = new Set();

        nftData?.map(nftItem => {
            nftItem?.metadata.properties.traits?.map(traits => {
                if(traits.propertyKey == propertyName){
                    value.add(traits.propertyValue);
                }
            })
        })
        setPropertyValue(Array.from(value));
        return() => {
            //clean up function, do nothing
        }
    },[nftData])

    const addRemoveFromSelection = (value) => {
        if(!selectedPropertyValue.includes(value)){
            //if not present then add
            setSelectedPropertyValue([...selectedPropertyValue, value]);
        }else {
            //take out that property
            const newArr = selectedPropertyValue.filter(item => item != value);
            setSelectedPropertyValue(newArr);
        }
    }



  return (
    <Disclosure>
        {({ open }) => (
            <div className="mb-4">
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-slate-600 px-4 py-4 text-left text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>{propertyName}</span>
                    <BsChevronUp
                    className={`${
                        open ? 'rotate-180 transform' : ''
                    } transition h-5 w-5 text-slate-100`}
                    />
                </Disclosure.Button>
                <Disclosure.Panel className="p-4 text-sm text-slate-200">
                    <div className="flex flex-wrap text-xs gap-2">
                        {propertyValue && propertyValue?.map(value => (
                            <div className={`rounded-lg p-2 px-3 border text-center break-words cursor-pointer ${selectedPropertyValue.includes(value) ? 'bg-sky-500 border-sky-500' : 'border-slate-600 '}`}
                                onClick={() => addRemoveFromSelection(value)}>
                                {value}
                            </div>
                        ))}
                    </div>
                </Disclosure.Panel>
            </div>
        )}
    </Disclosure>
  )
}

export default Property