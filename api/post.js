import apiEndpoint from './ApiEndpoint'

export const getAllPosts = async (limit, skips, sortBy) => {
  return await fetch(`${apiEndpoint}/post/getAllPosts?` + new URLSearchParams({
    limit,
    skips,
    sortBy
  })).then(r => r.json())
}

export const getSinglePostInfo = async (id) => {
  return await fetch(`${apiEndpoint}/post/singlePostInfo/${id}`).then(r => r.json())
}

export const putLikeOnPost = async (id, token) => {
  return await fetch(`${apiEndpoint}/post/like/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
}

export const postCreatePost = async (token, postData) => {
  return await fetch(`${apiEndpoint}/post`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(postData)
  }).then(r => r)
}
