import { useRouter } from 'next/router'
import React from 'react'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import getIPFSLink from '../User/lib/getIPFSLink'
import imageProxy from '../User/lib/imageProxy'
import AttachmentSlide from './AttachmentSlide'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../utils/config'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'

const AttachmentCarousel = ({ publication, medias, className }) => {
  const router = useRouter()
  const getCoverUrl = () => {
    return (
      publication?.metadata?.cover?.original.url || publication?.metadata?.image
    )
  }

  const renderElements = ({ index, onChangeIndex }) => (
    <>
      <button
        className="absolute bottom-[50%] translate-y-[50%] -translate-x-[50%] left-0 p-1 rounded-full hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text"
        onClick={(e) => {
          e.stopPropagation()
          onChangeIndex(index === 0 ? medias.length - 1 : index - 1)
        }}
      >
        <AiOutlineArrowLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute bottom-[50%] translate-y-[50%] translate-x-[50%] right-0 p-1 rounded-full hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text"
        onClick={(e) => {
          e.stopPropagation()
          onChangeIndex(index === medias.length - 1 ? 0 : index + 1)
        }}
      >
        <AiOutlineArrowRight className="w-6 h-6" />
      </button>
      <div className="flex flex-row justify-end absolute top-[10px] right-[10px]">
        <div className=" bg-p-bg rounded-full px-2 py-0.5">
          {index + 1}/{medias.length}
        </div>
      </div>
    </>
  )

  const renderChildren = () =>
    medias.map((media, i) => {
      const type = media.original.mimeType
      const url = getIPFSLink(media.original.url)

      return (
        <div key={i} className="flex items-center justify-center">
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
        </div>
      )
    })
  return (
    <div>
      <AttachmentSlide renderElements={renderElements} transition="0.8s">
        {renderChildren}
      </AttachmentSlide>
    </div>
  )
}

export default AttachmentCarousel
