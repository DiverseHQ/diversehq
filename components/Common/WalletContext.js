import React, { useState, createContext, useEffect, useContext } from 'react'
import { useAccount, useProvider, useSigner, useDisconnect } from 'wagmi'
import Web3Token from 'web3-token'
import {
  getLocalToken,
  removeLocalToken,
  setLocalToken
} from '../../utils/token'
import { getUserInfo, getWhitelistStatus } from '../../api/user'
import { useNotify } from './NotifyContext'
export const WalletContext = createContext([])

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address, isDisconnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('onConnect', address, connector, isReconnected)
    }
  })

  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const { notifyInfo } = useNotify()

  const checkWhitelistStatus = async () => {
    try {
      const res = await getWhitelistStatus(address)
      const resData = await res.json()
      if (res.status === 200) {
        setIsWhitelisted(resData)
      }
      if (!resData) {
        notifyInfo('You are not whitelisted')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (address) {
      checkWhitelistStatus()
    }
  }, [address])

  useEffect(() => {
    if (isDisconnected) {
      setUser(null)
      if (getLocalToken()) {
        removeLocalToken()
      }
    }
  }, [isDisconnected])

  useEffect(() => {
    // only allow whitelisted addresses to use the system
    if (signer && address && isWhitelisted) {
      // refetchToken()
      fetchWeb3Token()
    }
    if (!isWhitelisted) {
      console.log('You are not whitelisted')
    }
  }, [signer, address, isWhitelisted])

  const refreshUserInfo = async () => {
    try {
      if (!address) return
      console.log('refreshUserInfo', address)
      const userInfo = await getUserInfo(address)
      console.log(userInfo)
      setUser(userInfo)
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
        '1d'
      )

      setLocalToken(signedToken)
      await refreshUserInfo()
    } catch (error) {
      console.log(error)
    }
  }

  // const refetchToken = async () => {
  //   let existingToken = null
  //   let verified = false
  //   // return;
  //   try {
  //     existingToken = getLocalToken()
  //     console.log('existingToken', existingToken)
  //     if (existingToken) {
  //       setToken(existingToken)
  //       const web3Token = Web3Token.verify(existingToken)
  //       console.log('web3Token', web3Token)
  //       console.log(web3Token.address, web3Token.body)
  //       if (
  //         !web3Token ||
  //         !web3Token.address ||
  //         !web3Token.body ||
  //         web3Token.address.toLowerCase() !== address.toLowerCase()
  //       ) {
  //         verified = false
  //       } else {
  //         verified = true
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   console.log('existingToken', existingToken)
  //   console.log('verified', verified)
  //   if (!existingToken || !verified) {
  //     // if (!web3) {
  //     //   await connectWallet()
  //     // }
  //     if (!provider) {
  //       alert('No Provider but trying to sign in')
  //     }
  //     console.log('provider', provider)
  //     // alert("hi")
  //     console.log('signer', signer)
  //     // return;
  //     // const ethProvider = new ethers.providers.Web3Provider(provider)
  //     // const signer = ethProvider.getSigner()
  //     const signedToken = await Web3Token.sign(
  //       async (msg) => await signer.signMessage(msg),
  //       '1d'
  //     )
  //     console.log(signedToken)
  //     setToken(signedToken)
  //     try {
  //       await postUser(signedToken)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //     setLocalToken(signedToken)
  //     // localStorage.setItem('token', signedToken)
  //   }
  //   await refreshUserInfo()
  // }

  return (
    <WalletContext.Provider value={{ address, refreshUserInfo, user }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
