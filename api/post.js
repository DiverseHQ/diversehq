import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const getAllPosts = async (limit, skips, sortBy) => {
  return await fetch(
    `${apiEndpoint}/post/getAllPosts?` +
      new URLSearchParams({
        limit,
        skips,
        sortBy
      })
  ).then((r) => r.json())
}

export const getSinglePostInfo = async (id) => {
  return await fetch(`${apiEndpoint}/post/singlePostInfo/${id}`).then((r) => r)
}

export const putLikeOnPost = async (id) => {
  return await fetch(`${apiEndpoint}/post/like/${id}`, {
    method: 'PUT',
    headers: getHeaders()
  })
}

export const postCreatePost = async (postData) => {
  return await fetch(`${apiEndpoint}/post`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(postData)
  }).then((r) => r)
}

export const deletePost = async (id) => {
  return await fetch(`${apiEndpoint}/post/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

export const getNumberOfPostsInCommunity = async (communityId) => {
  return await fetch(
    `${apiEndpoint}/post/numberOfPostsInCommunity?` +
      new URLSearchParams({ communityId })
  ).then((r) => r.json())
}

export const getNumberOfPostsUsingUserAddress = async (address) => {
  return await fetch(
    `${apiEndpoint}/post/numberOfPostsOfUserAddress?` +
      new URLSearchParams({ address })
  ).then((r) => r.json())
}

export const putUpvoteOnPost = async (id) => {
  return await fetch(`${apiEndpoint}/post/upvote/${id}`, {
    method: 'PUT',
    headers: getHeaders()
  })
}

export const putDownvoteOnPost = async (id) => {
  return await fetch(`${apiEndpoint}/post/downvote/${id}`, {
    method: 'PUT',
    headers: getHeaders()
  })
}
