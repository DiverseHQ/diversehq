import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { CommunityType } from '../../../types/community'
import { stringToLength } from '../../../utils/utils'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import Markup from '../../Lexical/Markup'
import { getCommunityInfoUsingId } from '../../../api/community'
import useJoinCommunityButton from '../../Community/hook/useJoinCommunityButton'
import VerifiedBadge from '../../Common/UI/Icon/VerifiedBadge'

const LensPostPageCommunityCard = ({
  communityInfo: _community
}: {
  communityInfo: CommunityType
}) => {
  const [communityInfo, setCommunityInfo] =
    React.useState<CommunityType>(_community)
  const router = useRouter()
  const { JoinCommunityButton } = useJoinCommunityButton({
    id: communityInfo?._id,
    showJoined: true
  })

  const fetchAndSetCommunityInfo = async () => {
    const res = await getCommunityInfoUsingId(_community?._id)
    setCommunityInfo(res)
  }

  useEffect(() => {
    if (!_community?._id) return
    fetchAndSetCommunityInfo()
  }, [_community?._id])

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
            <div className="start-row gap-x-1">
              <div className="font-bold text-p-text text-lg  hover:underline cursor-pointer truncate">
                {stringToLength(communityInfo?.name, 19)}
              </div>
              {communityInfo?.verified && <VerifiedBadge className="w-4 h-4" />}
            </div>
          </div>
        </div>
        <p className="mb-2 leading-5 text-sm text-p-text">
          <Markup>{stringToLength(communityInfo?.description, 200)}</Markup>
        </p>
        {communityInfo?._id && (
          <>
            <div className="mb-2 text-s-text text-sm leading-5">
              <span>Members: </span>
              <span className="font-semibold">
                {communityInfo?.membersCount}
              </span>
            </div>
            <JoinCommunityButton />
          </>
        )}
      </div>
    </div>
  )
}

export default LensPostPageCommunityCard
