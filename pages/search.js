import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { searchCommunityFromName } from '../api/community'

const search = () => {
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
    <>
      <div className="mt-10">
        <div className="w-full flex items-center justify-center mb-10">
          <input type={'text'} placeholder="Search" onChange={onChangeSearch} />
        </div>
        {communities.map((community) => (
          <div
            className="bg-s-bg flex flex-row p-5 m-3 rounded-[10px] cursor-pointer"
            key={community._id}
            onClick={() => {
              handleCommunityClicked(community.name)
            }}
          >
            <img src={community.logoImageUrl} className="w-10 h-10 mr-5" />
            <div>{community.name}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default search
