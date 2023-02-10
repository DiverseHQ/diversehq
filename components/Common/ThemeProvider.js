import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const ThemeContext = createContext({})
import {
  ThemeProvider as MUIThemeProvider,
  createTheme
} from '@mui/material/styles'
// import MUITheme from './MUITheme'
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

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

  const MUITheme = createTheme({
    palette: {
      mode: theme,
      ...(theme === 'light'
        ? {
          primary: {
            main: '#eef1ff'
          },
          secondary: {
            main: '#1A1A1A'
          },
          text: {
            primary: '#000000'
          },
          background: {
            default: '#1A1A1A'
          }
        }
        : {
          primary: {
            main: '#030303'
          },
          secondary: {
            main: '#1a1a1b'
          },
          text: {
            primary: '#d7dadc'
          },
          background: {
            default: '#1a1a1b'
          }
        })
    }
  })
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
      <MUIThemeProvider theme={MUITheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider
