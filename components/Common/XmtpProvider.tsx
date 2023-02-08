import React from 'react'
import { Client } from '@xmtp/xmtp-js'
import { useSigner } from 'wagmi'

export const XmtpContext = React.createContext({})

const XmtpProvider = ({ children }) => {
  const [client, setClient] = React.useState<Client>()
  const { data: signer } = useSigner()

  const connect = async () => {
    if (!signer) return
    try {
      const xmtp = await Client.create(signer, {
        env: 'dev'
      })
      setClient(xmtp)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <XmtpContext.Provider value={{ connect, client }}>
      {children}
    </XmtpContext.Provider>
  )
}

export const useXmtp = () => React.useContext(XmtpContext)

export default XmtpProvider
