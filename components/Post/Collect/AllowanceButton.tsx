import React from 'react'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useGenerateModuleCurrencyApprovalDataQuery } from '../../../graphql/generated'

// todo : make a allowance button component
// todo: addd a revoke button
// take number input to allow that much amount
// make a separate ui for wallet balance, allowance balance, and collect balance
const AllowanceButton = ({ module, allowed, setAllowed }) => {
  // const [value, setValue] = React.useState(0)
  console.log('AllowanceButton', module)
  const generateModuleQuery = useGenerateModuleCurrencyApprovalDataQuery({
    request: {
      currency: module.currency,
      value: Number.MAX_SAFE_INTEGER.toString(),
      collectModule: module.module
    }
  })

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    request: {},
    mode: 'recklesslyUnprepared',
    onError: (e) => {
      console.log(e)
    }
  })

  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      setAllowed(!allowed)
    },
    onError: (e) => {
      console.log(e)
    }
  })

  const handleAllowance = async () => {
    try {
      const data = generateModuleQuery?.data?.generateModuleCurrencyApprovalData
      sendTransaction?.({
        recklesslySetUnpreparedRequest: {
          from: data?.from,
          to: data?.to,
          data: data?.data
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div className="flex flex-row items-center">
      <button
        onClick={handleAllowance}
        className=""
        disabled={waitLoading || transactionLoading}
      >
        {!(waitLoading || transactionLoading) && 'Allow to collect'}
        {waitLoading && 'Waiting for transaction'}
        {transactionLoading && 'Sending transaction'}
      </button>
      {/* <input
        type={'number'}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={'Amount'}
      /> */}
    </div>
  )
}

export default AllowanceButton
