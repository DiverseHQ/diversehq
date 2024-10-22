import { Profile } from '../graphql/generated'

export type CommunityType = {
  _id?: string
  name?: string
  description?: string
  label?: string
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
  verified?: boolean
  handle?: string
  Profile?: Profile
  isLensCommunity?: boolean
  membersCount?: number
  // hack to allow any other property
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

export type LensCommunity = {
  _id: string
  handle: string
  creator?: string
  bannedUsers?: BannedUser[]
  verified?: boolean
  rules?: Rule[]
  Profile?: Profile
  createdAt?: string
  updatedAt?: string
}
