import React, { useState, useCallback } from 'react'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import Composer from './Composer'
import useGetConversation from './hooks/useGetConversation'
import useGetMessages from './hooks/useGetMessages'
import useSendMessage from './hooks/useSendMessage'
import useStreamMessages from './hooks/useStreamMessages'
import MessagesList from './MessagesList'
import PreviewList from './PreviewList'

const AllConversations = () => {
  const { data: lensProfile } = useLensUserContext()
  const currentProfile = lensProfile?.defaultProfile
  const conversationKey = useMessageStore((state) => state.conversationKey)
  const profile = useMessageStore((state) =>
    state.messageProfiles.get(conversationKey)
  )
  const { selectedConversation, missingXmtpAuth } = useGetConversation(
    conversationKey,
    profile
  )
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map())
  const { messages, hasMore } = useGetMessages(
    conversationKey,
    selectedConversation,
    endTime.get(conversationKey)
  )
  useStreamMessages(conversationKey, selectedConversation)
  const { sendMessage } = useSendMessage(selectedConversation)

  const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent
      const currentEndTime = endTime.get(conversationKey)
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationKey, lastMsgDate)
        setEndTime(new Map(endTime))
      }
    }
  }, [conversationKey, hasMore, messages, endTime])

  if (!currentProfile) {
    return <></>
  }

  const showLoading =
    !missingXmtpAuth && (!profile || !currentProfile || !selectedConversation)

  const userNameForTitle = profile?.name ?? profile?.handle
  const title = userNameForTitle
  return (
    <div className="flex flex-col h-full w-full">
      {/* conversations preview */}
      {!profile && <PreviewList selectedConversationKey={conversationKey} />}

      {/* selected profile messages */}
      {profile && (
        <div className="w-full h-[500px]">
          <MessagesList
            profile={profile}
            fetchNextMessages={fetchNextMessages}
            messages={messages ?? []}
            currentProfile={currentProfile}
            hasMore={hasMore}
            missingXmtpAuth={missingXmtpAuth ?? false}
          />
          {/* composer */}
          <Composer
            sendMessage={sendMessage}
            conversationKey={conversationKey}
            disabledInput={missingXmtpAuth ?? false}
          />
        </div>
      )}
    </div>
  )
}

export default AllConversations
