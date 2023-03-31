import Link from 'next/link'
import React, { useEffect } from 'react'
import { MdOutlineCelebration } from 'react-icons/md'
import { NotificationSchema } from '../../types/notification'
import { useProfile } from '../Common/WalletContext'
import LensPostCardFromPublicationId from '../Post/Cards/LensPostCardFromPublicationId'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { MdRemoveCircleOutline } from 'react-icons/md'
import getIPFSLink from '../User/lib/getIPFSLink'

const NotificationReviewPostResolve = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  const { joinedLensCommunities } = useProfile()
  const [title, setTitle] = React.useState('')

  const fetchContentFromContentUriAndSetTitle = async () => {
    try {
      const response = await fetch(
        getIPFSLink(notification?.reviewLensCommunityPost?.contentUri)
      )
      const data = await response.json()
      setTitle(data.name)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (notification?.reviewLensCommunityPost?.resolveAction === 'ALLOW') return
    fetchContentFromContentUriAndSetTitle()
  }, [notification?._id])

  if (notification?.reviewLensCommunityPost?.resolveAction === 'ALLOW') {
    return (
      <CommonNotificationCardLayoutUI
        MainRow={() => (
          <div className="flex flex-row flex-wrap space-x-2">
            <span>{'Your post request has been accepted and posted on '}</span>
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

  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row flex-wrap space-x-2">
          <span>
            {'Your post request has been rejected by the creator of '}
          </span>
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
      Body={() => <div>{title}</div>}
      Icon={() => <MdRemoveCircleOutline />}
      isRead={notification.isRead}
      cardLink={`/p/${notification?.reviewLensCommunityPost?.publicationId}`}
    />
  )
}

export default NotificationReviewPostResolve
