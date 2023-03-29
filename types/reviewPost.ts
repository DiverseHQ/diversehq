import { Profile } from '../graphql/generated'

export type ReviewPostType = {
  _id: string
  lensCommunityId?: string
  contentUri?: string
  createdBy?: string
  publicationId?: string
  isResolved?: boolean
  resolveAction?: string
  authorProfile?: Profile
  createdAt?: string
  updatedAt?: string
  contentData?: any
}
