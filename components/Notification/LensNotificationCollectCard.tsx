import Link from 'next/link'
import React from 'react'
import { BsCollectionFill } from 'react-icons/bs'
import { Notification } from '../../graphql/generated'
import { stringToLength } from '../../utils/utils'
import Markup from '../Lexical/Markup'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const LensNotificationCollectCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  if (notification.__typename !== 'NewCollectNotification') return null
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row space-x-2">
          <span onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/u/${formatHandle(
                notification?.wallet.defaultProfile.handle
              )}`}
            >
              <div className="font-bold hover:underline">
                {`u/${formatHandle(
                  notification?.wallet.defaultProfile.handle
                )}`}
              </div>
            </Link>
          </span>
          <span className=""> collected your </span>
          <span className="hover:underline font-bold">
            <Link
              href={
                notification?.collectedPublication?.__typename === 'Comment'
                  ? `/p/${notification?.collectedPublication?.mainPost?.id}`
                  : `/p/${notification?.collectedPublication?.id}`
              }
            >
              <>
                {notification?.notificationId?.startsWith('collected-post-') &&
                  'Post'}
                {notification?.notificationId?.startsWith(
                  'collected-comment-'
                ) && 'Comment'}
              </>
            </Link>
          </span>
        </div>
      )}
      Body={() => (
        <div className={`overflow-hidden break-words`}>
          <Markup
            className={`linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
          >
            {stringToLength(
              notification?.collectedPublication?.metadata?.content,
              70
            )}
          </Markup>
        </div>
      )}
      createdAt={notification.createdAt}
      Icon={() => <BsCollectionFill />}
      isRead={isRead}
      cardLink={
        notification?.collectedPublication?.__typename === 'Comment'
          ? `/p/${notification?.collectedPublication?.mainPost?.id}`
          : `/p/${notification?.collectedPublication?.id}`
      }
    />
  )
}

export default LensNotificationCollectCard
