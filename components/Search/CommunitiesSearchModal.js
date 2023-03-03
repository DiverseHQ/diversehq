import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { searchCommunityFromName } from '../../api/community'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const CommunitiesSearchModal = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  communities,
  setCommunities
}) => {
  const router = useRouter()
  const setCommunitiesOnSearchChange = async () => {
    if (searchTerm === '') {
      setCommunities([])
      return
    }
    const res = await searchCommunityFromName(searchTerm, 6)
    setCommunities(res)
  }

  useEffect(() => {
    setCommunitiesOnSearchChange()
  }, [searchTerm])

  const handleCommunityClicked = (name) => {
    router.push(`/c/${name}`)
  }

  return (
    <>
      {communities.length > 0 && (
        <div>
          <div className="m-2 p-2 text-base font-bold">Communities</div>
          {communities.map((community) => (
            <div
              className="m-2 flex flex-row p-1 hover:bg-p-btn-hover underline-offset-4  items-center rounded-full cursor-pointer"
              key={community._id}
              onClick={() => {
                inputRef.current.value = ''
                setSearchTerm('')
                handleCommunityClicked(community.name)
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
