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

const Nav = () => {
  const router = useRouter()

  const { user, address } = useProfile()
  const { showModal } = usePopUpModal()
  const { notifyInfo } = useNotify()
  const { disconnect } = useDisconnect()

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
        )}
        {!user && !address && <LoginButton />}
        {!user && address && (
          <button
            className="text-2xl bg-p-h-bg py-4 px-10 rounded-full"
            onClick={disconnect}
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  )
}

export default Nav
