import { sleep } from '../helpers'
import { fetchData } from '../../auth-fetcher'
import {
  LensTransactionResult,
  LensTransactionStatusDocument,
  LensTransactionStatusQuery,
  LensTransactionStatusQueryVariables,
  LensTransactionStatusRequest,
  LensTransactionStatusType
} from '../../graphql/generated'

export const hasTxBeenIndexed = async (
  request: LensTransactionStatusRequest
): Promise<LensTransactionResult> => {
  const result = await fetchData<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  >(LensTransactionStatusDocument, {
    request
  })()
  return result.lensTransactionStatus
}

export const pollUntilIndexed = async (
  input: { txHash: string } | { txId: string }
) => {
  let request: LensTransactionStatusRequest = {}
  if ('txHash' in input) {
    request['forTxHash'] = input.txHash
  }

  if ('txId' in input) {
    request['forTxId'] = input.txId
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await hasTxBeenIndexed(request)

    if (!response) {
      break
    }

    console.log('pool until indexed: result', response)

    switch (response.status) {
      case LensTransactionStatusType.Failed:
        throw new Error(response.reason ?? 'Transaction failed')

      case LensTransactionStatusType.Processing:
        console.log('still in progress')
        break

      case LensTransactionStatusType.Complete:
        console.log('complete and indexed onchain')
        return response
    }

    console.log(
      'pool until indexed: sleep for 1500 milliseconds then try again'
    )
    // sleep for before trying again
    await sleep(1500)
  }
}
