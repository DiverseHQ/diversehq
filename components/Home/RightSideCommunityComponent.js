import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'
import { FiSettings } from 'react-icons/fi'
import { Tooltip } from '@mui/material'

const RightSideCommunityComponent = ({ community }) => {
  const router = useRouter()

  return (
    <Link
      href={
        community?.isLensCommunity
          ? `/l/${community?.name}`
          : `/c/${community?.name}`
      }
      passHref
    >
      <div className="space-between-row cursor-pointer text-p-text hover:bg-s-hover rounded-2xl pl-3 py-1">
        <div className="start-row ">
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
        <Tooltip title="Manage" placement="right">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(
                community?.isLensCommunity
                  ? `/l/${community?.name}/settings`
                  : `/c/${community?.name}/settings`
              )
            }}
            className="px-3 py-3 rounded-full"
          >
            <FiSettings />
          </button>
        </Tooltip>
      </div>
    </Link>
  )
}
export default RightSideCommunityComponent
