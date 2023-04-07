import React, { useEffect, useState } from 'react'
import { useProfile } from '../../Common/WalletContext'
import { useNotify } from '../../Common/NotifyContext'
import { useDevice } from '../../Common/DeviceWrapper'
import { useRouter } from 'next/router'
import { putJoinCommunity, putLeaveCommunity } from '../../../api/community'

const useJoinCommunityButton = ({
  id,
  showJoined = false
}: {
  id: string
  showJoined?: boolean
}): {
  joined: boolean
  // eslint-disable-next-line
  JoinCommunityButton: (props: any) => JSX.Element
} => {
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
      const res = await putJoinCommunity(id)
      if (res.status === 200) {
        setJoined(true)
      } else if (res.status === 400) {
        const resData = await res.json()
        notifyInfo(resData.msg)
        setLoading(false)
        return
      }
      refreshUserInfo()
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
      refreshUserInfo()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const JoinCommunityButton = () => (
    <>
      {!joined && !loading && (
        <>
          {showJoined ? (
            <button
              className={`text-xs sm:text-base text-p-btn-text bg-p-btn px-2 sm:px-3 py-0.5 rounded-md border-[1px] border-p-btn ${
                router.pathname.startsWith('/p') && !isMobile
                  ? 'w-full'
                  : 'w-[75px]'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                handleJoin()
              }}
              disabled={joined}
            >
              Join
            </button>
          ) : (
            <button
              className={`text-xs sm:text-base text-p-btn hover:bg-p-btn hover:text-p-btn-text px-2 sm:px-3 py-0.5 rounded-md border-[1px] border-p-btn ${
                router.pathname.startsWith('/p') && !isMobile
                  ? 'w-full'
                  : 'w-[75px]'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                handleJoin()
              }}
              disabled={joined}
            >
              Join
            </button>
          )}
        </>
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
            isMobile ? 'w-[65px] py-1' : 'py-0.5'
          }`}
          disabled={loading}
        >
          {joined ? 'Leaving...' : 'Joining...'}
        </button>
      )}
    </>
  )

  return {
    JoinCommunityButton,
    joined
  }
}

export default useJoinCommunityButton
