import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const getUserInfo = async (walletAddress) => {
  return await fetch(`${apiEndpoint}/user/${walletAddress}`).then((res) =>
    res.json()
  )
}

export const getWhitelistStatus = async (walletAddress) => {
  return await fetch(
    `${apiEndpoint}/user/checkWhitelist/${walletAddress}`
  ).then((res) => res)
}

export const postUser = async () => {
  return await fetch(`${apiEndpoint}/user`, {
    method: 'POST',
    headers: getHeaders()
  })
    .then((r) => r.json())
    .then((res) => {
      console.log(res)
    })
}

export const getUserPosts = async (walletAddress, limit, skips, sortBy) => {
  return await fetch(
    `${apiEndpoint}/post/getPostsOfUser/${walletAddress}?` +
      new URLSearchParams({
        limit,
        skips,
        sortBy
      })
  ).then((res) => res.json())
}

export const putUpdateUser = async (profileData) => {
  return await fetch(`${apiEndpoint}/user`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  }).then((r) => r)
}
