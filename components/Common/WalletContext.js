import React, { useState, createContext, useEffect, useContext } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import Web3 from 'web3'
import Web3Token from 'web3-token'
import { ethers } from 'ethers'
import apiEndpoint from '../../api/ApiEndpoint'
import { getLocalToken, setLocalToken } from '../../utils/token'
import { getUserInfo, postUser } from '../../api/user'
export const WalletContext = createContext([])

const once = true

export const WalletProvider = ({ children }) => {
  // const [wallet, setWallet] = useState(null)
  const [token, setToken] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [user, setUser] = useState(null)
  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount({
    onConnect ({ address, connector, isReconnected }) {
      console.log('onConnect', address, connector, isReconnected)
      // if (address) {
      //   refetchToken()
      // }
    }
  })

  useEffect(() => {
    console.log('signer isError isLoading', signer, isError, isLoading)
    if (signer && address) {
      refetchToken()
    }
  }, [signer, address])
  // useEffect(() => {
  //   if (wallet && once) {
  //     once = false
  //     refetchToken()
  //   }
  // }, [wallet])

  // useEffect(() => {
  //   ;(async () => {
  //     if (window.ethereum.selectedAddress && !wallet) {
  //       await connectWallet()
  //     }
  //   })()
  // }, [])

  const refreshUserInfo = async () => {
    try {
      if (!address) return
      const userInfo = await getUserInfo(address)
      console.log(userInfo)
      setUser(userInfo)
    } catch (error) {
      console.log(error)
    }
  }
  const refetchToken = async () => {
    let existingToken = null
    let verified = false
    // return;
    try {
      existingToken = getLocalToken()
      console.log(existingToken)
      if (existingToken) {
        setToken(existingToken)
        const web3Token = await Web3Token.verify(existingToken)
        console.log("web3Token", web3Token)
        console.log(web3Token.address, web3Token.body)
        if (!web3Token || !web3Token.address || !web3Token.body || web3Token.address.toLowerCase() !== address.toLowerCase()) {
          verified = false
        } else {
          verified = true
        }
      }
    } catch (error) {
      console.log(error)
    }
    console.log('existingToken', existingToken)
    console.log('verified', verified)
    if (!existingToken || !verified) {
      // if (!web3) {
      //   await connectWallet()
      // }
      if (!provider) {
        alert('No Provider but trying to sign in')
      }
      console.log('provider', provider)
      // alert("hi")
      console.log('signer', signer)
      // return;
      // const ethProvider = new ethers.providers.Web3Provider(provider)
      // const signer = ethProvider.getSigner()
      const signedToken = await Web3Token.sign(async msg => await signer.signMessage(msg), '1d')
      console.log(signedToken)
      setToken(signedToken)
      try {
        await postUser(signedToken)
      } catch (error) {
        console.log(error)
      }
      setLocalToken(signedToken)
      // localStorage.setItem('token', signedToken)
    }
    await refreshUserInfo()
    setConnecting(false)
  }

  // const connectWallet = async () => {
  //   setConnecting(true)
  //   try {
  //     const { ethereum } = window

  //     if (!ethereum) {
  //       alert('Get MetaMask!')
  //       return
  //     }
  //     const newWeb3 = new Web3(ethereum)
  //     setWeb3(newWeb3)
  //     await ethereum.request({ method: 'eth_requestAccounts' })

  //     // getting address from which we will sign message
  //     const address = (await newWeb3.eth.getAccounts())[0]

  //     window.ethereum.on('accountsChanged', function (accounts) {
  //       if (accounts.length > 0) {
  //         once = true
  //         // localStorage.removeItem('token')
  //         setLocalToken(null)
  //         setWallet(accounts[0])
  //       } else {
  //         once = true
  //         setWallet(null)
  //       }
  //     })

  //     // generating a token with 1 day of expiration time
  //     once = true
  //     setWallet(address)
  //   } catch (error) {
  //     console.log(error)
  //     setConnecting(false)
  //   }
  // }

  // const disconnectWallet = () => {
  //   once = true
  //   setWallet(null)
  //   setUser(null)
  // }
  return (
        <WalletContext.Provider value={{ refreshUserInfo, token, user }}>
            {children}
        </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
