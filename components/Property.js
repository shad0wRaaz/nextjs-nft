import { BsChevronUp } from 'react-icons/bs'
import { Disclosure } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useCollectionFilterContext } from '../contexts/CollectionFilterContext'

const Property = ({traits, nftData}) => {
    const [propertyKey, setPropertyKey] = useState();
    const [propertyValue, setPropertyValue] = useState(); //this is to show the list of available property
    const { selectedProperties, setSelectedProperties } = useCollectionFilterContext(); //this is to store the user selected property
    
    useEffect(() => {
        if(!traits) return
        
        const propKey = new Set();
        traits.map(tr => {
            propKey.add(tr.propertyKey);
        })
        setPropertyKey(Array.from(propKey))

        return() => {
            //clean up function, do nothing
        }
    },[traits])

    const addRemoveFromSelection = (key, value) => {
        if(!selectedProperties.find(tr => (tr.propertyKey == key && tr.propertyValue == value))){
            //if not present then add
            setSelectedProperties([...selectedProperties, { propertyKey: key, propertyValue: value}]);
        }else {
            //take out that property
            const newArr = selectedProperties.filter(tr => !(tr.propertyKey == key && tr.propertyValue == value));
            setSelectedProperties([...newArr]);
        }
    }


  return (
    <>
        {propertyKey && propertyKey.map((key, index) => (
            <Disclosure key={index}>
                {({ open }) => (
                    <div className="mb-4">
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-slate-600 px-4 py-4 text-left text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                            <span>{key}</span>
                            <BsChevronUp
                            className={`${
                                open ? 'rotate-180 transform' : ''
                            } transition h-5 w-5 text-slate-100`}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className="p-4 text-sm text-slate-200">
                            <div className="flex flex-wrap text-xs gap-2">
                                {traits.filter(tr => tr.propertyKey == key).map((filteredtr, index) => (

                                    <div key={index}
                                        className={`rounded-lg p-2 px-3 border text-center break-words cursor-pointer 
                                                    ${selectedProperties.findIndex(
                                                        tr => tr.propertyKey == key && tr.propertyValue == filteredtr.propertyValue
                                                        ) >= 0? 'bg-sky-500 border-sky-500' : 'border-slate-600 '}`}
                                        onClick={() => addRemoveFromSelection(key, filteredtr.propertyValue)}>
                                        {filteredtr.propertyValue}
                                    </div>
                                    
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </div>
                )}
            </Disclosure>
        ))}
    </>
  )
}

export default Property