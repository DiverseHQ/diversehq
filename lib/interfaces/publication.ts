import { MediaOutput } from '../../graphql/generated'
import { GenericMetadata, MetadataDisplayType } from './generic'

interface MetadataMedia {
  item: string
  /**
   * This is the mime type of media
   */
  type: string
}

export interface MetadataAttribute {
  displayType?: MetadataDisplayType
  traitType?: string
  value: string
}

export interface Metadata extends GenericMetadata {
  description?: string
  content?: string
  external_url?: string | null
  name: string
  attributes: MetadataAttribute[]
  image?: string | null
  imageMimeType?: string | null
  media?: MediaOutput[]
  animation_url?: string
  locale: string
  tags?: string[]
  contentWarning?: PublicationContentWarning
  mainContentFocus: PublicationMainFocus
}

export enum PublicationContentWarning {
  NSFW = 'NSFW',
  SENSITIVE = 'SENSITIVE',
  SPOILER = 'SPOILER'
}

export enum PublicationMainFocus {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  ARTICLE = 'ARTICLE',
  TEXT_ONLY = 'TEXT_ONLY',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  EMBED = 'EMBED'
}

export const supportedMimeTypes: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/x-ms-bmp',
  'image/svg+xml',
  'image/webp',
  'video/webm',
  'video/mp4',
  'video/x-m4v',
  'video/ogv',
  'video/ogg',
  'audio/wav',
  'audio/mpeg',
  'audio/ogg'
]
