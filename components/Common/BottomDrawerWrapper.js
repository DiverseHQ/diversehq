import React from 'react'
import { Drawer } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'

const BottomDrawerWrapper = ({
  children,
  isDrawerOpen,
  setIsDrawerOpen,
  showClose = true
}) => {
  const [theme, setTheme] = useState('light')

  const themeChange = () => {
    const theme = window.localStorage.getItem('data-theme')
    if (theme) {
      document.body.classList.add(theme)
      document.documentElement.setAttribute('data-theme', theme)
      setTheme(theme)
    }
  }

  useEffect(() => {
    themeChange()
    window.addEventListener('themeChange', themeChange)
    return () => {
      window.removeEventListener('themeChange', themeChange)
    }
  }, [])

  // const statusStyle = (status) => {
  //   switch (status) {
  //     case "dark":
  //       return "#1A1A1B";
  //       break;
  //     case "light":
  //       return "#FFFFFF";
  //       break;
  //   }
  // };

  // const textStyle = (status) => {
  //   switch (status) {
  //     case "light":
  //       return "#1A1A1B";
  //       break;
  //     case "dark":
  //       return "#FFFFFF";
  //       break;
  //   }
  // };

  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={() => {
        setIsDrawerOpen(false)
      }}
      sx={{
        '& .MuiDrawer-paper': {
          borderRadius: '50px 50px 0px 0px',
          bgcolor: theme === 'light' ? '#FFFFFF' : '#1A1A1B',
          color: theme === 'light' ? '#1A1A1B' : '#FFFFFF'
        }
      }}
    >
      <div className="self-center mt-1 pb-4">
        <svg
          width="36"
          height="5"
          viewBox="0 0 36 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="5" rx="2.5" fill="#B3B4F3" />
        </svg>
      </div>
      <div className="max-h-[350px] overflow-y-scroll overflow-x-hidden">
        {children}
      </div>
      {showClose && (
        <div className="px-4 w-full bg-s-bg mb-3 mt-1">
          <button
            onClick={() => {
              setIsDrawerOpen(false)
            }}
            className="bg-p-bg rounded-full text-center flex font-bold text-p-text py-1 justify-center items-center text-p-text w-full text-xl "
          >
            Close
          </button>
        </div>
      )}
    </Drawer>
  )
}

export default BottomDrawerWrapper
