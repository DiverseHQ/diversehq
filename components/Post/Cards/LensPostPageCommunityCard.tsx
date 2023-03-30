import { useRouter } from 'next/router'
import React from 'react'
import { CommunityType } from '../../../types/community'
import { stringToLength } from '../../../utils/utils'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import JoinCommunityButton from '../../Community/JoinCommunityButton'
import Markup from '../../Lexical/Markup'

const LensPostPageCommunityCard = ({
  communityInfo
}: {
  communityInfo: CommunityType
}) => {
  const router = useRouter()
  return (
    <div
      className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] bg-s-bg ml-4 mt-3 cursor-pointer"
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
      <span onClick={(e) => e.stopPropagation()}>
        <ImageWithFullScreenZoom
          src={
            communityInfo?.bannerImageUrl
              ? communityInfo?.bannerImageUrl
              : '/gradient.jpg'
          }
          className="h-[80px] rounded-t-[15px] w-full object-cover"
        />
      </span>
      <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
        <div className="flex flex-row gap-2 justify-start">
          <div
            className="flex items-center justify-center rounded-full bg-s-bg -mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFullScreenZoom
              src={
                communityInfo?.logoImageUrl
                  ? communityInfo?.logoImageUrl
                  : '/gradient.jpg'
              }
              className="rounded-2xl w-[70px] h-[70px] object-cover border-s-bg border-4 bg-s-bg"
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
            <div className="font-bold text-p-text text-lg  hover:underline cursor-pointer truncate">
              {communityInfo?.name}
            </div>
          </div>
        </div>
        <p className="mb-2 leading-5 text-p-text">
          <Markup>{stringToLength(communityInfo?.description, 200)}</Markup>
        </p>
        {communityInfo?._id && (
          <>
            <div className="mb-2 text-s-text text-sm leading-5">
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
