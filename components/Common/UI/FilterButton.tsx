import React from 'react'
interface Props {
  Icon?: React.ReactElement
  IconAtEnd?: React.ReactElement
  className?: string
  active?: boolean
  title: string
  onClick?: () => void
}

const FilterButton = ({
  Icon = <></>,
  IconAtEnd = <></>,
  className,
  active,
  title,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={`flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2.5 rounded-md sm:rounded-xl ${className} ${
        active && 'bg-s-bg'
      } hover:bg-s-hover`}
    >
      {Icon}
      <span>{title}</span>
      {IconAtEnd}
    </button>
  )
}

export default FilterButton
