import React, { FC } from 'react'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import imageProxy from '../User/lib/imageProxy'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../utils/config'
import AudioPlayer from './AudioPlayer'
import { Publication } from '../../graphql/generated'

interface Props {
  type: string
  url: string
  publication: Publication
  className?: string
}

const AttachmentMedia: FC<Props> = ({ type, url, publication, className }) => {
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
          poster={imageProxy(
            publication?.metadata?.cover?.original.url ||
              publication?.metadata?.image
          )}
        />
      ) : SUPPORTED_AUDIO_TYPE.includes(type) ? (
        <AudioPlayer
          src={url}
          className={`${className}`}
          coverImage={
            imageProxy(publication?.metadata?.cover?.original?.url) ||
            imageProxy(publication?.metadata?.image)
          }
          publication={publication}
        />
      ) : SUPPORTED_IMAGE_TYPE.includes(type) ? (
        <ImageWithFullScreenZoom
          src={imageProxy(url)}
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
