import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const CommunitySelectDiv = ({ community, handleSelect }) => {
  return (
    <div
      className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn gap-4"
      id={community._id}
      onClick={() => {
        handleSelect(community)
      }}
    >
      <ImageWithPulsingLoader
        src={community.logoImageUrl ? community.logoImageUrl : '/gradient.jpg'}
        alt="community logo"
        className="rounded-full object-cover w-9 h-9"
      />

      <div className="text-p-text" id={community._id}>
        {community.name}
      </div>
    </div>
  )
}

export default CommunitySelectDiv
