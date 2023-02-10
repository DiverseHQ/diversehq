import React, { FC } from 'react'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import useMessagePreviews from './hooks/useMessagePreviews'
import buildConversationId from './lib/buildConversationId'
import { buildConversationKey } from './lib/conversationKey'
import Preview from './Preview'

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
    <div className="flex flex-col">
      {/* todo search profile and message */}
      <div>search</div>
      {/* profiles and preview message */}
      {showAuthenticating && <div>authenticating</div>}
      {showLoading && <div>loading</div>}
      {profilesError && <div>profilesError</div>}
      <div>
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
    </div>
  )
}

export default PreviewList
