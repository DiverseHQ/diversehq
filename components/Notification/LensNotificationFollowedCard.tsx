import Link from 'next/link'
import React from 'react'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { SlUserFollow } from 'react-icons/sl'
import { NewFollowerNotification } from '../../graphql/generated'
import useLensFollowButton from '../User/useLensFollowButton'

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
        <div className="flex flex-row">
          <div className="pr-2">
            <span>
              <Link
                href={`/u/${
                  notification?.wallet?.defaultProfile?.handle.split('.')[0]
                }`}
                className="font-bold hover:underline"
              >
                u/{notification?.wallet?.defaultProfile?.handle.split('.')[0]}
              </Link>{' '}
            </span>
            {notification?.wallet?.defaultProfile?.isFollowedByMe && 'finally '}
            followed you
          </div>
          {!notification?.wallet?.defaultProfile?.isFollowedByMe && (
            <FollowButton />
          )}
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => <></>}
      Icon={() => <SlUserFollow />}
      isRead={isRead}
    />
  )
}

export default LensNotificationFollowedCard
