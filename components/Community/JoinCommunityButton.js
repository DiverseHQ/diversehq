import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { putJoinCommunity, putLeaveCommunity } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import useDevice from '../Common/useDevice'
import { useProfile } from '../Common/WalletContext'

const JoinCommunityButton = ({ id, showJoined = false }) => {
  const [loading, setLoading] = useState(false)
  // const [leavingLoading, setLoading] = us
  const [joined, setJoined] = useState(false)
  const { user, refreshUserInfo } = useProfile()
  const { notifyInfo } = useNotify()
  const { isMobile } = useDevice()
  const router = useRouter()

  useEffect(() => {
    if (!user || !id) return
    setJoined(user.communities.includes(id))
  }, [user, id])

  const handleJoin = async () => {
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    try {
      setLoading(true)
      await putJoinCommunity(id)
      await refreshUserInfo()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    try {
      setLoading(true)
      await putLeaveCommunity(id)
      notifyInfo('Left 😢')
      await refreshUserInfo()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!joined && !loading && (
        <button
          className={`text-xs sm:text-base text-p-btn-text bg-p-btn px-2 sm:px-3 rounded-md border-[1px] border-p-btn ${
            router.pathname.startsWith('/p') && !isMobile
              ? 'w-full'
              : 'w-[75px]'
          } ${isMobile ? 'w-[65px] py-1' : 'py-0.5'}`}
          onClick={(e) => {
            e.stopPropagation()
            handleJoin()
          }}
          disabled={joined}
        >
          Join
        </button>
      )}
      {joined && !loading && showJoined && (
        <button
          className={`text-xs sm:text-base px-2 sm:px-3 rounded-md ${
            router.pathname.startsWith('/p') && !isMobile
              ? 'w-full'
              : 'w-[75px]'
          } ${
            isMobile ? 'w-[65px] py-1' : 'py-0.5'
          } duration-600 bg-s-bg text-p-btn hover:bg-p-btn hover:text-p-btn-text hover:border-bg-p-btn border-[1px] border-p-btn group/text transition-all ease-in-out duration-300`}
          onClick={(e) => {
            e.stopPropagation()
            handleLeave()
          }}
        >
          <span className="group-hover/text:hidden">Joined</span>
          <span className="hidden group-hover/text:block">Leave</span>
        </button>
      )}
      {loading && (
        <button
          className={`text-xs sm:text-base text-p-btn-text bg-p-btn px-2 sm:px-3 py-0.5 rounded-md border-[1px] border-p-btn ${
            router.pathname.startsWith('/p') && !isMobile
              ? 'w-full'
              : 'w-[75px]'
          } ${isMobile ? 'w-[65px] py-1' : 'py-0.5'}`}
          disabled={loading}
        >
          {joined ? 'Leaving...' : 'Joining...'}
        </button>
      )}
    </>
  )
}

export default JoinCommunityButton
