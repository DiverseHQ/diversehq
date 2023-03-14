import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiRepost } from 'react-icons/bi'
import { BsCollection } from 'react-icons/bs'
import { MdOutlineGroups } from 'react-icons/md'
import { Profile, useProfileQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { UserType } from '../../types/user'
import { stringToLength } from '../../utils/utils'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import useDevice from '../Common/useDevice'
import Markup from '../Lexical/Markup'
import MessageButton from '../Messages/MessageButton'
import formatHandle from './lib/formatHandle'
import getAvatar from './lib/getAvatar'
import getIPFSLink from './lib/getIPFSLink'
import useLensFollowButton from './useLensFollowButton'

interface Props {
  _profile: UserType
  _lensProfile?: Profile
}

const ProfileCard = ({ _profile, _lensProfile }: Props) => {
  const [profile, setProfile] = useState(_profile)
  const [lensProfile, setLensProfile] = useState(_lensProfile)
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { data, refetch } = useProfileQuery(
    {
      request: {
        profileId: _lensProfile?.id
      }
    },
    {
      enabled: !!myLensProfile?.defaultProfile?.id
    }
  )
  const { FollowButton, isFollowedByMe } = useLensFollowButton({
    profileId: lensProfile?.id
  })
  let _profileBanner =
    lensProfile?.coverPicture?.__typename === 'NftImage'
      ? getIPFSLink(lensProfile?.coverPicture?.uri)
      : getIPFSLink(lensProfile?.coverPicture?.original?.url)
  const { isMobile } = useDevice()

  useEffect(() => {
    if (data?.profile) {
      // @ts-ignore
      setLensProfile(data?.profile)
    }
  }, [data])

  useEffect(() => {
    if (_profile) {
      setProfile(_profile)
    }
    if (_lensProfile) {
      refetch()
    }
  }, [_profile?._id, _lensProfile?.id])

  return (
    <div className="relative shadow-lg z-0 bg-s-bg mb-6 text-p-text w-[calc(100vw-9px)]">
      <ImageWithFullScreenZoom
        className={`h-48 w-full object-cover`}
        src={_profileBanner ? _profileBanner : '/gradient.jpg'}
      />
      {isMobile ? (
        <div className="md:w-[650px] lg:w-[950px] xl:w-[1000px] mx-auto">
          <div className="relative flex flex-row items-start justify-between">
            <div
              className={`flex flex-row gap-2 w-full justify-between mx-8 mt-2`}
            >
              <div className="flex flex-col items-center py-1 px-2 sm:px-4 rounded-[10px]">
                <span className="font-bold">
                  {lensProfile?.stats?.totalFollowers}
                </span>
                <span className="font-light">Followers</span>
              </div>
              <div className="shrink-0 rounded-full -translate-y-6  md:-translate-y-6 border-2 border-[#fff] md:border-4 dark:border-p-border">
                <ImageWithFullScreenZoom
                  className="rounded-full bg-s-bg w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-cover"
                  src={getAvatar(lensProfile)}
                />
              </div>
              <div className="flex flex-col items-center py-1 px-2 sm:px-4 rounded-[10px]">
                <span className="font-bold">
                  {lensProfile?.stats?.totalFollowing}
                </span>
                <span className="font-light">Following</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-start justify-center space-x-10 px-3 mb-2 -mt-2">
            <div className="flex flex-col text-center font-bold text-base sm:text-base">
              {lensProfile.name && (
                <span className="text-[22px]">{lensProfile.name}</span>
              )}
              {!lensProfile.name && profile.walletAddress && (
                <div>{profile.walletAddress.substring(0, 6) + '...'}</div>
              )}
              <Link href={`/u/${formatHandle(lensProfile?.handle)}`} passHref>
                <div className="hover:underline cursor-pointer text-s-text">
                  u/{formatHandle(lensProfile?.handle)}
                </div>
              </Link>
              <div className="font-normal">
                <Markup>{lensProfile.bio}</Markup>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center px-5 py-1 md:px-8 pb-2">
            <div className="flex flex-row justify-center w-full flex-wrap gap-x-2 gap-y-2 items-center text-[14px]">
              {/* onchain lens data */}
              {hasProfile &&
                isSignedIn &&
                myLensProfile &&
                lensProfile &&
                lensProfile.ownedBy?.toLowerCase() !==
                  myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() && (
                  <div className="mx-2">
                    <FollowButton />
                  </div>
                )}
              {myLensProfile &&
                myLensProfile?.defaultProfile?.ownedBy.toLowerCase() ===
                  lensProfile?.ownedBy.toLowerCase() && (
                  <Link href={isMobile ? '/settings/profile' : '/settings'}>
                    <div className="text-base text-p-btn-text bg-p-btn px-3 py-0.5 mx-2 rounded-md cursor-pointer">
                      Edit
                    </div>
                  </Link>
                )}
              <div
                className="flex items-center border border-p-border cursor-pointer text-p-btn-text rounded-full px-8 py-2 text-sm font-semibold"
                onClick={() => setIsDrawerOpen(true)}
              >
                <span className="font-light">More</span>
                <span className="font-semibold">
                  <BiChevronDown className="text-[18px]" />
                </span>
              </div>
            </div>

            {/* bottom drawer */}
            <BottomDrawerWrapper
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              showClose
              position="bottom"
            >
              <div className="flex flex-col gap-4 mx-4 mb-4">
                <h3 className="font-bold text-[20px] self-center">
                  {lensProfile?.name ?? `u/${formatHandle(lensProfile.handle)}`}
                </h3>
                <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
                  <BiRepost />
                  <span>Posts: {lensProfile?.stats?.totalPosts}</span>
                </div>
                <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
                  <BsCollection />
                  <span>
                    Collected Posts: {lensProfile?.stats?.totalCollects}
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
                  <MdOutlineGroups />
                  <span>
                    Joined Communities: {profile?.communities?.length}
                  </span>
                </div>
              </div>
            </BottomDrawerWrapper>
          </div>
        </div>
      ) : (
        <div className="md:w-[650px] lg:w-[950px] xl:w-[1000px] mx-auto">
          <div className="relative flex flex-row items-start justify-between">
            <div className={`flex flex-row gap-2`}>
              <div className="shrink-0 rounded-full -translate-y-4  md:-translate-y-6 border-2 md:border-4 border-s-bg">
                <ImageWithFullScreenZoom
                  className="rounded-full bg-s-bg w-[60px] h-[60px] md:w-[120px] md:h-[120px] object-cover"
                  src={getAvatar(lensProfile)}
                />
              </div>
              <div className="flex flex-col mt-4">
                <p className="font-bold text-[18px] md:text-2xl tracking-wider truncate">
                  {lensProfile?.name && (
                    <div>{stringToLength(lensProfile.name, 20)}</div>
                  )}
                  {!lensProfile.name && profile.walletAddress && (
                    <div>{profile.walletAddress.substring(0, 6) + '...'}</div>
                  )}
                </p>
                <div className="text-[14px] md:text-[16px]">
                  <Link
                    href={`/u/${formatHandle(lensProfile?.handle)}`}
                    passHref
                  >
                    <div className="hover:underline cursor-pointer text-s-text">
                      u/{formatHandle(lensProfile?.handle)}
                    </div>
                  </Link>
                </div>
                <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 mt-2 items-center text-[16px]">
                  {/* onchain lens data */}
                  {lensProfile && (
                    <>
                      <div className="">
                        <span>Followers: </span>
                        <span className="font-semibold">
                          {lensProfile?.stats?.totalFollowers}
                        </span>
                      </div>
                      <div className="">
                        <span>Following: </span>
                        <span className="font-semibold">
                          {lensProfile?.stats?.totalFollowing}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-1 sm:gap-2 pt-2 mt-2 md:mt-4">
              {hasProfile &&
                isSignedIn &&
                myLensProfile &&
                lensProfile &&
                lensProfile.ownedBy?.toLowerCase() !==
                  myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() && (
                  <div className="mx-2">
                    <FollowButton />
                  </div>
                )}
              {myLensProfile &&
                myLensProfile?.defaultProfile?.ownedBy.toLowerCase() ===
                  lensProfile?.ownedBy.toLowerCase() && (
                  <Link href={isMobile ? '/settings/profile' : '/settings'}>
                    <div className="text-base text-p-btn-text bg-p-btn px-3 py-0.5 mx-2 rounded-md cursor-pointer">
                      Edit
                    </div>
                  </Link>
                )}
              {isFollowedByMe && (
                <MessageButton userLensProfile={lensProfile} />
              )}
              <span onClick={(e) => e.stopPropagation()}></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
