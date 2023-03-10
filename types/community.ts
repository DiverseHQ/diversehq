import { Profile } from '../graphql/generated'

export type CommunityType = {
  _id?: string
  name?: string
  description?: string
  bannerImageUrl?: string
  logoImageUrl?: string
  creator?: string
  members?: string[]
  moderators?: string[]
  link?: string
  createdAt?: string
  updatedAt?: string
  creatorProfile?: Profile
  rules?: Rule[]
  bannedUsers?: BannedUser[]
  [key: string]: any
}

export interface CommunityWithCreatorProfile extends CommunityType {
  creatorProfile?: Profile
}

export type Rule = {
  title: string
  description: string
}

export type BannedUser = {
  address: string
  profileId: string
  reason: string
}
