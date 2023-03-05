import React, { useEffect } from 'react'
import { useProfile } from '../../Common/WalletContext'
import { isCreatorOfCommunity } from '../lib/utils'

interface Props {
  name: string
  callBackForNotCreator?: () => void
}

const useIsCreator = ({
  name,
  callBackForNotCreator = () => {}
}: Props): {
  isCreator: boolean
  isLoading: boolean
} => {
  const { user } = useProfile()
  const [isCreator, setIsCreator] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  useEffect(() => {
    if (!name) return null
    if (!user?.walletAddress) return null
    setIsLoading(true)
    checkIfCreator(String(name))
  }, [user?.walletAddress, name])

  const checkIfCreator = async (name: string) => {
    try {
      const _isCreator = await isCreatorOfCommunity(name)
      if (_isCreator) {
        setIsCreator(true)
      } else {
        callBackForNotCreator()
      }
    } catch (err) {
      console.log(err)
      callBackForNotCreator()
    } finally {
      setIsLoading(false)
    }
  }

  return { isCreator, isLoading }
}

export default useIsCreator
