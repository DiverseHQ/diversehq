import React from 'react'
import { useBroadcastMutation } from '../graphql/generated'
import { pollUntilIndexed } from './indexer/has-transaction-been-indexed'

const useBroadcastSignatureForTx = () => {
  const { mutateAsync: broadCast } = useBroadcastMutation()

  // use broadcast for gasless transactions
  const broadCastSignatureForTx = async (signature, id) => {
    console.log('signature', signature)
    console.log('id', id)
    const broadcastResult = (
      await broadCast({
        request: {
          id,
          signature
        }
      })
    ).broadcast
    console.log('data', broadcastResult)
    if (broadcastResult.reason) {
      throw new Error(broadcastResult.reason)
    }
    if (!broadcastResult.txHash) {
      console.log('broadcastResult', broadcastResult)
      throw new Error('broadcastResult.txHash is undefined')
    }
    console.log('broadcastFunc poll until indexed start')
    const indexedResult = await pollUntilIndexed({
      txHash: broadcastResult.txHash
    })
    console.log('indexedResult', indexedResult)
    console.log('broadcastFunc poll until indexed end')
    return indexedResult
  }

  return broadCastSignatureForTx
}

export default useBroadcastSignatureForTx
