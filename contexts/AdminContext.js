import { createContext, useState, useContext } from 'react'

const AdminContext = createContext()

export function AdminUserProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedChain, setSelectedChain] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [showUserTree, setShowUserTree] = useState('');
    const [referralModal, setReferralModal] = useState(false);
  
  return (
    <AdminContext.Provider
      value={{
        loggedIn, setLoggedIn,
        selectedChain, setSelectedChain,
        selectedUser, setSelectedUser,
        showUserTree, setShowUserTree,
        referralModal, setReferralModal,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

//Export useContext Hook
export function useAdminContext() {
  return useContext(AdminContext)
}
