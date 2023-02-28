import React from 'react'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
// import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import imageProxy from '../User/lib/imageProxy'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../utils/config'
import AudioPlayer from './AudioPlayer'
import getIPFSLink from '../User/lib/getIPFSLink'
// import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
// import useDevice from '../Common/useDevice'
// import { useRouter } from 'next/router'

const AttachmentMedia = ({ type, url, publication, className }) => {
  // const router = useRouter()
  const getCoverUrl = () => {
    return (
      publication?.metadata?.cover?.original.url || publication?.metadata?.image
    )
  }
  // const { isMobile } = useDevice()

  return (
    <>
      {type === 'image/svg+xml' ? (
        <button onClick={() => window.open(url, '_blank')}>
          Open Image in new tab
        </button>
      ) : SUPPORTED_VIDEO_TYPE.includes(type) ? (
        <VideoWithAutoPause
          src={imageProxy(url)}
          className={`image-unselectable object-cover sm:rounded-lg w-full ${className}`}
          controls
          muted
          poster={getCoverUrl}
        />
      ) : SUPPORTED_AUDIO_TYPE.includes(type) ? (
        <AudioPlayer
          src={url}
          className={`${className}`}
          coverImage={
            imageProxy(getIPFSLink(publication?.metadata?.cover?.original.url)) ||
            imageProxy(getIPFSLink(publication?.metadata?.image))
          }
          publication={publication}
        />
      ) : SUPPORTED_IMAGE_TYPE.includes(type) ? (
        <ImageWithFullScreenZoom
          src={url}
          className={`image-unselectable object-cover sm:rounded-lg w-full ${className}`}
          alt={publication?.metadata?.content}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default AttachmentMedia
