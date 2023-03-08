import Link from 'next/link'
import React from 'react'
import { MdOutlineAddModerator } from 'react-icons/md'
import { CommunityNotificationType } from '../../types/notification'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationModeratorAssignedCard = ({
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
          <span>{' has given you mod role for '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/c/${notification?.community?.name}`}>
              <span>c/{notification?.community?.name}</span>
            </Link>
          </span>
        </div>
      )}
      Body={() => <></>}
      Icon={() => <MdOutlineAddModerator />}
      cardLink={`/c/${notification?.community?.name}`}
      createdAt={notification?.createdAt}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationModeratorAssignedCard
