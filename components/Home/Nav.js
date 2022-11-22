import { useProfile } from '../Common/WalletContext'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { MdOutlineExplore } from 'react-icons/md'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ClickOption from './ClickOption'
import { AiFillPlusCircle } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup'
import { useNotify } from '../Common/NotifyContext'

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

  return (
    <>
      <div className="fixed top-0 left-[250px] pt-6 pb-14 flex flex-col justify-between items-center h-full">
        <div className="flex flex-col items-center">
          <div className="mb-7 hover:cursor-pointer" onClick={routeToHome}>
            <Image src="/DiverseLogo.svg" width="45" height="45" className="" />
          </div>
          <MdOutlineExplore
            className="w-12 h-12 mb-7 hover:cursor-pointer"
            onClick={routeToExplore}
          />
          <AiFillPlusCircle
            className="w-12 h-12 mb-7 text-p-btn cursor-pointer"
            onClick={creatPost}
          />
        </div>
        <div
          className="flex-end hover:cursor-pointer"
          onClick={showMoreOptions}
        >
          {user?.profileImageUrl && (
            <img
              src={user.profileImageUrl}
              className="w-12 h-12 rounded-full"
            />
          )}
          {user && !user.profileImageUrl && (
            <Image
              src="/gradient.jpg"
              width="48"
              height="48"
              className="rounded-full"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Nav
