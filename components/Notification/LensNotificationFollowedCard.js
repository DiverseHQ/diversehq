import Link from 'next/link'
import React from 'react'
import LensFollowButton from '../User/LensFollowButton'

const LensNotificationFollowedCard = ({ notification }) => {
  return (
    <div className="px-2 flex flex-row items-center">
      <div>
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
        <LensFollowButton lensProfile={notification?.wallet?.defaultProfile} />
      )}
    </div>
  )
}

export default LensNotificationFollowedCard
