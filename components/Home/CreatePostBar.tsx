import React from 'react'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import CreatePostPopup from './CreatePostPopup'
import { useNotify } from '../Common/NotifyContext'
import { modalType } from '../Common/CustomPopUpProvider'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'
import { BsFillPersonFill } from 'react-icons/bs'

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
        {(!isSignedIn || !lensProfile) && (
          <div>
            <BsFillPersonFill className="w-[32px] h-[32px]" />
          </div>
        )}
        {isSignedIn && lensProfile && (
          <img
            // @ts-ignore
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
    </div>
  )
}

export default CreatePostBar
