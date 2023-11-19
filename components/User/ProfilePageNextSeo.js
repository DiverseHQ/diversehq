// import { NextSeo } from 'next-seo'
import React from 'react'
import getAvatar from './lib/getAvatar'
import MetaTags from '../Common/Seo/MetaTags'
import formatHandle from './lib/formatHandle'

const ProfilePageNextSeo = ({ lensProfile }) => {
  return (
    <>
      <MetaTags
        title={`${
          lensProfile?.metadata?.displayName
            ? lensProfile?.metadata?.displayName + ' | '
            : ''
        } u/${formatHandle(lensProfile?.handle)}`}
        description={lensProfile?.metadata?.bio}
        image={getAvatar(lensProfile)}
        url={`https://diversehq.com/u/${formatHandle(lensProfile?.handle)}`}
      />

      {/* {lensProfile && (
        <NextSeo
          title={`${lensProfile.name} ${lensProfile?.handle}`}
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
      )} */}
    </>
  )
}

export default ProfilePageNextSeo
