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

export const getUserPosts = async (walletAddress) => {
  return await fetch(`${apiEndpoint}/post/getPostsOfUser/${walletAddress}`)
    .then(res => res.json())
}
