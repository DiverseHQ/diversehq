import { DecodedMessage } from '@xmtp/xmtp-js'
import React, { FC } from 'react'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'

interface Props {
  profile: Profile
  message: DecodedMessage
  conversationKey: string
  isSelected: boolean
}

const Preview: FC<Props> = ({
  profile,
  message,
  conversationKey,
  isSelected
}) => {
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  )
  const { data: lensProfile } = useLensUserContext()
  const currentProfile = lensProfile?.defaultProfile
  const address = currentProfile?.ownedBy
  const onConversationSelected = (profileId: string) => {
    if (profileId) {
      setConversationKey(conversationKey)
    } else {
      setConversationKey('')
    }
  }
  return (
    <div onClick={() => onConversationSelected(profile.id)}>
      {isSelected && <div>Selected </div>}
      <div>{/* todo profile picture */}</div>
      <span>
        {address === message.senderAddress && 'You: '} {message.content}
      </span>
    </div>
  )
}

export default Preview
