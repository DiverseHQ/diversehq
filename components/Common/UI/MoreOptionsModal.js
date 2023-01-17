import React from 'react'

const MoreOptionsModal = ({ list }) => {
  return (
    <>
      <div className="flex flex-col bg-s-bg rounded-xl p-1 shadow-md">
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex items-center px-3 py-2 bg-s-bg rounded-xl my-1 hover:bg-[#eee] hover:cursor-pointer ${
                item.label.includes('Delete') && 'text-red-500'
              }`}
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
