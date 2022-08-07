import apiEndpoint from './ApiEndpoint'

export const getUserInfo = async (walletAddress) => {
  return await fetch(`${apiEndpoint}/user/${walletAddress}`)
    .then(res => res.json())
}

export const postUser = async (signedToken) => {
  return await fetch(`${apiEndpoint}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: signedToken
    }
  }).then(r => r.json()).then(res => {
    console.log(res)
  })
}

export const getUserPosts = async (walletAddress,limit,skips,sortBy) => {
  return await fetch(`${apiEndpoint}/post/getPostsOfUser/${walletAddress}?` + new URLSearchParams({
    limit,
    skips,
    sortBy
  }))
    .then(res => res.json())
}

export const putUpdateUser = async (token, profileData) => {
  return await fetch(`${apiEndpoint}/user`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(profileData)
  }).then(r => r)
}
