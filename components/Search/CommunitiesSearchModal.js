import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { searchCommunityFromName } from '../../api/community'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const CommunitiesSearchModal = ({
  searchTerm,
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
    const res = await searchCommunityFromName(searchTerm)
    console.log(res)
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
              className="hover:bg-p-btn-hover m-2 flex flex-row p-2 hover:underline hover:bg-p-hover hover:text-p-hover-text underline-offset-4  items-center rounded-[25px] cursor-pointer"
              key={community._id}
              onClick={() => {
                inputRef.current.value = ''
                handleCommunityClicked(community.name)
              }}
            >
              <ImageWithPulsingLoader
                src={community.logoImageUrl}
                className="w-10 h-10 mr-5 rounded-full object-cover"
              />
              <div>{community.name}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CommunitiesSearchModal
