import { BsChevronUp } from 'react-icons/bs'
import { Disclosure } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useCollectionFilterContext } from '../contexts/CollectionFilterContext'
import { HiChevronUp } from 'react-icons/hi'
import { useThemeContext } from '../contexts/ThemeContext'

const Property = ({traits, nftData}) => {
    const { dark } = useThemeContext();
    const [propertyKey, setPropertyKey] = useState();
    const [propertyValue, setPropertyValue] = useState(); //this is to show the list of available property
    const { selectedProperties, setSelectedProperties } = useCollectionFilterContext(); //this is to store the user selected property
    console.log(propertyKey)
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
                        <Disclosure.Button className={`flex w-full justify-between rounded-lg ${dark ? 'bg-slate-600 hover:bg-slate-700' : 'bg-neutral-200 hover:bg-neutral-300'} px-4 py-4 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}>
                            <span>{ index + 1 }. {key}</span>
                            <HiChevronUp
                            className={`${
                                open ? 'rotate-180 transform' : ''
                            } transition h-5 w-5`}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className="p-4 text-sm">
                            <div className="flex flex-wrap text-xs gap-2">
                                {traits.filter(tr => tr.propertyKey === key).map((filteredtr, index) => (
                                    <div key={index}
                                        className={`rounded-lg transition p-2 px-3 border text-center break-words cursor-pointer 
                                                    ${selectedProperties.findIndex(
                                                        tr => tr.propertyKey == key && tr.propertyValue == filteredtr.propertyValue
                                                        ) >= 0? 'bg-sky-500 border-sky-500 text-neutral-100' : ( dark ? 'border-slate-600 hover:bg-slate-600' : 'border-neutral-200 hover:bg-neutral-200')}`}
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