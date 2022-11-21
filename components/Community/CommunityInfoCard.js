import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  getCommunityInfo,
  putJoinCommunity,
  putLeaveCommunity
} from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

const CommunityInfoCard = ({ communityInfo, communityName }) => {
  const { user, token, refreshUserInfo } = useProfile()
  const [community, setCommunity] = useState(communityInfo)
  const { notifyInfo } = useNotify()
  const [isJoined, setIsJoined] = useState(false)
  const router = useRouter()

  const name = communityInfo ? communityInfo.name : communityName
  useEffect(() => {
    if (!community && name) {
      fetchCommunityInformation()
    }
  }, [])

  useEffect(() => {
    if (!user || !community) return
    setIsJoined(!!user?.communities?.includes(community._id))
  }, [user, community])

  const fetchCommunityInformation = async () => {
    try {
      const community = await getCommunityInfo(name)
      console.log(community)
      setCommunity(community)
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
      await putJoinCommunity(community._id, token)
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
      await putLeaveCommunity(community._id, token)
      notifyInfo('Left 😢')
      await refreshUserInfo()
      await fetchCommunityInformation()
    } catch (error) {
      console.log(error)
    }
  }

  const redirectToCommunityPage = () => {
    if (!name) return
    router.push(`/c/${name}`)
  }

  return (
    <>
      {community && (
        <div className="relative">
          {/* eslint-disable-next-line */}
        <img className="h-28 w-full object-cover sm:rounded-t-3xl" src={community.bannerImageUrl} />
          <div className="absolute top-20 left-3 sm:left-5 border-s-bg border-4 rounded-full">
            <Image
              width={70}
              height={70}
              className="rounded-full bg-s-bg"
              src={community.logoImageUrl}
            />{' '}
          </div>
          <div className="flex flex-col px-3 sm:px-5 mb-5 pb-6 bg-s-bg sm:rounded-b-3xl">
            <button
              className="bg-p-btn rounded-full text-base sm:text-xl py-1 px-2 self-end my-3"
              onClick={isJoined ? leaveCommunity : joinCommunity}
            >
              {isJoined ? 'Leave' : 'Join'}
            </button>
            <div
              className="font-bold text-xl sm:text-2xl tracking-wider hover:underline cursor-pointer"
              onClick={redirectToCommunityPage}
            >
              {community.name}
            </div>
            <div>{community.description}</div>
            <div>
              <span className="font-bold">{community.members.length}</span>{' '}
              <span className="text-s-text"> members</span>
            </div>
          </div>
        </div>
      )}
      {!community && <div>Loading...</div>}
    </>
  )
}

export default CommunityInfoCard
