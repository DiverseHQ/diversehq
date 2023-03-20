import { NextSeo } from 'next-seo'
import React from 'react'
import { appLink, IMAGE_KIT_ENDPOINT } from '../../../utils/config'
import { stringToLength } from '../../../utils/utils'

const OffChainPostSeo = ({ post }) => {
  return (
    <NextSeo
      title={stringToLength(post?.title, 60)}
      openGraph={{
        url: `${appLink}/p/${post?._id}`,
        title: stringToLength(post?.title, 60),
        images: post?.postImageUrl
          ? [
              {
                url: post?.postImageUrl.replace(
                  'https://firebasestorage.googleapis.com',
                  `${IMAGE_KIT_ENDPOINT}/tr:w-1200,h-630,q-50`
                ),
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
