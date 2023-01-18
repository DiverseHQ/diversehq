import Link from 'next/link'
import React from 'react'
import LensFollowButton from '../User/LensFollowButton'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const LensNotificationFollowedCard = ({ notification }) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row">
          <div className="pr-2">
            <span>
              <Link
                href={`/u/${notification?.wallet?.defaultProfile?.handle}`}
                className="font-bold hover:underline"
              >
                u/{notification?.wallet?.defaultProfile?.handle}
              </Link>{' '}
            </span>
            {notification?.wallet?.defaultProfile?.isFollowedByMe && 'finally '}
            followed you
          </div>
          {!notification?.wallet?.defaultProfile?.isFollowedByMe && (
            <LensFollowButton
              lensProfile={notification?.wallet?.defaultProfile}
            />
          )}
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => <></>}
    />
  )
}

export default LensNotificationFollowedCard
