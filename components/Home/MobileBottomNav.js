import { useRouter } from 'next/router'
import React from 'react'
import { AiFillPlusCircle, AiOutlineBell, AiOutlineHome } from 'react-icons/ai'
import { MdOutlineExplore } from 'react-icons/md'
import { BsSearch } from 'react-icons/bs'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import CreatePostPopup from './CreatePostPopup'
import useNotificationsCount from '../Notification/useNotificationsCount'
const MobileBottomNav = () => {
  const { notificationsCount } = useNotificationsCount()
  const { showModal } = usePopUpModal()
  const router = useRouter()
  const routeToHome = () => {
    router.push('/')
  }
  const routeToExplore = () => {
    router.push('/explore')
  }
  const routeToNotifications = () => {
    router.push('/notification')
  }
  const showCreatePostModal = () => {
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }
  const routeToSearch = () => {
    router.push('/search')
  }

  return (
    <div className="fixed bottom-0 w-full py-2.5 flex flex-row justify-evenly items-center bg-p-bg shadow-top">
      <AiOutlineHome className="w-7 h-7 " onClick={routeToHome} />
      <MdOutlineExplore className="w-7 h-7 " onClick={routeToExplore} />
      <AiFillPlusCircle
        className="w-10 h-10 text-p-btn"
        onClick={showCreatePostModal}
      />
      <BsSearch className="w-6 h-6 " onClick={routeToSearch} />
      <div className="relative">
        <AiOutlineBell className="w-7 h-7 " onClick={routeToNotifications} />
        {notificationsCount > 0 && (
          <div className="absolute top-0 left-0 px-1 text-xs text-p-btn-text bg-green-500 rounded-full">
            <span>{notificationsCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileBottomNav
