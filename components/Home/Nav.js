import { useProfile } from '../Common/WalletContext'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { MdOutlineExplore, MdOutlineNotificationsActive } from 'react-icons/md'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ClickOption from './ClickOption'
import { AiFillPlusCircle } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup'
import { useNotify } from '../Common/NotifyContext'
import LoginButton from '../Common/UI/LoginButton'
import LogoComponent from '../Common/UI/LogoComponent'
import CreateCommunity from './CreateCommunity'
import { BiNetworkChart } from 'react-icons/bi'

const Nav = () => {
  const { user } = useProfile()
  const router = useRouter()
  const { showModal } = usePopUpModal()
  const { notifyInfo } = useNotify()
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

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    showModal({
      component: <CreateCommunity />,
      type: modalType.fullscreen,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  return (
    <div>
      <div className="fixed top-[50px] left-0 pt-6 pb-14 flex flex-col justify-between items-start min-w-[350px] h-[calc(100vh-100px)] bg-s-h-bg rounded-r-[25px] shadow-xl px-8">
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
          {/* <div className="flex flex-row text-2xl items-center mb-6 cursor-pointer">
            <AiFillPlusCircle className="w-10 h-10" onClick={creatPost} />
            <div className="ml-5">Notifications</div>
          </div>
          <AiFillPlusCircle
            className="w-12 h-12 mb-7 text-p-btn cursor-pointer"
            onClick={creatPost}
          /> */}
        </div>
        {user && (
          <div
            className="text-2xl items-center h-[60px] bg-s-bg flex flex-row hover:cursor-pointer rounded-full pr-8 ml-3 shadow-lg"
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
            <div className="pl-4">{user.name || user.address}</div>
          </div>
        )}
        {!user && <LoginButton />}
      </div>
    </div>
  )
}

export default Nav
