import Link from 'next/link'
import React from 'react'
import { IoBanSharp } from 'react-icons/io5'
import { NotificationSchema } from '../../types/notification'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationBannedUserLensCommunityCard = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span>{'You have been banned from '}</span>
          <span className="hover:underline font-bold">
            <Link
              href={`/l/${formatHandle(notification?.lensCommunity?.handle)}`}
            >
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
      cardLink={`/l/${formatHandle(notification?.lensCommunity?.handle)}`}
      createdAt={notification?.createdAt}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationBannedUserLensCommunityCard
