import React, { useEffect, useState } from 'react'
import { putJoinCommunity } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

const JoinCommunityButton = ({ id }) => {
  const [joined, setJoined] = useState(false)
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
      await putJoinCommunity(id)
      await refreshUserInfo()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      {!joined && (
        <button
          className="text-xs sm:text-base text-p-btn-text bg-p-btn px-3 py-1 h-fit w-fit rounded-full"
          onClick={handleJoin}
          disabled={joined}
        >
          Join
        </button>
      )}
      {joined && <></>}
    </>
  )
}

export default JoinCommunityButton
