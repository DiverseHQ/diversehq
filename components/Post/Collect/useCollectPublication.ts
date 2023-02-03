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
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
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
  }

  const handleCollect = async (publicationId: string) => {
    setLoading(true)
    console.log('Collecting', publicationId)
    const collectResult = (
      await createCollect({
        request: {
          publicationId: publicationId
        }
      })
    ).createCollectTypedData
    console.log('Collect Result', collectResult)

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
      console.log('collectPublication', publicationId)
      if (!hasProfile || !isSignedIn) return
      if (collectModule.__typename === 'FreeCollectModuleSettings') {
        try {
          console.log('handle free collect')
          setLoading(true)
          await handleFreeCollect(publicationId)
          setLoading(false)
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
