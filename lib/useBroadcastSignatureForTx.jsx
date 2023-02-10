import { useBroadcastMutation } from '../graphql/generated'
import { pollUntilIndexed } from './indexer/has-transaction-been-indexed'

const useBroadcastSignatureForTx = (waitForTxIndex = true) => {
  const { mutateAsync: broadCast } = useBroadcastMutation()
  // use broadcast for gasless transactions
  const broadCastSignatureForTx = async (signature, id) => {
    const broadcastResult = (
      await broadCast({
        request: {
          id,
          signature
        }
      })
    ).broadcast
    if (broadcastResult.reason) {
      throw new Error(broadcastResult.reason)
    }
    if (!broadcastResult.txHash) {
      throw new Error('broadcastResult.txHash is undefined')
    }
    if (!waitForTxIndex) {
      return broadcastResult
    }
    const indexedResult = await pollUntilIndexed({
      txHash: broadcastResult.txHash
    })
    return indexedResult
  }

  return broadCastSignatureForTx
}

export default useBroadcastSignatureForTx
