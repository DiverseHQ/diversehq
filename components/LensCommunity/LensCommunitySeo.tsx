import { NextSeo } from 'next-seo'
import React from 'react'
import { LensCommunity } from '../../types/community'
import { appLink } from '../../utils/config'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'

const LensCommunitySeo = ({ community }: { community: LensCommunity }) => {
  return (
    <NextSeo
      title={`l/${formatHandle(community?.Profile?.handle)}`}
      description={community?.Profile?.bio}
      openGraph={{
        title: `l/${formatHandle(community?.Profile?.handle)}`,
        description: community?.Profile?.bio,
        url: `${appLink}/l/${formatHandle(community?.Profile?.handle)}`,
        images: [
          {
            url: getAvatar(community?.Profile),
            alt: formatHandle(community?.Profile?.handle)
          }
        ]
      }}
    />
  )
}

export default LensCommunitySeo
