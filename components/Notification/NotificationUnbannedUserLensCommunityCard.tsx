import Link from 'next/link'
import React from 'react'
import { RxLinkBreak2 } from 'react-icons/rx'
import { NotificationSchema } from '../../types/notification'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationUnbannedUserLensCommunityCard = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span>{'Ban has been removed from you on '}</span>
          <span className="hover:underline font-bold">
            <Link
              href={`/l/${formatHandle(notification?.lensCommunity?.handle)}`}
            >
              <span>l/{formatHandle(notification?.lensCommunity?.handle)}</span>
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
      cardLink={`/l/${formatHandle(notification?.lensCommunity?.handle)}`}
      createdAt={notification?.createdAt}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationUnbannedUserLensCommunityCard
