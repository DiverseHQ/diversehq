import Link from 'next/link'
import React from 'react'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { SlUserFollow } from 'react-icons/sl'
import { NewFollowerNotification } from '../../graphql/generated'
import useLensFollowButton from '../User/useLensFollowButton'
import formatHandle from '../User/lib/formatHandle'

interface Props {
  notification: NewFollowerNotification
  isRead: boolean
}

const LensNotificationFollowedCard = ({ notification, isRead }: Props) => {
  const { FollowButton } = useLensFollowButton({
    profileId: notification?.wallet?.defaultProfile?.id
  })
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row pr-2 space-x-2">
          <span onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/u/${formatHandle(
                notification?.wallet?.defaultProfile?.handle
              )}`}
            >
              <div className="font-bold hover:underline">
                u/{formatHandle(notification?.wallet?.defaultProfile?.handle)}
              </div>
            </Link>{' '}
          </span>
          <span>
            {notification?.wallet?.defaultProfile?.isFollowedByMe && 'finally '}
            followed you
          </span>
          <div>
            {!notification?.wallet?.defaultProfile?.isFollowedByMe && (
              <span onClick={(e) => e.stopPropagation()}>
                <FollowButton />
              </span>
            )}
          </div>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => <></>}
      Icon={() => <SlUserFollow />}
      isRead={isRead}
      cardLink={`/u/${formatHandle(
        notification?.wallet?.defaultProfile?.handle
      )}`}
    />
  )
}

export default LensNotificationFollowedCard
