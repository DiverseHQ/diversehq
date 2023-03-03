import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import { getCommunityInfoUsingId } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import EditCommunity from './EditCommunity'
import { AiOutlineFileAdd } from 'react-icons/ai'
// import { getNumberOfPostsInCommunity } from '../../api/post'
import useDevice from '../Common/useDevice'
import { BiChevronDown, BiEdit } from 'react-icons/bi'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
// import { BsCollection } from 'react-icons/bs'
import { RiMore2Fill } from 'react-icons/ri'
import { IoIosShareAlt } from 'react-icons/io'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import OptionsWrapper from '../Common/OptionsWrapper'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import { Tooltip } from '@mui/material'
import { getLevelAndThresholdXP } from '../../lib/helpers'
import { xpPerMember } from '../../utils/config'
import JoinCommunityButton from './JoinCommunityButton'
import { CommunityType } from '../../types/community'
import { Profile } from '../../graphql/generated'
import Link from 'next/link'
import formatHandle from '../User/lib/formatHandle'

interface CommunityProp extends CommunityType {
  creatorProfile: Profile
}

interface Props {
  _community: CommunityProp
}
const CommunityInfoCard = ({ _community }: Props) => {
  const [community, setCommunity] = useState(_community)
  const { user } = useProfile()
  const { notifyInfo } = useNotify()
  const { showModal } = usePopUpModal()
  const router = useRouter()

  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    community?.members?.length * xpPerMember || 0
  )

  useEffect(() => {
    if (community) {
      setCommunity(_community)
    }
  }, [_community])

  const [isCreator, setIsCreator] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  // const [numberOfPosts, setNumberOfPosts] = useState(0)
  const name = community?.name

  useEffect(() => {
    if (!user || !community) return
    if (user.walletAddress === community.creator) {
      setIsCreator(true)
    }
  }, [user, community])

  // get the community information using it's id
  const getCommunityInformation = async () => {
    try {
      const comm = await getCommunityInfoUsingId(community._id)
      // fetchNumberOfPosts()

      setCommunity({ ...comm })
    } catch (error) {
      console.log(error)
    }
  }

  const redirectToCommunityPage = () => {
    if (name) router.push(`/c/${name}`)
  }

  const editCommunity = useCallback(() => {
    if (!community) return
    showModal({
      component: (
        <EditCommunity
          community={community}
          getCommunityInformation={getCommunityInformation}
        />
      ),
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }, [community])

  const { isMobile } = useDevice()

  const calculateBarPercentage = (currentXP, threshold) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }

  const shareCommunity = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${community?.name} on ${process.env.NEXT_PUBLIC_APP_NAME}`,
        text: `Join ${community?.name} on ${process.env.NEXT_PUBLIC_APP_NAME}`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/c/${community?.name}`
      })
    } else {
      notifyInfo('Sharing is not supported on your device')
    }
  }

  return (
    <>
      {community && (
        <div
          className={`relative shadow-lg z-0 bg-s-bg mb-6 text-p-text ${
            router.pathname.startsWith('/c') && !isMobile ? 'mt-10' : ''
          } ${!isMobile ? 'border-[1px] border-p-border rounded-[20px]' : ''} ${
            isMobile && router.pathname.startsWith('/explore')
              ? 'rounded-[20px] mx-2'
              : ''
          } ${router.pathname.startsWith('/explore') ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (router.pathname.startsWith('/c')) return
            redirectToCommunityPage()
          }}
        >
          {/* only enable the zoom on the community page not on any other page */}
          {!router.pathname.startsWith('/c') ? (
            <ImageWithPulsingLoader
              className={`h-20 sm:h-28 w-full object-cover ${
                !isMobile
                  ? 'rounded-t-[20px]'
                  : router.pathname.startsWith('/explore')
                  ? 'rounded-t-[20px]'
                  : ''
              }`}
              src={community.bannerImageUrl}
            />
          ) : (
            <ImageWithFullScreenZoom
              className={`h-20 sm:h-28 w-full object-cover ${
                !isMobile ? 'rounded-t-[20px]' : ''
              }`}
              src={community.bannerImageUrl}
            />
          )}
          <div className="relative flex flex-row items-start justify-between px-2 mb-[-10px] md:px-8">
            <div className="flex flex-row gap-2">
              <div className="shrink-0 border-s-bg border-4 rounded-full sm:-translate-y-8 -translate-y-6">
                {/* only enable the zoom on the community page not on any other page */}
                {!router.pathname.startsWith('/c') ? (
                  <ImageWithPulsingLoader
                    className="rounded-full bg-s-bg w-[50px] h-[50px] md:w-[90px] md:h-[90px] object-cover"
                    src={community.logoImageUrl}
                  />
                ) : (
                  <ImageWithFullScreenZoom
                    className="rounded-full bg-s-bg w-[50px] h-[50px] md:w-[90px] md:h-[90px] object-cover"
                    src={community.logoImageUrl}
                  />
                )}
              </div>
              {!isMobile && (
                <div className="flex flex-col">
                  <p
                    className="font-bold text-[18px] md:text-2xl tracking-wider hover:underline cursor-pointer truncate"
                    onClick={redirectToCommunityPage}
                  >
                    {community.name}
                  </p>
                  <div className="text-[14px] md:text-[16px]">
                    {community.description}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end items-center gap-1 sm:gap-2 pt-2">
              <JoinCommunityButton id={community._id} showJoined={true} />
              <span onClick={(e) => e.stopPropagation()}>
                <OptionsWrapper
                  OptionPopUpModal={() => (
                    <MoreOptionsModal
                      className="z-50"
                      list={
                        isCreator
                          ? [
                              {
                                label: 'Edit',
                                onClick: editCommunity,
                                icon: () => (
                                  <BiEdit className="mr-1.5 w-6 h-6" />
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
                    <div className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                      <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </Tooltip>
                </OptionsWrapper>
              </span>
            </div>
          </div>

          {isMobile && (
            <>
              {/* name and description row */}
              <div className="flex flex-col px-5">
                <p
                  className="font-bold text-[18px] md:text-2xl tracking-wider hover:underline cursor-pointer truncate"
                  onClick={redirectToCommunityPage}
                >
                  {community.name}
                </p>
                {router.pathname.startsWith('/explore') && (
                  <p className="text-[14px]">
                    <span className="font-semibold">
                      {community.members?.length}
                    </span>{' '}
                    Members
                  </p>
                )}
                <div className="text-[14px] md:text-[16px]">
                  {community.description}
                </div>
              </div>

              {/* level and date for mobile */}
              {!router.pathname.startsWith('/explore') && (
                <div className="flex flex-row items-center py-1">
                  {/* level */}
                  <div className="flex flex-row px-5 gap-1 items-center">
                    <img src={'/levelDropIcon.svg'} className="w-4 h-4" />
                    <div className="text-[12px] md:text-[14px] items-center">
                      {`Lvl${level}`}
                    </div>
                    <div className="flex flex-col w-[100px] items-end">
                      <div className="text-[10px] text-[#bbb]">
                        {currentXP}/{thresholdXP}
                      </div>
                      <div className="relative bg-[#AA96E2] h-[3px] w-full">
                        <div
                          className="absolute h-full bg-[#6668FF] w-[0%]"
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

                  {/* date */}
                  <div className="flex flex-row gap-0.5 items-center text-xs md:text-[14px] text-[#aaa]">
                    <AiOutlineFileAdd />
                    <span>
                      Created{' '}
                      {new Date(community.createdAt)
                        .toDateString()
                        .split(' ')
                        .slice(1)
                        .join(' ')}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-row justify-between items-center px-5 py-1 md:px-8 pb-2">
            {/* stats UI for mobile */}
            {isMobile && !router.pathname.startsWith('/explore') && (
              <div className="flex flex-row flex-wrap gap-2 md:gap-4 text-[14px]">
                <div className="flex flex-col items-center bg-s-h-bg dark:bg-p-bg py-1 px-2 sm:px-4 rounded-[10px]">
                  <span className="font-semibold">
                    {community.members?.length}
                  </span>
                  <span className="font-light">Members</span>
                </div>
                {/* <div className="flex flex-col items-center bg-s-h-bg dark:bg-p-bg py-1 px-2 sm:px-4 rounded-[10px]">
                  <span className="font-semibold">{numberOfPosts}</span>
                  <span className="font-light">Posts</span>
                </div> */}
                {/* <div className="flex flex-col items-center bg-s-h-bg dark:bg-p-bg py-1 px-2 sm:px-4 rounded-[10px]">
                  <span className="font-semibold">0</span>
                  <span className="font-light">Matic</span>
                </div> */}
                <div
                  className="flex flex-col items-center justify-between bg-s-h-bg dark:bg-p-bg py-1 px-2 sm:px-4 rounded-[10px] cursor-pointer"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <span className="font-semibold">
                    <BiChevronDown className="text-[18px]" />
                  </span>
                  <span className="font-light">More</span>
                </div>
              </div>
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
                {/* <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#687684]">
                  <BsCollection className='className="w-5 h-5"' />
                  <span>Matic transferred: 0</span>
                </div> */}
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

            {/* stats UI for desktop */}
            {!isMobile && (
              <div className="flex flex-row flex-wrap gap-2 md:gap-4 text-xs md:text-[16px]">
                <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                  <span>Members: </span>
                  <span className="font-semibold">
                    {community.members?.length}
                  </span>
                </div>
                {router.pathname.startsWith('/c/') && (
                  <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                    <span>Members: </span>
                    <span className="font-semibold">
                      {community.members?.length}
                    </span>
                  </div>
                )}
                {/* <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                  <span>Posts: </span>
                  <span className="font-semibold">{numberOfPosts}</span>
                </div> */}
                {/* <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                  <span>Matic transferred: </span>
                  <span className="font-semibold">0</span>
                </div> */}
              </div>
            )}

            {/* todo make dynamic from the backend */}
            {/* level and date for desktop */}
            <div className="flex flex-col gap-1">
              {/* level */}
              {!isMobile && (
                <>
                  {' '}
                  <div className="flex flex-row gap-1 items-center">
                    <div className="text-[12px] md:text-[14px] items-center">
                      {`Lvl${level}`}
                    </div>
                    <div className="flex flex-col w-full items-end">
                      <div className="text-[10px] text-[#bbb]">{`${currentXP}/${thresholdXP}`}</div>
                      <div className="relative bg-[#AA96E2] h-2.5 rounded-full w-full">
                        <div
                          className="absolute h-full rounded-full bg-[#6668FF] transition-all duration-500 ease-in-out"
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
                  {/* createdat */}
                  <div className="flex flex-row gap-0.5 items-center text-xs md:text-[14px] text-[#aaa]">
                    <AiOutlineFileAdd />
                    <span>
                      Created{' '}
                      {new Date(community.createdAt)
                        .toDateString()
                        .split(' ')
                        .slice(1)
                        .join(' ')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {!community && <div>Loading...</div>}
    </>
  )
}

export default CommunityInfoCard
