import React from 'react'

interface ItemType {
  label: string
  icon?: React.FC
  hidden?: boolean
  onClick?: () => void
  className?: string
}

interface Props {
  list: ItemType[]
  className?: string
}

const MoreOptionsModal = ({ list, className }: Props) => {
  return (
    <>
      <div
        className={`flex flex-col w-full bg-s-bg sm:rounded-xl p-1 sm:shadow-md min-w-[180px] sm:border-[1px] border-s-border w-fit ${className}`}
      >
        {list.map((item: ItemType, index: number) => {
          if (item.hidden) return null
          return (
            <div
              key={index}
              className={`flex shrink-0 w-full space-x-2 items-center px-5 sm:pl-2 sm:pr-5 py-1 text-xl sm:text-lg rounded-md sm:rounded-lg my-1 hover:bg-s-hover hover:cursor-pointer text-p-text ${
                item?.label?.includes('Delete') &&
                'text-red-500 hover:text-red-500'
              } ${item.className ? item.className : ''}}`}
              onClick={item.onClick}
            >
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MoreOptionsModal
