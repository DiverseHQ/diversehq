import { useProfile } from '../Common/WalletContext'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { MdOutlineExplore, MdOutlineNotificationsActive } from 'react-icons/md'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ClickOption from './ClickOption'
import LoginButton from '../Common/UI/LoginButton'
import LogoComponent from '../Common/UI/LogoComponent'
import CreateCommunity from './CreateCommunity'
import { BiNetworkChart } from 'react-icons/bi'
import { stringToLength } from '../../utils/utils'
import { useNotify } from '../Common/NotifyContext'
import { FaRegCopy } from 'react-icons/fa'
import CreatePostPopup from './CreatePostPopup'
import { useDisconnect } from 'wagmi'
import { useLensUserContext } from '../../lib/LensUserContext'
import useLogin from '../../lib/auth/useLogin'
import CreateTestLensHandle from '../User/CreateTestLensHandle'
import { useCreateSetDispatcherTypedDataMutation } from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const Nav = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

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

  const { user, address } = useProfile()
  const { showModal } = usePopUpModal()
  const { notifyInfo, notifySuccess, notifyError } = useNotify()
  const { disconnect } = useDisconnect()

  async function handleLogin() {
    await login()
  }

  const routeToExplore = () => {
    router.push('/explore')
  }

  const routeToHome = () => {
    router.push('/')
  }

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal({
      component: <ClickOption />,
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        bottom:
          window.innerHeight -
          e.currentTarget.getBoundingClientRect().top +
          10 +
          'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You shall not pass, without login first')
      return
    }
    showModal({
      component: <CreateCommunity />,
      type: modalType.fullscreen,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const handleWalletAddressCopy = () => {
    if (!user?.walletAddress) {
      notifyInfo('Please Login')
      return
    }
    navigator.clipboard.writeText(user?.walletAddress)
    notifyInfo('Copied to clipboard')
  }

  const creatPost = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
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
    <div>
      <div className="fixed top-[50px] left-[calc(((100vw-600px)/2)-50px-350px)] pt-6 pb-14 flex flex-col justify-between items-start w-[350px] h-[calc(100vh-100px)] bg-s-bg rounded-[25px] shadow-xl px-8">
        <div className="flex flex-col">
          <div
            className="mb-10 mx-3 hover:cursor-pointer justify-center"
            onClick={routeToHome}
          >
            {/* <Image src="/DiverseLogo.svg" width="45" height="45" className="" />
             */}
            <LogoComponent />
          </div>
          <div
            className="flex flex-row text-2xl items-center mb-4 cursor-pointer hover:bg-p-h-bg rounded-full p-3"
            onClick={routeToExplore}
          >
            <MdOutlineExplore className="w-10 h-10" />
            <div className="ml-5">Explore</div>
          </div>
          <div
            className="flex flex-row text-2xl items-center mb-4 cursor-pointer hover:bg-p-h-bg rounded-full p-3"
            onClick={() => {}}
          >
            <MdOutlineNotificationsActive className="w-10 h-10" />
            <div className="ml-5">Notifications</div>
          </div>
          <div
            className="flex flex-row text-2xl items-center mb-4 cursor-pointer hover:bg-p-h-bg rounded-full p-3"
            onClick={createCommunity}
          >
            <BiNetworkChart className="w-10 h-10" />
            <div className="ml-5">Create Community</div>
          </div>
          <div
            className="text-2xl py-3 px-12 primary-gradient rounded-full button-dropshadow cursor-pointer text-center"
            onClick={creatPost}
          >
            Create Post
          </div>
          {/* <div className="flex flex-row text-2xl items-center mb-6 cursor-pointer">
            <AiFillPlusCircle className="w-10 h-10" onClick={creatPost} />
            <div className="ml-5">Notifications</div>
          </div>
          <AiFillPlusCircle
            className="w-12 h-12 mb-7 text-p-btn cursor-pointer"
            onClick={creatPost}
          /> */}
        </div>
        {user && address && (
          <div>
            {isSignedIn && hasProfile && (
              <>
                <div>Lens Profile: {lensProfile.defaultProfile.handle}</div>
                {!lensProfile?.defaultProfile.dispatcher?.canUseRelay && (
                  <button onClick={handleEnableDispatcher}>
                    Enable Dispatcher : Recommended for smoooth experience
                  </button>
                )}
              </>
            )}
            {isSignedIn && !hasProfile && (
              <button onClick={handleCreateLensProfileAndMakeDefault}>
                Create Lens Profile
              </button>
            )}
            {!isSignedIn && (
              <button onClick={handleLogin} className="text-2xl">
                Lens Login
              </button>
            )}
            <div
              className="text-xl items-center h-[60px] bg-s-h-bg flex flex-row hover:cursor-pointer rounded-full pr-8 ml-3 shadow-lg"
              onClick={showMoreOptions}
            >
              {user?.profileImageUrl && (
                <img
                  src={user.profileImageUrl}
                  className="w-[65px] h-[65px] rounded-full"
                />
              )}
              {user && !user.profileImageUrl && (
                <Image
                  src="/gradient.jpg"
                  width="65"
                  height="65"
                  className="rounded-full"
                />
              )}
              <div className="pl-4 flex flex-col">
                {user?.name && <div>{stringToLength(user?.name, 10)}</div>}
                <div
                  className="flex flex-row items-center cursor-pointer"
                  onClick={handleWalletAddressCopy}
                >
                  <div className="text-base sm:text-xl">
                    {stringToLength(user.walletAddress, 10)}
                  </div>
                  <FaRegCopy className="w-8 h-8 px-2" />
                </div>
              </div>
            </div>
          </div>
        )}
        {!user && !address && <LoginButton />}
        {!user && address && (
          <div className="">
            <div className="text-sm text-red-600 pl-6">Not whitelisted</div>
            <button
              className="text-2xl bg-p-h-bg py-4 px-10 rounded-full"
              onClick={disconnect}
            >
              <div>Disconnect</div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Nav
