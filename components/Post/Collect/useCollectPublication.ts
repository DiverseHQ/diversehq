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
  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: createCollect } = useCreateCollectTypedDataMutation()
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const { notifyError, notifySuccess }: any = useNotify()
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
  }

  const handleCollect = async (publicationId: string) => {
    setLoading(true)
    const collectResult = (
      await createCollect({
        request: {
          publicationId: publicationId
        }
      })
    ).createCollectTypedData

    signTypedDataAndBroadcast(collectResult.typedData, {
      id: collectResult.id,
      type: 'collect'
    })
  }
  useEffect(() => {
    if (type === 'collect' && result) {
      console.log('Successfully Collected', result)
      setIsSuccess(true)
      setLoading(false)
      notifySuccess('Successfully Collected')
    }
  }, [type, result])

  useEffect(() => {
    if (!error) return
    console.error(error)
    notifyError(error)
    setLoading(false)
  }, [error])

  const collectPublication = async (publicationId: string) => {
    try {
      if (!hasProfile || !isSignedIn || !lensProfile) return
      if (collectModule.__typename === 'FreeCollectModuleSettings') {
        try {
          setLoading(true)
          await handleFreeCollect(publicationId)
          setIsSuccess(true)
        } catch (e) {
          console.error(e)
          notifyError(e)
        } finally {
          setLoading(false)
        }
      } else {
        await handleCollect(publicationId)
      }
    } catch (e) {
      console.error(e)
      notifyError(e)
    }
  }
  return { collectPublication, loading, isSuccess }
}

export default useCollectPublication
