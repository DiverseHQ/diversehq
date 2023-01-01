import { useConnectModal } from '@rainbow-me/rainbowkit'
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
  const { openConnectModal } = useConnectModal()

  const { mutateAsync: login } = useLogin()
  const { mutateAsync: createSetDispatcher } =
    useCreateSetDispatcherTypedDataMutation()
  const { result, type, loading, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()

  async function handleLogin() {
    await login()
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

  useEffect(() => {
    if (result && type === 'createSetDispatcher') {
      notifySuccess('Dispatcher Set successfully')
      queryClient.invalidateQueries({
        queryKey: ['defaultProfile']
      })
      queryClient.invalidateQueries({
        queryKey: ['lensUser']
      })
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
        <div className="flex flex-col gap-4">
          {isSignedIn && hasProfile && (
            <div className="flex flex-row items-center">
              <Link
                href={`/u/${lensProfile.defaultProfile.handle}`}
                className="mr-2 hover:cursor-pointer hover:underline"
              >
                u/{lensProfile.defaultProfile.handle}
              </Link>
              {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                !loading && (
                  <button
                    onClick={handleEnableDispatcher}
                    className="rounded-lg text-sm bg-[#62F030] px-2"
                  >
                    Enable Dispatcher <br /> Recommended for smoooth experience
                  </button>
                )}
              {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                loading && (
                  <div className="rounded-lg text-sm bg-[#62F030] px-2">
                    Enabling Dispatcher
                  </div>
                )}
            </div>
          )}
          {isSignedIn && !hasProfile && (
            <button
              onClick={handleCreateLensProfileAndMakeDefault}
              className="rounded-[20px] text-[16px] font-semibold text-s-text bg-[#62F030] py-2 px-2 md:px-6 lg:px-12"
            >
              Create Lens Profile
            </button>
          )}
          {!isSignedIn && (
            <button
              onClick={handleLogin}
              className="rounded-[20px] text-[16px] font-semibold text-s-text bg-[#62F030] py-2 px-2 md:px-6 lg:px-12"
            >
              Lens Login
            </button>
          )}
        </div>
      )}
      {!user && !address && (
        <button
          className="justify-end bg-p-btn text-s-text px-4 py-2 rounded-[50px] text-[14px] font-bold"
          onClick={openConnectModal}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default LensLoginButton
