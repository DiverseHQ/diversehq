import { Tooltip } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import { MdVerified } from 'react-icons/md'

const VerifiedBadge = ({ className }: { className?: string }) => {
  return (
    <Tooltip title="Verified" arrow enterDelay={1000} leaveDelay={200}>
      <MdVerified className={clsx('text-p-btn', className)} />
    </Tooltip>
  )
}

export default VerifiedBadge
