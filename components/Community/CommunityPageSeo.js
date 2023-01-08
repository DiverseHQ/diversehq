import { NextSeo } from 'next-seo'
import React from 'react'

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
            url: community?.logoImageUrl,
            alt: community?.name
          }
        ]
      }}
    />
  )
}

export default CommunityPageSeo
