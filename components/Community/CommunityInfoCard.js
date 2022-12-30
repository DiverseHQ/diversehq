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
import { dateToSince } from '../../utils/utils'

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

  const name = community?.name

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
      const comm = await getCommunityInfoUsingId(community._id)
      setCommunity(comm)
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
      {community && (
        <div className="relative rounded-3xl shadow-lg z-0">
          {/* eslint-disable-next-line */}
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
      )}
      {!community && <div>Loading...</div>}
    </>
  )
}

export default CommunityInfoCard
