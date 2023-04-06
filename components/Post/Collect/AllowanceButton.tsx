import { CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useGenerateModuleCurrencyApprovalDataQuery } from '../../../graphql/generated'
import { useDevice } from '../../Common/DeviceWrapper'

// todo : make a allowance button component
// todo: addd a revoke button
// take number input to allow that much amount
// make a separate ui for wallet balance, allowance balance, and collect balance
const AllowanceButton = ({ module, allowed, setAllowed }) => {
  // const [value, setValue] = React.useState(0)
  const generateModuleQuery = useGenerateModuleCurrencyApprovalDataQuery({
    request: {
      currency: module.currency,
      value: Number.MAX_SAFE_INTEGER.toString(),
      collectModule: module.module
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const { isMobile } = useDevice()

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    request: {},
    mode: 'recklesslyUnprepared',
    onError: (e) => {
      setIsLoading(false)
      console.log(e)
    }
  })

  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      setIsLoading(false)
      setAllowed(true)
    },
    onError: (e) => {
      setIsLoading(false)
      console.log(e)
    }
  })

  const handleAllowance = async (e) => {
    e.stopPropagation()
    try {
      if (allowed) return
      setIsLoading(true)
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
    <button
      onClick={handleAllowance}
      className={`${
        isMobile
          ? 'bg-p-btn rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl text-p-btn-text'
          : 'bg-p-btn text-p-btn-text px-2 py-1 text-base font-semibold rounded-md'
      }`}
      disabled={waitLoading || transactionLoading}
    >
      {!(waitLoading || transactionLoading || isLoading) ? (
        <div className="flex flex-row items-center space-x-1 ">
          <BiPlus className={` ${isMobile ? 'w-6 h-6' : 'w-5 h-5'} `} />
          <p>{isMobile ? 'Allow to Collect' : 'Allow'}</p>
        </div>
      ) : (
        <div className="flex flex-row items-center space-x-1">
          <CircularProgress size="18px" color="primary" />
          <p>Allowing..</p>
        </div>
      )}
    </button>
  )
}

export default AllowanceButton
