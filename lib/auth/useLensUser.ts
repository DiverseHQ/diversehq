import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { STORAGE_KEY } from '../../auth-fetcher'
import { useDefaultProfileQuery } from '../../graphql/generated'
// import { parseJwt, removeAccessTokenFromStorage } from './helpers'

/**
 * DON'T USE THIS DIRECTLY! Use useLensUserContext.
 */
export default function useLensUser() {
  const { address } = useAccount()
  const localStorageQuery = useQuery(['lensUser'], () => {
    const user = localStorage.getItem(STORAGE_KEY)
    return user ? JSON.parse(user) : null
  })

  const lensProfileQuery = useDefaultProfileQuery(
    {
      request: {
        for: address
      }
    },
    {
      // Only fire the query if the address is available.
      enabled: !!address
    }
  )

  // When result.data is available, we can read the user from it (or null).
  useEffect(() => {
    // Re-run the lensProfileQuery if the address changes.
    if (!address) return
    // if (localStorageQuery?.data?.accessToken) {
    //   const data = parseJwt(localStorageQuery.data.accessToken)
    //   console.log('data?.id?.toLowerCase()', data?.id?.toLowerCase())
    //   if (data?.id?.toLowerCase() !== address?.toLowerCase()) {
    //     removeAccessTokenFromStorage()
    //     localStorageQuery.refetch()
    //   }
    // }
    if (address) {
      lensProfileQuery.refetch()
    }
  }, [localStorageQuery.data, address])

  return {
    isSignedIn: !!address && !!localStorageQuery.data,
    isLoading: lensProfileQuery.isLoading,
    hasProfile: !!lensProfileQuery.data?.defaultProfile,
    data: !!address && !!localStorageQuery.data ? lensProfileQuery.data : null,
    refetch: async () => {
      await localStorageQuery.refetch()
    }
  }
}
