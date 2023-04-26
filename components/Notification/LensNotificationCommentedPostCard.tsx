import Link from 'next/link'
import React from 'react'
import { NewCommentNotification } from '../../graphql/generated'
import { stringToLength } from '../../utils/utils'
import Markup from '../Lexical/Markup'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { FaRegCommentDots } from 'react-icons/fa'

interface Props {
  notification: NewCommentNotification
  isRead: boolean
}

const LensNotificationCommentedPostCard = ({ notification, isRead }: Props) => {
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
            {notification?.notificationId?.startsWith('commented-post') &&
              ' commented on your '}
            {notification?.notificationId?.startsWith('commented-comment') &&
              ' replied to your '}
          </span>

          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/p/${notification?.comment?.mainPost?.id}`}>
              {notification?.notificationId?.startsWith('commented-post')
                ? 'Post'
                : 'Comment'}
            </Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <div className={`overflow-hidden break-words`}>
          <Markup
            className={`linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
          >
            {stringToLength(notification?.comment?.metadata?.content, 70)}
          </Markup>
        </div>
      )}
      Icon={() => <FaRegCommentDots />}
      isRead={isRead}
      cardLink={`/p/${notification?.comment?.mainPost?.id}`}
    />
  )
}

export default LensNotificationCommentedPostCard
