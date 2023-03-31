import { sleep } from '../helpers'
import { fetchData } from '../../auth-fetcher'
import {
  HasTxHashBeenIndexedRequest,
  HasTxHashBeenIndexedQuery,
  HasTxHashBeenIndexedQueryVariables,
  HasTxHashBeenIndexedDocument
} from '../../graphql/generated'

export const hasTxBeenIndexed = async (
  request: HasTxHashBeenIndexedRequest
) => {
  const result = await fetchData<
    HasTxHashBeenIndexedQuery,
    HasTxHashBeenIndexedQueryVariables
  >(HasTxHashBeenIndexedDocument, {
    request
  })()
  return result.hasTxHashBeenIndexed
}

export const pollUntilIndexed = async (
  input: { txHash: string } | { txId: string }
) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await hasTxBeenIndexed(input)

    if (response.__typename === 'TransactionIndexedResult') {
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          console.log('response.metadataStatus', response.metadataStatus)
          throw new Error(response.metadataStatus.status)
        }
      } else {
        if (response.indexed) {
          return response
        }
      }
      // sleep for a second before trying again
      await sleep(5000)
    } else {
      // it got reverted and failed!
      throw new Error(response.reason)
    }
  }
}
