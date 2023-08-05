import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
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
import { getUserInfo, removeSubscription } from '../../apiHelper/user'
import { removeAccessTokenFromStorage } from '../../lib/auth/helpers'
import {
  getLocalToken,
  removeLocalToken
  // setLocalToken
} from '../../utils/token'
// import { userRoles } from '../../utils/config'
import { useQueryClient } from '@tanstack/react-query'
import { useLensUserContext } from '../../lib/LensUserContext'
import { UserType } from '../../types/user'
import { useNotify } from './NotifyContext'

import { getBulkIsFollowedByMe } from '../../lib/profile/get-bulk-is-followed-by-me'
import { LensCommunity } from '../../types/community'
// import getProfiles from '../../lib/profile/get-profiles'
// import { Profile } from '../../graphql/generated'
import {
  getAllLensCommunitiesHandle,
  getLensCommunity
} from '../../apiHelper/lensCommunity'
import { ProfileMedia } from '../../graphql/generated'
import { useProfileStore } from '../../store/profile'
import { subscribeUserToPush } from '../../utils/notification'
// import { whitelistedAddresses } from '../../utils/profileIds'
export interface IsFollowedLensCommunityType {
  _id: string
  handle: string
  createdAt?: string
  isFollowedByMe: boolean
  picture: ProfileMedia
  stats: {
    totalFollowers: number
  }
  verified?: boolean
}

interface ContextType {
  address: string
  refreshUserInfo: () => Promise<void>
  fetchAndSetLensCommunity: () => void
  user: UserType
  loading: boolean
  LensCommunity: LensCommunity
  joinedLensCommunities: IsFollowedLensCommunityType[]
  allLensCommunities: IsFollowedLensCommunityType[]
}

export const WalletContext = createContext<ContextType>(null)

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState<UserType>(null)
  // const { data: signer } = useSigner()
  const { notifyError } = useNotify()
  const { address, isDisconnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [LensCommunity, setLensCommunity] = useState(null)
  const [allLensCommunities, setAllLensCommunities] = useState<
    IsFollowedLensCommunityType[]
  >([])
  const [joinedLensCommunities, setJoinedLensCommunties] = useState<
    IsFollowedLensCommunityType[]
  >([])
  const { data: signer } = useSigner()
  const addProfile = useProfileStore((state) => state.addProfile)
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
      // @ts-ignore
      addProfile(lensProfile?.defaultProfile?.id, lensProfile?.defaultProfile)
      refreshUserInfo()
      fetchAndSetLensCommunity()
    } else {
      setUser(null)
      setLoading(false)
      setLensCommunity(null)
    }
  }, [isSignedIn, hasProfile, address, signer])

  const handleDisconnected = async () => {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js',
        {
          scope: '/'
        }
      )
      if (registration) {
        const exisitngSubscription =
          await registration.pushManager.getSubscription()
        if (exisitngSubscription) {
          await removeSubscription(exisitngSubscription)
        }
      }
    }
    setUser(null)
    setLoading(false)
    removeAccessTokenFromStorage()
    // delete subscription from db
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
    // const res = await getLensCommunity('youmemeworld.lens')
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
      const _allLensCommunities = await getAllLensCommunitiesHandle()
      // loop through all communities in group of 50 and check if lens user follows them
      // const _joinedLensCommunities = []
      let cursor = null

      const promiseList = []

      for (let i = 0; i < _allLensCommunities.length; i += 50) {
        promiseList.push(
          getBulkIsFollowedByMe({
            cursor: cursor,
            handles: _allLensCommunities.slice(i, i + 50).map((c) => c.handle),
            limit: 50
          })
        )
      }

      const _allLensCommunitiesInDetail = (await Promise.all(promiseList))
        .flat(Infinity)
        .map((a) => a.profiles.items)
        .flat(Infinity)
      const allLensCommunitiesInDetail = _allLensCommunitiesInDetail.map(
        (c) => ({
          ...c,
          _id: _allLensCommunities.find((l) => l.handle === c.handle)?._id,
          verified: _allLensCommunities.find((l) => l.handle === c.handle)
            .verified,
          createdAt: _allLensCommunities.find((l) => l.handle === c.handle)
            .createdAt
        })
      )
      const _joinedLensCommunities: IsFollowedLensCommunityType[] =
        allLensCommunitiesInDetail.filter((c) => c.isFollowedByMe)

      setAllLensCommunities(allLensCommunitiesInDetail)
      setJoinedLensCommunties(_joinedLensCommunities)
    }, [user, lensProfile?.defaultProfile?.id])

  useEffect(() => {
    if (user && lensProfile?.defaultProfile?.id) {
      getAllLensCommunitiesAndSetJoinedLensCommunities()
    } else {
      setLensCommunity(null)
    }
  }, [user?._id, lensProfile])

  const refreshUserInfo = async () => {
    try {
      setLoading(true)
      if (!address) return
      const userInfo = await getUserInfo(address)
      // console.log('userInfo', userInfo)
      if (userInfo) {
        setUser(userInfo)
        setLoading(false)
        subscribeUserToPush()
      } else {
        notifyError('Something went wrong. Please try again later.')
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
        joinedLensCommunities,
        allLensCommunities
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
