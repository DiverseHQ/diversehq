import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiRepost } from 'react-icons/bi'
import { BsCollection } from 'react-icons/bs'
import { MdOutlineGroups } from 'react-icons/md'
import { Profile, useProfileQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { UserType } from '../../types/user'
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

  const { FollowButton, isFollowedByMe } = useLensFollowButton({
    profileId: lensProfile?.id
  })
  let _profileBanner =
    lensProfile?.coverPicture?.__typename === 'NftImage'
      ? getIPFSLink(lensProfile?.coverPicture?.uri)
      : getIPFSLink(lensProfile?.coverPicture?.original?.url)
  const { isMobile } = useDevice()

  return (
    <div>
      <ImageWithFullScreenZoom
        className={`h-28 w-full object-cover ${
          !isMobile
            ? 'rounded-t-[20px] border-t-[1px] border-x-[1px] border-p-border'
            : ''
        }`}
        src={_profileBanner ? _profileBanner : '/gradient.jpg'}
      />

      <ImageWithFullScreenZoom
        className="absolute top-[-30px] left-3 sm:left-5 border-s-bg border-4 rounded-full bg-s-bg w-20 h-20"
        src={getAvatar(lensProfile)}
      />

      <div
        className={`flex flex-col px-3 sm:px-5 pb-6 bg-s-bg ${
          !isMobile
            ? 'rounded-b-[20px] border-x-[1px] border-b-[1px] border-p-border'
            : ''
        }`}
      >
        <div className="ml-24 flex flex-row justify-end md:justify-between items-start">
          {!isMobile && (
            <div className="flex flex-row items-start justify-between sm:space-x-10 mt-1 mb-2">
              <div className="flex flex-col items-start font-medium text-base sm:text-base tracking-wider">
                {lensProfile?.name && <div>{lensProfile.name}</div>}
                {!lensProfile.name && profile.walletAddress && (
                  <div>{profile.walletAddress.substring(0, 6) + '...'}</div>
                )}
                <Link href={`/u/${formatHandle(lensProfile?.handle)}`} passHref>
                  <div className="hover:underline cursor-pointer">
                    u/{formatHandle(lensProfile?.handle)}
                  </div>
                </Link>
                <div className="font-normal">
                  <Markup>{lensProfile.bio}</Markup>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row items-center my-2 md:my-3 px-2 py-1">
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
            {isFollowedByMe && <MessageButton userLensProfile={lensProfile} />}
          </div>
        </div>
        {isMobile && (
          <>
            <div className="flex flex-row items-start justify-start space-x-10">
              <div className="flex flex-col items-start font-bold text-base sm:text-base tracking-wider">
                {lensProfile.name && <div>{lensProfile.name}</div>}
                {!lensProfile.name && profile.walletAddress && (
                  <div>{profile.walletAddress.substring(0, 6) + '...'}</div>
                )}
                <Link href={`/u/${formatHandle(lensProfile?.handle)}`} passHref>
                  <div className="hover:underline cursor-pointer">
                    u/{formatHandle(lensProfile?.handle)}
                  </div>
                </Link>
              </div>
            </div>
            <div>{lensProfile.bio}</div>
          </>
        )}
        {isMobile ? (
          <div className="flex flex-row flex-wrap gap-x-2 gap-y-2 mt-4 items-center text-[14px]">
            {/* onchain lens data */}
            {lensProfile && (
              <>
                <div className="flex flex-col items-center bg-s-h-bg py-1 px-2 sm:px-4 rounded-[10px] dark:bg-p-bg">
                  <span className="font-bold">
                    {lensProfile?.stats?.totalFollowers}
                  </span>
                  <span className="font-light">Followers</span>
                </div>
                <div className="flex flex-col items-center bg-s-h-bg py-1 px-2 sm:px-4 rounded-[10px] dark:bg-p-bg">
                  <span className="font-bold">
                    {lensProfile?.stats?.totalFollowing}
                  </span>
                  <span className="font-light">Following</span>
                </div>
                <div className="flex flex-col items-center bg-[#62F030] py-1 px-2 sm:px-4 rounded-[10px] text-ap-text dark:bg-p-bg">
                  <span className="font-bold">
                    {lensProfile?.stats?.totalPosts}
                  </span>
                  <span className="font-light">LensPosts</span>
                </div>
              </>
            )}

            <div
              className="flex flex-col items-center bg-s-h-bg py-1 px-2 sm:px-4 rounded-[10px] dark:bg-p-bg cursor-pointer"
              onClick={() => setIsDrawerOpen(true)}
            >
              <span className="font-semibold">
                <BiChevronDown className="text-[18px]" />
              </span>
              <span className="font-light">More</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 mt-3 items-center text-[14px]">
            <div className="">
              <span className="">Joined </span>
              <span className="">Communities: </span>
              <span className="font-semibold">
                {profile?.communities?.length}
              </span>
            </div>
            <div className="">
              <span>
                Posts :{' '}
                <span className="font-semibold">
                  {Number(lensProfile?.stats?.totalPosts)}
                </span>
              </span>
            </div>
            {/* <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full dark:bg-p-bg">
                      <span>
                        Community Spells : {profile?.communityCreationSpells}
                      </span>
                    </div> */}

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
        )}
      </div>

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
            <span>Collected Posts: {lensProfile?.stats?.totalCollects}</span>
          </div>
          <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
            <MdOutlineGroups />
            <span>Joined Communities: {profile?.communities?.length}</span>
          </div>
        </div>
      </BottomDrawerWrapper>
    </div>
  )
}

export default ProfileCard
