import { DecodedMessage } from '@xmtp/xmtp-js'
// import dayjs from 'dayjs'
import React, { FC } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import { stringToLength } from '../../utils/utils'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'

interface Props {
  profile: Profile
  message: DecodedMessage
  conversationKey: string
  isSelected?: boolean
}

const Preview: FC<Props> = ({ profile, message, conversationKey }) => {
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
      className="cursor-pointer hover:bg-s-hover p-3 flex flex-row justify-between"
      onClick={() => onConversationSelected(profile.id)}
    >
      <div className="flex flex-row items-center space-x-2">
        <ImageWithPulsingLoader
          src={getAvatar(profile)}
          className="w-12 h-12 rounded-full object-cover"
          alt={profile?.handle}
        />
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-center space-x-2">
            {profile?.metadata?.displayName && (
              <span>{profile?.metadata?.displayName}</span>
            )}
            <span
              className={`${
                profile?.metadata?.displayName ? 'text-sm text-s-text' : ''
              }`}
            >
              {profile?.handle && `u/${formatHandle(profile?.handle)}`}
            </span>
          </div>
          <div className="text-s-text">
            {address.address === message.senderAddress && 'You: '}{' '}
            {stringToLength(message.content, 30)}
          </div>
        </div>
      </div>
      <div className="text-s-text text-xs shrink-0">
        {/** day js time go in format of 3M, 3H, 3D */}
        {/** dayjs with date and local time */}
        {/* {dayjs(message.sent).format('DD/MM/YYYY hh:mm A')} */}
        <ReactTimeAgo timeStyle="twitter" date={message.sent} locale="en-US" />
      </div>
    </div>
  )
}

export default Preview
