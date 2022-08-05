import apiEndpoint from './ApiEndpoint'

export const getPostOfCommunity = async (communityName, limit, skips, sortBy) => {
  return await fetch(`${apiEndpoint}/post/getPostsOfCommunity/${communityName}?` + new URLSearchParams({
    limit,
    skips,
    sortBy
  }))
    .then(res => res.json())
}

export const getCommunityInfo = async (name) => {
  return await fetch(`${apiEndpoint}/community/communityInfoUsingName/${name}`)
    .then(res => res.json())
}

export const putJoinCommunity = async (communityId, token) => {
  return await fetch(`${apiEndpoint}/community/join/${communityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  }).then(res => res.json())
}

export const putLeaveCommunity = async (communityId, token) => {
  return await fetch(`${apiEndpoint}/community/leave/${communityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  }).then(res => res.json())
}

export const getAllCommunities = async (limit, skips, sortBy) => {
  return await fetch(`${apiEndpoint}/community/getAllCommunities?` + new URLSearchParams({
    limit,
    skips,
    sortBy
  })).then(res => res.json())
}

export const postCreateCommunity = async (token, communityData) => {
  return await fetch(`${apiEndpoint}/community`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(communityData)
  }).then(res => res.json())
}
