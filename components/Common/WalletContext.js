import React, { useState, createContext, useEffect, useContext } from 'react'
import {
  useAccount,
  useDisconnect,
  //  useProvider,
  useSigner
  //  useDisconnect
} from 'wagmi'
import Web3Token from 'web3-token'
import {
  getLocalToken,
  removeLocalToken,
  setLocalToken
} from '../../utils/token'
import { getUserInfo } from '../../api/user'
import { removeAccessTokenFromStorage } from '../../lib/auth/helpers'
import { userRoles } from '../../utils/config'
import { useNotify } from './NotifyContext'
import { useQueryClient } from '@tanstack/react-query'
export const WalletContext = createContext([])

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { data: signer } = useSigner()
  const { notifyInfo } = useNotify()
  const { address, isDisconnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const { disconnect } = useDisconnect()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (signer && address) {
      if (getLocalToken()) {
        fetchWeb3Token(true)
      }
    }
  }, [signer, address])

  const handleDisconnected = async () => {
    setUser(null)
    setLoading(false)
    if (getLocalToken()) {
      removeLocalToken()
    }
    removeAccessTokenFromStorage()
    await queryClient.invalidateQueries({
      queryKey: ['lensUser', 'defaultProfile']
    })
  }

  useEffect(() => {
    if (isDisconnected && user) {
      handleDisconnected()
    }
  }, [isDisconnected])

  const refreshUserInfo = async () => {
    try {
      setLoading(true)
      if (!address) return
      const userInfo = await getUserInfo(address)
      if (userInfo && userInfo.role <= userRoles.WHITELISTED_USER) {
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

  const fetchWeb3Token = async (useEffectCalled = false) => {
    try {
      let existingTokenOnLocalStorage = null
      existingTokenOnLocalStorage = getLocalToken()

      try {
        //return if token is already in local storage and is not expired
        if (existingTokenOnLocalStorage) {
          const web3Token = Web3Token.verify(existingTokenOnLocalStorage)
          if (web3Token.address.toLowerCase() !== address.toLowerCase()) {
            removeLocalToken()
            removeAccessTokenFromStorage()
            setUser(null)
            setLoading(false)
            return
          } else if (
            web3Token &&
            new Date(web3Token?.body['expiration-time']) > new Date()
          ) {
            await refreshUserInfo()
            return
          }
        }
      } catch (error) {
        console.log('error from verfiying token', error)
      }
      console.log('useEffectCalled', useEffectCalled)
      if (useEffectCalled) return

      if (!existingTokenOnLocalStorage) {
        console.log('no existing token on local storage')
      }

      //if token is not in local storage or is expired, fetch a new one and save it to local storage and state
      if (!signer) {
        alert('No Signer but trying to sign in')
      }
      console.log('requesting signature from metamask')

      const signedToken = await Web3Token.sign(async (msg) => {
        try {
          return await signer.signMessage(msg)
        } catch (err) {
          const { reason } = err
          if (reason === 'unknown account #0') {
            return console.log(
              'Have you unlocked metamask and are connected to this page?'
            )
          }
          disconnect()

          console.log(err.toString())
        }
      }, '7d')
      console.log('signedToken', signedToken)

      setLocalToken(signedToken)
      await refreshUserInfo()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <WalletContext.Provider
      value={{ address, refreshUserInfo, user, fetchWeb3Token, loading }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
