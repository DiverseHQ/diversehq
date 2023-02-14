import React, { useEffect, useState } from 'react'
import { putJoinCommunity } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

const JoinCommunityButton = ({ id }) => {
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(true)
  const { user, refreshUserInfo } = useProfile()
  const { notifyInfo } = useNotify()
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
  return (
    <>
      {!joined && !loading && (
        <button
          className="text-xs sm:text-base text-p-btn-text bg-p-btn px-2 sm:px-3 py-1 h-fit w-fit rounded-md"
          onClick={(e) => {
            e.stopPropagation()
            handleJoin()
          }}
          disabled={joined}
        >
          Join
        </button>
      )}
      {loading && (
        <button
          className="text-xs sm:text-base text-p-btn-text bg-p-btn px-2 sm:px-3 py-1 h-fit w-fit rounded-full"
          disabled={loading}
        >
          Joining...
        </button>
      )}
      {joined && !loading && <></>}
    </>
  )
}

export default JoinCommunityButton
