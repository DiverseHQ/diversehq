import React from 'react'
import { CircularProgress } from '@mui/material'

const MobileLoader = () => {
  return (
    <div className="flex flex-row justify-center w-full py-6">
      <CircularProgress
        size="30px"
        sx={{ '.MuiCircularProgress-svg': { color: '#9378d8' } }}
      />
    </div>
  )
}

export default MobileLoader
