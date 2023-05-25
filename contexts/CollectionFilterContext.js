import { createContext, useContext, useEffect, useState } from 'react'

const CollectionFilterContext = createContext();

export function CollectionFilterProvider({ children }) {
    const [selectedProperties, setSelectedProperties] = useState([]);
    useEffect(() => {
        // console.log(selectedProperties)
    }, [selectedProperties])
return (
    <CollectionFilterContext.Provider value={{ selectedProperties, setSelectedProperties }}>
        {children}
    </CollectionFilterContext.Provider>
)
}

//Export useContext Hook
export function useCollectionFilterContext() {
    return useContext(CollectionFilterContext)
  }