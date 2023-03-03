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
import getIPFSLink from '../../User/lib/getIPFSLink'
import useLensFollowButton from '../../User/useLensFollowButton'

interface Props {
  _profile?: Profile
  profileHandle?: string
}

const LensPageProfileCard = ({ _profile, profileHandle }: Props) => {
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
  const { FollowButton, isFollowedByMe } = useLensFollowButton({
    profileId: _profile?.id || null,
    handle: profileHandle || null
  })
  let _profileBanner =
    profile?.coverPicture?.__typename === 'NftImage'
      ? getIPFSLink(profile?.coverPicture?.uri)
      : getIPFSLink(profile?.coverPicture?.original?.url)
  return (
    <div
      className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] ml-4 mt-3 cursor-pointer"
      onClick={() => {
        router.push(`/u/${formatHandle(profile?.handle)}`)
      }}
    >
      <span onClick={(e) => e.stopPropagation()}>
        <ImageWithFullScreenZoom
          src={_profileBanner || '/gradient.jpg'}
          className="h-[80px] rounded-t-[15px] w-full object-cover"
        />
      </span>
      <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-2">
            <div
              className="flex items-center justify-center rounded-full bg-[#000] w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] -translate-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFullScreenZoom
                src={getAvatar(profile)}
                className="rounded-full w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] object-cover"
              />
            </div>
            <div className="flex flex-row">
              <div>
                <div
                  className="font-bold leading-4 text-p-text text-lg  hover:underline cursor-pointer truncate"
                  onClick={() => {
                    router.push(`/u/${formatHandle(profile?.handle)}`)
                  }}
                >
                  {stringToLength(profile?.name, 20)}
                </div>
                <div
                  className="font-medium text text-s-text  hover:underline cursor-pointer truncate mb-3"
                  onClick={() => {
                    router.push(`/u/${formatHandle(profile?.handle)}`)
                  }}
                >
                  u/{formatHandle(profile?.handle)}
                </div>
              </div>
            </div>
          </div>
          <div className="self-start">
            {isFollowedByMe && hasProfile && isSignedIn && (
              <MessageButton userLensProfile={profile} />
            )}
          </div>
        </div>
        <p className="-translate-y-2 text-p-text leading-5">
          <Markup>{stringToLength(profile?.bio, 200)}</Markup>
        </p>
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
        <FollowButton />
      </div>
    </div>
  )
}

export default LensPageProfileCard
