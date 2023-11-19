import { v4 as uuid } from 'uuid'
import { useCallback } from 'react'

import { audio, image, textOnly, video } from '@lens-protocol/metadata'
import { usePublicationStore } from '../../store/publication'
import { appId } from '../../utils/config'

interface UsePublicationMetadataProps {
  baseMetadata: any
}

const useCommentMetadata = () => {
  const attachments = usePublicationStore((state) => state.commnetAttachments)
  const audioPublication = usePublicationStore(
    (state) => state.audioPublication
  )
  const videoThumbnail = usePublicationStore((state) => state.videoThumbnail)
  const videoDurationInSeconds = usePublicationStore(
    (state) => state.videoDurationInSeconds
  )
  // const publicationContent = usePublicationStore(
  //   (state) => state.publicationContent
  // );
  // const showLiveVideoEditor = usePublicationStore(
  //   (state) => state.showLiveVideoEditor
  // );
  // const liveVideoConfig = usePublicationStore((state) => state.liveVideoConfig);

  const attachmentsHasAudio = attachments[0]?.type === 'Audio'
  const attachmentsHasVideo = attachments[0]?.type === 'Video'

  const cover = attachmentsHasAudio
    ? audioPublication.cover
    : attachmentsHasVideo
    ? videoThumbnail.url
    : attachments[0]?.cover

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePublicationMetadataProps) => {
      // const urls = getURLsFromText(publicationContent)

      const hasAttachments = attachments.length
      const isImage = attachments[0]?.type === 'Image'
      const isAudio = attachments[0]?.type === 'Audio'
      const isVideo = attachments[0]?.type === 'Video'
      // const isMint = Boolean(getNft(urls)?.mintLink)
      // const isEmbed = Boolean(getEmbed(urls)?.embed)
      // const isLiveStream = Boolean(showLiveVideoEditor && liveVideoConfig.id)

      const localBaseMetadata = {
        id: uuid(),
        locale: 'en-US',
        appId: appId
      }

      const attachmentsToBeUploaded = attachments.map((attachment) => ({
        item: attachment.item,
        type: attachment.mimeType,
        cover: cover
      }))

      switch (true) {
        // case isMint:
        //   return mint({
        //     ...baseMetadata,
        //     ...localBaseMetadata,
        //     ...(hasAttachments && { attachments: attachmentsToBeUploaded }),
        //     mintLink: getNft(urls)?.mintLink
        //   })
        // case isEmbed:
        //   return embed({
        //     ...baseMetadata,
        //     ...localBaseMetadata,
        //     ...(hasAttachments && { attachments: attachmentsToBeUploaded }),
        //     embed: getEmbed(urls)?.embed
        //   })
        // case isLiveStream:
        //   return liveStream({
        //     ...baseMetadata,
        //     ...localBaseMetadata,
        //     liveUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
        //     playbackUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
        //     startsAt: new Date().toISOString()
        //   })
        case !hasAttachments:
          return textOnly({
            ...baseMetadata,
            ...localBaseMetadata
          })
        case isImage:
          return image({
            ...baseMetadata,
            ...localBaseMetadata,
            image: {
              item: attachments[0]?.item,
              type: attachments[0]?.mimeType
            },
            attachments: attachmentsToBeUploaded
          })
        case isAudio:
          return audio({
            ...baseMetadata,
            ...localBaseMetadata,
            audio: {
              item: attachments[0]?.item,
              type: attachments[0]?.mimeType,
              artist: audioPublication.author,
              cover: audioPublication.cover
            },
            attachments: attachmentsToBeUploaded
          })
        case isVideo:
          return video({
            ...baseMetadata,
            ...localBaseMetadata,
            video: {
              item: attachments[0]?.item,
              type: attachments[0]?.mimeType,
              duration: parseInt(videoDurationInSeconds)
            },
            attachments: attachmentsToBeUploaded
          })
        default:
          return null
      }
    },
    [attachments, videoDurationInSeconds, audioPublication, cover]
  )

  return getMetadata
}

export default useCommentMetadata
