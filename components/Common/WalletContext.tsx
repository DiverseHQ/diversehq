import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useCallback
} from 'react'
import {
  useAccount,
  useSigner
  // useDisconnect,
  //  useProvider,
  // useSigner
  //  useDisconnect
} from 'wagmi'
// import Web3Token from 'web3-token'
import {
  getLocalToken,
  removeLocalToken
  // setLocalToken
} from '../../utils/token'
import { getUserInfo } from '../../api/user'
import { removeAccessTokenFromStorage } from '../../lib/auth/helpers'
import { userRoles } from '../../utils/config'
import { useNotify } from './NotifyContext'
import { useQueryClient } from '@tanstack/react-query'
import { useLensUserContext } from '../../lib/LensUserContext'
import { UserType } from '../../types/user'
import { sleep } from '../../lib/helpers'

import { LensCommunity } from '../../types/community'
import { getBulkIsFollowedByMe } from '../../lib/profile/get-bulk-is-followed-by-me'
import getProfiles from '../../lib/profile/get-profiles'
import { Profile } from '../../graphql/generated'
import {
  getAllLensCommunitiesHandle,
  getLensCommunity
} from '../../api/lensCommunity'

interface ContextType {
  address: string
  refreshUserInfo: () => void
  fetchAndSetLensCommunity: () => void
  user: UserType
  loading: boolean
  LensCommunity: LensCommunity
  joinedLensCommunities: {
    _id: string
    handle: string
    Profile: Profile
  }[]
}

export const WalletContext = createContext<ContextType>(null)

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState<UserType>(null)
  // const { data: signer } = useSigner()
  const { notifyInfo } = useNotify()
  const { address, isDisconnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [LensCommunity, setLensCommunity] = useState(null)
  const [joinedLensCommunities, setJoinedLensCommunties] = useState<
    {
      _id: string
      handle: string
      Profile: Profile
    }[]
  >([])
  const { data: signer } = useSigner()
  // const { disconnect } = useDisconnect()
  const queryClient = useQueryClient()
  const {
    refetch,
    isSignedIn,
    hasProfile,
    data: lensProfile
  } = useLensUserContext()

  useEffect(() => {
    if (isSignedIn && hasProfile && address) {
      // fetchWeb3Token(true)
      console.log('refreshing user info')
      refreshUserInfo()
      fetchAndSetLensCommunity()
    } else {
      setUser(null)
      setLoading(false)
      setLensCommunity(null)
    }
  }, [isSignedIn, hasProfile, address, signer])

  const handleDisconnected = async () => {
    setUser(null)
    setLoading(false)
    removeAccessTokenFromStorage()
    localStorage.removeItem('mostPostedCommunities')
    localStorage.removeItem('recentCommunities')
    await queryClient.invalidateQueries({
      queryKey: ['lensUser', 'defaultProfile']
    })
    await refetch()
  }

  useEffect(() => {
    if (isDisconnected && user) {
      handleDisconnected()
    }
  }, [isDisconnected])

  const fetchAndSetLensCommunity = useCallback(async () => {
    const res = await getLensCommunity(lensProfile?.defaultProfile?.handle)
    if (res.status !== 200) return
    if (res.status === 200) {
      const resJson = await res.json()
      setLensCommunity({ ...resJson, Profile: lensProfile?.defaultProfile })
    }
  }, [lensProfile?.defaultProfile?.handle])

  const getAllLensCommunitiesAndSetJoinedLensCommunities =
    useCallback(async () => {
      if (!user || !lensProfile?.defaultProfile?.id) return
      // todo optimize this, currently fetching all communities and then filtering
      const allLensCommunities = await getAllLensCommunitiesHandle()

      // loop through all communities in group of 50 and check if lens user follows them
      const _joinedLensCommunities = []
      let cursor = null
      for (let i = 0; i < allLensCommunities.length; i += 50) {
        const { profiles } = await getBulkIsFollowedByMe({
          cursor: cursor,
          handles: allLensCommunities.slice(i, i + 50).map((c) => c.handle),
          limit: 50
        })

        profiles.items.forEach((profile, index) => {
          if (profile.isFollowedByMe) {
            _joinedLensCommunities.push(allLensCommunities[i + index])
          }
        })
        cursor = profiles.pageInfo.next
      }

      // remove communities from where user in banned

      cursor = null
      for (let i = 0; i < _joinedLensCommunities.length; i += 50) {
        const { profiles } = await getProfiles({
          cursor: cursor,
          handles: _joinedLensCommunities.slice(i, i + 50).map((c) => c.handle),
          limit: 50
        })

        profiles.items.forEach((profile, index) => {
          _joinedLensCommunities[i + index] = {
            ..._joinedLensCommunities[i + index],
            Profile: profile
          }
        })
        cursor = profiles.pageInfo.next
      }

      setJoinedLensCommunties(_joinedLensCommunities)
    }, [user, lensProfile?.defaultProfile?.id])

  useEffect(() => {
    if (user) {
      getAllLensCommunitiesAndSetJoinedLensCommunities()
    } else {
      setLensCommunity(null)
    }
  }, [user?._id])

  const refreshUserInfo = async () => {
    try {
      setLoading(true)
      await sleep(2000)
      if (!address) return
      const userInfo = await getUserInfo(address)
      if (userInfo && userInfo.role <= userRoles.NORMAL_USER) {
        setUser(userInfo)
      } else {
        notifyInfo(
          'You are not whitelisted yet. Join our discord to get whitelisted.'
        )
        setUser(null)
        if (getLocalToken()) {
          removeLocalToken()
        }
        removeAccessTokenFromStorage()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        refreshUserInfo,
        user,
        loading,
        LensCommunity,
        fetchAndSetLensCommunity,
        joinedLensCommunities
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
