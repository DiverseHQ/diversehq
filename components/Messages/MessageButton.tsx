import React, { FC, useEffect, useState } from 'react'
import { CiMail } from 'react-icons/ci'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import useXmtpClient from './hooks/useXmtpClient'
import buildConversationId from './lib/buildConversationId'
import { buildConversationKey } from './lib/conversationKey'

interface Props {
  userLensProfile: Profile
  className?: string
}

const MessageButton: FC<Props> = ({ userLensProfile, className }) => {
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
        lensProfile.ownedBy !== myLensProfile?.defaultProfile.ownedBy && (
          <div
            className={`p-1.5 rounded-full cursor-pointer hover:bg-s-hover flex flex-row items-center space-x-1 ${className}`}
            onClick={(e) => {
              e.stopPropagation()
              handleDmClick()
            }}
          >
            {!loading && <CiMail className="w-5 h-5" />}
            {loading && <div className="h-5 w-5 border-p-text spinner" />}
          </div>
        )}
    </>
  )
}

export default MessageButton
