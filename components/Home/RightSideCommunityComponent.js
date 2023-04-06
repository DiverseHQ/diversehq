import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { MdOutlineVerified } from 'react-icons/md'
import { Tooltip } from '@mui/material'

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
        <span className="pl-3 pr-1">
          {community?.isLensCommunity
            ? `l/${community?.name}`
            : community?.name}
        </span>
        {community?.verified && (
          <Tooltip title="Verified">
            <MdOutlineVerified className="text-p-text" />
          </Tooltip>
        )}
      </div>
    </Link>
  )
}
export default RightSideCommunityComponent
