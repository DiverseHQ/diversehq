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

interface MessageTileProps {
  message: DecodedMessage
  profile?: Profile
  currentProfile?: Profile | null
}

const MessageTile: FC<MessageTileProps> = ({
  message,
  profile,
  currentProfile
}) => {
  const address = currentProfile?.ownedBy

  return (
    <div>
      <div className="flex max-w-[60%]">
        {/* todo profile picture */}
        {/* {address !== message.senderAddress && ( */}
        {/* //   <img
        //     src={
        //       profile?.picture?.__typename === 'MediaSet'
        //         ? profile?.picture?.original?.url
        //         : ''
        //     }
        //     className="h-10 w-10 bg-gray-200 rounded-full border dark:border-gray-700 mr-2"
        //     alt={profile?.handle}
        //   />
        //   <ImageWithPulsingLoader
        //                       src={`${LensInfuraEndpoint}${
        //                         postInfo?.metadata?.media[0]?.original.url.split(
        //                           '//'
        //                         )[1]
        //                       }`}
        //                       className={`image-unselectable object-contain sm:rounded-lg w-full ${
        //                         router.pathname.startsWith('/p')
        //                           ? ''
        //                           : 'max-h-[450px]'
        //                       }`}
        //                     />
        // )} */}
        <div>
          <span>
            {message.error
              ? `Error: ${message.error?.message}`
              : <Markup matchOnlyUrl>{message.content}</Markup> ?? ''}
          </span>
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
  return (
    <div className="flex flex-col">
      <div>{missingXmtpAuth && 'Missing XMTP Auth'}</div>
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchNextMessages}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden"
        inverse
        endMessage={<div>Start of a journey</div>}
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
              <MessageTile
                currentProfile={currentProfile}
                profile={profile}
                message={msg}
              />
              {dateHasChanged ? <div>--- Dividier for date ---</div> : null}
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
