import { NextSeo } from 'next-seo'
import React from 'react'
import { stringToLength } from '../../../utils/utils'

const OffChainPostSeo = ({ post }) => {
  return (
    <NextSeo
      title={stringToLength(post?.title, 15)}
      description={post?.title}
      openGraph={{
        url: `https://app.diversehq.xyz/p/${post?._id}`,
        title: stringToLength(post?.title, 15),
        description: post?.title,
        images: post?.postImageUrl
          ? [
              {
                url: post?.postImageUrl,
                alt: post?.title
              }
            ]
          : [],
        videos: post?.postVideoUrl
          ? [
              {
                url: post?.postVideoUrl,
                alt: post?.title
              }
            ]
          : []
      }}
    />
  )
}

export default OffChainPostSeo
