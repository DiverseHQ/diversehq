import { getAccessToken } from '../auth-fetcher'
import { encrypt } from '../utils/utils'
// import { getLocalToken } from '../utils/token'

export const getHeaders = async () => {
  // let token = getLocalToken()
  let token = await getAccessToken()
  const encryptedToken = encrypt(token)
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: encryptedToken
    }
  } else {
    return {
      'Content-Type': 'application/json'
    }
  }
}
