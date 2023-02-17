import React, { FC } from 'react'
import { Publication } from '../../graphql/generated'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../utils/config'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import getIPFSLink from '../User/lib/getIPFSLink'
import imageProxy from '../User/lib/imageProxy'

interface Props {
  publication: Publication
  className: String
}

const Attachment: FC<Props> = ({ publication, className }) => {
  const medias = publication?.metadata?.media
  const getCoverUrl = () => {
    return (
      publication?.metadata?.cover?.original.url || publication?.metadata?.image
    )
  }
  if (medias.length === 0) return <></>
  return (
    <>
      {medias.map((media) => {
        const type = media.original.mimeType
        const url = getIPFSLink(media.original.url)

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
              <ImageWithPulsingLoader
                src={url}
                className={`image-unselectable object-cover sm:rounded-lg w-full ${className}`}
                alt={publication?.metadata?.content}
              />
            ) : (
              <></>
            )}
          </>
        )
      })}
    </>
  )
}

export default Attachment
