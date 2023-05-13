import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const submitPostForReview = async (
  lensCommunityId: string,
  contentUri: string
) => {
  return await fetch(`${apiEndpoint}/review-lens-community-posts/submit-post`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({
      lensCommunityId,
      contentUri
    })
  })
}

export const getAllUnResolvedLensCommunityPostsForReview = async (
  lensCommunityId: string
) => {
  if (!lensCommunityId) return
  return await fetch(
    `${apiEndpoint}/review-lens-community-posts/unresolved-posts/${lensCommunityId}`,
    {
      headers: await getHeaders()
    }
  )
}

export const putResolveLensCommunityPost = async (
  reviewPostId: string,
  resolveAction: string,
  publicationId?: string
) => {
  return await fetch(
    `${apiEndpoint}/review-lens-community-posts/resolve-post`,
    {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        reviewPostId,
        resolveAction,
        publicationId
      })
    }
  )
}
