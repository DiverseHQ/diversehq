import Link from 'next/link'
import React, { useEffect } from 'react'
import { useCreateSetDispatcherTypedDataMutation } from '../../graphql/generated'
import useLogin from '../../lib/auth/useLogin'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import CreateTestLensHandle from '../User/CreateTestLensHandle'
import { modalType, usePopUpModal } from './CustomPopUpProvider'
import { useNotify } from './NotifyContext'
import { useProfile } from './WalletContext'
// import ConnectWalletAndSignInButton from './ConnectWalletAndSignInButton'
import useDevice from './useDevice'
import { useQueryClient } from '@tanstack/react-query'
import formatHandle from '../User/lib/formatHandle'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

interface Props {
  connectWalletLabel?: string
}

const LensLoginButton = ({ connectWalletLabel = 'Connect' }: Props) => {
  const {
    isSignedIn,
    hasProfile,
    data: lensProfile,
    isLoading,
    refetch
  } = useLensUserContext()
  const { user, loading } = useProfile()
  const { address } = useAccount()
  const { notifyInfo, notifySuccess, notifyError } = useNotify()
  const { showModal } = usePopUpModal()
  const { isMobile } = useDevice()
  const { openConnectModal } = useConnectModal()

  const queryClient = useQueryClient()

  const { mutateAsync: login } = useLogin()
  const { mutateAsync: createSetDispatcher } =
    useCreateSetDispatcherTypedDataMutation()
  const {
    result,
    type,
    error,
    loading: broadcastLoading,
    signTypedDataAndBroadcast
  } = useSignTypedDataAndBroadcast(true)

  async function handleLogin() {
    await login()
    await queryClient.invalidateQueries({
      queryKey: ['lensUser', 'defaultProfile']
    })
  }

  const handleCreateLensProfileAndMakeDefault = () => {
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }

    showModal({
      component: <CreateTestLensHandle />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const handleEnableDispatcher = async () => {
    try {
      console.log('handleEnableDispatcher')
      const createSetDispatcherResult = await createSetDispatcher({
        request: {
          profileId: lensProfile?.defaultProfile?.id,
          enable: true
        }
      })

      console.log('createSetDispatcherResult', createSetDispatcherResult)

      if (!createSetDispatcherResult?.createSetDispatcherTypedData) {
        notifyError('Something went wrong')
        return
      }

      signTypedDataAndBroadcast(
        createSetDispatcherResult?.createSetDispatcherTypedData?.typedData,
        {
          id: createSetDispatcherResult?.createSetDispatcherTypedData?.id,
          type: 'createSetDispatcher'
        }
      )
    } catch (e) {
      notifyError('Something went wrong')
      console.log(e)
    }
  }

  const onSetDispatcherSuccess = async () => {
    notifySuccess('No more signing required for many actions')
    await queryClient.invalidateQueries({
      queryKey: ['lensUser']
    })
    await queryClient.invalidateQueries({
      queryKey: ['defaultProfile']
    })
    await queryClient.invalidateQueries({
      queryKey: ['lensUser', 'defaultProfile']
    })
    await refetch()
  }

  useEffect(() => {
    if (result && type === 'createSetDispatcher') {
      onSetDispatcherSuccess()
    }
  }, [result, type])

  useEffect(() => {
    if (error && type === 'createSetDispatcher') {
      notifyError('Something went wrong')
    }
  }, [error, type])

  const showLoading = loading || (isLoading && address)

  return (
    <div>
      {/* {user && address && ( */}
      <div className="flex flex-col gap-4 text-p-text items-start">
        {isSignedIn && hasProfile && user && !showLoading && (
          <div className="flex flex-col items-start">
            {lensProfile?.defaultProfile?.dispatcher?.canUseRelay && (
              <Link
                href={`/u/${formatHandle(lensProfile.defaultProfile.handle)}`}
              >
                <div
                  className={`mr-2 hover:cursor-pointer hover:underline ${
                    isMobile
                      ? 'dark:text-s-bg hover:font-semibold'
                      : 'dark:text-p-text'
                  } text-[20px] md:text-[16px] p-2 md:p-0`}
                >
                  u/
                  {formatHandle(lensProfile.defaultProfile.handle)}
                </div>
              </Link>
            )}
            {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
              !broadcastLoading && (
                <button
                  onClick={handleEnableDispatcher}
                  className="rounded-full sm:rounded-xl text-s-bg font-semibold bg-[#62F030]  py-1 px-2 sm:px-6"
                >
                  <span>Go Signless</span>
                </button>
              )}
            {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
              broadcastLoading && (
                <div className="rounded-full sm:rounded-xl text-sm text-s-bg font-semibold bg-[#62F030]  py-1 px-2 sm:px-6">
                  Going...
                </div>
              )}
          </div>
        )}
        {isSignedIn && !hasProfile && !showLoading && (
          <button
            onClick={handleCreateLensProfileAndMakeDefault}
            className="rounded-xl text-[20px] md:text-[16px] font-semibold text-s-bg bg-[#62F030] py-1 px-2 sm:px-6"
          >
            Create Lens Handle
          </button>
        )}
        {!isSignedIn && address && !showLoading && (
          <button
            onClick={handleLogin}
            className="rounded-full sm:rounded-xl  sm:text-xl space-x-3 flex flex-row items-center font-semibold text-s-bg bg-[#62F030] py-1 px-3 sm:px-6 "
          >
            <img
              src={'/lensLogoWithoutText.svg'}
              className="sm:w-6 sm:h-6 w-5 h-5"
            />

            <span>Login</span>
          </button>
        )}
        {!isSignedIn && !address && !showLoading && (
          <button
            onClick={openConnectModal}
            className="bg-p-btn text-p-btn-text px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold"
          >
            {connectWalletLabel}
          </button>
        )}
      </div>
      {showLoading && (
        <>
          {isMobile ? (
            <div className="w-[35px] h-[35px] rounded-full animate-pulse bg-s-hover" />
          ) : (
            <div className="flex flex-row items-center space-x-2 border-s-border border py-1 px-2 rounded-full ">
              <div className="w-[40px] h-[40px] rounded-full animate-pulse bg-s-hover" />
              <div className="flex flex-col justify-around space-y-1">
                <div className="w-[100px] h-4 rounded-full animate-pulse bg-s-hover" />
                <div className="w-[80px] h-4 rounded-full animate-pulse bg-s-hover" />
              </div>
            </div>
          )}
        </>
      )}
      {/* )} */}
      {/* {!user && (
        <ConnectWalletAndSignInButton
          connectWalletLabel={'Connect'}
          SignInLabel={'Sign In'}
          DisconnectLabel={'Disconnect'}
        />
      )} */}
    </div>
  )
}

export default LensLoginButton
