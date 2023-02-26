import Link from 'next/link'
import React from 'react'
import { ImArrowUp } from 'react-icons/im'
import { stringToLength } from '../../utils/utils'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationCommentUpvote = ({ notification }) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span className="hover:underline font-bold">
            <Link href={`/u/${notification?.sender?.walletAddress}`}>
              <>
                {notification?.sender?.name
                  ? `u/${notification?.sender?.name}`
                  : `u/${stringToLength(
                      notification?.sender?.walletAddress,
                      10
                    )}`}
              </>
            </Link>
          </span>
          <span>{' upvoted your comment of '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/p/${notification?.comment?.postId}`}>Post</Link>
          </span>
        </div>
      )}
      Body={() => (
        <div className="text-sm sm:text-base">
          {notification?.comment?.content}
        </div>
      )}
      createdAt={notification?.createdAt}
      Icon={() => <ImArrowUp />}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationCommentUpvote
