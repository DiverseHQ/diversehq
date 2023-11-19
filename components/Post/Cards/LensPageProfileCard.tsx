import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'
import { Profile } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { stringToLength } from '../../../utils/utils'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import Markup from '../../Lexical/Markup'
import MessageButton from '../../Messages/MessageButton'
import formatHandle from '../../User/lib/formatHandle'
import getAvatar from '../../User/lib/getAvatar'
import getCoverBanner from '../../User/lib/getCoverBanner'
// import ProfileLinksRow from '../../User/ProfileLinksRow'
import useLensFollowButton from '../../User/useLensFollowButton'
import VerifiedBadge from '../../Common/UI/Icon/VerifiedBadge'

interface Props {
  _profile?: Profile
  isLensCommunity?: boolean
  verified?: boolean
}

const LensPageProfileCard = ({ _profile, verified = false }: Props) => {
  const router = useRouter()

  const { isSignedIn, hasProfile } = useLensUserContext()
  const { FollowButton, isFollowedByMe } = useLensFollowButton(
    {
      forProfileId: _profile?.id
    },
    'follow'
  )

  if (!_profile) return null
  return (
    <div
      className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] ml-4 mt-3 cursor-pointer"
      onClick={() => {
        // if (isLensCommunity) {
        //   router.push(`/l/${formatHandle(profile?.handle)}`)
        // } else {
        router.push(`/u/${formatHandle(_profile?.handle)}`)
        // }
      }}
    >
      <span onClick={(e) => e.stopPropagation()}>
        <ImageWithFullScreenZoom
          src={getCoverBanner(_profile)}
          className="h-[80px] rounded-t-[15px] w-full object-cover"
        />
      </span>
      <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
        <div className="flex flex-row gap-2 justify-between mb-2">
          <div className="flex flex-row gap-2">
            <div
              className="flex items-center justify-center rounded-full bg-s-bg -mt-12"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFullScreenZoom
                src={getAvatar(_profile)}
                className={clsx(
                  'rounded-full',
                  'w-[70px] h-[70px] object-cover  border-s-bg border-4 bg-s-bg shrink-0'
                )}
              />
            </div>
            <div className="flex flex-row">
              <div>
                <div
                  className="font-bold break-words leading-4 text-p-text text-lg  hover:underline cursor-pointer truncate"
                  onClick={() => {
                    // if (isLensCommunity) {
                    //   router.push(`/l/${formatHandle(profile?.handle)}`)
                    // } else {
                    router.push(`/u/${formatHandle(_profile?.handle)}`)
                    // }
                  }}
                >
                  {stringToLength(_profile?.metadata?.displayName, 20)}
                </div>
                <div
                  className="font-medium start-row gap-x-1 text text-s-text  hover:underline cursor-pointer truncate mb-3"
                  onClick={() => {
                    // if (isLensCommunity) {
                    //   router.push(`/l/${formatHandle(profile?.handle)}`)
                    // } else {
                    router.push(`/u/${formatHandle(_profile?.handle)}`)
                    // }
                  }}
                >
                  <div>
                    {/* {isLensCommunity
                      ? `l/${formatHandle(profile?.handle)}`
                      : `u/${formatHandle(profile?.handle)}`} */}
                    {`u/${formatHandle(_profile?.handle)}`}
                  </div>
                  {verified && <VerifiedBadge className="w-4 h-4" />}
                </div>
              </div>
            </div>
          </div>
          <div className="self-start">
            {isFollowedByMe && hasProfile && isSignedIn && (
              <MessageButton userLensProfile={_profile} />
            )}
          </div>
        </div>
        <p className="text-p-text text-sm leading-5 -mt-4 pb-2">
          <Markup>{stringToLength(_profile?.metadata?.bio, 200)}</Markup>
        </p>
        {/* {!isLensCommunity && (
          <div className="pb-2">
            <ProfileLinksRow profile={profile} />
          </div>
        )} */}
        {/* {isLensCommunity && (
          // ? (
          //   <div className="mb-2 text-s-text flex flex-row gap-2 text-sm leading-5">
          //     <span>
          //       Followers:{' '}
          //       <span className="font-semibold">
          //         {profile?.stats?.totalFollowers}
          //       </span>
          //     </span>
          //     <span>
          //       Following:{' '}
          //       <span className="font-semibold">
          //         {profile?.stats?.totalFollowing}
          //       </span>
          //     </span>
          //   </div>
          // ) : (
          <div className="mb-2 text-s-text flex flex-row gap-2 text-sm leading-5">
            <span>
              Members:{' '}
              <span className="font-semibold">
                {profile?.stats?.totalFollowers}
              </span>
            </span>
          </div>
        )} */}
        {/* {isLensCommunity} */}
        <FollowButton />
      </div>
    </div>
  )
}

export default LensPageProfileCard
