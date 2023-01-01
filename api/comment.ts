import apiEndpoint from './ApiEndpoint'
import { CommentType } from '../utils/types'
import { getHeaders } from './apiHelper'

export const postComment = async (
  content: string,
  postId: string,
  appreciateAmount: number
): Promise<CommentType> => {
  return await fetch(`${apiEndpoint}/comment`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      content,
      postId,
      appreciateAmount: appreciateAmount > 0 ? appreciateAmount : 0
    })
  }).then((r) => r.json())
}

export const putEditComment = async (commentId: string, content: string) => {
  return await fetch(`${apiEndpoint}/comment/edit/${commentId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ content })
  }).then((res) => res)
}

export const deleteComment = async (commentId: string) => {
  return await fetch(`${apiEndpoint}/comment/${commentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then((r) => r.json())
}

export const getCommentFromCommentId = async (commentId: string) => {
  return await fetch(`${apiEndpoint}/comment/${commentId}`).then((r) => r)
}

export const putLikeComment = async (commentId: string) => {
  return await fetch(`${apiEndpoint}/comment/like/${commentId}`, {
    method: 'PUT',
    headers: getHeaders()
  }).then((res) => res)
}

export const getCommentsFromPostId = async (
  postId: string,
  limit: number,
  skips: number,
  sortBy: string
) => {
  return await fetch(
    `${apiEndpoint}/comment/getCommentsOfPost/${postId}?` +
      new URLSearchParams({
        limit: limit.toString(),
        skips: skips.toString(),
        sortBy
      })
  ).then((r) => r)
}

export const putUpvoteComment = async (commentId: string) => {
  return await fetch(`${apiEndpoint}/comment/upvote/${commentId}`, {
    method: 'PUT',
    headers: getHeaders()
  }).then((res) => res)
}

export const putDownvoteComment = async (commentId: string) => {
  return await fetch(`${apiEndpoint}/comment/downvote/${commentId}`, {
    method: 'PUT',
    headers: getHeaders()
  })
}
