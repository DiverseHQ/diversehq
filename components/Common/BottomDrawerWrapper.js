import React from 'react'
import { Drawer } from '@mui/material'
import { useTheme } from '../Common/ThemeProvider'

const BottomDrawerWrapper = ({
  children,
  isDrawerOpen,
  setIsDrawerOpen,
  showClose = true,
  position
}) => {
  const { theme } = useTheme()
  return (
    <Drawer
      anchor={position}
      open={isDrawerOpen}
      onClose={() => {
        setIsDrawerOpen(false)
      }}
      sx={{
        '& .MuiDrawer-paper': {
          borderRadius:
            (position === 'bottom' && '20px 20px 0px 0px') ||
            (position === 'left' && '0px 10px 10px 0px'),
          bgcolor: theme === 'dark' ? '#1a1a1b' : '#fff',
          color: theme === 'dark' ? '#fff' : '#1a1a1b'
        },
        '& .MuiDrawer-paperAnchorLeft': {
          width: '80%'
        }
      }}
      transitionDuration={200}
      bgcolor="custom"
    >
      <div
        className={` ${
          position === 'bottom' ? 'self-center mt-1 pb-4' : 'hidden'
        }`}
      >
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
      <div className="max-h-[500px]">{children}</div>
      {showClose && (
        <div className="px-4 w-full  mb-3 mt-1">
          <button
            onClick={() => {
              setIsDrawerOpen(false)
            }}
            className="bg-s-bg-hover rounded-full text-center flex font-semibold text-s-text py-1 justify-center items-center text-p-text w-full text-xl "
          >
            Close
          </button>
        </div>
      )}
    </Drawer>
  )
}

export default BottomDrawerWrapper
