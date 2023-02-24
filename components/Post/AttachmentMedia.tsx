import React from 'react'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import imageProxy from '../User/lib/imageProxy'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../utils/config'
import { useRouter } from 'next/router'

const AttachmentMedia = ({ type, url, publication, className }) => {
  const router = useRouter()
  const getCoverUrl = () => {
    return (
      publication?.metadata?.cover?.original.url || publication?.metadata?.image
    )
  }

  return (
    <>
      {type === 'image/svg+xml' ? (
        <button onClick={() => window.open(url, '_blank')}>
          Open Image in new tab
        </button>
      ) : SUPPORTED_VIDEO_TYPE.includes(type) ? (
        <VideoWithAutoPause
          src={imageProxy(url)}
          className={`image-unselectable object-contain sm:rounded-lg w-full ${className}`}
          controls
          muted
          poster={getCoverUrl}
        />
      ) : SUPPORTED_AUDIO_TYPE.includes(type) ? (
        <audio src={url} className={`${className}`} loop controls muted />
      ) : SUPPORTED_IMAGE_TYPE.includes(type) ? (
        router.pathname.startsWith('/p/') ? (
          <ImageWithFullScreenZoom
            src={url}
            className={`image-unselectable object-cover sm:rounded-lg w-full ${className}`}
            alt={publication?.metadata?.content}
          />
        ) : (
          <ImageWithPulsingLoader
            src={url}
            className={`image-unselectable object-cover sm:rounded-lg w-full ${className}`}
            alt={publication?.metadata?.content}
          />
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default AttachmentMedia
