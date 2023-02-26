import type { DecodedMessage } from '@xmtp/xmtp-js'
import React, { FC } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Profile } from '../../graphql/generated'
import dayjs from 'dayjs'
// import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import Markup from '../Lexical/Markup'

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return dayjs(d1).format('YYYYMMDD') === dayjs(d2).format('YYYYMMDD')
}

const formatDate = (d?: Date) => dayjs(d).format('MMMM D, YYYY')

interface MessageTileProps {
  message: DecodedMessage
  profile?: Profile
  currentProfile?: Profile | null
}

const MessageTile: FC<MessageTileProps> = ({ message, currentProfile }) => {
  const address = currentProfile?.ownedBy
  const isSender = address.toLowerCase() === message.senderAddress.toLowerCase()
  return (
    <div
      className={`flex flex-row w-full px-2 py-1 ${
        isSender
          ? ' justify-end text-[#ffffff]'
          : 'text-[#000000] justify-start'
      } `}
    >
      <div className="flex flex-col space-y-0.5">
        <div
          className={`px-4 py-2 max-w-[370px] rounded-2xl break-words ${
            isSender ? ' bg-p-btn rounded-br-sm' : 'bg-p-hover rounded-bl-sm'
          }`}
        >
          <span>
            {message.error
              ? `Error: ${message.error?.message}`
              : <Markup matchOnlyUrl>{message.content}</Markup> ?? ''}
          </span>
        </div>

        {/* time with format eg, 12:00 AM */}
        <div
          className={`text-s-text text-[10px] px-1 ${
            isSender ? 'self-end' : 'self-start'
          }`}
        >
          {dayjs(message.sent).format('h:mm A')}
        </div>
      </div>
    </div>
  )
}

interface MessageListProps {
  messages: DecodedMessage[]
  fetchNextMessages: () => void
  profile?: Profile
  currentProfile?: Profile | null | any
  hasMore: boolean
  missingXmtpAuth: boolean
}

const MessagesList: FC<MessageListProps> = ({
  messages,
  fetchNextMessages,
  profile,
  currentProfile,
  hasMore,
  missingXmtpAuth
}) => {
  let lastMessageDate: Date | undefined
  React.useEffect(() => {
    const scrollableDiv = document.getElementById('scrollableDiv')
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight
    }
  }, [messages])
  return (
    <div
      id="scrollableDiv"
      className="h-full  sm:pb-[0px] pb-[120px] sm:max-h-[440px]  overflow-y-auto"
    >
      <div className="w-full px-7 text-center my-6">
        {missingXmtpAuth &&
          `The person you are trying to chat with hasn't enabled dms yet, tell them to do so!`}
      </div>
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchNextMessages}
        className="flex flex-col-reverse"
        inverse
        endMessage={
          <>
            {!missingXmtpAuth && (
              <div className="w-full text-center mb-4">
                Start of an amazing Conversation
              </div>
            )}
          </>
        }
        hasMore={hasMore}
        loader={<div>loading...</div>}
        scrollableTarget="scrollableDiv"
      >
        {messages?.map((msg: DecodedMessage, index) => {
          const dateHasChanged = lastMessageDate
            ? !isOnSameDay(lastMessageDate, msg.sent)
            : false
          const messageDiv = (
            <div key={`${msg.id}_${index}`}>
              {index === messages.length - 1 && (
                <div className="w-full text-sm flex flex-row justify-center my-2">
                  <div className="py-0.5 px-3 bg-p-bg rounded-md">
                    {formatDate(msg.sent)}
                  </div>
                </div>
              )}
              <MessageTile
                currentProfile={currentProfile}
                profile={profile}
                message={msg}
              />
              {dateHasChanged ? (
                <div className="w-full text-sm flex flex-row justify-center my-2">
                  <div className="py-0.5 px-3 bg-p-bg rounded-md">
                    {formatDate(lastMessageDate)}
                  </div>
                </div>
              ) : null}
            </div>
          )
          lastMessageDate = msg.sent
          return messageDiv
        })}
      </InfiniteScroll>
    </div>
  )
}

export default MessagesList
