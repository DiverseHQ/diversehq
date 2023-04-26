import { getCommunityInfoUsingId } from '../../api/community'
import { PublicationQueryVariables } from '../../graphql/generated'
import { postWithCommunityInfoType } from '../../types/post'
import { getCommunityInfoFromAppId } from '../../utils/helper'
import getSinglePublicationInfo from './get-single-publication-info'

export default async function getPostWithCommunityInfo(
  request: PublicationQueryVariables
): Promise<postWithCommunityInfoType> {
  try {
    const response = await getSinglePublicationInfo(request)
    if (!response.publication) {
      throw new Error('No publication found')
    }
    let post: postWithCommunityInfoType = null
    if (response?.publication?.__typename === 'Post') {
      // @ts-ignore
      post = response.publication
    } else if (response?.publication?.__typename === 'Mirror') {
      // @ts-ignore
      post = response.publication.mirrorOf
      // @ts-ignore
      post.originalMirrorPublication = response.publication
      // @ts-ignore
      post.mirroredBy = response.publication.profile

      // @ts-ignore
      post.originalMirrorPublication = response.publication
    } else if (response?.publication?.__typename === 'Comment') {
      // @ts-ignore
      post = response.publication
    }

    const communityId = post?.metadata?.tags?.[0]
    if (!communityId) {
      post.communityInfo = getCommunityInfoFromAppId(post?.appId)
      return post
    }
    const communityInfo = await getCommunityInfoUsingId(communityId)
    if (communityInfo?.handle) {
      post.communityInfo = communityInfo
      post.isLensCommunityPost = true
      return post
    } else if (communityInfo?._id) {
      post.communityInfo = communityInfo
      return post
    } else {
      return post
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
