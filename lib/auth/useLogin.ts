import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount, useSigner } from 'wagmi'
import {
  useChallengeQuery,
  useGetAccessTokenMutation,
  useGetDefaultProfileQuery
} from '../../graphql/generated'
import { useLensUserContext } from '../LensUserContext'
import { setAccessTokenToStorage } from './helpers'

/**
 * This function begins the full login flow for the user.
 * 1) Generate a challenge for the user to sign
 * 2) Use the signature from the challenge to get an access token
 * 3) Store the access token in local storage
 */
export default function useLogin() {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const queryClient = useQueryClient()
  const { refetch } = useLensUserContext()

  const { data: defaultProfile } = useGetDefaultProfileQuery(
    {
      request: {
        for: address
      }
    },
    {
      enabled: !!address
    }
  )

  const { data: challenge } = useChallengeQuery(
    {
      request: {
        signedBy: address,
        for: defaultProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!address && !!defaultProfile?.defaultProfile?.id
    }
  )

  const { mutateAsync: getAccessToken } = useGetAccessTokenMutation()
  async function login() {
    if (!address) {
      console.error('No address found. Cannot generateChallenge')
      return null
    }
    if (!signer) {
      console.error('No signer found. Cannot sign challenge')
      return null
    }

    // Generate a challenge for the user to sign

    if (!challenge?.challenge) {
      console.error('Failed to get challenge from Lens')
      return null
    }

    // Sign the challenge message
    const signature = await signer?.signMessage(challenge.challenge?.text)

    // Now, send the challenge and signature to the Lens API to get an access token
    const { accessToken, refreshToken } = (
      await getAccessToken({
        request: {
          id: challenge.challenge?.id,
          signature
        }
      })
    ).authenticate
    // Store the access token in local storage
    setAccessTokenToStorage(accessToken, refreshToken)

    // Invalidate the query so that the user is logged in
    queryClient.invalidateQueries({
      queryKey: ['lensUser']
    })
    await refetch()
  }

  // Return a useMutation hook that will call the login function
  return useMutation(login)
}
