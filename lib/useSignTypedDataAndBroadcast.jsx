import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSignTypedData } from 'wagmi'
import useBroadcastSignatureForTx from './useBroadcastSignatureForTx'

const useSignTypedDataAndBroadcast = (waitForTxIndex = true) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [result, setResult] = React.useState(null)
  const [typedData, setTypedData] = useState(null)
  const [dataForAfterSig, setDataForAfterSig] = useState(null)

  const signTypedDataResult = useSignTypedData(typedData || undefined)

  const broadCastSignatureForTx = useBroadcastSignatureForTx(waitForTxIndex)

  const signTypedDataAndBroadcast = async (typedData, dataForSig) => {
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
      const result = await broadCastSignatureForTx(signature, id)
      setResult(result)
      setLoading(false)
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
    type: dataForAfterSig?.type,
    isSignedTx: signTypedDataResult?.data ? true : false,
    signTypedDataAndBroadcast
  }
}

export default useSignTypedDataAndBroadcast
