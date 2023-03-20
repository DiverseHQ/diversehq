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
import { getLensCommunity } from '../../api/community'
import { LensCommunity } from '../../types/community'

interface ContextType {
  address: string
  refreshUserInfo: () => void
  fetchAndSetLensCommunity: () => void
  user: UserType
  loading: boolean
  LensCommunity: LensCommunity
}

export const WalletContext = createContext<ContextType>(null)

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState<UserType>(null)
  // const { data: signer } = useSigner()
  const { notifyInfo } = useNotify()
  const { address, isDisconnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [LensCommunity, setLensCommunity] = useState(null)
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
      setLensCommunity(resJson)
    }
  }, [lensProfile?.defaultProfile?.handle])

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
        fetchAndSetLensCommunity
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
