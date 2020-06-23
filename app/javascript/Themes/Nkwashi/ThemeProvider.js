import React from 'react'
import { Theme as theme } from './Theme'

const ThemeContext = React.createContext(theme)
export const Context = ThemeContext
export default function ThemeProvider({ children }) {
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}
