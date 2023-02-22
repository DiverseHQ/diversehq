import React, { FC } from 'react'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import useMessagePreviews from './hooks/useMessagePreviews'
import buildConversationId from './lib/buildConversationId'
import { buildConversationKey } from './lib/conversationKey'
import Preview from './Preview'
import Search from './Search'

interface Props {
  className?: string
  selectedConversationKey: string
}

const PreviewList: FC<Props> = ({ className, selectedConversationKey }) => {
  const { data: lensProfile } = useLensUserContext()
  const addProfile = useMessageStore((state) => state.addProfile)
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  )
  const currentProfile = lensProfile?.defaultProfile
  const { authenticating, loading, messages, profilesToShow, profilesError } =
    useMessagePreviews()
  const sortedProfiles = Array.from(profilesToShow).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA)
    const messageB = messages.get(keyB)
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0)
      ? -1
      : 1
  })
  const showAuthenticating = currentProfile && authenticating
  const showLoading =
    loading && (messages.size === 0 || profilesToShow.size === 0)

  const onProfileSelected = (profile: Profile) => {
    const conversationId = buildConversationId(currentProfile?.id, profile.id)
    const conversationKey = buildConversationKey(
      profile.ownedBy,
      conversationId
    )
    addProfile(conversationKey, profile)
    setConversationKey(conversationKey)
  }

  return (
    <div className={`flex flex-col  h-full ${className}`}>
      {/* todo search profile and message */}
      <Search
        placeholder="Search someone to chat with..."
        onProfileSelected={onProfileSelected}
      />
      {/* profiles and preview message */}
      {showAuthenticating && (
        <div className="flex w-full h-full justify-center item-center">
          Authenticating...
        </div>
      )}
      {showLoading && (
        <div className="flex w-full h-full justify-center item-center">
          Loading...
        </div>
      )}
      {profilesError && (
        <div className="flex w-full h-full justify-center item-center">
          Error loading messages
        </div>
      )}
      {!showAuthenticating && !showLoading && !profilesError && (
        <div className="flex flex-col h-full sm:h-[450px] overflow-y-auto">
          {sortedProfiles?.map(([key, profile]) => {
            const message = messages.get(key)
            if (!message) {
              return null
            }

            return (
              <Preview
                isSelected={key === selectedConversationKey}
                key={key}
                profile={profile}
                conversationKey={key}
                message={message}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PreviewList
