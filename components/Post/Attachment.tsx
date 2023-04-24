// import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose
} from 'react-icons/ai'
import { MediaSet, Publication } from '../../graphql/generated'
import {
  LensInfuraEndpoint,
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../utils/config'
import { getURLsFromText } from '../../utils/utils'
import getIPFSLink from '../User/lib/getIPFSLink'
import imageProxy from '../User/lib/imageProxy'
// import AttachmentCarousel from './AttachmentCarousel'
// import AttachmentMedia from './AttachmentMedia'
import ReactEmbedo from './embed/ReactEmbedo'
import { AttachmentType, usePublicationStore } from '../../store/publication'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import LivePeerVideoPlayback from '../Common/UI/LivePeerVideoPlayback'
import AudioPlayer from './AudioPlayer'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import clsx from 'clsx'
// import { useDevice } from '../Common/DeviceWrapper'

interface Props {
  publication?: Publication
  attachments?: any
  className?: String
  isNew?: boolean
  hideDelete?: boolean
}

const Attachment: FC<Props> = ({
  publication,
  className,
  attachments = [],
  isNew = false,
  hideDelete = false
}) => {
  const removeAttachments = usePublicationStore(
    (state) => state.removeAttachments
  )
  const getCoverUrl = () => {
    return imageProxy(getIPFSLink(publication?.metadata?.cover?.original?.url))
  }

  const [currentMedia, setCurrentMedia] = useState(0)

  const handleNextClick = () => {
    if (currentMedia === attachments.length - 1) {
      setCurrentMedia(0)
    } else {
      setCurrentMedia(currentMedia + 1)
    }
  }

  const handlePrevClick = () => {
    if (currentMedia === 0) {
      setCurrentMedia(attachments.length - 1)
    } else {
      setCurrentMedia(currentMedia - 1)
    }
  }

  // const { isMobile } = useDevice()

  if (attachments?.length === 0) {
    if (getURLsFromText(publication?.metadata?.content)?.length > 0) {
      return (
        <ReactEmbedo url={getURLsFromText(publication?.metadata?.content)[0]} />
      )
    } else return null
  }

  return (
    <>
      {/* {isMobile ? (
        <div
          className="relative flex flex-col justify-center items-center overflow-x-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <AttachmentCarousel
            publication={publication}
            medias={medias}
            className={`${medias.length > 1 ? 'h-[450px]' : className}`}
          />
        </div>
      ) : ( */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {attachments.length > 1 && (
          <>
            {currentMedia !== 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevClick()
                }}
                className="absolute left-0 top-[50%] z-20 p-1 rounded-full translate-x-[50%] -translate-y-[50%] hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text transition-all duration-300"
              >
                <AiOutlineArrowLeft className="w-6 h-6" />
              </button>
            )}
            {currentMedia !== attachments.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextClick()
                }}
                className="absolute right-0 top-[50%] z-20 p-1 rounded-full -translate-x-[50%] -translate-y-[50%] hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text transition-all duration-300"
              >
                <AiOutlineArrowRight className="w-6 h-6" />
              </button>
            )}
            <div
              className={clsx(
                'absolute top-[10px] z-20 bg-p-bg py-0.5 px-2 rounded-full',
                // isNew ? 'left-[10px]' : 'right-[10px]',
                'left-[10px]'
              )}
            >
              {currentMedia + 1}/{attachments.length}
            </div>
          </>
        )}

        {attachments.length > 0 &&
          attachments.map(
            (attachment: AttachmentType & MediaSet, index: number) => {
              const type = isNew
                ? attachment?.type
                : attachment?.original?.mimeType
              const url = isNew
                ? attachment?.previewItem || getIPFSLink(attachment?.item!)
                : getIPFSLink(attachment?.original?.url)

              return (
                <div key={index} className={currentMedia !== index && 'hidden'}>
                  {type === 'image/svg+xml' ? (
                    <button onClick={() => window.open(url, '_blank')}>
                      Open Image in new tab
                    </button>
                  ) : SUPPORTED_VIDEO_TYPE.includes(type) ? (
                    (isNew && !url.startsWith(LensInfuraEndpoint)) ||
                    url.startsWith('https://firebasestorage.googleapis.com') ? (
                      <VideoWithAutoPause
                        src={isNew ? url : imageProxy(url)}
                        className={`image-unselectable object-contain sm:rounded-lg w-full ${className}`}
                        controls
                        muted
                        autoPlay={false}
                        poster={getCoverUrl()}
                      />
                    ) : (
                      <div
                        className={`image-unselectable object-contain sm:rounded-lg w-full overflow-hidden ${className} flex items-center`}
                      >
                        <LivePeerVideoPlayback
                          posterUrl={getCoverUrl() || null}
                          title={publication?.metadata?.name}
                          url={url}
                        />
                      </div>
                    )
                  ) : SUPPORTED_AUDIO_TYPE.includes(type) ? (
                    <AudioPlayer
                      src={url}
                      isNew={isNew}
                      className={`${className}`}
                      publication={publication}
                    />
                  ) : SUPPORTED_IMAGE_TYPE.includes(type) ? (
                    <ImageWithFullScreenZoom
                      src={isNew ? url : imageProxy(url)}
                      className={`image-unselectable object-cover sm:rounded-lg w-full ${className}`}
                      alt={isNew ? url : publication?.metadata?.content}
                    />
                  ) : (
                    <></>
                  )}

                  {isNew && !hideDelete && (
                    <div className={clsx('absolute top-4 right-4')}>
                      <button
                        className="bg-black bg-opacity-70 rounded-full p-1"
                        onClick={() => {
                          // set proper currentMedia
                          removeAttachments([attachment.id])
                          setCurrentMedia(0)
                        }}
                      >
                        <AiOutlineClose className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              )
            }
          )}
        {/* <AttachmentMedia
          type={attachments[currentMedia].original.mimeType}
          url={
            SUPPORTED_VIDEO_TYPE.includes(
              attachments[currentMedia].original.mimeType
            )
              ? attachments[currentMedia].original.url
              : SUPPORTED_IMAGE_TYPE.includes(
                  attachments[currentMedia].original.mimeType
                )
              ? imageProxy(getIPFSLink(attachments[currentMedia].original.url))
              : getIPFSLink(attachments[currentMedia].original.url)
          }
          publication={publication}
          className={`${attachments.length > 1 ? 'h-[450px]' : className}`}
          // className={className}
        /> */}
      </div>
      {/* )} */}
    </>
  )
}

export default Attachment
