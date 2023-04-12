import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'

const RightSideCommunityComponent = ({ community }) => {
  // const router = useRouter()
  return (
    <Link
      href={
        community?.isLensCommunity
          ? `/l/${community?.name}`
          : `/c/${community?.name}`
      }
      passHref
    >
      <div className="cursor-pointer flex flex-row items-center text-p-text hover:bg-s-hover rounded-2xl pl-3 py-1">
        <ImageWithPulsingLoader
          src={community?.logoImageUrl}
          className="w-[40px] h-[40px] object-cover rounded-full"
        />
        <span className="pl-3 pr-1 truncate">
          {community?.isLensCommunity
            ? `l/${community?.name}`
            : community?.name}
        </span>
        {community?.verified && <VerifiedBadge className="w-4 h-4" />}
      </div>
    </Link>
  )
}
export default RightSideCommunityComponent
