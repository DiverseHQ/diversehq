import React, { memo, useEffect, useRef } from 'react'
import Embedo from 'embedo'
import { uuidv4 } from '@firebase/util'
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
  /^http[s]*:\/\/[www.]*twitter(\.[a-z]+).*/i,
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

/* eslint-enable */

const ReactEmbedo = ({ url, ...props }) => {
  const embedoRef = useRef(null)
  //   const [embeded, setEmbeded] = useState(false)
  //   if (
  //     typeof window !== 'undefined' &&
  //     embedoRef?.current?.children.length === 0
  //   ) {
  //     console.log(
  //       'embedoRef.current.children.length',
  //       embedoRef.current.children.length
  //     )
  //     const embedo = new Embedo({
  //       twitter: true,
  //       pinterest: true,
  //       reddit: true,
  //       flickr: true
  //     })
  //     embedo.load(embedoRef.current, url, {
  //       centerize: true
  //     })
  //   }
  const isEmbedable = (url) => {
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
      console.log(
        'embedoRef.current.children.length',
        embedoRef.current.children.length
      )
      console.log('embedoRef.current.id', embedoRef.current.id)
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
  return (
    <>
      {isEmbedable(url) ? (
        <div ref={embedoRef} id={uuidv4()} {...props}></div>
      ) : (
        // <LinkPreview url={url} />
        <></>
      )}
    </>
  )
}

export default memo(ReactEmbedo)
