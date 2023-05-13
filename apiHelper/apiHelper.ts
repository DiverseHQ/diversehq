import { getAccessToken } from '../auth-fetcher'
import { encrypt } from '../utils/utils'
// import { getLocalToken } from '../utils/token'

export const getHeaders = async () => {
  // let token = getLocalToken()
  let token = await getAccessToken()

  const encrypted = encrypt(token)
  // console.log('encrypted', encrypted)
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: encrypted
    }
  } else {
    return {
      'Content-Type': 'application/json'
    }
  }
}
