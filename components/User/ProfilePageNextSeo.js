import { NextSeo } from 'next-seo'
import React from 'react'
import { stringToLength } from '../../utils/utils'
import getAvatar from './lib/getAvatar'

const ProfilePageNextSeo = ({ profile, lensProfile }) => {
  return (
    <>
      {profile && (
        <NextSeo
          title={`${
            lensProfile.name
              ? lensProfile.name
              : stringToLength(profile.walletAddress, 6)
          } ${lensProfile?.handle ? ' | ' + lensProfile?.handle : ''}`}
          description={lensProfile.bio}
          openGraph={{
            title: `${lensProfile.name} | ${lensProfile?.handle}`,
            description: lensProfile.bio,
            images: [
              {
                url: getAvatar(lensProfile),
                alt: `${lensProfile.name} | ${lensProfile?.handle}`
              }
            ]
          }}
        />
      )}
      {!lensProfile && (
        <NextSeo
          title="No Profile Found"
          description="This user has not created a profile yet."
          openGraph={{
            title: 'No Profile Found',
            description: 'This user has not created a profile yet.'
          }}
        />
      )}
    </>
  )
}

export default ProfilePageNextSeo
