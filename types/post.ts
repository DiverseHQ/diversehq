import { Post } from '../graphql/generated'
import { CommunityType } from './community'

export interface postWithCommunityInfoType extends Post {
  communityInfo: CommunityType
}
