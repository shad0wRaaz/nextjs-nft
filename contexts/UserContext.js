import { createContext, useState, useContext } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [myUser, setMyUser] = useState();

  const [myCollections, setMyCollections] = useState([]);

  const [queryCacheTime, setQueryCacheTime] = useState(1000 * 60 * 60);
  const [queryStaleTime, setQueryStaleTime] = useState(1000 * 60 * 60);
  
  return (
    <UserContext.Provider
      value={{
        myUser,
        setMyUser,
        queryStaleTime,
        queryCacheTime,
        myCollections,
        setMyCollections,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

//Export useContext Hook
export function useUserContext() {
  return useContext(UserContext)
}
