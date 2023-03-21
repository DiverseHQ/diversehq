import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const CommunitySelectDiv = ({ community, handleSelect }) => {
  return (
    <div
      className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl text-p-text hover:bg-p-btn hover:text-p-btn-text gap-4"
      id={community._id}
      onClick={() => {
        handleSelect(community)
      }}
    >
      <ImageWithPulsingLoader
        src={community.logoImageUrl}
        alt="community logo"
        className="rounded-full object-cover w-9 h-9"
      />
      {community?.isLensCommunity ? (
        <div id={community._id}>l/{community.name}</div>
      ) : (
        <div id={community._id}>{community.name}</div>
      )}
    </div>
  )
}

export default CommunitySelectDiv
