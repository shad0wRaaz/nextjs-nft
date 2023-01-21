import { createContext, useContext, useEffect, useState } from 'react'

const CollectionFilterContext = createContext();

export function CollectionFilterProvider({ children }) {
    const [selectedPropertyValue, setSelectedPropertyValue] = useState([]);

return (
    <CollectionFilterContext.Provider value={{ selectedPropertyValue, setSelectedPropertyValue }}>
        {children}
    </CollectionFilterContext.Provider>
)
}

//Export useContext Hook
export function useCollectionFilterContext() {
    return useContext(CollectionFilterContext)
  }