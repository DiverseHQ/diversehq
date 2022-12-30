import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import SearchModal from '../Search/SearchModal'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useProfile } from '../Common/WalletContext'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useNotify } from '../Common/NotifyContext'
import { modalType } from '../Common/CustomPopUpProvider'
import useLogin from '../../lib/auth/useLogin'
import CreateTestLensHandle from '../User/CreateTestLensHandle'
import { useCreateSetDispatcherTypedDataMutation } from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useQueryClient } from '@tanstack/react-query'

const Navbar = () => {
  const router = useRouter()
  const { openConnectModal, showModal } = useConnectModal()
  const { user, address } = useProfile()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const queryClient = useQueryClient()

  const routeToHome = () => {
    router.push('/')
  }

  const { mutateAsync: login } = useLogin()
  const { mutateAsync: createSetDispatcher } =
    useCreateSetDispatcherTypedDataMutation()
  const { result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const {
    error,
    isSignedIn,
    hasProfile,
    data: lensProfile
  } = useLensUserContext()

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
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      console.error(error)
      notifyError('Something went wrong, while setting dispatcher')
    }
  }, [error])

  return (
    <div className="flex flex-row flex-1 z-10 justify-between px-4 md:px-8 py-2 items-center shadow-nav gap-2 sticky top-0 bg-[#eef1ff]">
      <div
        className="flex flex-row items-center border-[1px] border-[#C9A4F4] rounded-[50px] hover:cursor-pointer"
        onClick={routeToHome}
      >
        <img
          className="w-[44px] h-[44px] object-contain"
          src="/logo.svg"
          alt="Diverse HQ logo"
        />
        <h2 className="text-[18px] text-p-btn font-semibold tracking-wide p-1 md:p-2">
          DIVERSE HQ
        </h2>
      </div>
      {/* <div className="hidden sm:flex flex-row items-center border-[1px] border-p-btn p-1 rounded-[50px] bg-s-text w-[200px] md:w-[300px] lg:w-[400px] xl:w-[450px] 2xl:w-[600px]  gap-2 md:gap-4">
          <div className="bg-p-btn rounded-[22px] py-1 px-2 md:px-3 ">
            <AiOutlineSearch className="w-[23px] h-[23px] text-s-text" />
          </div>
          <input
            className="bg-transparent mr-1 text-[14px] text-[#111] outline-none w-full"
            type="text"
            placeholder="Search Diverse"
          />
        </div> */}
      <SearchModal />
      <div>
        {user && address && (
          <div className="flex flex-col gap-4">
            {isSignedIn && hasProfile && (
              <>
                <div className="rounded-[20px] text-[16px] font-semibold text-s-text bg-[#62F030] py-2 px-2 md:px-6 lg:px-12">
                  Lens Profile: {lensProfile.defaultProfile.handle}
                </div>
                {!lensProfile?.defaultProfile.dispatcher?.canUseRelay && (
                  <button
                    onClick={handleEnableDispatcher}
                    className="rounded-[20px] text-[16px] font-semibold text-s-text bg-[#62F030] py-2 px-2 md:px-6 lg:px-12"
                  >
                    Enable Dispatcher : Recommended for smoooth experience
                  </button>
                )}
              </>
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
    </div>
  )
}

export default Navbar
