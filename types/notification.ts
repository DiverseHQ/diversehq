import { Profile } from '../graphql/generated'
import { CommunityType, LensCommunity } from './community'
import { UserType } from './user'

export interface NotificationSchema {
  _id: string
  type?: number
  refId?: string
  sender?: UserType
  receiver?: string
  createdAt?: string
  updatedAt?: string
  isRead?: boolean
  senderLensProfile?: Profile
  extraInfo?: string
  community?: CommunityType
  lensCommunity?: LensCommunity
  reviewLensCommunityPost?: ReviewLensCommunityPost
  [key: string]: any
}

export interface ReviewLensCommunityPost {
  _id: string
  contentUri: string
  createdAt: string
  updatedAt: string
  isResolved?: boolean
  lensCommunityId?: string
  publicationId?: string
}

export interface CommunityNotificationType extends NotificationSchema {
  community?: CommunityType
}
