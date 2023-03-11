import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { isCreatorOrModeratorOfCommunity } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

const AuthCommunity = ({ children }) => {
  const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const router = useRouter()
  const [isAuth, setIsAuth] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  useEffect(() => {
    if (!router?.query?.name) return null
    if (!user?.walletAddress) return null
    setIsLoading(true)
    checkIfCreatorOrModerator(String(router?.query?.name))
  }, [user?.walletAddress, router?.query?.name])

  const checkIfCreatorOrModerator = async (name: string) => {
    try {
      const res = await isCreatorOrModeratorOfCommunity(name)
      if (res.status === 200) {
        setIsAuth(true)
      } else if (res.status === 400) {
        const resJson = await res.json()
        notifyInfo(resJson.msg)
        router.push(`/c/${name}`)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  if (isLoading || !isAuth) {
    return null
  }
  return <>{children}</>
}

export default AuthCommunity
