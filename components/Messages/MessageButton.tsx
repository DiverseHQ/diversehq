import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CiMail } from 'react-icons/ci'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import useLensFollowButton from '../User/useLensFollowButton'
import useXmtpClient from './hooks/useXmtpClient'
import buildConversationId from './lib/buildConversationId'
import { buildConversationKey } from './lib/conversationKey'

const MessageButton = ({ userLensProfile }) => {
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()
  const [lensProfile, setLensProfile] = useState(null)

  useEffect(() => {
    setLensProfile(userLensProfile)
  }, [userLensProfile])

  const { client, initXmtpClient, loading } = useXmtpClient()
  const setMessageProfiles = useMessageStore(
    (state) => state.setMessageProfiles
  )
  const messageProfiles = useMessageStore((state) => state.messageProfiles)
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  )
  const setIsOpen = useMessageStore((state) => state.setIsOpen)

  const { isFollowedByMe } = useLensFollowButton({
    profileId: lensProfile?.id
  })

  const handleDmClick = async () => {
    if (!client) {
      await initXmtpClient()
    }
    const newMessagesProfile = new Map(messageProfiles)
    const peerAddress = lensProfile?.ownedBy
    const key = buildConversationKey(
      peerAddress,
      buildConversationId(myLensProfile?.defaultProfile?.id, lensProfile.id)
    )
    newMessagesProfile.set(key, lensProfile)
    setMessageProfiles(newMessagesProfile)
    setConversationKey(key)
    setIsOpen(true)
  }

  return (
    <>
      {lensProfile &&
        isSignedIn &&
        hasProfile &&
        lensProfile.ownedBy !== myLensProfile?.defaultProfile.ownedBy &&
        isFollowedByMe && (
          <div
            className="p-1.5 rounded-full cursor-pointer hover:bg-p-btn-hover flex flex-row items-center space-x-1"
            onClick={handleDmClick}
          >
            {!loading && <CiMail className="w-6 h-6" />}
            {loading && <CircularProgress size="18px" color="primary" />}
          </div>
        )}
    </>
  )
}

export default MessageButton
