import React from 'react'
import { useDevice } from '../Common/DeviceWrapper'
import useLensFollowButton from '../User/useLensFollowButton'
import formatHandle from '../User/lib/formatHandle'
import { useRouter } from 'next/router'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getCoverBanner from '../User/lib/getCoverBanner'
import getAvatar from '../User/lib/getAvatar'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'
import { stringToLength } from '../../utils/utils'
import { BsPeopleFill } from 'react-icons/bs'

const ExploreLensCommunityCard = ({ community }) => {
  const { isMobile } = useDevice()
  const router = useRouter()

  const { FollowButton } = useLensFollowButton(
    {
      handle: community.handle
    },
    'join'
  )

  const redirectToCommunityPage = () => {
    router.push(`/l/${formatHandle(community.handle)}`)
  }

  return (
    <div
      className={`relative overflow-hidden shadow-lg z-0 bg-s-bg mb-6 text-[#FFF] dark:text-p-text cursor-pointer h-48 sm:h-64 rounded-2xl ${
        !isMobile ? '' : 'mx-2'
      }`}
      onClick={() => {
        redirectToCommunityPage()
      }}
    >
      <ImageWithPulsingLoader
        className={`h-full w-full object-cover rounded-[15px]`}
        // @ts-ignore
        src={getCoverBanner(community)}
      />
      <div className="absolute bg-[#ccc] bottom-0 w-full bg-black/70 backdrop-blur-md py-2 sm:py-4 px-2 md:px-4">
        <div className="relative flex flex-row items-start justify-between">
          <div className="flex flex-row gap-4">
            <div className="shrink-0 rounded-[10px]">
              <ImageWithPulsingLoader
                className="rounded-[10px] bg-s-bg w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-cover"
                src={getAvatar(community)}
              />
            </div>
            {/* {!isMobile && ( */}
            <div className="flex flex-col">
              <div
                className="start-row gap-x-2 font-bold sm:text-2xl  tracking-wider hover:underline cursor-pointer truncate"
                onClick={redirectToCommunityPage}
              >
                <div>l/{formatHandle(community?.handle)}</div>
                {community?.verified && <VerifiedBadge className="w-4 h-4" />}
              </div>
              <div
                className="text-xs sm:text-base w-full sm:py-0.5"
                style={{
                  lineHeight: '1.1rem'
                }}
              >
                {stringToLength(community.bio, 130)}
              </div>
              {/* <div className="flex flex-row flex-wrap gap-8"> */}
              <div className="flex flex-row items-center sm:text-base text-sm space-x-1 sm:space-x-2">
                <BsPeopleFill />
                <span className="font-semibold">
                  {community.membersCount || community.stats.totalFollowers}
                </span>
              </div>
              {/* </div> */}
            </div>
            {/* )} */}
          </div>
          <div className="flex justify-end items-center gap-1 sm:gap-2">
            <FollowButton hideIfFollow />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreLensCommunityCard
