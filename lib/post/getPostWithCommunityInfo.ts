import { getCommunityInfoUsingId } from '../../apiHelper/community'
import { PublicationQueryVariables } from '../../graphql/generated'
import { postWithCommunityInfoType } from '../../types/post'
// import { getCommunityInfoFromAppId } from '../../utils/helper'
import getSinglePublicationInfo from './get-single-publication-info'

export default async function getPostWithCommunityInfo(
  request: PublicationQueryVariables
): Promise<postWithCommunityInfoType> {
  try {
    const response = await getSinglePublicationInfo(request)
    console.log('response', response)
    if (!response.publication) {
      throw new Error('No publication found')
    }
    let post: postWithCommunityInfoType = null
    if (response?.publication?.__typename === 'Mirror') {
      // @ts-ignore
      post = response.publication.mirrorOn
      // @ts-ignore
      // post.originalMirrorPublication = response.publication
      // @ts-ignore
      post.mirroredBy = response.publication.by
      // @ts-ignore
      post.originalMirrorPublication = response.publication
    } else {
      // @ts-ignore
      post = response.publication
    }

    const communityId = post?.metadata?.tags?.[0]

    console.log('communityId', communityId)
    if (!communityId) {
      // post.communityInfo = getCommunityInfoFromAppId(post?.appId)
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
