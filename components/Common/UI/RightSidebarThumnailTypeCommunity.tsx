import Link from 'next/link'
import React from 'react'
import ImageWithPulsingLoader from './ImageWithPulsingLoader'
import { BiChevronRight } from 'react-icons/bi'
import getIPFSLink from '../../User/lib/getIPFSLink'

export interface RightSidebarCommunity {
  name: string
  logoImageUrl: string
  bannerImageUrl: string
  isLensCommunity: boolean
}

const RightSidebarThumnailTypeCommunity = ({
  community
}: {
  community: RightSidebarCommunity
}) => {
  return (
    <Link
      href={
        community?.isLensCommunity
          ? `/l/${community?.name}`
          : `/c/${community?.name}`
      }
      passHref
    >
      <div className="relative cursor-pointer flex flex-row items-center text-p-btn-text rounded-2xl">
        <ImageWithPulsingLoader
          src={getIPFSLink(community?.bannerImageUrl)}
          className="h-[150px] w-full rounded-xl object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md rounded-b-xl p-2">
          <div className="space-between-row">
            <div className="flex flex-row items-center gap-2">
              <ImageWithPulsingLoader
                src={getIPFSLink(community?.logoImageUrl)}
                className="h-[40px] w-[40px] rounded-full object-cover"
              />
              <div className="font-semibold truncate">
                {community?.isLensCommunity
                  ? `l/${community?.name}`
                  : community?.name}
              </div>
            </div>
            <BiChevronRight className="text-2xl font-bold" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RightSidebarThumnailTypeCommunity
