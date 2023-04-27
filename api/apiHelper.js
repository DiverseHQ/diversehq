import { getAccessToken } from '../auth-fetcher'
// import { getLocalToken } from '../utils/token'

export const getHeaders = async () => {
  // let token = getLocalToken()
  let token = await getAccessToken()
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: token
    }
  } else {
    return {
      'Content-Type': 'application/json'
    }
  }
}
