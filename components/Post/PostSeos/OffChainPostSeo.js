import { NextSeo } from 'next-seo'
import React from 'react'
import { stringToLength } from '../../../utils/utils'

const OffChainPostSeo = ({ post }) => {
  return (
    <NextSeo
      title={stringToLength(post?.title, 60)}
      openGraph={{
        url: `https://app.diversehq.xyz/p/${post?._id}`,
        title: stringToLength(post?.title, 60),
        images: [
          {
            url: post?.postImageUrl,
            alt: post?.title
          }
        ],
        videos: [
          {
            url: post?.postVideoUrl,
            alt: post?.title
          }
        ]
      }}
    />
  )
}

export default OffChainPostSeo