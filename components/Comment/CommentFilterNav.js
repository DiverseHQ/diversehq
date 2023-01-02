import React from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'

const CommentFilterNav = ({ active, setActive }) => {
  return (
    <div className="font-bold text-sm sm:text-base flex flex-row  border px-3 sm:px-6 bg-white sm:mt-0 py-1 mb-2 sm:mb-4 sm:py-3 w-full sm:rounded-xl space-x-9 items-center">
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'top' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          setActive('top')
        }}
      >
        <MdLeaderboard />
        <div>Top</div>
      </button>
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'new' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          setActive('new')
        }}
      >
        <HiSparkles />
        <div>New</div>
      </button>
    </div>
  )
}

export default CommentFilterNav
