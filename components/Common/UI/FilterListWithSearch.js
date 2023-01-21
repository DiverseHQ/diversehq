import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import CommunitySelectDiv from '../../Community/CommunitySelectDiv'
/*
 * list is the list of items to be filtered
 * types are community, ...
 * filterParam is the params to be searched upon, mostly a string value
 * handleSelect is the operation to perform when list item is clicked
 */

const FilterListWithSearch = ({ list, type, filterParam, handleSelect }) => {
  const [filteredList, setFilteredList] = useState(list)

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
      {/* search input */}
      <div className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl gap-4">
        <div className="rounded-[22px] py-1 px-2">
          <AiOutlineSearch className="w-6 h-6 text-p-btn" />
        </div>
        <input
          type="text"
          placeholder="Search ..."
          className="outline-none w-full font-medium bg-transparent"
          onChange={onChangeSearch}
          autoFocus={true}
        />
      </div>
      {filteredList?.length > 0 && (
        <>
          {filteredList.map((item) => {
            return (
              <>
                {type === 'community' && (
                  <CommunitySelectDiv
                    community={item}
                    handleSelect={handleSelect}
                  />
                )}
              </>
            )
          })}
        </>
      )}
    </>
  )
}

export default FilterListWithSearch
