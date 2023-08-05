import { uuidv4 } from '@firebase/util'
import Embedo from 'embedo'
import { memo, useEffect, useRef } from 'react'
import LensPostCardFromPublicationId from '../Cards/LensPostCardFromPublicationId'
// import LinkPreview from './LinkPreview'
// import { ReactTinyLink } from 'react-tiny-link'
// import LinkPreview from './LinkPreview'
// import { useState } from 'react'

const sessionEmbededIds = new Set()

/* eslint-disbale */
// eslint-disable-line
// eslint-disable-next-line
const AllowedEmbedoRegexList = [
  // eslint-disable-next-line
  /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/g,
  // eslint-disable-next-line
  // only twitter tweets and not twitter profile
  // eslint-disable-next-line
  /^(http|https):\/\/twitter\.com\/(\w+)\/status\/(\d+)$/i,
  // eslint-disable-next-line
  /(http|https)?:\/\/(www\.)?instagram.com\/p\/[a-zA-Z0-9_\/\?\-\=]+/gi,
  // eslint-disable-next-line
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/,
  // eslint-disable-next-line
  /(https?:\/\/(ww.)?)?pinterest(\.[a-z]+).*/i,
  // eslint-disable-next-line
  /(http|https)?:\/\/(www\.)?vimeo(\.[a-z]+)\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/,
  /(http|https):\/\/gist\.github\.com\/(\w+)\/(\w+)/,
  /^(http|https):\/\/soundcloud\.com\/(\w+)\/.*$/,
  // music youtube
  /^(http|https):\/\/music\.youtube\.com\/watch\?v=.*$/
]

const isLensPostLink = (url) => {
  // lens post  has /p or /posts or /post in it
  // starting with https://testnet.lenster.xyz, https://diversehq.xyz or https://lenster.xyz
  // for example https://testnet.lenster.xyz/posts/0x35b0-0x04, https://diversehq.xyz/p/0xf340-0x0277, or https://lenster.xyz/posts/0xbb03-0x0396
  return (
    (url &&
      // eslint-disable-next-line
      /^(https?:\/\/(testnet\.)?lenster\.xyz\/(p|posts|post)\/[a-zA-Z0-9_-]+)$/i.test(
        url
      )) ||
    // eslint-disable-next-line
    /^(https?:\/\/(testnet\.)?diversehq\.xyz\/(p|posts|post)\/[a-zA-Z0-9_-]+)$/i.test(
      url
    ) ||
    // example https://orb.ac/post/0x35b0-0x04
    // eslint-disable-next-line
    /^(https?:\/\/(testnet\.)?orb\.ac\/(p|posts|post)\/[a-zA-Z0-9_-]+)$/i.test(
      url
    )
  )
}

/* eslint-enable */

const ReactEmbedo = ({ url, ...props }) => {
  const embedoRef = useRef(null)
  const isEmbedable = (url: string) => {
    return AllowedEmbedoRegexList.some((regex) => regex.test(url))
  }

  useEffect(() => {
    if (
      embedoRef.current &&
      url &&
      typeof window !== 'undefined' &&
      embedoRef.current.children.length === 0 &&
      !sessionEmbededIds.has(embedoRef.current.id) &&
      isEmbedable(url)
    ) {
      sessionEmbededIds.add(embedoRef.current.id)

      const embedo = new Embedo({
        twitter: true,
        pinterest: true,
        reddit: true,
        flickr: true,
        soundCloud: true,
        facebook: {
          appId: '712654940465859',
          version: 'v9.0',
          access_token: 'aac9ae7191d0d2848481a2806f1dac35'
        },
        instagram: {
          access_token: 'aac9ae7191d0d2848481a2806f1dac35'
        }
      })
      embedo.load(embedoRef.current, url, {
        centerize: true
      })
    }
  }, [url, embedoRef])

  if (isLensPostLink(url)) {
    const postId = url.split('/')[4]
    return <LensPostCardFromPublicationId publicationId={postId} />
    // return <div>This is the quotepost</div>
  }

  if (!isEmbedable(url)) return null
  return (
    <>
      <div
        className="sm:rounded-lg  overflow-hidden"
        ref={embedoRef}
        id={uuidv4()}
        {...props}
      ></div>
    </>
  )
}

export default memo(ReactEmbedo)
