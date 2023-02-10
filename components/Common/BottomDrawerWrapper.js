import React from 'react'
import { Drawer } from '@mui/material'

const BottomDrawerWrapper = ({
  children,
  isDrawerOpen,
  setIsDrawerOpen,
  showClose = true
}) => {
  // const { theme } = useTheme()
  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={() => {
        setIsDrawerOpen(false)
      }}
      sx={{
        '& .MuiDrawer-paper': {
          borderRadius: '20px 20px 0px 0px',
          backgroundColor: 'background'
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
      <div className="max-h-[500px] ">{children}</div>
      {showClose && (
        <div className="px-4 w-full  mb-3 mt-1">
          <button
            onClick={() => {
              setIsDrawerOpen(false)
            }}
            className="bg-p-bg rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl "
          >
            Close
          </button>
        </div>
      )}
    </Drawer>
  )
}

export default BottomDrawerWrapper
