import React, { useState, createContext, useEffect, useContext } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import Web3Token from 'web3-token'
import { getLocalToken, setLocalToken } from '../../utils/token'
import { getUserInfo, postUser } from '../../api/user'
import { client, getDefaultProfile, refreshAuthToken } from '../../utils/lensAuth'
export const WalletContext = createContext([])

export const WalletProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const { address,isDisconnected } = useAccount({
    onConnect ({ address, connector, isReconnected }) {
      console.log('onConnect', address, connector, isReconnected)
    }
  })
  const [lensToken, setLensToken] = useState(null)
  const [lensProfile, setLensProfile] = useState(null);

  useEffect(() => {
    if(isDisconnected){
      setToken(null)
      setUser(null)
    }
  },[isDisconnected])

  useEffect(() => {
    console.log('signer isError isLoading', signer, isError, isLoading)
    if (signer && address) {
      refetchToken()
    }
  }, [signer, address])

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
        console.log('web3Token', web3Token)
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
  }

  // Lens Auth
  useEffect(() => {
    refreshAuthToken();
    async function checkProfile() {
      if (address && localStorage.getItem('STORAGE_KEY')) {
        const token = JSON.parse(localStorage.getItem('STORAGE_KEY'));
        console.log('Success Token From STORAGE_KEY', token)
        setLensToken(token.accessToken)
        // const response = await client.query({
        //   query: getDefaultProfile,
        //   variables: { address: address }
        // })
        // console.log('Lens Profile', response);
      } else {
        console.log('Not Logged In')
      }
    }
    checkProfile();
  }, []);


   

  return (
        <WalletContext.Provider value={{ address, refreshUserInfo, token, user, lensToken, setLensToken }}>
            {children}
        </WalletContext.Provider>
  )
}

export const useProfile = () => useContext(WalletContext)
