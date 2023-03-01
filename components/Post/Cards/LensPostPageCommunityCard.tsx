import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { getLevelAndThresholdXP } from '../../../lib/helpers'
import { CommunityType } from '../../../types/community'
import { xpPerMember } from '../../../utils/config'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import JoinCommunityButton from '../../Community/JoinCommunityButton'

const LensPostPageCommunityCard = ({
  communityInfo
}: {
  communityInfo: CommunityType
}) => {
  const router = useRouter()
  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    (communityInfo?.members?.length ? communityInfo?.members?.length : 0) *
      xpPerMember || 0
  )
  const calculateBarPercentage = (currentXP: number, threshold: number) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }
  return (
    <div className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] bg-s-bg ml-4 mt-3">
      <ImageWithFullScreenZoom
        src={
          communityInfo?.bannerImageUrl
            ? communityInfo?.bannerImageUrl
            : '/gradient.jpg'
        }
        className="h-[80px] rounded-t-[15px] w-full object-cover"
      />
      <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
        <div className="flex flex-row gap-2 justify-start">
          <div className="flex items-center justify-center rounded-full bg-s-bg w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] -translate-y-6">
            <ImageWithFullScreenZoom
              src={
                communityInfo?.logoImageUrl
                  ? communityInfo?.logoImageUrl
                  : '/gradient.jpg'
              }
              className="rounded-full w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] object-cover"
            />
          </div>
          <div
            onClick={() => {
              if (communityInfo?.name && communityInfo?._id) {
                router.push(`/c/${communityInfo?.name}`)
                return
              }
              if (communityInfo?.link) {
                window.open(communityInfo?.link, '_blank')
                return
              }
            }}
          >
            <h2 className="font-bold text-p-text text-[20px]  hover:underline cursor-pointer truncate">
              {communityInfo?.name}
            </h2>
          </div>
        </div>
        {communityInfo?._id && (
          <div className="-translate-y-2 mb-2">
            <div className="flex flex-row gap-1 items-center w-[80%] mb-1">
              <div className="text-[12px] md:text-[14px] items-center">
                {`Lvl${level}`}
              </div>
              <div className="flex flex-col w-full items-end">
                <div className="text-[10px] text-[#bbb]">{`${currentXP}/${thresholdXP}`}</div>
                <div className="relative bg-[#AA96E2] rounded-full h-2.5 w-full">
                  <div
                    className="absolute h-full bg-[#6668FF] rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${calculateBarPercentage(
                        thresholdXP,
                        currentXP
                      )}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {/* createdat */}
            <div className="flex flex-row gap-0.5 items-center text-xs md:text-[14px] text-[#aaa]">
              <AiOutlineFileAdd />
              <span>
                Created{' '}
                {new Date(communityInfo?.createdAt)
                  .toDateString()
                  .split(' ')
                  .slice(1)
                  .join(' ')}
              </span>
            </div>
          </div>
        )}
        <p className="mb-2 text-p-text">{communityInfo?.description}</p>
        {communityInfo?._id && (
          <>
            <div className="mb-2 text-p-text">
              <span>Members: </span>
              <span className="font-semibold">
                {communityInfo?.members?.length}
              </span>
            </div>
            <JoinCommunityButton id={communityInfo?._id} showJoined />
          </>
        )}
      </div>
    </div>
  )
}

export default LensPostPageCommunityCard
