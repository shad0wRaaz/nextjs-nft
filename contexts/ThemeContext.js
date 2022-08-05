import {createContext, useState, useContext} from 'react';

const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [dark, setDark] = useState(false)
    return(
        <ThemeContext.Provider value={{dark, setDark}}>
            {children}
        </ThemeContext.Provider>
    )
}

//Export useContext Hook
export function useThemeContext() {
    return useContext(ThemeContext);
}