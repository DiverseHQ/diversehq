import { useEffect, useState } from 'react'
import {
  CollectModule,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../lib/useSignTypedDataAndBroadcast'
import { useNotify } from '../../Common/NotifyContext'

const useCollectPublication = (collectModule: CollectModule) => {
  const { hasProfile, isSignedIn } = useLensUserContext()
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: createCollect } = useCreateCollectTypedDataMutation()
  const [error, setError] = useState<string>(null)
  const {
    error: signInError,
    result,
    type,
    signTypedDataAndBroadcast
  } = useSignTypedDataAndBroadcast(false)
  const { notifyError }: any = useNotify()
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const handleFreeCollect = async (publicationId: string) => {
    await proxyAction({
      request: {
        collect: {
          freeCollect: {
            publicationId: publicationId
          }
        }
      }
    })
    setLoading(false)
    setIsSuccess(true)
  }

  const handleCollect = async (publicationId: string) => {
    setLoading(true)
    try {
      const collectResult = await createCollect({
        request: {
          publicationId: publicationId
        }
      })

      if (!collectResult) {
        setError('Error collecting publication, try again latter')
        setLoading(false)
      }

      signTypedDataAndBroadcast(
        collectResult.createCollectTypedData.typedData,
        {
          id: collectResult.createCollectTypedData.id,
          type: 'collect'
        }
      )
    } catch (e) {
      setError('Error collecting publication, try again latter')
      console.log(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (type === 'collect' && result) {
      setIsSuccess(true)
      setLoading(false)
    }
  }, [type, result])

  useEffect(() => {
    if (!signInError) return
    console.log(signInError)
    setLoading(false)
    setError('Sign in failed, try again later')
  }, [signInError])

  const collectPublication = async (publicationId: string) => {
    try {
      if (!hasProfile || !isSignedIn) return
      if (collectModule.__typename === 'FreeCollectModuleSettings') {
        try {
          setLoading(true)
          await handleFreeCollect(publicationId)
        } catch (e) {
          console.error(e)
          notifyError(e)
          setLoading(false)
        }
      } else {
        console.log('Collecting publication with module', collectModule)
        await handleCollect(publicationId)
      }
    } catch (e) {
      console.log("Couldn't collect publication")
      notifyError(e)
      setLoading(false)
      setError(e)
    }
  }
  return { collectPublication, loading, isSuccess, error }
}

export default useCollectPublication
