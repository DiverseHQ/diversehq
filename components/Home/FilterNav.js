import React from 'react'
import { AiOutlineFire } from 'react-icons/ai'
import { RiArrowDropDownLine } from 'react-icons/ri'

const FilterNav = () => {
  return (
    <>
      <div className="flex flex-row w-full h-14 mt-16 border border-amber-50 rounded-xl space-x-9 items-center">
        <div className="flex flex-row pl-6">
          <AiOutlineFire className="w-6 h-6 text-p-btn" />
          <p>HOT</p>
        </div>
        <div className="flex flex-row">
          <p>Communities</p>
          <RiArrowDropDownLine className="w-6 h-6 text-p-btn items-center" />
        </div>
        <div>
          <p>NEW</p>
        </div>
        <div>
          <p>LENS</p>
        </div>
      </div>
    </>
  )
}

export default FilterNav
