import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Profile, useProfileQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { stringToLength } from '../../../utils/utils'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import Markup from '../../Lexical/Markup'
import MessageButton from '../../Messages/MessageButton'
import formatHandle from '../../User/lib/formatHandle'
import getAvatar from '../../User/lib/getAvatar'
import getCoverBanner from '../../User/lib/getCoverBanner'
import ProfileLinksRow from '../../User/ProfileLinksRow'
import useLensFollowButton from '../../User/useLensFollowButton'

interface Props {
  _profile?: Profile
  profileHandle?: string
  isLensCommunity?: boolean
}

const LensPageProfileCard = ({
  _profile,
  profileHandle,
  isLensCommunity
}: Props) => {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>(_profile)

  const { data } = useProfileQuery(
    {
      request: {
        handle: profileHandle
      }
    },
    {
      enabled: !!profileHandle && !_profile
    }
  )

  useEffect(() => {
    if (!data?.profile) return
    // @ts-ignore
    setProfile(data.profile)
  }, [data])

  const { isSignedIn, hasProfile } = useLensUserContext()
  const { FollowButton, isFollowedByMe } = useLensFollowButton(
    {
      profileId: _profile?.id || null,
      handle: profileHandle || null
    },
    isLensCommunity ? 'join' : 'follow'
  )
  return (
    <div
      className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] ml-4 mt-3 cursor-pointer"
      onClick={() => {
        if (isLensCommunity) {
          router.push(`/l/${formatHandle(profile?.handle)}`)
        } else {
          router.push(`/u/${formatHandle(profile?.handle)}`)
        }
      }}
    >
      <span onClick={(e) => e.stopPropagation()}>
        <ImageWithFullScreenZoom
          src={getCoverBanner(profile)}
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
                src={getAvatar(profile)}
                className={clsx(
                  isLensCommunity ? 'rounded-xl' : 'rounded-full',
                  'w-[70px] h-[70px] object-cover  border-s-bg border-4 bg-s-bg'
                )}
              />
            </div>
            <div className="flex flex-row">
              <div>
                <div
                  className="font-bold break-words leading-4 text-p-text text-lg  hover:underline cursor-pointer truncate"
                  onClick={() => {
                    if (isLensCommunity) {
                      router.push(`/l/${formatHandle(profile?.handle)}`)
                    } else {
                      router.push(`/u/${formatHandle(profile?.handle)}`)
                    }
                  }}
                >
                  {stringToLength(profile?.name, 20)}
                </div>
                <div
                  className="font-medium text text-s-text  hover:underline cursor-pointer truncate mb-3"
                  onClick={() => {
                    if (isLensCommunity) {
                      router.push(`/l/${formatHandle(profile?.handle)}`)
                    } else {
                      router.push(`/u/${formatHandle(profile?.handle)}`)
                    }
                  }}
                >
                  {isLensCommunity
                    ? `l/${formatHandle(profile?.handle)}`
                    : `u/${formatHandle(profile?.handle)}`}
                </div>
              </div>
            </div>
          </div>
          <div className="self-start">
            {isFollowedByMe && !isLensCommunity && hasProfile && isSignedIn && (
              <MessageButton userLensProfile={profile} />
            )}
          </div>
        </div>
        <p className="text-p-text text-sm leading-5 -mt-4 pb-2">
          <Markup>{stringToLength(profile?.bio, 200)}</Markup>
        </p>
        {!isLensCommunity && (
          <div className="pb-2">
            <ProfileLinksRow profile={profile} />
          </div>
        )}
        {!isLensCommunity ? (
          <div className="mb-2 text-s-text flex flex-row gap-2 text-sm leading-5">
            <span>
              Followers:{' '}
              <span className="font-semibold">
                {profile?.stats?.totalFollowers}
              </span>
            </span>
            <span>
              Following:{' '}
              <span className="font-semibold">
                {profile?.stats?.totalFollowing}
              </span>
            </span>
          </div>
        ) : (
          <div className="mb-2 text-s-text flex flex-row gap-2 text-sm leading-5">
            <span>
              Members:{' '}
              <span className="font-semibold">
                {profile?.stats?.totalFollowers}
              </span>
            </span>
          </div>
        )}
        {isLensCommunity}
        <FollowButton />
      </div>
    </div>
  )
}

export default LensPageProfileCard
