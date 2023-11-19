import { readAccessTokenFromStorage, isTokenExpired } from './lib/auth/helpers'
import refreshAccessToken from './lib/auth/refreshAccessToken'
import { lensApiEndpoint } from './utils/config'

export const STORAGE_KEY = 'LH_STORAGE_KEY'
/* eslint-disable */

export async function getAccessToken(): Promise<string | null> {
  const tokenValue = readAccessTokenFromStorage()

  // If the token is not in localStorage, then the user is not logged in
  if (!tokenValue) {
    return null
  }

  let accessTokenValue = tokenValue.accessToken

  // If the exp is less than the current time, then the token has expired
  if (isTokenExpired(tokenValue.exp)) {
    console.log('token expired')

    // If the token has expired, then we need to refresh the token
    accessTokenValue = await refreshAccessToken(tokenValue.refreshToken)
  }

  // If the token has not expired, then we can use the accessToken
  return accessTokenValue
}

export const fetchData = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers']
): (() => Promise<TData>) => {
  return async () => {
    // If on server, then don't try to get an access token

    const accessToken = await getAccessToken()

    const res = await fetch(lensApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options ?? {}),
        ...(accessToken
          ? {
              'x-access-token': `Bearer ${accessToken}`
            }
          : {}),

        // Cors
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    const json = await res.json()

    if (json.errors) {
      console.log(json.errors)
      const { message } = json.errors[0] || 'Error..'
      // @ts-ignore
      // if (typeof window !== 'undefined') {
      //   window.location.reload()
      // }
      console.log('message', message)
      // throw new Error(message)
    }

    return json.data
  }
}
