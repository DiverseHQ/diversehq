import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import {
  putJoinCommunity,
  putLeaveCommunity,
  getCommunityInfoUsingId
} from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

import {
  modalType,
  usePopUpModal
} from '../../components/Common/CustomPopUpProvider'
import EditCommunity from './EditCommunity'
// import { dateToSince } from '../../utils/utils'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { getNumberOfPostsInCommunity } from '../../api/post'
import useDevice from '../Common/useDevice'
import { BiChevronDown } from 'react-icons/bi'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { BsCollection } from 'react-icons/bs'
import ImgWithZoon from '../Common/UI/ImgWithZoon'

const CommunityInfoCard = ({ _community }) => {
  const [community, setCommunity] = useState(_community)
  const { user, refreshUserInfo } = useProfile()
  const { notifyInfo } = useNotify()
  const { showModal } = usePopUpModal()
  const router = useRouter()

  useEffect(() => {
    if (community) {
      setCommunity(_community)
    }
  }, [_community])

  const [isJoined, setIsJoined] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [numberOfPosts, setNumberOfPosts] = useState(0)

  const name = community?.name

  const fetchNumberOfPosts = async () => {
    const result = await getNumberOfPostsInCommunity(community._id)
    setNumberOfPosts(result.numberOfPosts)
  }

  const fetchCommunityInformation = useCallback(async () => {
    try {
      const res = await getCommunityInfoUsingId(community._id)
      if (res.status !== 200) {
        return
      }
      const result = await res.json()
      setCommunity(result)
    } catch (error) {
      console.log(error)
    }
  }, [community?._id])

  useEffect(() => {
    if (community?._id) {
      fetchNumberOfPosts()
    }
  }, [community])

  useEffect(() => {
    if (!user || !community) return
    setIsJoined(!!user?.communities?.includes(community?._id))

    if (user.walletAddress === community.creator) {
      setIsCreator(true)
    }
  }, [user, community])

  // get the community information using it's id
  const getCommunityInformation = async () => {
    try {
      const comm = await getCommunityInfoUsingId(community._id)
      fetchNumberOfPosts()

      setCommunity({ ...comm, numberOfPosts })
    } catch (error) {
      console.log(error)
    }
  }

  const joinCommunity = async () => {
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    try {
      await putJoinCommunity(community._id)
      notifyInfo('Joined 😍')
      await refreshUserInfo()
      await fetchCommunityInformation()
    } catch (error) {
      console.log(error)
    }
  }

  const leaveCommunity = async () => {
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    try {
      await putLeaveCommunity(community._id)
      notifyInfo('Left 😢')
      await refreshUserInfo()
      await fetchCommunityInformation()
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

  // const calculateLevel = (currentXP, levelThreshold) => {
  //   let currentLevel = 0
  //   while (currentXP >= levelThreshold) {
  //     setCurrentLevel((prev) => prev + 1)
  //     currentXP -= levelThreshold
  //     setLevelThreshold((prev) => prev * 1.5) // Increase the threshold for each subsequent level
  //   }
  //   return currentLevel
  // }

  const [currentXP, setCurrentXP] = useState(
    numberOfPosts * 10 + community?.members?.length * 25
  )
  const [levelThreshold, setLevelThreshold] = useState(250)
  const [currentLevel, setCurrentLevel] = useState(0)

  // 1lvl = 250xp
  // 1post = 10xp
  // 1member = 25xp
  const calculateLevelAndThreshold = () => {
    const lvl = Math.floor(currentXP / 250)
    setCurrentLevel(lvl)
    const threshold = 250 * (lvl + 1)
    setLevelThreshold(threshold)
  }

  useEffect(() => {
    calculateLevelAndThreshold(currentXP)
  }, [currentXP])

  useEffect(() => {
    setCurrentXP(numberOfPosts * 10 + community?.members?.length * 25)
  }, [numberOfPosts, community])

  // useEffect(() => {
  //   setCurrentLevel(calculateLevel(currentXP, levelThreshold))
  // }, [levelThreshold])

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
          }`}
        >
          {/* only enable the zoom on the community page not on any other page */}
          {!router.pathname.startsWith('/c') ? (
            <ImgWithZoon
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
            <ImgWithZoon
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
                  <ImgWithZoon
                    className="rounded-full bg-s-bg w-[50px] h-[50px] md:w-[90px] md:h-[90px] object-cover"
                    src={community.logoImageUrl}
                  />
                ) : (
                  <ImgWithZoon
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
            <div className="flex justify-end gap-1 sm:gap-2 pt-2">
              {isCreator && (
                <button
                  className="bg-p-btn rounded-full py-1 px-2 sm:px-4 self-end text-p-btn-text text-sm sm:text-[14px] font-semibold text-p-btn-text"
                  onClick={editCommunity}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-p-btn rounded-full py-1 px-2 sm:px-4 self-end text-p-btn-text text-sm sm:text-[14px] font-semibold text-p-btn-text"
                onClick={isJoined ? leaveCommunity : joinCommunity}
              >
                {isJoined ? 'Leave' : 'Join'}
              </button>
            </div>
          </div>

          {isMobile && (
            <>
              {/* name row */}
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
              {/* description row */}

              {/* level and date */}
              {!router.pathname.startsWith('/explore') && (
                <div className="flex flex-row items-center py-1">
                  {/* level */}
                  <div className="flex flex-row px-5 gap-1 items-center">
                    <img src={'/levelDropIcon.svg'} className="w-4 h-4" />
                    <div className="text-[12px] md:text-[14px] items-center">
                      {`Lvl${currentLevel}`}
                    </div>
                    <div className="flex flex-col w-[100px] items-end">
                      <div className="text-[10px] text-[#bbb]">
                        {currentXP}/{levelThreshold}
                      </div>
                      <div className="relative bg-[#AA96E2] h-[3px] w-full">
                        <div
                          className="absolute h-full bg-[#6668FF] w-[0%]"
                          style={{
                            width: `${calculateBarPercentage(
                              levelThreshold,
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
                <div className="flex flex-col items-center bg-s-h-bg dark:bg-p-bg py-1 px-2 sm:px-4 rounded-[10px]">
                  <span className="font-semibold">{numberOfPosts}</span>
                  <span className="font-light">Posts</span>
                </div>
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

            <BottomDrawerWrapper
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              showClose
              // height="235px"
            >
              <div className="flex flex-col gap-4 mx-4 mb-4">
                <h3 className="font-bold text-[20px] self-center">
                  {community?.name}
                </h3>
                <div className="flex flex-row gap-1 w-full">
                  <div className="flex flex-col w-full">
                    <div className="relative bg-[#D7D7D7] h-[35px] rounded-[10px] flex flex-row">
                      <div className="flex z-10 self-center justify-self-center w-full justify-center text-white dark:text-p-text text-[14px]">
                        Level {currentLevel}
                      </div>
                      <div
                        className="absolute h-full bg-[#9378D8] rounded-[10px] "
                        style={{
                          width: `${calculateBarPercentage(
                            levelThreshold,
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
                  <BsCollection className='className="w-5 h-5"' />
                  <span>Matic transferred: 0</span>
                </div>
                <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#687684]">
                  <img
                    src="/createdByUser.svg"
                    alt="created by user"
                    className="w-5 h-5"
                  />
                  <span>Created by u/0</span>
                </div>
              </div>
            </BottomDrawerWrapper>

            {!isMobile && (
              <div className="flex flex-row flex-wrap gap-2 md:gap-4 text-xs md:text-[16px]">
                {/* stats UI for desktop */}
                <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                  <span>Members: </span>
                  <span className="font-semibold">
                    {community.members?.length}
                  </span>
                </div>
                <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                  <span>Posts: </span>
                  <span className="font-semibold">{numberOfPosts}</span>
                </div>
                {/* <div className="bg-s-h-bg dark:bg-p-bg p-1 px-2 sm:px-4 rounded-full">
                  <span>Matic transferred: </span>
                  <span className="font-semibold">0</span>
                </div> */}
              </div>
            )}

            {/* todo make dynamic from the backend */}

            <div className="flex flex-col gap-1">
              {/* level */}
              {!isMobile && (
                <>
                  {' '}
                  <div className="flex flex-row gap-1 items-center">
                    <div className="text-[12px] md:text-[14px] items-center">
                      {`Lvl${currentLevel}`}
                    </div>
                    <div className="flex flex-col w-full items-end">
                      <div className="text-[10px] text-[#bbb]">{`${currentXP}/${levelThreshold}`}</div>
                      <div className="relative bg-[#AA96E2] h-[3px] w-full">
                        <div
                          className="absolute h-full bg-[#6668FF]"
                          style={{
                            width: `${calculateBarPercentage(
                              levelThreshold,
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
