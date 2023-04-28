import { useEffect, useState } from 'react'
import { useSignTypedData } from 'wagmi'
import { useBroadcastDataAvailabilityMutation } from '../graphql/generated'

const useDASignTypedDataAndBroadcast = (): {
  // eslint-disable-next-line
  signDATypedDataAndBroadcast: (typedData: any, dataForSig: any) => void
  type: string
  loading: boolean
  error: any
  result: any
  isSignedTx: boolean
} => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [typedData, setTypedData] = useState(null)
  const [dataForAfterSig, setDataForAfterSig] = useState(null)

  const signTypedDataResult = useSignTypedData(typedData || undefined)

  const { mutateAsync: broadCast } = useBroadcastDataAvailabilityMutation()

  const signDATypedDataAndBroadcast = async (typedData, dataForSig) => {
    setLoading(true)
    setResult(null)
    const _typedData = {
      domain: typedData.domain,
      types: typedData.types,
      value: typedData.value
    }
    setTypedData(_typedData)
    setDataForAfterSig(dataForSig)
  }

  // singTypedData if typedData is set
  useEffect(() => {
    if (typedData && signTypedDataResult.signTypedData) {
      try {
        signTypedDataResult.signTypedData()
      } catch (err) {
        setError(err)
        setLoading(false)
        console.error('sign typed data: failed', err)
      }
    }
  }, [typedData])

  useEffect(() => {
    if (
      signTypedDataResult?.data &&
      dataForAfterSig?.type &&
      dataForAfterSig?.id
    ) {
      broadCastSignatureForTxAndWaitForResult(
        signTypedDataResult?.data,
        dataForAfterSig.id
      )
    }
  }, [signTypedDataResult?.data, dataForAfterSig])

  const broadCastSignatureForTxAndWaitForResult = async (signature, id) => {
    try {
      const result = (
        await broadCast({
          request: {
            signature: signature,
            id: id
          }
        })
      ).broadcastDataAvailability

      console.log(
        'broadcast signature for gasless transaction: success',
        result
      )
      if (result.__typename === 'RelayError' || !result.id) {
        // @ts-ignore
        setError(result?.reason ?? 'Error broadcasting signature')
        setLoading(false)
      } else {
        setLoading(false)
        setResult(result)
      }
    } catch (err) {
      setLoading(false)
      setError(err)
      console.error('broadcast signature for gasless transaction: failed', err)
    }
  }

  return {
    loading,
    error,
    result,
    // @ts-ignore
    type: dataForAfterSig?.type,
    isSignedTx: signTypedDataResult?.data ? true : false,
    signDATypedDataAndBroadcast
  }
}

export default useDASignTypedDataAndBroadcast
