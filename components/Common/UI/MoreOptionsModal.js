import React from 'react'

const MoreOptionsModal = ({ list, className }) => {
  return (
    <>
      <div
        className={`flex flex-col bg-s-bg sm:rounded-xl p-1 sm:shadow-md min-w-[180px] w-fit ${className}`}
      >
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex shrink-0 w-full space-x-2 items-center px-5 sm:pl-2 sm:pr-5 py-1 text-xl sm:text-lg sm:rounded-lg my-1 hover:bg-p-hover hover:text-p-hover-text hover:cursor-pointer text-p-text ${
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
