import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import CommunitySelectDiv from '../../Community/CommunitySelectDiv'
/*
 * types are community, ...
 * filterParam is the params to be searched upon, mostly a string value
 * list is the list of items to be filtered
 */

const FilterListWithSearch = ({ list, type, filterParam }) => {
  const [filteredList, setFilteredList] = useState([])

  const onChangeSearch = (e) => {
    const { value } = e.target

    if (value.trim() === '') {
      setFilteredList(list)
      return
    }

    setFilteredList(
      list.filter((item) => {
        return item[`${filterParam}`]
          ?.toLowerCase()
          ?.includes(value?.toLowerCase())
      })
    )
  }

  return (
    <>
      <div className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl bg-p-btn gap-4 text-p-btn-text">
        <div className="bg-p-btn-text rounded-[22px] py-1 px-2 ">
          <AiOutlineSearch className="w-[18px] h-[18px] text-p-btn" />
        </div>
        <input
          type="text"
          placeholder="Search ..."
          className="bg-transparent outline-none text-p-btn-text w-[100px] sm:w-[160px] font-medium"
          onChange={onChangeSearch}
        />
      </div>
      {filteredList?.length > 0 ? (
        <>
          {filteredList.map((item) => {
            return (
              <>
                {type === 'community' && (
                  <CommunitySelectDiv community={item} />
                )}
              </>
            )
          })}
        </>
      ) : (
        <>{type === 'community' && <span>No community found</span>}</>
      )}
    </>
  )
}

export default FilterListWithSearch
