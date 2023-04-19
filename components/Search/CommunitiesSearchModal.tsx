import React, { useState } from 'react'
import { useEffect } from 'react'
import { searchCommunityFromName } from '../../api/community'
import { CommunityType } from '../../types/community'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'
import {
  IsFollowedLensCommunityType,
  useProfile
} from '../Common/WalletContext'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'

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
  const [lensCommunities, setLensCommunities] = useState<
    IsFollowedLensCommunityType[]
  >([])
  const { allLensCommunities } = useProfile()

  const setCommunitiesOnSearchChange = async () => {
    if (searchTerm === '') {
      setCommunities([])
      setLensCommunities([])
      return
    }
    const res = await searchCommunityFromName(searchTerm, 6)
    setCommunities(res)

    // get top 5 matching communities from allLensCommunities
    const matchingCommunities = allLensCommunities
      .filter((community) => {
        return community.handle.toLowerCase().includes(searchTerm.toLowerCase())
      })
      .slice(0, 5)
    setLensCommunities(matchingCommunities)
  }

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setCommunities([])
      setLensCommunities([])
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
      {communities.length + lensCommunities.length > 0 && (
        <div>
          <div className="m-2 p-2 text-base font-bold">Communities</div>
          {lensCommunities.map((community) => (
            <div
              className="m-2 flex flex-row p-1 hover:bg-s-hover underline-offset-4  items-center rounded-full cursor-pointer"
              key={community.handle}
              onClick={() => {
                inputRef.current.value = ''
                setSearchTerm('')
                onCommunitySelect(community)
              }}
            >
              <ImageWithPulsingLoader
                // @ts-ignore
                src={getAvatar(community)}
                className="w-8 h-8 mr-3 rounded-full object-cover"
              />
              <div className="text-sm">l/{formatHandle(community.handle)}</div>
              {community?.verified && <VerifiedBadge className="ml-1" />}
            </div>
          ))}

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
              {community?.verified && <VerifiedBadge className="ml-1" />}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CommunitiesSearchModal
