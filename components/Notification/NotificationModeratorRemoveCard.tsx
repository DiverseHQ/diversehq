import Link from 'next/link'
import React from 'react'
import { MdOutlineRemoveModerator } from 'react-icons/md'
import { CommunityNotificationType } from '../../types/notification'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationModeratorRemoveCard = ({
  notification
}: {
  notification: CommunityNotificationType
}) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span className="hover:underline font-bold">
            <Link
              href={`/u/${formatHandle(
                notification?.senderLensProfile?.handle
              )}`}
            >
              <span>
                u/{formatHandle(notification?.senderLensProfile?.handle)}
              </span>
            </Link>
          </span>
          <span>{' has removed you from mods of '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/c/${notification?.community?.name}`}>
              <span>c/{notification?.community?.name}</span>
            </Link>
          </span>
        </div>
      )}
      Body={() => <></>}
      Icon={() => <MdOutlineRemoveModerator />}
      cardLink={`/c/${notification?.community?.name}`}
      createdAt={notification?.createdAt}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationModeratorRemoveCard
