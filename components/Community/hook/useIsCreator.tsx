import React, { useEffect } from 'react'
import { useProfile } from '../../Common/WalletContext'
import { isCreatorOfCommunity } from '../lib/utils'
import { useAuthCommunityStore } from '../../../store/community'

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
  const isCreators = useAuthCommunityStore((state) => state.isCreator)
  const [isCreator, setIsCreator] = React.useState(
    isCreators.get(name) ? isCreators.get(name) : false
  )
  const [isLoading, setIsLoading] = React.useState(true)
  const addIsCreator = useAuthCommunityStore((state) => state.addIsCreator)
  useEffect(() => {
    if (!name) return null
    if (!user?.walletAddress) return null
    setIsLoading(true)
    checkIfCreator(String(name))
  }, [user?.walletAddress, name])

  const checkIfCreator = async (name: string) => {
    try {
      if (isCreators.get(name)) {
        setIsCreator(isCreators.get(name))
        return
      }
      const _isCreator = await isCreatorOfCommunity(name)
      addIsCreator(name, _isCreator)
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
