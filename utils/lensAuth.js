import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const API_URL = 'https://api.lens.dev'

/* configuring Apollo GraphQL Client */
const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('STORAGE_KEY')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.accessToken}` : ''
    }
  }
})

const httpLink = createHttpLink({
  uri: API_URL
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
})

//Parse the token and return the expiration date
export function parseJwt(token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

// Authenticate
export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`

export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`

// Refresh Auth Token
const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }`

const refreshAuth = async (refreshToken) => {
  const result = await client.mutate({
    mutation: gql(REFRESH_AUTHENTICATION),
    variables: {
      request: {
        refreshToken
      }
    }
  })
  console.log('Refresh result', result)
  return result
}
// const refreshAuth = gql`
//   mutation Refresh {
//     refresh(request: {
//       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
//     }) {
//       accessToken
//       refreshToken
//     }
//   }
// `

export async function refreshAuthToken() {
  const token = JSON.parse(localStorage.getItem('STORAGE_KEY'))
  console.log('LensToken', token)
  if (!token) return
  try {
    console.log('token:', { token })
    const authData = await refreshAuth(token.refreshToken)

    console.log('authData:', { authData })
    const { accessToken, refreshToken } = authData.data.refresh
    const exp = parseJwt(refreshToken).exp

    localStorage.setItem(
      'STORAGE_KEY',
      JSON.stringify({
        accessToken,
        refreshToken,
        exp
      })
    )
  } catch (err) {
    console.log('error:', err)
  }
}

// GET Default Profile
export const GET_DEFAULT_PROFILES = `
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
  }
`

export const getDefaultProfile = gql`
  query DefaultProfile($address: EthereumAddress!) {
    defaultProfile(request: { ethereumAddress: $address }) {
      id
      handle
    }
  }
`
