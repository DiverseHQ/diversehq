import { useRouter } from 'next/router'
import React from 'react'
import { useNotify } from '../Common/NotifyContext'
import useIsCreator from './hook/useIsCreator'

const AuthCreatorOfCommunity = ({ children }) => {
  const { notifyInfo } = useNotify()
  const router = useRouter()
  const { isCreator, isLoading } = useIsCreator({
    name: router.query.name as string,
    callBackForNotCreator: () => {
      notifyInfo('You are not the creator of this community')
      router.push(`/c/${router.query.name}`)
    }
  })

  if (isLoading || !isCreator) return null
  return <>{children}</>
}

export default AuthCreatorOfCommunity
