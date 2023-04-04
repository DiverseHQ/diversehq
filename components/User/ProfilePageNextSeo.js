import { NextSeo } from 'next-seo'
import React from 'react'
import getAvatar from './lib/getAvatar'

const ProfilePageNextSeo = ({ lensProfile }) => {
  return (
    <>
      {!lensProfile && (
        <NextSeo
          title={`${lensProfile.name} ${
            lensProfile?.handle ? ' | ' + lensProfile?.handle : ''
          }`}
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
