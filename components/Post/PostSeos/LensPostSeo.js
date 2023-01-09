import { NextSeo } from 'next-seo'
import React from 'react'
import { LensInfuraEndpoint } from '../../../utils/config'
import { stringToLength } from '../../../utils/utils'

const LensPostSeo = ({ post }) => {
  return (
    <NextSeo
      title={stringToLength(post?.metadata?.content, 60)}
      openGraph={{
        url: `https://app.diversehq.xyz/p/${post?.id}`,
        title: stringToLength(post?.metadata?.content, 60),
        images:
          post?.metadata?.mainContentFocus === 'IMAGE'
            ? [
                {
                  url: `${LensInfuraEndpoint}${
                    post?.metadata?.media[0]?.original.url.split('//')[1]
                  }`,
                  alt: post?.metadata?.content
                }
              ]
            : [],
        videos:
          post?.metadata?.mainContentFocus === 'VIDEO'
            ? [
                {
                  url: `${LensInfuraEndpoint}${
                    post?.metadata?.media[0]?.original.url.split('//')[1]
                  }`,
                  alt: post?.metadata?.content
                }
              ]
            : []
      }}
    />
  )
}

export default LensPostSeo
