// import { NextSeo } from 'next-seo'
import React from 'react'
import { Publication } from '../../../graphql/generated'
import { appLink } from '../../../utils/config'
// import { IMAGE_KIT_ENDPOINT, LensInfuraEndpoint } from '../../../utils/config'
import { stringToLength } from '../../../utils/utils'
import imageProxy from '../../User/lib/imageProxy'
import formatHandle from '../../User/lib/formatHandle'
import MetaTags from '../../Common/Seo/MetaTags'
import { getContent } from '../getContent'

const LensPostSeo = ({ post }: { post: Publication }) => {
  // @ts-ignore
  const content = getContent(post)
  return (
    <MetaTags
      title={
        stringToLength(post?.metadata?.name, 90) +
        `\n by u/${formatHandle(post?.profile?.handle)}`
      }
      description={stringToLength(content, 90)}
      url={`${appLink}/p/${post?.id}`}
      image={
        post?.metadata?.mainContentFocus === 'IMAGE'
          ? imageProxy(
              post?.metadata?.media[0]?.original.url,
              'w-1200,h-630,q-50'
            )
          : undefined
      }
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
