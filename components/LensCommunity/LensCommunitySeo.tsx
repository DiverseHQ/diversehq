// import { NextSeo } from 'next-seo'
import React from 'react'
import { LensCommunity } from '../../types/community'
import { appLink } from '../../utils/config'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import { stringToLength } from '../../utils/utils'
import MetaTags from '../Common/Seo/MetaTags'

const LensCommunitySeo = ({ community }: { community: LensCommunity }) => {
  if (!community?.Profile) return null
  return (
    <MetaTags
      title={`l/${formatHandle(community?.Profile?.handle)}`}
      description={stringToLength(community?.Profile?.metadata?.bio, 90)}
      url={`${appLink}/l/${formatHandle(community?.Profile?.handle)}`}
      image={getAvatar(community?.Profile, 'w-1200,h-630,q-80')}
    />
    // <NextSeo
    //   title={`l/${formatHandle(community?.Profile?.handle)}`}
    //   description={stringToLength(community?.Profile?.bio, 90)}
    //   openGraph={{
    //     title: `l/${formatHandle(community?.Profile?.handle)}`,
    //     description: stringToLength(community?.Profile?.bio, 90),
    //     url: `${appLink}/l/${formatHandle(community?.Profile?.handle)}`,
    //     images: [
    //       {
    //         url: getAvatar(community?.Profile, 'w-1200,h-630,q-80'),
    //         alt: formatHandle(community?.Profile?.handle)
    //       }
    //     ]
    //   }}
    // />
  )
}

export default LensCommunitySeo
