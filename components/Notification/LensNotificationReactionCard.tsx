import React from 'react'
import Link from 'next/link'
import Markup from '../Lexical/Markup'
import { stringToLength } from '../../utils/utils'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { NewReactionNotification } from '../../graphql/generated'
import formatHandle from '../User/lib/formatHandle'
import { BiDownvote, BiUpvote } from 'react-icons/bi'
type Props = {
  notification: NewReactionNotification
  isRead: boolean
}

const LensNotificationReactionCard = ({ notification, isRead }: Props) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/u/${formatHandle(notification?.profile?.handle)}`}>
              <span>u/{formatHandle(notification?.profile?.handle)}</span>
            </Link>
          </span>
          <span>
            {notification?.reaction === 'UPVOTE' && ' upvoted your '}
            {notification?.reaction === 'DOWNVOTE' && ' downvoted your '}
          </span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            {notification.notificationId.startsWith('reaction-post') && (
              <Link href={`/p/${notification?.publication?.id}`}>Post</Link>
            )}
            {notification.notificationId.startsWith('reaction_comment') && (
              /** @ts-ignore */
              <Link href={`/p/${notification?.publication?.mainPost?.id}`}>
                Comment
              </Link>
            )}
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <div className={`overflow-hidden break-words`}>
          <Markup
            className={`linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
          >
            {stringToLength(notification?.publication?.metadata?.content, 70)}
          </Markup>
        </div>
      )}
      Icon={() =>
        notification?.reaction === 'UPVOTE' ? <BiUpvote /> : <BiDownvote />
      }
      isRead={isRead}
      cardLink={
        notification.notificationId.startsWith('reaction-post')
          ? `/p/${notification?.publication?.id}`
          : /** @ts-ignore */
            `/p/${notification?.publication?.mainPost?.id}`
      }
    />
  )
}

export default LensNotificationReactionCard
