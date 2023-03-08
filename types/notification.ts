import { Profile } from '../graphql/generated'
import { CommunityType } from './community'
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
  [key: string]: any
}

export interface CommunityNotificationType extends NotificationSchema {
  community?: CommunityType
}
