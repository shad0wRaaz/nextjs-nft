import { createContext, useContext, useState } from "react";

const SettingsContext = createContext()

export function SettingsProvider({children}) {
    const [coinPrices, setCoinPrices] = useState();
    const [loadingNewPrice, setLoadingNewPrice] = useState(false);
    return (
        <SettingsContext.Provider value={{ coinPrices, setCoinPrices, loadingNewPrice, setLoadingNewPrice }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettingsContext() {
    return useContext(SettingsContext)
}