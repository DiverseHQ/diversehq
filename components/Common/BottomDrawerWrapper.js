import React from 'react'
import { Drawer } from '@mui/material'

const BottomDrawerWrapper = ({ children, isDrawerOpen, setIsDrawerOpen }) => {
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
          // height: height,
          maxHeight: '300px',
          overflowY: 'auto'
        }
      }}
    >
      <div className="self-center mt-1">
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

      {children}
    </Drawer>
  )
}

export default BottomDrawerWrapper
