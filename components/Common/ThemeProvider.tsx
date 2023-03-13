import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

interface ContextType {
  theme: string
  toggleTheme: () => void
}

export const ThemeContext = createContext<ContextType>(null)
// import MUITheme from './MUITheme'
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    if (theme === 'light') {
      document.body.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      window.localStorage.setItem('data-theme', 'dark')
      setTheme('dark')
    } else {
      document.body.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      window.localStorage.setItem('data-theme', 'light')
      setTheme('light')
    }
  }

  useEffect(() => {
    const theme = window.localStorage.getItem('data-theme')
    if (theme) {
      document.body.classList.add(theme)
      document.documentElement.setAttribute('data-theme', theme)
      setTheme(theme)
    }
  }, [])
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider
