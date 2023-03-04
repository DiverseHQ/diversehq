import React, { FC } from 'react'
import { alpha, styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { FormControlLabel } from '@mui/material'

interface Props {
  showUnjoined: boolean
  setShowUnjoined: any
}

const ExploreSwitch: FC<Props> = ({ showUnjoined, setShowUnjoined }) => {
  const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#9378d8',
      '&:hover': {
        backgroundColor: alpha('#9378d8', theme.palette.action.hoverOpacity)
      }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#9378d8'
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#e0e0e0'
    }
  }))

  return (
    <>
      <FormControlLabel
        control={
          <CustomSwitch
            onChange={(e) => setShowUnjoined(e.target.checked)}
            checked={showUnjoined}
          />
        }
        label="Yet to join"
        labelPlacement="start"
      />
    </>
  )
}

export default ExploreSwitch
