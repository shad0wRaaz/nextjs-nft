import {createContext, useState, useContext} from 'react';

const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [dark, setDark] = useState(true);
    const [headerToggler, setHeaderToggler] = useState(true);
    const successToastStyle = {
        style: { background: '#10B981', padding: '16px', color: '#fff' },
        iconTheme: { primary: '#ffffff', secondary: '#10B981' },
    }
    const errorToastStyle = {
        style: { background: '#ef4444', padding: '16px', color: '#fff' },
        iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
      }

    return(
        <ThemeContext.Provider value={{dark, setDark, successToastStyle, errorToastStyle, headerToggler, setHeaderToggler}}>
            {children}
        </ThemeContext.Provider>
    )
}

//Export useContext Hook
export function useThemeContext() {
    return useContext(ThemeContext);
}