import { NextSeo } from 'next-seo'
import React from 'react'
import { Publication } from '../../../graphql/generated'
import { appLink } from '../../../utils/config'
// import { IMAGE_KIT_ENDPOINT, LensInfuraEndpoint } from '../../../utils/config'
import { stringToLength } from '../../../utils/utils'
import imageProxy from '../../User/lib/imageProxy'

const LensPostSeo = ({ post }: { post: Publication }) => {
  return (
    <NextSeo
      title={stringToLength(post?.metadata?.content, 60)}
      twitter={{
        cardType: 'summary_large_image',
        handle: '@useDiverseHQ'
      }}
      openGraph={{
        url: `${appLink}/p/${post?.id}`,
        title: `${stringToLength(post?.metadata?.content, 40)} \n | ${
          post?.stats?.totalAmountOfCollects
        } Collects | ${post?.stats?.totalUpvotes} Upvotes | \n by ${
          post?.profile?.handle
        }`,
        images:
          post?.metadata?.mainContentFocus === 'IMAGE'
            ? [
                {
                  url: imageProxy(
                    post?.metadata?.media[0]?.original.url,
                    'w-1200,h-630,q-50'
                  )
                }
              ]
            : [],
        videos:
          post?.metadata?.mainContentFocus === 'VIDEO'
            ? [
                {
                  url: imageProxy(
                    post?.metadata?.media[0]?.original.url,
                    'w-1200,h-630,q-50'
                  ),
                  alt: post?.metadata?.content,
                  secureUrl: imageProxy(
                    post?.metadata?.media[0]?.original.url,
                    'w-1200,h-630,q-50'
                  ),
                  type: post?.metadata?.media[0]?.original?.mimeType,
                  width: 450
                }
              ]
            : []
      }}
    />
  )
}

export default LensPostSeo
