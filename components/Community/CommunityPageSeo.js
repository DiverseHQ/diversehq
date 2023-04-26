import { NextSeo } from 'next-seo'
import React from 'react'
import { appLink } from '../../utils/config'
import imageProxy from '../User/lib/imageProxy'
import { stringToLength } from '../../utils/utils'

const CommunityPageSeo = ({ community }) => {
  return (
    <NextSeo
      title={community?.name}
      description={stringToLength(community?.description, 90)}
      openGraph={{
        title: community?.name,
        description: stringToLength(community?.description, 90),
        url: `${appLink}/c/${community?.name}`,
        images: [
          {
            url: imageProxy(community?.logoImageUrl, 'tr:w-1200,h-630,q-50'),
            alt: community?.name
          }
        ]
      }}
    />
  )
}

export default CommunityPageSeo
