import { DecodedMessage } from '@xmtp/xmtp-js'
import React, { FC } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getAvatar from '../User/lib/getAvatar'

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
    <div
      className="cursor-pointer hover:bg-p-hover p-3 flex flex-row justify-between border-b border-grey-200"
      onClick={() => onConversationSelected(profile.id)}
    >
      <div className="flex flex-row items-center space-x-2">
        <ImageWithPulsingLoader
          src={getAvatar(profile)}
          className="w-12 h-12 rounded-full"
          alt={profile?.handle}
        />
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-center">
            {profile?.name} {profile?.handle && `u/${profile?.handle}`}
          </div>
          <div className="text-s-text">
            {address === message.senderAddress && 'You: '} {message.content}
          </div>
        </div>
      </div>
      <div className="text-s-text">
        <ReactTimeAgo date={message.sent} locale="en-US" />
      </div>
    </div>
  )
}

export default Preview
