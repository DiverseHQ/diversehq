import Link from 'next/link'
import React from 'react'
import { BiCommentAdd } from 'react-icons/bi'
import { stringToLength } from '../../utils/utils'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationCommentedPostCard = ({ notification }) => {
  return (
    <>
      <CommonNotificationCardLayoutUI
        MainRow={() => (
          <div>
            <span className="hover:underline font-bold">
              <Link href={`/u/${notification?.sender?.walletAddress}`}>
                {notification?.sender?.name
                  ? `u/${notification?.sender?.name}`
                  : `u/${stringToLength(
                      notification?.sender?.walletAddress,
                      10
                    )}`}
              </Link>
            </span>
            <span>{' commented on your '}</span>
            <span className="hover:underline font-bold">
              <Link href={`/p/${notification?.comment?.postId}`}>Post</Link>
            </span>
          </div>
        )}
        createdAt={notification?.createdAt}
        Body={() => (
          <div className="text-sm sm:text-base">
            {notification?.comment?.content}
          </div>
        )}
        Icon={() => <BiCommentAdd />}
      />
    </>
  )
}

export default NotificationCommentedPostCard
