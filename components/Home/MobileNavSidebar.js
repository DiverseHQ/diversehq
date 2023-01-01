import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { IoIosClose } from 'react-icons/io'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import { BsMoon } from 'react-icons/bs'
import { AiOutlineGift } from 'react-icons/ai'
import { MdOutlineGroups, MdOutlinePerson } from 'react-icons/md'
import CreateCommunity from './CreateCommunity'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import { useLensUserContext } from '../../lib/LensUserContext'
import useLogin from '../../lib/auth/useLogin'
import CreateTestLensHandle from '../User/CreateTestLensHandle'
import { useCreateSetDispatcherTypedDataMutation } from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

const MobileNavSidebar = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const router = useRouter()
  const { user, address } = useProfile()
  const { notifyInfo, notifySuccess, notifyError } = useNotify()
  const { showModal } = usePopUpModal()
  const queryClient = useQueryClient()

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You shall not pass, without login first')
      return
    }
    showModal({
      component: <CreateCommunity />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const routeToProfile = () => {
    if (!address) {
      notifyInfo('You might want to login first')
      return
    }
    router.push(`/u/${address}`)
  }

  const { mutateAsync: login } = useLogin()
  const { mutateAsync: createSetDispatcher } =
    useCreateSetDispatcherTypedDataMutation()
  const { result, type, loading, signTypedDataAndBroadcast } =
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
    <div
      className={`text-black z-0 fixed top-0 left-0 right-0 bottom-0 w-full overflow-hidden ${
        isOpenSidebar ? 'z-20' : ''
      }`}
    >
      {/* backdrop */}
      {isOpenSidebar && (
        <div
          className="absolute bg-black/20 top-0 right-0 left-0 bottom-0 w-full"
          onClick={() => {
            setIsOpenSidebar(false)
          }}
        />
      )}

      <div
        className={`flex flex-col absolute transition ease-in-out w-[80%] h-full duration-3000 bg-p-bg border gap-4 bg-[#E7ECF0] ${
          isOpenSidebar ? 'top-0 ' : 'top-[-490px]'
        } `}
      >
        <div className="flex flex-row justify-between p-4 gap-2">
          {user && address && (
            <div className="flex flex-col gap-1">
              <div className="w-[55px] h-[55px] bg-[#333] rounded-full"></div>
              <h3 className="font-semibold text-[18px]">Funny Pop</h3>
              <span className="text-[14px] text-s-text">
                4 Communities joined
              </span>
            </div>
          )}
          {!user && !address && <ConnectButton accountStatus="avatar" />}
          <div className="jutify-end">
            <button onClick={() => setIsOpenSidebar(!isOpenSidebar)}>
              <IoIosClose className="w-[40px] h-[40px]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-[#EEF1FF]">
          <button
            className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold p-4 gap-2"
            onClick={() => {
              routeToProfile()
              setIsOpenSidebar(false)
            }}
          >
            <MdOutlinePerson className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text ">Profile</span>
          </button>
          <button className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold p-4 gap-2">
            <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text ">Your Communities</span>
          </button>
          <button
            className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold p-4 gap-2"
            onClick={() => {
              createCommunity()
              setIsOpenSidebar(false)
            }}
          >
            <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text ">Create Community</span>
          </button>
          <button className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold p-4 gap-2">
            <AiOutlineGift className="w-[24px] h-[24px] object-contain" />
            <span className="text-p-text">XP Gift</span>
          </button>
        </div>
        {user && address && (
          <div className="flex flex-col bg-[#62F030]">
            {isSignedIn && hasProfile && (
              <div className="flex flex-col hover:font-semibold p-4 gap-2">
                <Link
                  href={`/u/${lensProfile.defaultProfile.handle}`}
                  className="flex flex-row gap-2 items-center mr-2 hover:cursor-pointer hover:underline"
                >
                  <img
                    src="/lensLogo.svg"
                    alt="Lens logo"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="text-p-btn-text">
                    {' '}
                    u/{lensProfile.defaultProfile.handle}
                  </span>
                </Link>
                {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                  !loading && (
                    <button
                      onClick={handleEnableDispatcher}
                      className="flex flex-row items-center hover:font-semibold p-4 gap-2"
                    >
                      <span className="text-p-btn-text">
                        {' '}
                        Enable Dispatcher <br /> Recommended for smoooth
                        experience
                      </span>
                    </button>
                  )}
                {!lensProfile?.defaultProfile.dispatcher?.canUseRelay &&
                  loading && (
                    <div className="flex flex-row items-center hover:font-semibold p-4 gap-2">
                      Enabling Dispatcher
                    </div>
                  )}
              </div>
            )}
            {isSignedIn && !hasProfile && (
              <button
                onClick={handleCreateLensProfileAndMakeDefault}
                className="flex flex-row items-center hover:font-semibold p-4 gap-2"
              >
                <span className="text-p-btn-text">Create Lens Profile</span>
              </button>
            )}
            {!isSignedIn && (
              <button
                onClick={handleLogin}
                className="flex flex-row items-center hover:font-semibold p-4 gap-2"
              >
                <img
                  src="/lensLogo.svg"
                  alt="Lens logo"
                  className="w-[20px] h-[20px]"
                />
                <span className="text-p-btn-text">Lens Login</span>
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col bg-[#EEF1FF]">
          <button className="flex flex-row items-center gap-2 p-4 hover:bg-p-btn-hover hover:font-semibold">
            <BsMoon className="w-[20px] h-[20px]" />
            <span className="text-p-text">Dark Mode</span>
          </button>
          <button className="flex flex-row items-center gap-2 p-4 hover:bg-p-btn-hover hover:font-semibold">
            <IoIosHelpCircleOutline className="w-[20px] h-[20px]" />
            <span className="text-p-text">Help Center</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileNavSidebar
