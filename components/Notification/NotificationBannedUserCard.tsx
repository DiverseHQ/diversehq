import Link from 'next/link'
import React from 'react'
import { IoBanSharp } from 'react-icons/io5'
import { CommunityNotificationType } from '../../types/notification'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationBannedUserCard = ({
  notification
}: {
  notification: CommunityNotificationType
}) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span>A mod</span>
          <span>{' has banned you from '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/c/${notification?.community?.name}`}>
              <span>c/{notification?.community?.name}</span>
            </Link>
          </span>
        </div>
      )}
      Body={() => (
        <div>
          <span>Reason for ban: {notification?.extraInfo}</span>
        </div>
      )}
      Icon={() => <IoBanSharp />}
      cardLink={`/c/${notification?.community?.name}`}
      createdAt={notification?.createdAt}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationBannedUserCard
