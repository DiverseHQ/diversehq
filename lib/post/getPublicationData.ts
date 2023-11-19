import { PublicationMetadata } from '../../graphql/generated'
import { DEFAULT_OG_IMAGE } from '../../utils/config'
import getAttachmentsData from './getAttachmentsData'

export interface MetadataAsset {
  type: 'Image' | 'Video' | 'Audio'
  uri: string
  cover?: string
  artist?: string
  title?: string
}

const getPublicationData = (
  metadata: PublicationMetadata
): {
  content?: string
  asset?: MetadataAsset
  attachments?: {
    uri: string
    type: 'Image' | 'Video' | 'Audio'
  }[]
} | null => {
  if (!metadata) return null
  switch (metadata.__typename) {
    case 'ArticleMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'TextOnlyMetadataV3':
    case 'LinkMetadataV3':
      return {
        content: metadata.content
      }
    case 'ImageMetadataV3':
      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.image.optimized?.uri,
          type: 'Image'
        },
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'AudioMetadataV3':
      // eslint-disable-next-line no-case-declarations
      const audioAttachments = getAttachmentsData(metadata.attachments)[0]

      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.audio.optimized?.uri || audioAttachments?.uri,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            audioAttachments?.coverUri ||
            DEFAULT_OG_IMAGE,
          artist: metadata.asset.artist || audioAttachments?.artist,
          title: metadata.title,
          type: 'Audio'
        }
      }
    case 'VideoMetadataV3':
      // eslint-disable-next-line no-case-declarations
      const videoAttachments = getAttachmentsData(metadata.attachments)[0]

      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.video.optimized?.uri || videoAttachments?.uri,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            videoAttachments?.coverUri ||
            DEFAULT_OG_IMAGE,
          type: 'Video'
        }
      }
    case 'MintMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'EmbedMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'LiveStreamMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    default:
      return null
  }
}

export default getPublicationData
