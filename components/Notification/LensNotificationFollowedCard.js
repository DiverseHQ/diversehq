import Link from 'next/link'
import React from 'react'
import LensFollowButton from '../User/LensFollowButton'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

const LensNotificationFollowedCard = ({ notification }) => {
  return (
    <div className="flex flex-row items-center">
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
      <div>
        <ReactTimeAgo date={notification?.createdAt} locale="en-US" />
      </div>
    </div>
  )
}

export default LensNotificationFollowedCard
