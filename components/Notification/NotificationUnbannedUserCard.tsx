import Link from 'next/link'
import React from 'react'
import { CommunityNotificationType } from '../../types/notification'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

import { RxLinkBreak2 } from 'react-icons/rx'

const NotificationUnbannedUserCard = ({
  notification
}: {
  notification: CommunityNotificationType
}) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span>A mod</span>
          <span>{' has removed ban on you for '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/c/${notification?.community?.name}`}>
              <span>c/{notification?.community?.name}</span>
            </Link>
          </span>
        </div>
      )}
      Body={() => (
        <div>
          {"Don't do the same thing again. And be nice to the community."}
        </div>
      )}
      Icon={() => <RxLinkBreak2 />}
      cardLink={`/c/${notification?.community?.name}`}
      createdAt={notification?.createdAt}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationUnbannedUserCard
