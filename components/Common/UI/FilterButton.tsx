import { Tooltip } from '@mui/material'
import React from 'react'
interface Props {
  Icon?: React.ReactElement
  IconAtEnd?: React.ReactElement
  className?: string
  active?: boolean
  title: string
  tooltipTitle?: string
  onClick?: () => void
}

const FilterButton = ({
  Icon = <></>,
  IconAtEnd = <></>,
  className,
  active,
  title,
  tooltipTitle,
  ...props
}: Props) => {
  return (
    <Tooltip title={tooltipTitle} arrow placement="bottom">
      <button
        {...props}
        className={`flex items-center hover:cursor-pointer space-x-1 sm:space-x-2 py-1 px-2.5 sm:py-1 sm:px-2.5 rounded-full ${className} ${
          active
            ? 'bg-select-active-btn-bg text-select-active-btn-text'
            : 'bg-select-btn-bg text-select-btn-text sm:hover:bg-select-btn-hover-bg'
        }`}
      >
        {Icon}
        <span>{title}</span>
        {IconAtEnd}
      </button>
    </Tooltip>
  )
}

export default FilterButton