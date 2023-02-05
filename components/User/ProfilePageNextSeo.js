import { NextSeo } from 'next-seo'
import React from 'react'
import { stringToLength } from '../../utils/utils'

const ProfilePageNextSeo = ({ profile, lensProfile }) => {
  return (
    <>
      {profile && (
        <NextSeo
          title={`${
            profile.name
              ? profile.name
              : stringToLength(profile.walletAddress, 6)
          } ${lensProfile?.handle ? ' | ' + lensProfile?.handle : ''}`}
          description={profile.bio}
          openGraph={{
            title: `${profile.name} | ${lensProfile?.handle}`,
            description: profile.bio,
            images: [
              {
                url: profile?.profileImageUrl,
                alt: `${profile.name} | ${lensProfile?.handle}`
              }
            ]
          }}
        />
      )}
      {!profile && (
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
