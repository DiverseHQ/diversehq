// import { useRouter } from 'next/router'
import { FC, useRef, useState } from 'react'
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose
} from 'react-icons/ai'
// import { getURLsFromText } from '../../utils/utils'
import getIPFSLink from '../User/lib/getIPFSLink'
import imageProxy from '../User/lib/imageProxy'
// import AttachmentCarousel from './AttachmentCarousel'
// import AttachmentMedia from './AttachmentMedia'
import clsx from 'clsx'
import { useSwipeable } from 'react-swipeable'
import { useUpdateEffect } from 'usehooks-ts'
import { AttachmentType, usePublicationStore } from '../../store/publication'
import { useDevice } from '../Common/DeviceWrapper'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import LivePeerVideoPlayback from '../Common/UI/LivePeerVideoPlayback'
import AudioPlayer from './AudioPlayer'
import LensPostCardFromPublicationId from './Cards/LensPostCardFromPublicationId'
import ChooseThumbnail from './ChooseThumbnail'
// import ReactEmbedo from './embed/ReactEmbedo'
import { AnyPublication } from '../../graphql/generated'
import getPublicationData, {
  MetadataAsset
} from '../../lib/post/getPublicationData'
// import { useDevice } from '../Common/DeviceWrapper'

interface MetadataAttachment {
  uri: string
  type: 'Image' | 'Video' | 'Audio'
}

interface Props {
  publication?: AnyPublication
  attachments?: MetadataAttachment[]
  newAttachments?: AttachmentType[]
  className?: String
  isNew?: boolean
  hideDelete?: boolean
  isComment?: boolean
  isAlone?: boolean
  asset?: MetadataAsset
}

