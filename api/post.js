import apiEndpoint from './ApiEndpoint'

export const getAllPosts = async (PerPage, page, sortBy) => {
  return await fetch(`${apiEndpoint}/post/getAllPosts?` + new URLSearchParams({
    PerPage,
    page,
    sortBy
  })).then(r => r.json())
}
