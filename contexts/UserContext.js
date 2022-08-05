import { createContext, useState, useContext } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [myUser, setMyUser] = useState()
  const [myProfileImage, setMyProfileImage] = useState()
  const [myCollections, setMyCollections] = useState([])
  const [myBannerImage, setMyBannerImage] = useState()
  const [queryCacheTime, setQueryCacheTime] = useState(1000 * 60 * 60)
  const [queryStaleTime, setQueryStaleTime] = useState(1000 * 60 * 60)
  return (
    <UserContext.Provider
      value={{
        myUser,
        setMyUser,
        queryStaleTime,
        queryCacheTime,
        myProfileImage,
        setMyProfileImage,
        myBannerImage,
        setMyBannerImage,
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
