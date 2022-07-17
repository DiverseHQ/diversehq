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
