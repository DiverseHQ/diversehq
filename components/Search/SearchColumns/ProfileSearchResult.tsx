import React from 'react'
import { Profile } from '../../../graphql/generated'
import getAvatar from '../../User/lib/getAvatar'
import formatHandle from '../../User/lib/formatHandle'
import Markup from '../../Lexical/Markup'
import { stringToLength } from '../../../utils/utils'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import Link from 'next/link'

const ProfileSearchResult = ({ profile }: { profile: Profile }) => {
  return (
    <Link
      href={`/u/${formatHandle(profile?.handle)}`}
      passHref
      className="start-row my-4 cursor-pointer hover:bg-s-hover p-2 rounded-xl"
    >
      <ImageWithPulsingLoader
        src={getAvatar(profile)}
        className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-full shrink-0"
        alt={profile?.name}
      />
      <div className="flex flex-col ml-4">
        <div className="start-row gap-x-2">
          <span className="text-xl font-bold hover:underline">
            {profile?.name}
          </span>
          <span className="text-lg text-gray-500 hover:underline">
            u/{formatHandle(profile.handle)}
          </span>
        </div>
        <div className="text-sm text-s-text">
          <Markup>{stringToLength(profile?.bio, 150)}</Markup>
        </div>
      </div>
    </Link>
  )
}

export default ProfileSearchResult
