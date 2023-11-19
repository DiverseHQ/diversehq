import { Mirror, Post, Profile } from '../graphql/generated'
import { MetadataDisplayType } from '../lib/interfaces/generic'
import { CommunityType } from './community'

/* eslint-disable */

export interface postWithCommunityInfoType extends Post {
  communityInfo?: CommunityType
  isLensCommunityPost?: boolean
  mirroredBy?: Profile
  originalMirrorPublication?: Mirror
}

export type Url = string
export type MimeType = string

export interface PublicationMetadataMedia {
  item: Url
  /**
   * This is the mime type of media
   */
  type?: MimeType | null

  /**
   * The alt tags for accessibility
   */
  altTag?: string | null

  /**
   * The cover for any video or audio you attached
   */
  cover?: string | null
}

export enum PublicationMetadataVersions {
  one = '1.0.0',
  // please use metadata v2 when doing anything! v1 is supported but discontinued.
  two = '2.0.0'
}

export interface PublicationMetadataAttribute {
  displayType?: MetadataDisplayType | undefined | null
  traitType?: string | undefined | null
  value: string
}
