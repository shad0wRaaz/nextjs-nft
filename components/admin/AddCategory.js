import toast from 'react-hot-toast';
import { MdAdd, MdDeleteOutline } from 'react-icons/md';
import React, { Fragment, useEffect, useState } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import { getAllCategories } from '../../fetchers/SanityFetchers';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addCategory, removeCategory } from '../../mutators/SanityMutators';
import { IconLoading } from '../icons/CustomIcons';

const style = {
    'button' : 'flex rounded-md gradBlue text-white p-2 px-4 cursor-pointer items-center justify-center',
}
const AddCategory = ({ setCategoryCount }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState();
    const { dark, errorToastStyle, successToastStyle } = useThemeContext();
    const queryClient = useQueryClient();

    const {mutate: addNewCategory, status: addStatus} = useMutation(
        ({categoryname, image}) => addCategory({categoryname, image}),
        {
            onError: (err) => {
                toast.error('Error in adding Category', errorToastStyle);
                console.log(err);
            },
            onSuccess: () => {
                setCategoryName('');
                setCategoryImage()
                queryClient.invalidateQueries(['allcategories']);
                toast.success('The Category has been added', successToastStyle);
            }

        }
    );

    const {mutate: removeNewCategory, status: removeStatus} = useMutation(
        ({categoryname, image}) => removeCategory({categoryname, image}),
        {
            onError:(err) => {
                toast.error(err.message, errorToastStyle);
                console.log(err);
            },
            onSuccess:() => {
                queryClient.invalidateQueries(['allcategories']);
                toast.success('The Category has been deleted', successToastStyle);
            }
        }
    );

    const { data: allcategories, status: allcategoriesstatus } = useQuery(
        "allcategories",
        getAllCategories(),
        {
            onSuccess:(res) => {
                setCategoryCount(Boolean(res?.length) ? res.length : 0)
            }
        }
        );

    
    const handleAdd = async () => {
        //check if the collection is already in the blocked list
        if(categoryName == '' || !categoryName) {
            toast.error('Category name is required', errorToastStyle);
            return
        };
        if(!categoryImage) {
            toast.error('Category image is required', errorToastStyle);
            return;
        }
        console.log(categoryImage);
        
        const words = categoryName.split(" ");

        const newname = words.map((word) => { return word[0].toUpperCase() + word.substring(1) }).join(" ");
        console.log(newname)
        addNewCategory({ categoryname: newname, image: categoryImage });
      
    }

    const handleRemove = async(catname) => {
        removeNewCategory({categoryname: catname});
    }

  return (
    <div className="space-y-3">
        <div className={`rounded-lg border ${dark ? 'border-slate-600 bg-slate-600 text-neutral-100' : 'border-neutral-200 bg-neutral-100'} p-4`}>
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2 items-center">
                    <p>Category Name</p>
                    <input name="catname" type="text" value={categoryName} className={`flex-grow rounded-md outline-0 p-2 ${dark? 'bg-slate-700 text-neutral-100' : 'text-gray-900'}`} onChange={(e) => setCategoryName(e.target.value)}/>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="border border-dashed rounded-md overflow-hidden w-2/3">
                        <input type="file" className="" onChange={(e) => setCategoryImage(e.target.files[0])}/>
                    </div>
                    <div onClick={() => handleAdd()} className={`${style.button} ${addStatus == "loading" ? "pointer-event-none" : ""}`}>
                        {addStatus == "loading" ? (
                            <>
                                {dark ? <IconLoading dark="inbutton" /> : <IconLoading/>}
                            </>
                        ) : (
                            <>
                                <MdAdd/> Add
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
        <div className="flex justify-between items-center mt-4">
            <p className={`font-semibold mt-3 ${dark ? 'text-neutral-100': ''}`}>List of available Categories</p>
        </div>
        <div className="max-h-[10rem] overflow-auto pr-4">
            {allcategories?.map(item => (
                <div key={item._id} className={`border p-3 px-5 ${dark ? 'border-slate-600 text-neutral-100' : 'border-neutral-100'} rounded-lg mt-1 relative`}>
                    <span>{item.name}</span>
                    <div 
                        className="absolute top-2 right-2 p-1 bg-red-500 text:bg-red-500 rounded-md cursor-pointer"
                        onClick={() => handleRemove(item.name)}>
                        <MdDeleteOutline fontSize={20} color='#ffffff'/>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AddCategory