const Attachment: FC<Props> = ({
  publication,
  className,
  attachments = [],
  newAttachments = [],
  isNew = false,
  hideDelete = false,
  isComment = false,
  isAlone = false,
  asset
}) => {
  const content = getPublicationData(
    publication?.__typename === 'Mirror'
      ? publication?.mirrorOn?.metadata
      : publication?.metadata
  )?.content

  const assetIsImage = asset?.type === 'Image'
  const assetIsVideo = asset?.type === 'Video'
  const assetIsAudio = asset?.type === 'Audio'

  const attachmentsHasImage = attachments.some(
    (attachment) => attachment.type === 'Image'
  )

  const determineDisplay = ():
    | 'displayVideoAsset'
    | 'displayAudioAsset'
    | 'displayImageAsset'
    | MetadataAttachment[]
    | null => {
    if (isNew) {
      if (newAttachments[0]?.type === 'Video') {
        return 'displayVideoAsset'
      }
      if (newAttachments[0]?.type === 'Audio') {
        return 'displayAudioAsset'
      }
      if (newAttachments[0]?.type === 'Image') {
        return 'displayImageAsset'
      }
    }

    if (assetIsVideo) {
      return 'displayVideoAsset'
    } else if (assetIsAudio) {
      return 'displayAudioAsset'
    } else if (attachmentsHasImage) {
      const imageAttachments = attachments.filter(
        (attachment) => attachment.type === 'Image'
      )

      return imageAttachments
    } else if (assetIsImage) {
      return 'displayImageAsset'
    }

    return null
  }

  const displayDecision = determineDisplay()

  // @ts-ignore
  const quotedPublicationId =
    publication?.__typename === 'Quote' ? publication?.quoteOn?.id : null
  const removeAttachments = usePublicationStore(
    (state) => state.removeAttachments
  )
  const removeCommentAttachments = usePublicationStore(
    (state) => state.removeCommentAttachments
  )
  const getCoverUrl = () => {
    return imageProxy(getIPFSLink(asset?.cover))
  }

  const setVideoDurationInSeconds = usePublicationStore(
    (state) => state.setVideoDurationInSeconds
  )

  const videoRef = useRef<HTMLVideoElement>(null)

  const onDataLoaded = () => {
    if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
      setVideoDurationInSeconds(videoRef.current.duration.toFixed(2))
    }
  }

  useUpdateEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded
    }
  }, [videoRef, attachments])

  const { isMobile } = useDevice()

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

  const handlers = useSwipeable({
    onSwipedLeft: handleNextClick,
    onSwipedRight: handlePrevClick,
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  // const { isMobile } = useDevice()

  // if (attachments?.length === 0) {
  //   if (quotedPublicationId && !isAlone) {
  //     return (
  //       <div className="px-4 sm:px-0">
  //         <LensPostCardFromPublicationId publicationId={quotedPublicationId} />
  //       </div>
  //     )
  //   }
  //   if (getURLsFromText(content)?.length > 0 && !isAlone) {
  //     return <ReactEmbedo url={getURLsFromText(content)[0]} />
  //   } else return null
  // }

  if (
    displayDecision === 'displayVideoAsset' ||
    displayDecision === 'displayAudioAsset'
  ) {
    attachments = attachments.slice(0, 1)
  }

  if (isNew) {
    if (isMobile) {
      return (
        <>
          <div className="relative " onClick={(e) => e.stopPropagation()}>
            {newAttachments.length > 1 && (
              <div className="relative w-full">
                <div
                  className={clsx(
                    'absolute top-[10px] left-[10px] text-white z-20 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg py-0.5 px-2 rounded-full'
                  )}
                >
                  {currentMedia + 1}/{newAttachments.length}
                </div>
              </div>
            )}
            <div
              {...handlers}
              style={{ overflow: 'hidden' }}
              className="reletive"
            >
              <div
                style={{
                  display: 'flex',
                  transition: 'transform 0.3s ease-out',
                  transform: `translateX(-${currentMedia * 100}%)`
                }}
              >
                {newAttachments.length > 0 &&
                  newAttachments.map(
                    (attachment: AttachmentType, index: number) => {
                      const url = attachment.previewItem

                      return (
                        <div
                          key={index}
                          style={{
                            width: '100%',
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          className="relative"
                        >
                          {attachment?.type === 'Video' ? (
                            <>
                              <video
                                src={url}
                                className={`image-unselectable object-contain sm:rounded-lg w-full ${className}`}
                                ref={videoRef}
                                controls
                                muted
                                autoPlay={false}
                                poster={getIPFSLink(attachment?.cover)}
                              />
                              <ChooseThumbnail />
                            </>
                          ) : attachment.type === 'Audio' ? (
                            <AudioPlayer
                              src={url}
                              isNew
                              hideDelete={hideDelete}
                              className={`${className}`}
                              publication={publication}
                            />
                          ) : attachment.type === 'Image' ? (
                            <ImageWithFullScreenZoom
                              src={url}
                              className={`image-unselectable shrink-0 object-cover sm:rounded-lg min-h-[200px] w-full`}
                              alt={url}
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
                                  if (isComment) {
                                    // @ts-ignore
                                    removeCommentAttachments([attachment.id])
                                  } else {
                                    // @ts-ignore
                                    removeAttachments([attachment.id])
                                  }
                                  setCurrentMedia(0)
                                }}
                              >
                                <AiOutlineClose className="w-6 h-6 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    }
                  )}
              </div>
            </div>
          </div>
          {quotedPublicationId && !isAlone && (
            <div className="sm:mt-4 mt-2 px-4 sm:px-0">
              <LensPostCardFromPublicationId
                publicationId={quotedPublicationId}
                // @ts-ignore
                publication={
                  publication?.__typename === 'Quote'
                    ? publication?.quoteOn
                    : null
                }
              />
            </div>
          )}
        </>
      )
    }

    return (
      <>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {newAttachments.length > 1 && (
            <>
              {currentMedia !== 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevClick()
                  }}
                  className="absolute left-0 top-[50%] z-20 p-1 rounded-full translate-x-[50%] -translate-y-[50%] bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg transition-all duration-300"
                >
                  <AiOutlineArrowLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {currentMedia !== newAttachments.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextClick()
                  }}
                  className="absolute right-0 top-[50%] z-20 p-1 rounded-full -translate-x-[50%] -translate-y-[50%] bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg transition-all duration-300"
                >
                  <AiOutlineArrowRight className="w-6 h-6 text-white" />
                </button>
              )}
              <div
                className={clsx(
                  'absolute top-[10px] left-[10px] text-white z-20 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg py-0.5 px-2 rounded-full',
                  // isNew ? 'left-[10px]' : 'right-[10px]',
                  'left-[10px]'
                )}
              >
                {currentMedia + 1}/{newAttachments.length}
              </div>
            </>
          )}

          {newAttachments.length > 0 &&
            newAttachments.map((attachment: AttachmentType, index: number) => {
              const url = attachment.previewItem
              return (
                <div key={index} className={currentMedia !== index && 'hidden'}>
                  {attachment?.type === 'Video' ? (
                    <>
                      <video
                        src={url}
                        className={`image-unselectable object-contain sm:rounded-lg w-full ${className}`}
                        controls
                        muted
                        ref={videoRef}
                        autoPlay={false}
                        poster={getCoverUrl()}
                      />
                      <ChooseThumbnail />
                    </>
                  ) : attachment?.type === 'Audio' ? (
                    <AudioPlayer
                      src={url}
                      isNew
                      hideDelete={hideDelete}
                      className={`${className}`}
                      publication={publication}
                    />
                  ) : attachment?.type === 'Image' ? (
                    <ImageWithFullScreenZoom
                      src={url}
                      className={`image-unselectable object-cover sm:rounded-lg min-h-[200px] ${className}`}
                      alt={url}
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
                          if (isComment) {
                            // @ts-ignore
                            removeCommentAttachments([attachment.id])
                          } else {
                            // @ts-ignore
                            removeAttachments([attachment.id])
                          }
                          setCurrentMedia(0)
                        }}
                      >
                        <AiOutlineClose className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
        </div>

        {quotedPublicationId && !isAlone && (
          <div className="sm:mt-4 mt-2 sm:px-0 px-4">
            <LensPostCardFromPublicationId
              publicationId={quotedPublicationId}
              // @ts-ignore
              publication={
                publication?.__typename === 'Quote'
                  ? publication?.quoteOn
                  : null
              }
            />
          </div>
        )}
      </>
    )
  }

  if (isMobile) {
    return (
      <>
        <div className="relative " onClick={(e) => e.stopPropagation()}>
          {Array.isArray(displayDecision) && displayDecision.length > 1 && (
            <div className="relative w-full">
              <div
                className={clsx(
                  'absolute top-[10px] left-[10px] text-white z-20 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg py-0.5 px-2 rounded-full'
                )}
              >
                {currentMedia + 1}/{attachments.length}
              </div>
            </div>
          )}
          <div
            {...handlers}
            style={{ overflow: 'hidden' }}
            className="reletive"
          >
            <div
              style={{
                display: 'flex',
                transition: 'transform 0.3s ease-out',
                transform: `translateX(-${currentMedia * 100}%)`
              }}
            >
              {Array.isArray(displayDecision) ? (
                <>
                  {displayDecision.map((attachment, index) => (
                    <div
                      key={index}
                      style={{
                        width: '100%',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="relative"
                    >
                      <ImageWithFullScreenZoom
                        src={String(attachment.uri)}
                        className={`image-unselectable object-cover sm:rounded-lg min-h-[200px] w-full`}
                        alt={content}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: '100%',
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    className="relative"
                  >
                    {displayDecision === 'displayImageAsset' && (
                      <ImageWithFullScreenZoom
                        src={asset.uri}
                        className={`image-unselectable object-cover sm:rounded-lg min-h-[200px] w-full`}
                        alt={publication?.by}
                      />
                    )}

                    {displayDecision === 'displayVideoAsset' && (
                      <div
                        className={`image-unselectable object-contain sm:rounded-lg w-full overflow-hidden flex items-center`}
                      >
                        <LivePeerVideoPlayback
                          posterUrl={getCoverUrl() || null}
                          url={getIPFSLink(asset.uri)}
                        />
                      </div>
                    )}

                    {displayDecision === 'displayAudioAsset' && (
                      <AudioPlayer
                        src={getIPFSLink(asset.uri)}
                        isNew={isNew}
                        hideDelete={hideDelete}
                        className={`${className}`}
                        publication={publication}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {quotedPublicationId && !isAlone && (
          <div className="sm:mt-4 mt-2 px-4 sm:px-0">
            <LensPostCardFromPublicationId
              publicationId={quotedPublicationId}
              // @ts-ignore
              publication={
                publication?.__typename === 'Quote'
                  ? publication?.quoteOn
                  : null
              }
            />
          </div>
        )}
      </>
    )
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
        {Array.isArray(displayDecision) && displayDecision.length > 1 && (
          <>
            {currentMedia !== 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevClick()
                }}
                className="absolute left-0 top-[50%] z-20 p-1 rounded-full translate-x-[50%] -translate-y-[50%] bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg transition-all duration-300"
              >
                <AiOutlineArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {currentMedia !== attachments.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextClick()
                }}
                className="absolute right-0 top-[50%] z-20 p-1 rounded-full -translate-x-[50%] -translate-y-[50%] bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg transition-all duration-300"
              >
                <AiOutlineArrowRight className="w-6 h-6 text-white" />
              </button>
            )}
            <div
              className={clsx(
                'absolute top-[10px] left-[10px] text-white z-20 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg py-0.5 px-2 rounded-full',
                // isNew ? 'left-[10px]' : 'right-[10px]',
                'left-[10px]'
              )}
            >
              {currentMedia + 1}/{attachments.length}
            </div>
          </>
        )}

        {Array.isArray(displayDecision) &&
          displayDecision.map((attachment, index) => (
            <div key={index} className={currentMedia !== index && 'hidden'}>
              <ImageWithFullScreenZoom
                src={String(attachment.uri)}
                className={`image-unselectable object-cover sm:rounded-lg min-h-[200px] w-full`}
                alt={content}
                key={index}
              />
            </div>
          ))}

        {displayDecision === 'displayImageAsset' && (
          <div className={currentMedia !== 0 && 'hidden'}>
            <ImageWithFullScreenZoom
              src={asset.uri}
              className={`image-unselectable object-cover sm:rounded-lg min-h-[200px] w-full`}
              alt={publication?.by}
            />
          </div>
        )}

        {displayDecision === 'displayVideoAsset' && (
          <div className={currentMedia !== 0 && 'hidden'}>
            <div
              className={`image-unselectable object-contain sm:rounded-lg w-full overflow-hidden flex items-center`}
            >
              <LivePeerVideoPlayback
                posterUrl={getCoverUrl() || null}
                url={getIPFSLink(asset.uri)}
              />
            </div>
          </div>
        )}

        {displayDecision === 'displayAudioAsset' && (
          <div className={currentMedia !== 0 && 'hidden'}>
            <AudioPlayer
              src={getIPFSLink(asset.uri)}
              isNew={isNew}
              hideDelete={hideDelete}
              className={`${className}`}
              publication={publication}
            />
          </div>
        )}
      </div>

      {quotedPublicationId && !isAlone && (
        <div className="sm:mt-4 mt-2 sm:px-0 px-4">
          <LensPostCardFromPublicationId publicationId={quotedPublicationId} />
        </div>
      )}
    </>
  )
}

export default Attachment
