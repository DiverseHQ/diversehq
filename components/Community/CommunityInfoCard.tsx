import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { isCreatorOrModeratorOfCommunity } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import useDevice from '../Common/useDevice'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { RiMore2Fill } from 'react-icons/ri'
import { IoIosShareAlt } from 'react-icons/io'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import OptionsWrapper from '../Common/OptionsWrapper'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import { Tooltip } from '@mui/material'
import { getLevelAndThresholdXP } from '../../lib/helpers'
import { appLink, xpPerMember } from '../../utils/config'
import JoinCommunityButton from './JoinCommunityButton'
import Link from 'next/link'
import formatHandle from '../User/lib/formatHandle'
import { CommunityWithCreatorProfile } from '../../types/community'
import { FiInfo, FiSettings } from 'react-icons/fi'
import ExploreCommunityCard from './ExploreCommunityCard'
import { BsPeopleFill } from 'react-icons/bs'

interface Props {
  _community: CommunityWithCreatorProfile
}

const CommunityInfoCard = ({ _community }: Props) => {
  const [community, setCommunity] = useState(_community)
  const { user } = useProfile()
  const { notifyInfo } = useNotify()
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()
  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    community?.members?.length * xpPerMember || 0
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const name = community?.name
  const { isMobile } = useDevice()

  const redirectToCommunityPage = () => {
    if (name) router.push(`/c/${name}`)
  }

  const calculateBarPercentage = (currentXP, threshold) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }

  const shareCommunity = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${community?.name} on DiverseHQ`,
        text: `Join ${community?.name} on DiverseHQ`,
        url: `${appLink}/c/${community?.name}`
      })
    } else {
      notifyInfo('Sharing is not supported on your device')
    }
  }

  const checkIfCreatorOrModerator = async (name: string) => {
    try {
      const res = await isCreatorOrModeratorOfCommunity(name)
      if (res.status === 200) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (community) {
      setCommunity(_community)
    }
  }, [_community])

  useEffect(() => {
    checkIfCreatorOrModerator(community?.name)
  }, [user?.walletAddress, community?.name])

  return (
    <>
      {community && (
        <>
          {router.pathname.startsWith('/explore') ? (
            <ExploreCommunityCard _community={community} />
          ) : (
            <div className="relative z-0 bg-s-bg text-p-text w-[calc(100vw-9px)]">
              <ImageWithFullScreenZoom
                className={`h-48 sm:h-72 w-full object-cover`}
                src={community.bannerImageUrl}
              />
              <div className="md:w-[650px] lg:w-[950px] xl:w-[1000px] mx-auto">
                <div className="relative flex flex-row items-start justify-between">
                  <div
                    className={`flex flex-row gap-2 ${isMobile ? 'mx-4' : ''}`}
                  >
                    <div className="shrink-0 rounded-xl -translate-y-5  md:-translate-y-10 border-4 border-s-bg overflow-hidden">
                      <ImageWithFullScreenZoom
                        className="bg-s-bg w-[60px] h-[60px] md:w-[120px] md:h-[120px] object-cover"
                        src={community.logoImageUrl}
                      />
                    </div>
                    {!isMobile ? (
                      <div className="flex flex-col mt-3">
                        <p
                          className="font-bold text-[18px] md:text-2xl tracking-wider truncate"
                          onClick={redirectToCommunityPage}
                        >
                          {community?.label || community?.name}
                        </p>
                        <div className="text-[14px] md:text-[16px]">
                          <div className="hover:underline cursor-pointer text-s-text">
                            c/{community.name}
                          </div>
                        </div>
                        <div className="flex flex-row items-center pt-0.5">
                          <BsPeopleFill className="w-4 h-4 mr-1" />
                          <span>{community?.members?.length}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="px-2">
                          <div className="hover:underline cursor-pointer text-s-text">
                            c/{community.name}
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-x-1 px-2 sm:px-4 rounded-[10px]">
                          <BsPeopleFill className="w-4 h-4 mr-1" />
                          <span className="font-bold">
                            {community?.members?.length || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end items-center gap-1 sm:gap-2 pt-2 mt-2 md:mt-4">
                    <JoinCommunityButton id={community._id} showJoined={true} />
                    <span onClick={(e) => e.stopPropagation()}>
                      <OptionsWrapper
                        OptionPopUpModal={() => (
                          <MoreOptionsModal
                            className="z-50"
                            list={
                              isMobile
                                ? isAuth
                                  ? [
                                      {
                                        label: 'Setting',
                                        onClick: () => {
                                          router.push(
                                            `/c/${community.name}/settings`
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
                                        onClick: shareCommunity,
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
                                        onClick: shareCommunity,
                                        icon: () => (
                                          <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                        )
                                      }
                                    ]
                                : isAuth
                                ? [
                                    {
                                      label: 'Setting',
                                      onClick: () => {
                                        router.push(
                                          `/c/${community.name}/settings`
                                        )
                                      },
                                      icon: () => (
                                        <FiSettings className="mr-1.5 w-6 h-6" />
                                      )
                                    },
                                    {
                                      label: 'Share',
                                      onClick: shareCommunity,
                                      icon: () => (
                                        <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                      )
                                    }
                                  ]
                                : [
                                    {
                                      label: 'Share',
                                      onClick: shareCommunity,
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

              {isMobile && (
                <>
                  {/* name and description row */}
                  <div className="flex flex-col px-3 mb-2">
                    <p
                      className="font-bold text-[18px] md:text-2xl tracking-wider hover:underline cursor-pointer"
                      onClick={redirectToCommunityPage}
                    >
                      {community?.label || community?.name}
                    </p>
                    <div className="text-[14px] md:text-[16px]">
                      {community.description}
                    </div>
                  </div>
                </>
              )}
              {/* bottom drawer for mobile */}
              <BottomDrawerWrapper
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                showClose
                position="bottom"
              >
                <div className="flex flex-col gap-4 mx-4 mb-4">
                  <h3 className="font-bold text-[20px] self-center">
                    {community?.name}
                  </h3>
                  <div className="flex flex-row gap-1 w-full">
                    <div className="flex flex-col w-full">
                      <div className="relative bg-[#D7D7D7] h-[35px] rounded-[10px] flex flex-row">
                        <div className="flex z-10 self-center justify-self-center w-full justify-center text-white dark:text-p-text text-[14px]">
                          Level {level}
                        </div>
                        <div
                          className="absolute h-full bg-[#9378D8] rounded-[10px] "
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
                  <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#687684]">
                    <img
                      src="/createdOnDate.svg"
                      alt="created on date"
                      className="w-5 h-5"
                    />
                    <span>
                      Created{' '}
                      {new Date(community.createdAt)
                        .toDateString()
                        .split(' ')
                        .slice(1)
                        .join(' ')}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#687684]">
                    <img
                      src="/createdByUser.svg"
                      alt="created by user"
                      className="w-5 h-5"
                    />
                    <span>
                      Created by{' '}
                      <span>
                        <Link
                          href={`u/${formatHandle(
                            community?.creatorProfile?.handle
                          )}`}
                        >
                          <span>{`u/${formatHandle(
                            community?.creatorProfile?.handle
                          )}`}</span>
                        </Link>
                      </span>
                    </span>
                  </div>
                </div>
              </BottomDrawerWrapper>
            </div>
          )}
        </>
      )}
      {!community && <div>Loading...</div>}
    </>
  )
}

export default CommunityInfoCard
