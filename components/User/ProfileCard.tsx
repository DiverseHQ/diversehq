import { Tooltip } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import { BiChevronDown, BiRepost } from 'react-icons/bi'
import { BsCollection, BsPeopleFill } from 'react-icons/bs'
import { FiInfo, FiSettings } from 'react-icons/fi'
import { IoIosShareAlt } from 'react-icons/io'
import { MdOutlineGroups } from 'react-icons/md'
import { RiMore2Fill } from 'react-icons/ri'
import { Profile, useProfileQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { UserType } from '../../types/user'
import { appLink } from '../../utils/config'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { useNotify } from '../Common/NotifyContext'
import OptionsWrapper from '../Common/OptionsWrapper'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import useDevice from '../Common/useDevice'
import Markup from '../Lexical/Markup'
import MessageButton from '../Messages/MessageButton'
import formatHandle from './lib/formatHandle'
import getAvatar from './lib/getAvatar'
import getCoverBanner from './lib/getCoverBanner'
import ProfileLinksRow from './ProfileLinksRow'
import useLensFollowButton from './useLensFollowButton'

interface Props {
  _profile?: UserType
  _lensProfile?: Profile
  isLensCommunity?: boolean
}

const ProfileCard = ({
  _profile,
  _lensProfile,
  isLensCommunity = false
}: Props) => {
  const [profile, setProfile] = useState(_profile)
  const [lensProfile, setLensProfile] = useState(_lensProfile)
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const router = useRouter()
  const { notifyInfo } = useNotify()
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
  const { FollowButton, isFollowedByMe } = useLensFollowButton(
    {
      profileId: lensProfile?.id
    },
    isLensCommunity ? 'join' : 'follow'
  )
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
        className={`h-48 sm:h-72 w-full object-cover`}
        src={getCoverBanner(lensProfile)}
      />
      {isMobile ? (
        <div className="md:w-[650px] lg:w-[950px] xl:w-[1000px] mx-auto">
          <div>
            {isLensCommunity ? (
              <div className="relative flex flex-row items-start justify-between">
                <div
                  className={`flex flex-row gap-2 w-full justify-start items-start ${
                    isMobile ? 'mx-4' : ''
                  } mt-2`}
                >
                  <div className="shrink-0 -translate-y-5 md:-translate-y-10 overflow-hidden">
                    <ImageWithFullScreenZoom
                      className="rounded-lg border-4 border-s-bg bg-s-bg w-[72px] h-[72px] md:w-[120px] md:h-[120px] object-cover"
                      src={getAvatar(lensProfile)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="px-2">
                      <div className="hover:underline cursor-pointer text-s-text">
                        l/{formatHandle(lensProfile?.handle)}
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-x-1 px-2 sm:px-4 rounded-[10px]">
                      <BsPeopleFill className="w-4 h-4 mr-1" />
                      <span className="font-bold">
                        {lensProfile?.stats?.totalFollowers}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-1 sm:gap-2 pt-2 mt-2 md:mt-4">
                  <FollowButton />
                  <span onClick={(e) => e.stopPropagation()}>
                    <OptionsWrapper
                      OptionPopUpModal={() => (
                        <MoreOptionsModal
                          className="z-50"
                          list={
                            isMobile
                              ? myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() ===
                                lensProfile?.ownedBy?.toLowerCase()
                                ? [
                                    {
                                      label: 'Setting',
                                      onClick: () => {
                                        router.push(
                                          `/l/${formatHandle(
                                            lensProfile?.handle
                                          )}/settings`
                                        )
                                      },
                                      icon: () => (
                                        <FiSettings className="mr-1.5 w-6 h-6" />
                                      )
                                    },
                                    {
                                      label: 'More Info',
                                      onClick: () => {
                                        setIsDrawerOpen(true)
                                      },
                                      icon: () => (
                                        <FiInfo className="mr-1.5 w-6 h-6" />
                                      )
                                    },
                                    {
                                      label: 'Share',
                                      onClick: () => {
                                        if (navigator.share) {
                                          navigator.share({
                                            title: `Join l/${formatHandle(
                                              lensProfile?.handle
                                            )} on DiverseHQ`,
                                            text: lensProfile?.bio,
                                            url: `${appLink}/l/${formatHandle(
                                              lensProfile?.handle
                                            )}`
                                          })
                                        } else {
                                          notifyInfo('Share not supported')
                                        }
                                      },
                                      icon: () => (
                                        <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                      )
                                    }
                                  ]
                                : [
                                    {
                                      label: 'More Info',
                                      onClick: () => {
                                        setIsDrawerOpen(true)
                                      },
                                      icon: () => (
                                        <FiInfo className="mr-1.5 w-6 h-6" />
                                      )
                                    },
                                    {
                                      label: 'Share',
                                      onClick: () => {
                                        if (navigator.share) {
                                          navigator.share({
                                            title: `Join l/${formatHandle(
                                              lensProfile?.handle
                                            )} on DiverseHQ`,
                                            text: lensProfile?.bio,
                                            url: `${appLink}/l/${formatHandle(
                                              lensProfile?.handle
                                            )}`
                                          })
                                        } else {
                                          notifyInfo('Share not supported')
                                        }
                                      },
                                      icon: () => (
                                        <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                      )
                                    }
                                  ]
                              : myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() ===
                                lensProfile?.ownedBy?.toLowerCase()
                              ? [
                                  {
                                    label: 'Setting',
                                    onClick: () => {
                                      router.push(
                                        `/l/${formatHandle(
                                          lensProfile?.handle
                                        )}/settings`
                                      )
                                    },
                                    icon: () => (
                                      <FiSettings className="mr-1.5 w-6 h-6" />
                                    )
                                  },
                                  {
                                    label: 'Share',
                                    onClick: () => {
                                      if (navigator.share) {
                                        navigator.share({
                                          title: `Join l/${formatHandle(
                                            lensProfile?.handle
                                          )} on DiverseHQ`,
                                          text: lensProfile?.bio,
                                          url: `${appLink}/l/${formatHandle(
                                            lensProfile?.handle
                                          )}`
                                        })
                                      } else {
                                        notifyInfo('Share not supported')
                                      }
                                    },
                                    icon: () => (
                                      <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                    )
                                  }
                                ]
                              : [
                                  {
                                    label: 'Share',
                                    onClick: () => {
                                      if (navigator.share) {
                                        navigator.share({
                                          title: `Join l/${formatHandle(
                                            lensProfile?.handle
                                          )} on DiverseHQ`,
                                          text: lensProfile?.bio,
                                          url: `${appLink}/l/${formatHandle(
                                            lensProfile?.handle
                                          )}`
                                        })
                                      } else {
                                        notifyInfo('Share not supported')
                                      }
                                    },
                                    icon: () => (
                                      <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                    )
                                  }
                                ]
                          }
                        />
                      )}
                      position="left"
                      showOptionsModal={showOptionsModal}
                      setShowOptionsModal={setShowOptionsModal}
                      isDrawerOpen={isExploreDrawerOpen}
                      setIsDrawerOpen={setIsExploreDrawerOpen}
                    >
                      <Tooltip
                        enterDelay={1000}
                        leaveDelay={200}
                        title="More"
                        arrow
                      >
                        <div className="hover:bg-p-btn-hover rounded-md p-1.5 cursor-pointer">
                          <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </Tooltip>
                    </OptionsWrapper>
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`flex flex-row gap-2 w-full justify-between mx-8 mt-2`}
                >
                  <div className="flex flex-col items-center py-1 px-2 sm:px-4 rounded-[10px]">
                    <span className="font-bold">
                      {lensProfile?.stats?.totalFollowers}
                    </span>
                    <span className="font-light">Followers</span>
                  </div>
                  <div className="shrink-0 rounded-full -translate-y-6 border-2 border-[#fff] md:border-4 dark:border-p-border">
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
              </>
            )}
          </div>

          <div className="flex flex-row items-start justify-center space-x-10 px-3 mb-2 -mt-2">
            <div className="flex flex-col font-bold text-base sm:text-base gap-y-1.5">
              {!isLensCommunity && (
                <div className="flex flex-row items-center justify-center gap-x-2 flex-wrap">
                  {lensProfile.name && (
                    <span className="text-[22px]">{lensProfile.name}</span>
                  )}
                  <Link
                    href={`/u/${formatHandle(lensProfile?.handle)}`}
                    passHref
                  >
                    <div className="hover:underline cursor-pointer text-s-text">
                      u/{formatHandle(lensProfile?.handle)}
                    </div>
                  </Link>
                </div>
              )}

              {isLensCommunity && (
                <div className="font-bold text-[18px] md:text-2xl tracking-wider hover:underline cursor-pointer">
                  {lensProfile?.name}
                </div>
              )}

              <div className="font-normal text-sm">
                <Markup>{lensProfile.bio}</Markup>
              </div>
              <ProfileLinksRow profile={lensProfile} />
              {!isLensCommunity && (
                <div className="flex flex-row justify-center w-full flex-wrap gap-x-2 gap-y-2 items-center text-[14px]">
                  {/* onchain lens data */}
                  {hasProfile &&
                    isSignedIn &&
                    myLensProfile &&
                    lensProfile &&
                    lensProfile.ownedBy?.toLowerCase() !==
                      myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() && (
                      <div className="mx-2">
                        <FollowButton className="px-8 py-2 rounded-full" />
                      </div>
                    )}
                  {myLensProfile &&
                    myLensProfile?.defaultProfile?.ownedBy.toLowerCase() ===
                      lensProfile?.ownedBy.toLowerCase() && (
                      <Link
                        href={
                          isLensCommunity
                            ? isMobile
                              ? `/l/${formatHandle(
                                  lensProfile.handle
                                )}/settings`
                              : `/l/${formatHandle(
                                  lensProfile.handle
                                )}/settings`
                            : isMobile
                            ? '/settings/profile'
                            : '/settings'
                        }
                      >
                        <div className="mx-2 rounded-full cursor-pointer bg-p-btn text-p-btn-text px-8 py-2 text-sm font-semibold">
                          {isLensCommunity ? 'Settings' : 'Edit'}
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
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center px-5 py-1 md:px-8 pb-2">
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
                  <MdOutlineGroups />
                  <span>
                    Joined Communities: {profile?.communities?.length}
                  </span>
                </div>
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
                  <AiOutlineRetweet />
                  <span>
                    Mirrored Posts: {lensProfile?.stats?.totalMirrors}
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
              {isLensCommunity ? (
                <div className="shrink-0 -translate-y-8">
                  <ImageWithFullScreenZoom
                    className="rounded-xl bg-s-bg w-[60px] h-[60px] md:w-[120px] md:h-[120px] object-cover border-2 md:border-4 border-s-bg"
                    src={getAvatar(lensProfile)}
                  />
                </div>
              ) : (
                <div className="shrink-0 rounded-full -translate-y-8 border-2 md:border-4 border-s-bg">
                  <ImageWithFullScreenZoom
                    className="rounded-full bg-s-bg w-[60px] h-[60px] md:w-[120px] md:h-[120px] object-cover"
                    src={getAvatar(lensProfile)}
                  />
                </div>
              )}
              <div className="flex flex-col mt-3">
                <p className="font-bold text-[18px] md:text-2xl tracking-wider truncate">
                  {lensProfile?.name && <div>{lensProfile.name}</div>}
                </p>
                <div className="text-[14px] md:text-[16px]">
                  <Link
                    href={
                      isLensCommunity
                        ? `/l/${formatHandle(lensProfile?.handle)}`
                        : `/u/${formatHandle(lensProfile?.handle)}`
                    }
                    passHref
                  >
                    <div className="hover:underline cursor-pointer text-s-text">
                      {isLensCommunity
                        ? `l/${formatHandle(lensProfile?.handle)}`
                        : `u/${formatHandle(lensProfile?.handle)}`}
                    </div>
                  </Link>
                </div>
                <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 mt-0.5 items-center text-[16px]">
                  {isLensCommunity && (
                    <span className="flex flex-row items-center gap-x-1">
                      <BsPeopleFill className="w-4 h-4 mr-1" />
                      <span className="font-bold">
                        {lensProfile?.stats?.totalFollowers}
                      </span>
                    </span>
                  )}
                  {/* onchain lens data */}
                  {lensProfile && !isLensCommunity && (
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
                  <Link
                    href={
                      isLensCommunity
                        ? isMobile
                          ? `/l/${formatHandle(lensProfile.handle)}/settings`
                          : `/l/${formatHandle(lensProfile.handle)}/settings`
                        : isMobile
                        ? '/settings/profile'
                        : '/settings'
                    }
                  >
                    <div className="text-base text-p-btn-text bg-p-btn px-3 py-0.5 mx-2 rounded-md cursor-pointer">
                      {isLensCommunity ? 'Settings' : 'Edit'}
                    </div>
                  </Link>
                )}
              {isFollowedByMe && !isLensCommunity && (
                <MessageButton userLensProfile={lensProfile} />
              )}
              <span onClick={(e) => e.stopPropagation()}>
                <OptionsWrapper
                  OptionPopUpModal={() => (
                    <MoreOptionsModal
                      className="z-50"
                      list={
                        isMobile
                          ? myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() ===
                            lensProfile?.ownedBy?.toLowerCase()
                            ? [
                                {
                                  label: 'Setting',
                                  onClick: () => {
                                    router.push(
                                      `/l/${formatHandle(
                                        lensProfile?.handle
                                      )}/settings`
                                    )
                                  },
                                  icon: () => (
                                    <FiSettings className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'More Info',
                                  onClick: () => {
                                    setIsDrawerOpen(true)
                                  },
                                  icon: () => (
                                    <FiInfo className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'Share',
                                  onClick: () => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: `Join l/${formatHandle(
                                          lensProfile?.handle
                                        )} on DiverseHQ`,
                                        text: lensProfile?.bio,
                                        url: `${appLink}/l/${formatHandle(
                                          lensProfile?.handle
                                        )}`
                                      })
                                    } else {
                                      notifyInfo('Share not supported')
                                    }
                                  },
                                  icon: () => (
                                    <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                  )
                                }
                              ]
                            : [
                                {
                                  label: 'More Info',
                                  onClick: () => {
                                    setIsDrawerOpen(true)
                                  },
                                  icon: () => (
                                    <FiInfo className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'Share',
                                  onClick: () => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: `Join l/${formatHandle(
                                          lensProfile?.handle
                                        )} on DiverseHQ`,
                                        text: lensProfile?.bio,
                                        url: `${appLink}/l/${formatHandle(
                                          lensProfile?.handle
                                        )}`
                                      })
                                    } else {
                                      notifyInfo('Share not supported')
                                    }
                                  },
                                  icon: () => (
                                    <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                  )
                                }
                              ]
                          : myLensProfile?.defaultProfile?.ownedBy?.toLowerCase() ===
                            lensProfile?.ownedBy?.toLowerCase()
                          ? [
                              {
                                label: 'Setting',
                                onClick: () => {
                                  router.push(
                                    `/l/${formatHandle(
                                      lensProfile?.handle
                                    )}/settings`
                                  )
                                },
                                icon: () => (
                                  <FiSettings className="mr-1.5 w-6 h-6" />
                                )
                              },
                              {
                                label: 'Share',
                                onClick: () => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: `Join l/${formatHandle(
                                        lensProfile?.handle
                                      )} on DiverseHQ`,
                                      text: lensProfile?.bio,
                                      url: `${appLink}/l/${formatHandle(
                                        lensProfile?.handle
                                      )}`
                                    })
                                  } else {
                                    notifyInfo('Share not supported')
                                  }
                                },
                                icon: () => (
                                  <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                )
                              }
                            ]
                          : [
                              {
                                label: 'Share',
                                onClick: () => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: `Join l/${formatHandle(
                                        lensProfile?.handle
                                      )} on DiverseHQ`,
                                      text: lensProfile?.bio,
                                      url: `${appLink}/l/${formatHandle(
                                        lensProfile?.handle
                                      )}`
                                    })
                                  } else {
                                    notifyInfo('Share not supported')
                                  }
                                },
                                icon: () => (
                                  <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                )
                              }
                            ]
                      }
                    />
                  )}
                  position="left"
                  showOptionsModal={showOptionsModal}
                  setShowOptionsModal={setShowOptionsModal}
                  isDrawerOpen={isExploreDrawerOpen}
                  setIsDrawerOpen={setIsExploreDrawerOpen}
                >
                  <Tooltip
                    enterDelay={1000}
                    leaveDelay={200}
                    title="More"
                    arrow
                  >
                    <div className="hover:bg-p-btn-hover rounded-md p-1.5 cursor-pointer">
                      <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </Tooltip>
                </OptionsWrapper>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
