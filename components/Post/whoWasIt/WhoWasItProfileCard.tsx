import React from 'react'
import { Profile } from '../../../graphql/generated'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import getAvatar from '../../User/lib/getAvatar'
import formatHandle from '../../User/lib/formatHandle'
import Markup from '../../Lexical/Markup'
import { stringToLength } from '../../../utils/utils'
import { usePopUpModal } from '../../Common/CustomPopUpProvider'
import useLensFollowButton from '../../User/useLensFollowButton'
import { useRouter } from 'next/router'

const WhoWasItProfileCard = ({ profile }: { profile: Profile }) => {
  const { hideModal } = usePopUpModal()
  const router = useRouter()

  const { FollowButton, isFollowedByMe } = useLensFollowButton({
    handle: profile.handle
  })
  return (
    <div
      className="py-3.5 sm:py-4 px-4 sm:px-6 start-row hover:bg-s-hover cursor-pointer w-full"
      onClick={() => {
        router.push(`/u/${formatHandle(profile.handle)}`)
        hideModal()
      }}
    >
      <div className="shrink-0">
        <ImageWithFullScreenZoom
          src={getAvatar(profile)}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
      <div className="ml-4 w-full">
        <div className="space-between-row w-full">
          <div>
            <div className="text-p-text text-base font-bold leading-5">
              {profile.name}
            </div>
            <div className="text-s-text leading-4 text-sm">
              u/{formatHandle(profile.handle)}
            </div>
          </div>
          {!isFollowedByMe && (
            <div
              className="w-fit"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <FollowButton />
            </div>
          )}
        </div>
        <div className="text-s-text text-sm mt-1 w-[250px] sm:w-[400px]">
          <Markup className="break-words">
            {stringToLength(profile.bio, 100)}
          </Markup>
        </div>
      </div>
    </div>
  )
}

export default WhoWasItProfileCard
