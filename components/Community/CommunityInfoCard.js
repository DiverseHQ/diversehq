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

const CommunityInfoCard = ({
  community,
  setCommunity,
  fetchCommunityInformation
}) => {
  const { user, refreshUserInfo } = useProfile()
  const { notifyInfo } = useNotify()
  const { showModal } = usePopUpModal()
  const router = useRouter()

  const [isJoined, setIsJoined] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  const [numberOfPosts, setNumberOfPosts] = useState(0)

  const name = community?.name

  const fetchNumberOfPosts = async () => {
    const result = await getNumberOfPostsInCommunity(community._id)
    setNumberOfPosts(result.numberOfPosts)
  }

  useEffect(() => {
    if (community._id) {
      fetchNumberOfPosts()
    }
  }, [community])

  useEffect(() => {
    if (!user || !community) return
    setIsJoined(!!user?.communities?.includes(community._id))

    if (user.walletAddress === community.creator) {
      setIsCreator(true)
    }
  }, [user, community])

  // get the community information using it's id
  const getCommunityInformation = async () => {
    try {
      console.log('community._id', community._id)
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
    console.log(community)
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

  return (
    <>
      {community && (
        <div className="relative shadow-lg z-0 bg-[#FFFFFF] mb-6">
          <img
            className="h-20 sm:h-28 w-full object-cover"
            src={community.bannerImageUrl}
          />
          <div className="relative flex flex-row items-start justify-between px-2 mb-[-10px] md:px-8">
            <div className="flex flex-row gap-2">
              <div className="shrink-0 border-s-bg border-4 rounded-full sm:-translate-y-8 -translate-y-6">
                <img
                  className="rounded-full bg-s-bg w-[50px] h-[50px] md:w-[90px] md:h-[90px]"
                  src={community.logoImageUrl}
                />
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
                  className="bg-p-btn rounded-full py-1 px-2 sm:px-4 self-end text-s-text text-sm sm:text-[14px] font-semibold text-p-btn-text"
                  onClick={editCommunity}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-p-btn rounded-full py-1 px-2 sm:px-4 self-end text-s-text text-sm sm:text-[14px] font-semibold text-p-btn-text"
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
                <div className="text-[14px] md:text-[16px]">
                  {community.description}
                </div>
              </div>
              {/* description row */}

              {/* level and date */}
              <div className="flex flex-row items-center py-1">
                {/* level */}
                <div className="flex flex-row px-5 gap-1 items-center">
                  <img src={'/levelDropIcon.svg'} className="w-4 h-4" />
                  <div className="text-[12px] md:text-[14px] items-center">
                    Lvl0
                  </div>
                  <div className="flex flex-col w-[100px] items-end">
                    <div className="text-[10px] text-[#bbb]">0/0</div>
                    <div className="relative bg-[#AA96E2] h-[3px] w-full">
                      <div className="absolute h-full bg-[#6668FF] w-[0%]"></div>
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
            </>
          )}

          <div className="flex flex-row justify-between items-center px-5 py-1 md:px-8 pb-2">
            {/* stats */}
            <div className="flex flex-row flex-wrap gap-2 md:gap-4 text-xs md:text-[16px]">
              <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                <span>Members: </span>
                <span className="font-semibold">
                  {community.members?.length}
                </span>
              </div>
              <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                <span>Posts: </span>
                <span className="font-semibold">{numberOfPosts}</span>
              </div>
              <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                <span>Matic transferred: </span>
                <span className="font-semibold">0</span>
              </div>
            </div>

            {/* todo make dynamic from the backend */}

            <div className="flex flex-col gap-1">
              {/* level */}
              {!isMobile && (
                <>
                  {' '}
                  <div className="flex flex-row gap-1 items-center">
                    <div className="text-[12px] md:text-[14px] items-center">
                      Lvl0
                    </div>
                    <div className="flex flex-col w-full items-end">
                      <div className="text-[10px] text-[#bbb]">0/0</div>
                      <div className="relative bg-[#AA96E2] h-[3px] w-full">
                        <div className="absolute h-full bg-[#6668FF] w-[0%]"></div>
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
