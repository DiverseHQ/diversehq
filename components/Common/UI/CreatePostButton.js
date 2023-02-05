import { useRouter } from 'next/router'
import React from 'react'
import { BsPlus } from 'react-icons/bs'
import CreatePostPopup from '../../Home/CreatePostPopup'
import { modalType, usePopUpModal } from '../CustomPopUpProvider'

const CreatePostButton = () => {
  const { showModal } = usePopUpModal()
  const router = useRouter()

  const showCreatePostModal = () => {
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  return (
    <div
      className={`cursor-pointer text-[32px] md:text-[36px] bg-p-btn rounded-full fixed z-40 ${
        router.pathname.startsWith('/p/')
          ? 'top-[calc(100vh-160px)]'
          : 'top-[calc(100vh-110px)]'
      } left-[calc(100vw-50px)] inline-block`}
      onClick={showCreatePostModal}
    >
      <BsPlus className="text-p-btn-text" />
    </div>
  )
}

export default CreatePostButton
