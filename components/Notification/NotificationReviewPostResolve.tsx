import Link from 'next/link'
import React from 'react'
import { MdOutlineCelebration } from 'react-icons/md'
import { NotificationSchema } from '../../types/notification'
import { useProfile } from '../Common/WalletContext'
import LensPostCardFromPublicationId from '../Post/Cards/LensPostCardFromPublicationId'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationReviewPostResolve = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  const { joinedLensCommunities } = useProfile()
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span>{'Your post has been accepted and posted on '}</span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/l/${formatHandle(
                joinedLensCommunities.find(
                  (c) =>
                    c._id ===
                    notification?.reviewLensCommunityPost?.lensCommunityId
                )?.handle
              )}`}
            >
              <span>{`l/${formatHandle(
                joinedLensCommunities.find(
                  (c) =>
                    c._id ===
                    notification?.reviewLensCommunityPost?.lensCommunityId
                )?.handle
              )}`}</span>
            </Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <LensPostCardFromPublicationId
          publicationId={notification?.reviewLensCommunityPost?.publicationId}
        />
      )}
      Icon={() => <MdOutlineCelebration />}
      isRead={notification.isRead}
      cardLink={`/p/${notification?.reviewLensCommunityPost?.publicationId}`}
    />
  )
}

export default NotificationReviewPostResolve
