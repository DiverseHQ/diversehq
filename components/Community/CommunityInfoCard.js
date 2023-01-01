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

  return (
    <>
      {/* {community && (
        <div className="relative rounded-3xl shadow-lg z-0">
          <img
            className="h-28 w-full object-cover sm:rounded-t-3xl"
            src={community.bannerImageUrl}
          />
          <div className="absolute top-20 left-3 sm:left-5 border-s-bg border-4 rounded-full">
            <img
              className="rounded-full bg-s-bg w-[70px] h-[70px]"
              src={community.logoImageUrl}
            />
          </div>
          <div className="flex flex-col px-3 sm:px-5 mb-5 pb-6 bg-s-bg sm:rounded-b-3xl">
            <div className="flex justify-end gap-2 sm:gap-4">
              {isCreator && (
                <button
                  className="bg-p-btn rounded-full text-base sm:text-xl py-1 px-2 self-end my-3"
                  onClick={editCommunity}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-p-btn rounded-full text-base sm:text-xl py-1 px-2 self-end my-3"
                onClick={isJoined ? leaveCommunity : joinCommunity}
              >
                {isJoined ? 'Leave' : 'Join'}
              </button>
            </div>
            <div
              className="font-bold text-xl sm:text-2xl tracking-wider hover:underline cursor-pointer"
              onClick={redirectToCommunityPage}
            >
              {community.name}
            </div>
            <div>{community.description}</div>
            <div>
              <span className="font-bold">{community.members?.length}</span>{' '}
              <span className="text-s-text"> members</span>
            </div>
            <div>
              Vibing since{' '}
              <span className="font-bold">
                {dateToSince(community.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )} */}
      {community && (
        <div className="relative shadow-lg z-0 bg-[#FFFFFF] mb-8">
          <img
            className="h-28 w-full object-cover"
            src={community.bannerImageUrl}
          />
          <div className="relative flex flex-row items-start justify-between px-2 md:px-8 pt-2">
            <div className="flex flex-row gap-2">
              <div className="shrink-0 border-s-bg border-4 rounded-full -translate-y-8">
                <img
                  className="rounded-full bg-s-bg w-[50px] h-[50px] md:w-[90px] md:h-[90px]"
                  src={community.logoImageUrl}
                />
              </div>
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
            </div>
            <div className="flex justify-end gap-1 sm:gap-2">
              {isCreator && (
                <button
                  className="bg-p-btn rounded-full py-1 px-4 self-end text-s-text text-[14px] font-semibold"
                  onClick={editCommunity}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-p-btn rounded-full py-1 px-4 self-end text-s-text text-[14px] font-semibold"
                onClick={isJoined ? leaveCommunity : joinCommunity}
              >
                {isJoined ? 'Leave' : 'Join'}
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center px-4 md:px-8 pb-2">
            <div className="flex flex-row gap-2 md:gap-4 text-[14px] md:text-[16px]">
              <div>
                <span>Members: </span>
                <span className="font-semibold">
                  {community.members?.length}
                </span>
              </div>
              <div>
                <span>Posts: </span>
                <span className="font-semibold">{numberOfPosts}</span>
              </div>
              <div>
                <span>Matic transferred: </span>
                <span className="font-semibold">0</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-0.5 items-center">
                <span className="text-[12px] md:text-[14px] items-center">
                  Lvl2
                </span>
                <div className="flex flex-col w-full items-end">
                  <div className="text-[10px] text-[#bbb]">300/500</div>
                  <div className="relative bg-[#AA96E2] h-[3px] w-full">
                    <div className="absolute h-full bg-[#6668FF] w-[60%]"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-0.5 items-center text-[12px] md:text-[14px] text-[#aaa]">
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
          </div>
        </div>
      )}
      {!community && <div>Loading...</div>}
    </>
  )
}

export default CommunityInfoCard
