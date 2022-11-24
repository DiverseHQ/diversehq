import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { searchCommunityFromName } from '../../api/community'

const SearchModal = () => {
  const router = useRouter()
  const [communities, setCommunities] = useState([])
  const onChangeSearch = async (e) => {
    const { value } = e.target
    if (value === '') {
      setCommunities([])
      return
    }
    const res = await searchCommunityFromName(value)
    console.log(res)
    setCommunities(res)
  }

  const handleCommunityClicked = (name) => {
    router.push(`/c/${name}`)
  }
  return (
    <div className="relative">
      <label>
        <div className="w-[250px] flex flex-row items-center border rounded-xl border-s-text py-2 px-4 mb-6">
          <HiOutlineSearch />
          <input
            type="text"
            className={`w-full text-p-text bg-s-bg outline-none pl-3`}
            placeholder="Search"
            onChange={onChangeSearch}
          />
        </div>
      </label>
      {communities.length > 0 && (
        <div className="bg-s-h-bg rounded-[25px] absolute w-[250px]">
          {communities.map((community) => (
            <div
              className="hover:bg-p-h-bg m-2 flex flex-row p-2 hover:underline underline-offset-4  items-center rounded-[25px] cursor-pointer"
              key={community._id}
              onClick={() => {
                handleCommunityClicked(community.name)
              }}
            >
              <img
                src={community.logoImageUrl}
                className="w-10 h-10 mr-5 rounded-full"
              />
              <div>{community.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchModal
