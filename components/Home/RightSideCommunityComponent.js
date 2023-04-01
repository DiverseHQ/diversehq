import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

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
      <div className="cursor-pointer flex flex-row gap-4 items-center text-p-text hover:bg-s-hover rounded-2xl pl-3 py-1">
        <ImageWithPulsingLoader
          src={community?.logoImageUrl}
          className="w-[40px] h-[40px] object-cover rounded-full"
        />
        <span>
          {community?.isLensCommunity
            ? `l/${community?.name}`
            : community?.name}
        </span>
      </div>
    </Link>
  )
}
export default RightSideCommunityComponent
