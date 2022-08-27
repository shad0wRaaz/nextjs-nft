import { createContext, useContext, useState } from "react";

const SettingsContext = createContext()

export function SettingsProvider({children}) {
    const [coinPrices, setCoinPrices] = useState()
    return (
        <SettingsContext.Provider value={{ coinPrices, setCoinPrices}}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettingsContext() {
    return useContext(SettingsContext)
}