import React from 'react'

const MoreOptionsModal = ({ list }) => {
  return (
    <>
      <div className="flex flex-col bg-s-bg sm:rounded-xl p-1 sm:shadow-md">
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex items-center px-5 sm:px-3 py-2 bg-s-bg text-xl sm:text-base sm:rounded-xl my-1 hover:bg-[#eee] hover:cursor-pointer ${
                item.label.includes('Delete') && 'text-red-500'
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
