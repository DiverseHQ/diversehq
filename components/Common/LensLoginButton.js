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
import ConnectWalletAndSignInButton from './ConnectWalletAndSignInButton'
import useDevice from './useDevice'
import { useQueryClient } from '@tanstack/react-query'
import formatHandle from '../User/lib/formatHandle'

const LensLoginButton = () => {
  const {
    isSignedIn,
    hasProfile,
    data: lensProfile,
    refetch
  } = useLensUserContext()
  const { user, address } = useProfile()
  const { notifyInfo, notifySuccess } = useNotify()
  const { showModal } = usePopUpModal()
  const { isMobile } = useDevice()

  const queryClient = useQueryClient()

  const { mutateAsync: login } = useLogin()
  const { mutateAsync: createSetDispatcher } =
    useCreateSetDispatcherTypedDataMutation()
  const { result, type, loading, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()

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
      const createSetDispatcherResult = (
        await createSetDispatcher({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            enable: true
          }
        })
      ).createSetDispatcherTypedData

      signTypedDataAndBroadcast(createSetDispatcherResult?.typedData, {
        id: createSetDispatcherResult?.id,
        type: 'createSetDispatcher'
      })
    } catch (e) {
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

  return (
    <div>
      {user && address && (
        <div className="flex flex-col gap-4 text-p-text items-start">
          {isSignedIn && hasProfile && (
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
                !loading && (
                  <button
                    onClick={handleEnableDispatcher}
                    className="rounded-full sm:rounded-xl text-sm bg-[#62F030] px-2"
                  >
                    <span>Go Signless</span>
                  </button>
                )}
              {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                loading && (
                  <div className="rounded-full sm:rounded-xl text-sm bg-[#62F030]  py-2 px-2 sm:px-6">
                    Going...
                  </div>
                )}
            </div>
          )}
          {isSignedIn && !hasProfile && (
            <button
              onClick={handleCreateLensProfileAndMakeDefault}
              className="rounded-xl text-[20px] md:text-[16px] font-semibold text-p-btn-text dark:text-s-bg bg-[#62F030] py-2 px-2 sm:px-6"
            >
              Create Lens Handle
            </button>
          )}
          {!isSignedIn && (
            <button
              onClick={handleLogin}
              className="rounded-xl text-[20px] space-x-3 md:text-[16px] flex flex-row items-center font-semibold text-p-btn-text dark:text-s-bg bg-[#62F030] py-2 px-4 sm:px-6 "
            >
              <img src={'/lensLogoWithoutText.svg'} className="w-6 h-6" />

              <span>Login</span>
            </button>
          )}
        </div>
      )}
      {!user && (
        <ConnectWalletAndSignInButton
          connectWalletLabel={'Connect'}
          SignInLabel={'Sign In'}
          DisconnectLabel={'Disconnect'}
        />
      )}
    </div>
  )
}

export default LensLoginButton
