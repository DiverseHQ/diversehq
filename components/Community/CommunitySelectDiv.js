import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getIPFSLink from '../User/lib/getIPFSLink'

const CommunitySelectDiv = ({ community, handleSelect }) => {
  return (
    <div
      className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl text-p-text hover:bg-p-btn hover:text-p-btn-text gap-4"
      onClick={() => {
        handleSelect(community)
      }}
    >
      <ImageWithPulsingLoader
        src={getIPFSLink(community.logoImageUrl)}
        alt="community logo"
        className="rounded-full object-cover w-9 h-9"
      />
      {community?.isLensCommunity ? (
        <div>l/{community.name}</div>
      ) : (
        <div>{community.name}</div>
      )}
    </div>
  )
}

export default CommunitySelectDiv
