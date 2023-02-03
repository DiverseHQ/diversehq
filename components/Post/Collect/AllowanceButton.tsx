import { CircularProgress } from '@mui/material'
import React from 'react'
import { BiPlus } from 'react-icons/bi'
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
    <div className="flex flex-row items-center justify-center place-items-center space-x-1">
      <button
        onClick={handleAllowance}
        className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
        disabled={waitLoading || transactionLoading}
      >
        {!(waitLoading || transactionLoading) && (
          <div className="flex flex-row space-x-1">
            <BiPlus className="w-5 h-5" />
            <p>Allow</p>
          </div>
        )}
        {waitLoading && (
          <div className="flex flex-row space-x-1">
            <CircularProgress size="18px" color="primary" />
            <p>Waiting for Transaction</p>
          </div>
        )}
        {transactionLoading && (
          <div className="flex flex-row space-x-1">
            <CircularProgress size="18px" color="primary" />
            <p>Sending Transaction</p>
          </div>
        )}
      </button>
      <p className="font-medium">To Collect</p>
    </div>
  )
}

export default AllowanceButton
