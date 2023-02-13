import { NextSeo } from 'next-seo'
import React from 'react'
import { IMAGE_KIT_ENDPOINT } from '../../utils/config'

const CommunityPageSeo = ({ community }) => {
  return (
    <NextSeo
      title={community?.name}
      description={community?.description}
      openGraph={{
        title: community?.name,
        description: community?.description,
        url: `https://app.diversehq.xyz/c/${community?.name}`,
        images: [
          {
            url: community?.logoImageUrl.replace(
              'https://firebasestorage.googleapis.com',
              `${IMAGE_KIT_ENDPOINT}/tr:w-1200,h-630,q-50`
            ),
            alt: community?.name
          }
        ]
      }}
    />
  )
}

export default CommunityPageSeo
