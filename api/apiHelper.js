import { getLocalToken } from '../utils/token'

export const getHeaders = () => {
  let token = getLocalToken()
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: getLocalToken()
    }
  } else {
    return {
      'Content-Type': 'application/json'
    }
  }
}
