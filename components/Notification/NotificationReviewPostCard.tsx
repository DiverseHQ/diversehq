import Link from 'next/link'
import React, { useEffect } from 'react'
import { VscOpenPreview } from 'react-icons/vsc'
import { useLensUserContext } from '../../lib/LensUserContext'
import { NotificationSchema } from '../../types/notification'
import formatHandle from '../User/lib/formatHandle'
import getIPFSLink from '../User/lib/getIPFSLink'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationReviewPostCard = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  const { data: lensProfile } = useLensUserContext()
  const [metadata, setMetadata] = React.useState<any>(null)

  useEffect(() => {
    async function getMetadata() {
      const data = await fetch(
        getIPFSLink(notification?.reviewLensCommunityPost?.contentUri)
      ).then((r) => r.json())
      setMetadata(data)
    }
    getMetadata()
  }, [])

  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
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
          <span>{' submitted a post request on '}</span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/l/${formatHandle(lensProfile?.defaultProfile?.handle)}`}
            >
              <span>l/{formatHandle(lensProfile?.defaultProfile?.handle)}</span>
            </Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => <div>{metadata?.name}</div>}
      Icon={() => <VscOpenPreview />}
      isRead={notification.isRead}
      cardLink={`/l/${formatHandle(
        lensProfile?.defaultProfile?.handle
      )}/settings/review-posts`}
    />
  )
}

export default NotificationReviewPostCard
