import toast from 'react-hot-toast';
import { config } from '../../lib/sanityClient'
import { MdAdd, MdDeleteOutline } from 'react-icons/md';
import { Combobox, Transition } from '@headlessui/react'
import { BsCheck, BsChevronExpand } from 'react-icons/bs';
import React, { Fragment, useEffect, useState } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getAllNFTsforDashboard } from '../../fetchers/SanityFetchers';
import { addBlockedNft, removeBlockedNft } from '../../mutators/SanityMutators';
import { IconLoading } from '../icons/CustomIcons';

const style = {
    'button' : 'flex rounded-md gradBlue text-white p-2 px-4 cursor-pointer items-center justify-center',
}
const BlockedNFTs = () => {
    const [selected, setSelected] = useState('');
    const [filterQuery, setFilterQuery] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const queryClient = useQueryClient();
    const [filteredNfts, setFilteredNft] = useState([]);
    const { blockedNfts, setBlockedNfts } = useSettingsContext();

    const {mutate: addNFTinBlockList, status: addStatus} = useMutation(
        ({id}) => addBlockedNft({id}),
        {
            onError: (err) => {
                toast.error('Error in blocking NFT', errorToastStyle);
                console.log(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['blockedItems']);
                toast.success('The NFT has been blocked', successToastStyle);
            }

        }
    );

    const {mutate: removeNFTfromBlockList, status: removeStatus} = useMutation(
        ({id}) => removeBlockedNft({id}),
        {
            onError:(err) => {
                toast.error('Error in unblocking NFT', errorToastStyle);
                console.log(err);
            },
            onSuccess:() => {
                queryClient.invalidateQueries(['blockedItems']);
                toast.success('The NFT has been unblocked', successToastStyle);
            }

        }
    );
    
    const { data: allnfts, status: allnftstatus } = useQuery(
        "allnfts",
        getAllNFTsforDashboard(), {
            onError: (err) => {},
            onSuccess: (res) => {
                setFilteredNft(res);
            },
        }
    );

    useEffect(() => {
        if(!allnfts) return;
        const filteredItems =
                    filterQuery === ''
                        ? allnfts
                        : filteredNfts.filter((item) =>
                            item.name
                            .toLowerCase()
                            .replace(/\s+/g, '')
                            .includes(filterQuery.toLowerCase().replace(/\s+/g, ''))
                        );
                setFilteredNft(filteredItems)
    }, [filterQuery]);
    
    
    const handleAdd = async (toastHandler =  toast) => {
        //check if the nft is already in the blocked list
        const checkitem = blockedNfts?.filter(item => item._id == selected._id);
        if(checkitem?.length > 0){
            toastHandler.error("The NFT is already in the blocked list", errorToastStyle);
            return;
        }
        addNFTinBlockList({id: selected._id});
        setFilterQuery('');
    }

    const handleRemove = async(id) => {
        removeNFTfromBlockList({id: id});
        setFilterQuery('');
    }

  return (
    <div className="space-y-3">
        <div className={`rounded-lg border ${dark ? 'border-slate-600 bg-slate-600 text-neutral-100' : 'border-neutral-200 bg-neutral-100'} p-4`}>
            <p className="mb-2">Add NFTs in the block list</p>
            <div className="flex flex-wrap gap-2 items-center mb-5">
                <Combobox value={selected} onChange={setSelected} className="flex-grow z-30">
                    <div className="relative mt-1">
                        <div className={`relative w-full cursor-default overflow-hidden rounded-lg  ${dark ? 'border-slate-700' : 'border-neutral-100 shadow-md'} border text-left  sm:text-sm`}>
                            <Combobox.Input
                            className={`w-full py-2 pl-3 pr-10 text-sm leading-5 focus:outline-0 outline-0 ring-0 ${dark? 'bg-slate-700 text-neutral-100' : 'text-gray-900'}`}
                            displayValue={(nft) => nft.name}
                            onChange={(event) => setFilterQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <BsChevronExpand
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setFilterQuery('')}
                        >
                            <Combobox.Options className={`absolute mt-1 max-h-60 w-96 overflow-auto rounded-lg ${dark ? 'bg-slate-700 border border-slate-600 shadow-md shadow-slate-600' : 'bg-white'} py-1 text-base shadow-lg sm:text-sm`}>
                            {filteredNfts?.length === 0 && filterQuery !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                                </div>
                            ) : (
                                filteredNfts?.map((nft) => (
                                <Combobox.Option
                                    key={nft._id}
                                    className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-blue-600 text-white' : dark ? 'text-neutral-100' : 'text-gray-900'
                                    }`
                                    }
                                    value={nft}
                                >
                                    {({ selected, active }) => (
                                    <>
                                        <span
                                        className={`block truncate ${
                                            selected ? 'font-medium' : 'font-normal'
                                        }`}
                                        >
                                        {nft.name}
                                        </span>
                                        {selected ? (
                                        <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active ? 'text-white' : 'text-teal-600'
                                            }`}
                                        >
                                            <BsCheck className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        ) : null}
                                    </>
                                    )}
                                </Combobox.Option>
                                ))
                            )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
                <div className={style.button} onClick={() => handleAdd()}>
                    {addStatus == 'loading' ? <IconLoading dark="inbutton"/> : (
                    <>
                        <MdAdd/> Add
                    </>)}
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center mt-4">
            <p className={`font-semibold mt-3 ${dark ? 'text-neutral-100': ''}`}>List of Blocked NFTs</p>
        </div>
        <div className="max-h-[10rem] overflow-scroll pr-4">
            {blockedNfts && blockedNfts?.length > 0 && blockedNfts?.map(nft => (
                <div key={nft._id} className={`border p-3 px-5 ${dark ? 'border-slate-600 text-neutral-100' : 'border-neutral-100'} rounded-lg blockedNft mt-1 relative`}>
                    <span>{nft.name}</span>
                    <div 
                        className="absolute top-2 right-2 p-1 bg-red-500 text:bg-red-500 rounded-md cursor-pointer"
                        onClick={() => handleRemove(nft._id)}>
                        <MdDeleteOutline fontSize={20} color='#ffffff'/>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default BlockedNFTs