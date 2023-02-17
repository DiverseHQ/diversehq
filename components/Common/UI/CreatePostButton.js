import { useRouter } from 'next/router'
import React from 'react'
import CreatePostPopup from '../../Home/CreatePostPopup'
import { modalType, usePopUpModal } from '../CustomPopUpProvider'
import { HiPencil } from 'react-icons/hi'

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
      className={`cursor-pointer bg-p-btn p-3 rounded-full fixed  ${
        router.pathname.startsWith('/p/') ? 'z-20' : 'z-40'
      } bottom-[70px] right-[10px] inline-block`}
      onClick={showCreatePostModal}
    >
      <HiPencil className="text-p-btn-text w-7 h-7" />
    </div>
  )
}

export default CreatePostButton
