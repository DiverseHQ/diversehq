import { Profile } from '../graphql/generated'

export type CommunityType = {
  _id?: string
  name?: string
  description?: string
  bannerImageUrl?: string
  logoImageUrl?: string
  creator?: string
  members?: string[]
  link?: string
  createdAt?: string
  updatedAt?: string
  creatorProfile?: Profile
  [key: string]: any
}

export interface CommunityWithCreatorProfile extends CommunityType {
  creatorProfile?: Profile
}
