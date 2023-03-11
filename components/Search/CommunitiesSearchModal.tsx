import React, { useState } from 'react'
import { useEffect } from 'react'
import { searchCommunityFromName } from '../../api/community'
import { CommunityType } from '../../types/community'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

/* eslint-disable */

interface Props {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  onCommunitySelect: (community: CommunityType) => void
}

const CommunitiesSearchModal = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  onCommunitySelect
}: Props) => {
  const [communities, setCommunities] = useState([])
  const setCommunitiesOnSearchChange = async () => {
    if (searchTerm === '') {
      setCommunities([])
      return
    }
    const res = await searchCommunityFromName(searchTerm, 6)
    setCommunities(res)
  }

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setCommunities([])
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [inputRef])

  useEffect(() => {
    setCommunitiesOnSearchChange()
  }, [searchTerm])

  return (
    <>
      {communities.length > 0 && (
        <div>
          <div className="m-2 p-2 text-base font-bold">Communities</div>
          {communities.map((community) => (
            <div
              className="m-2 flex flex-row p-1 hover:bg-s-hover underline-offset-4  items-center rounded-full cursor-pointer"
              key={community._id}
              onClick={() => {
                inputRef.current.value = ''
                setSearchTerm('')
                onCommunitySelect(community)
              }}
            >
              <ImageWithPulsingLoader
                src={community.logoImageUrl}
                className="w-8 h-8 mr-3 rounded-full object-cover"
              />
              <div className="text-sm">{community.name}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CommunitiesSearchModal
