import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { isCreatorOrModeratorOfCommunity } from '../../apiHelper/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import { useAuthCommunityStore } from '../../store/community'

const AuthCommunity = ({ children }) => {
  const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const router = useRouter()
  const isModerator = useAuthCommunityStore((state) => state.isModerator)
  const [isAuth, setIsAuth] = React.useState(
    isModerator.get(String(router?.query?.name))
      ? isModerator.get(String(router?.query?.name))
      : false
  )
  const [isLoading, setIsLoading] = React.useState(true)
  const addIsModerator = useAuthCommunityStore((state) => state.addIsModerator)
  useEffect(() => {
    if (!router?.query?.name) return
    if (!user?.walletAddress) return
    setIsLoading(true)
    checkIfCreatorOrModerator(String(router?.query?.name))
  }, [user?.walletAddress, router?.query?.name])

  const checkIfCreatorOrModerator = async (name: string) => {
    try {
      if (isModerator.get(name)) {
        setIsAuth(isModerator.get(name))
        return
      }
      const res = await isCreatorOrModeratorOfCommunity(name)
      if (res.status === 200) {
        addIsModerator(name, true)
        setIsAuth(true)
      } else if (res.status === 400) {
        addIsModerator(name, false)
        const resJson = await res.json()
        notifyInfo(resJson.msg)
        router.push(`/c/${name}`)
      }
    } catch (err) {
      console.log(err)
      addIsModerator(name, false)
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
