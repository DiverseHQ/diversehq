import Link from 'next/link'
import React, { useEffect } from 'react'
import { useQueryClient } from 'wagmi'
import { useCreateSetDispatcherTypedDataMutation } from '../../graphql/generated'
import useLogin from '../../lib/auth/useLogin'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import CreateTestLensHandle from '../User/CreateTestLensHandle'
import { modalType, usePopUpModal } from './CustomPopUpProvider'
import { useNotify } from './NotifyContext'
import { useProfile } from './WalletContext'
import ConnectWalletAndSignInButton from './ConnectWalletAndSignInButton'

const LensLoginButton = () => {
  const {
    error,
    isSignedIn,
    hasProfile,
    data: lensProfile
  } = useLensUserContext()
  const { user, address } = useProfile()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { showModal } = usePopUpModal()

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
  }

  useEffect(() => {
    if (result && type === 'createSetDispatcher') {
      onSetDispatcherSuccess()
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      console.error(error)
      notifyError('Something went wrong, while setting dispatcher')
    }
  }, [error])
  return (
    <div>
      {user && address && (
        <div className="flex flex-col gap-4 text-p-text">
          {isSignedIn && hasProfile && (
            <div className="flex flex-col items-start">
              {lensProfile?.defaultProfile?.dispatcher?.canUseRelay && (
                <Link
                  href={`/u/${lensProfile.defaultProfile.handle}`}
                  className="mr-2 hover:cursor-pointer hover:underline"
                >
                  u/{lensProfile.defaultProfile.handle}
                </Link>
              )}
              {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                !loading && (
                  <button
                    onClick={handleEnableDispatcher}
                    className="flex flex-col items-center rounded-lg text-sm bg-[#62F030] px-2"
                  >
                    <div>
                      <span>u/{lensProfile?.defaultProfile?.handle}</span>
                    </div>
                    <div>
                      <spa>Go Signless</spa>
                    </div>
                  </button>
                )}
              {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                loading && (
                  <div className="rounded-lg text-sm bg-[#62F030] px-2">
                    Enabling...
                  </div>
                )}
            </div>
          )}
          {isSignedIn && !hasProfile && (
            <button
              onClick={handleCreateLensProfileAndMakeDefault}
              className="rounded-[20px] text-[16px] font-semibold text-p-btn-text bg-[#62F030] py-2 px-2 md:px-6 lg:px-12"
            >
              Create Lens Handle
            </button>
          )}
          {!isSignedIn && (
            <button
              onClick={handleLogin}
              className="rounded-[20px] text-[16px] font-semibold text-p-btn-text bg-[#62F030] py-2 px-2 md:px-6 lg:px-12"
            >
              Lens Login
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
