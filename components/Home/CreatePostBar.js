import React from 'react'
// import { CiImageOn } from 'react-icons/ci'
import { CgProfile } from 'react-icons/cg'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import CreatePostPopup from './CreatePostPopup'
import { useNotify } from '../Common/NotifyContext'
import { modalType } from '../Common/CustomPopUpProvider'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'

const CreatePostBar = () => {
  const { user } = useProfile()
  const { data: lensProfile, isSignedIn } = useLensUserContext()
  const { showModal } = usePopUpModal()
  const { notifyInfo } = useNotify()

  const createPost = () => {
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    if (!lensProfile) {
      notifyInfo('Lets login lens before we create a post')
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
    <div className="flex flex-row items-center bg-s-bg mt-4 mb-2 py-2 px-4 rounded-[15px] gap-2 border-[1px] border-s-border">
      <div className="flex items-center justify-center rounded-full w-[44px] h-[44px]">
        {!isSignedIn ||
          (!lensProfile && (
            <div>
              <CgProfile className="w-[32px] h-[32px]" />
            </div>
          ))}
        {isSignedIn && lensProfile && (
          <img
            src={getAvatar(lensProfile?.defaultProfile)}
            className="w-[44px] h-[44px] rounded-full"
          />
        )}
      </div>
      <div
        className="p-2 flex-1 bg-s-hover rounded-[15px] h-[44px] flex flex-row items-center text-[#898A8D] cursor-pointer"
        onClick={createPost}
      >
        <span>What&apos;s up?</span>
      </div>
      {/* <div className="flex flex-row gap-2 items-center">
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
      </div> */}
    </div>
  )
}

export default CreatePostBar
