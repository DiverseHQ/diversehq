import React, { useState, createContext, useEffect, useContext } from 'react'
import {
  useAccount,
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
// import { useNotify } from './NotifyContext'
import { removeAccessTokenFromStorage } from '../../lib/auth/helpers'
import { userRoles } from '../../utils/config'
import { useNotify } from './NotifyContext'
export const WalletContext = createContext([])

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { data: signer } = useSigner()
  const { notifyInfo } = useNotify()
  const { address, isDisconnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('onConnect', address, connector, isReconnected)
    }
  })

  // uncomment this if you want to enable whitelist access
  // const [isWhitelisted, setIsWhitelisted] = useState(false)

  // const checkWhitelistStatus = async () => {
  //   try {
  //     const res = await getWhitelistStatus(address)
  //     const resData = await res.json()
  //     console.log('resData in checkWhitelistStatus', resData)
  //     if (res.status === 200 && resData === true) {
  //       setIsWhitelisted(resData)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   if (address) {
  //     checkWhitelistStatus()
  //   }
  // }, [address])

  // useEffect(() => {
  //   // only allow whitelisted addresses to use the system
  //   if (signer && address && isWhitelisted) {
  //     console.log('generating token for api')
  //     // refetchToken()
  //     fetchWeb3Token()
  //   }
  // }, [signer, address, isWhitelisted])

  useEffect(() => {
    if (signer && address) {
      console.log('generating token for api')
      fetchWeb3Token()
    }
  }, [signer, address])

  useEffect(() => {
    if (isDisconnected) {
      console.log('isDisconnected', isDisconnected)
      setUser(null)
      if (getLocalToken()) {
        removeLocalToken()
      }
      removeAccessTokenFromStorage()
    }
  }, [isDisconnected])

  const refreshUserInfo = async () => {
    try {
      if (!address) return
      const userInfo = await getUserInfo(address)
      console.log('userInfo', userInfo)
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
    }
  }

  const fetchWeb3Token = async () => {
    try {
      let existingTokenOnLocalStorage = null
      existingTokenOnLocalStorage = getLocalToken()

      //return if token is already in local storage and is not expired
      if (existingTokenOnLocalStorage) {
        const web3Token = Web3Token.verify(existingTokenOnLocalStorage)
        if (
          web3Token &&
          web3Token.address &&
          web3Token.address.toLowerCase() === address.toLowerCase()
        ) {
          await refreshUserInfo()
          return
        }
      }

      //if token is not in local storage or is expired, fetch a new one and save it to local storage and state
      if (!signer) {
        alert('No Signer but trying to sign in')
      }

      const signedToken = await Web3Token.sign(
        async (msg) => await signer.signMessage(msg),
        '7d'
      )

      setLocalToken(signedToken)
      await refreshUserInfo()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <WalletContext.Provider
      value={{ address, refreshUserInfo, user, fetchWeb3Token }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
