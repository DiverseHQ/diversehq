// import { NextSeo } from 'next-seo'
import React from 'react'
import { appLink } from '../../../utils/config'
// import { IMAGE_KIT_ENDPOINT, LensInfuraEndpoint } from '../../../utils/config'
import { stringToLength } from '../../../utils/utils'
import formatHandle from '../../User/lib/formatHandle'
import MetaTags from '../../Common/Seo/MetaTags'
import { getContent } from '../getContent'
import { AnyPublication } from '../../../graphql/generated'

const LensPostSeo = ({ post }: { post: AnyPublication }) => {
  // @ts-ignore
  const content = getContent(post)
  return (
    <MetaTags
      title={
        // @ts-ignore
        stringToLength(post?.metadata?.content, 90) +
        `\n by u/${formatHandle(post?.by?.handle)}`
      }
      description={stringToLength(content, 90)}
      url={`${appLink}/p/${post?.id}`}
      // @ts-ignore
      image={post?.metadata?.marketplace?.image?.optimized?.uri}
    />
    // <NextSeo
    //   title={stringToLength(post?.metadata?.content, 60)}
    //   twitter={{
    //     cardType: 'summary_large_image',
    //     handle: '@useDiverseHQ'
    //   }}
    //   openGraph={{
    //     url: `${appLink}/p/${post?.id}`,
    //     title: `${stringToLength(
    //       post?.metadata?.content,
    //       90
    //     )} \n by u/${formatHandle(post?.profile?.handle)}`,
    //     images:
    //       post?.metadata?.mainContentFocus === 'IMAGE'
    //         ? [
    //             {
    //               url: imageProxy(
    //                 post?.metadata?.media[0]?.original.url,
    //                 'w-1200,h-630,q-50'
    //               )
    //             }
    //           ]
    //         : [],
    //     videos:
    //       post?.metadata?.mainContentFocus === 'VIDEO'
    //         ? [
    //             {
    //               url: imageProxy(
    //                 post?.metadata?.media[0]?.original.url,
    //                 'w-1200,h-630,q-50'
    //               ),
    //               alt: post?.metadata?.content,
    //               secureUrl: imageProxy(
    //                 post?.metadata?.media[0]?.original.url,
    //                 'w-1200,h-630,q-50'
    //               ),
    //               type: post?.metadata?.media[0]?.original?.mimeType,
    //               width: 450
    //             }
    //           ]
    //         : []
    //   }}
    // />
  )
}

export default LensPostSeo
