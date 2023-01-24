import React from 'react'
import { CiImageOn } from 'react-icons/ci'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import CreatePostPopup from './CreatePostPopup'
import { useNotify } from '../Common/NotifyContext'
import { modalType } from '../Common/CustomPopUpProvider'
import Image from 'next/image'

const CreatePostBar = () => {
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  const { notifyInfo } = useNotify()

  const createPost = () => {
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
    <div className="flex flex-row items-center bg-s-bg mt-10 mb-4 py-2 px-4 rounded-[15px] gap-2 border-[1px] border-p-border">
      <div className="flex items-center justify-center rounded-full w-[44px] h-[44px]">
        {user?.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            className="w-[44px] h-[44px] rounded-full"
          />
        )}
        {user && !user.profileImageUrl && (
          <Image
            src="/gradient.jpg"
            width="44"
            height="44"
            className="rounded-full"
          />
        )}
      </div>
      <div
        className="p-2 flex-1 bg-[#EDE7FF] dark:bg-[#272729] rounded-[15px] h-[44px] flex flex-row items-center text-[#898A8D] cursor-pointer"
        onClick={createPost}
      >
        <span>What&apos;s up?</span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <CiImageOn
          className="w-[20px] h-[20px] text-[#898A8D] cursor-pointer"
          onClick={createPost}
        />
        <button
          className="bg-p-btn text-p-btn-text font-semibold rounded-[10px] py-1 px-3 cursor-pointer"
          onClick={createPost}
        >
          POST
        </button>
      </div>
    </div>
  )
}

export default CreatePostBar
