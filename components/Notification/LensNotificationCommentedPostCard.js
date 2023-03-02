import Link from 'next/link'
import React from 'react'
import { BiCommentAdd } from 'react-icons/bi'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const LensNotificationCommentedPostCard = ({ notification, isRead }) => {
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
              ' replied to your comment of this '}
          </span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/p/${notification?.comment?.mainPost?.id}`}>Post</Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <div className="text-sm sm:text-base">
          {notification?.comment?.metadata?.content}
        </div>
      )}
      Icon={() => <BiCommentAdd />}
      isRead={isRead}
      cardLink={`/p/${notification?.comment?.mainPost?.id}`}
    />
  )
}

export default LensNotificationCommentedPostCard
