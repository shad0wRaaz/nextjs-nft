import {createContext, useContext, useState} from 'react';

const SearchContext = createContext();

export function SearchProvider({children}) {
    const [collectionArray, setCollectionArray] = useState([{address: 'asdf', name:'monkey'}])
    return(
        <SearchContext.Provider value={{collectionArray, setCollectionArray}}>
            {children}
        </SearchContext.Provider>
    )
}

//Export useContext Hook
export function useSearchContext() {
    return useContext(SearchContext);
}