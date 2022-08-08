import { createContext, useContext, useState, useEffect } from 'react'

const SearchContext = createContext()

export function SearchProvider({ children }) {
  return <SearchContext.Provider value={{}}>{children}</SearchContext.Provider>
}

//Export useContext Hook
export function useSearchContext() {
  return useContext(SearchContext)
}
