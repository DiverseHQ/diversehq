import { endpoint, fetchData } from '../../auth-fetcher'
import { setAccessTokenToStorage } from './helpers'

export default async function refreshAccessToken(
  _refreshToken: string
): Promise<string> {
  console.log('refreshAccessToken', _refreshToken)
  if (!_refreshToken) return ''
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      query: `
     mutation Refresh($refreshToken: Jwt!) {
      refresh(request: {
        refreshToken: $refreshToken
      }) {
        accessToken
        refreshToken
      }
    }
      `,
      variables: {
        refreshToken: _refreshToken
      }
    })
  })
  const json = await res.json()
  console.log(json)
  if (json.errors) {
    const { message } = json.errors[0] || 'Error..'
    throw new Error(message)
  }

  const newTokenResult = json.data

  const { accessToken, refreshToken } = newTokenResult.refresh

  // Set in local storage
  setAccessTokenToStorage(accessToken, refreshToken)
  return String(accessToken)
}
