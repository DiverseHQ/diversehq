import { Client } from '@xmtp/xmtp-js'
import { useCallback, useEffect, useState } from 'react'
import { useMessageStore } from '../../store/message'
import { useSigner } from 'wagmi'
import { useLensUserContext } from '../../lib/LensUserContext'

const ENCODING = 'binary'
const XMTP_ENV = 'dev'
const buildLocalStorageKey = (walletAddress: string) =>
  `xmtp:${XMTP_ENV}:keys:${walletAddress}`

const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress))
  return val ? Buffer.from(val, ENCODING) : null
}

/**
 * Anyone copying this code will want to be careful about leakage of sensitive keys.
 * Make sure that there are no third party services, such as bug reporting SDKs or ad networks, exporting the contents
 * of your LocalStorage before implementing something like this.
 */
const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  )
}

const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress))
}

const useXmtpClient = (cacheOnly = false) => {
  const { data: lensProfile } = useLensUserContext()
  const client = useMessageStore((state) => state.client)
  const setClient = useMessageStore((state) => state.setClient)
  const [awaitingXmtpAuth, setAwaitingXmtpAuth] = useState<boolean>()
  const { data: signer, isLoading } = useSigner()

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer && !client && lensProfile?.defaultProfile) {
        let keys = loadKeys(await signer.getAddress())
        if (!keys) {
          if (cacheOnly) {
            return
          }
          setAwaitingXmtpAuth(true)
          keys = await Client.getKeys(signer, {
            env: XMTP_ENV
          })
          storeKeys(await signer.getAddress(), keys)
        }

        const xmtp = await Client.create(null, {
          env: XMTP_ENV,
          privateKeyOverride: keys
        })
        setClient(xmtp)
        setAwaitingXmtpAuth(false)
      } else {
        setAwaitingXmtpAuth(false)
      }
    }
    initXmtpClient()
    if (!signer || !lensProfile?.defaultProfile) {
      setClient(undefined)
    }
  }, [signer, lensProfile?.defaultProfile])

  return {
    client: client,
    loading: isLoading || awaitingXmtpAuth
  }
}

export const useDisconnectXmtp = () => {
  const { data: signer } = useSigner()
  const client = useMessageStore((state) => state.client)
  const setClient = useMessageStore((state) => state.setClient)
  const disconnect = useCallback(async () => {
    if (signer) {
      wipeKeys(await signer.getAddress())
    }
    if (client) {
      setClient(undefined)
    }
    localStorage.removeItem('message.store')
  }, [signer, client])

  return disconnect
}

export default useXmtpClient
