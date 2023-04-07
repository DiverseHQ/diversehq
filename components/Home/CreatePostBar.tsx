import React from 'react'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import CreatePostPopup from './CreatePostPopup'
import { useNotify } from '../Common/NotifyContext'
import { modalType } from '../Common/CustomPopUpProvider'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'
import { BsFillPersonFill } from 'react-icons/bs'
import clsx from 'clsx'

const CreatePostBar = ({
  title,
  beforeOpen,
  className = ''
}: {
  title?: string
  beforeOpen?: () => void
  className?: string
}) => {
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
    if (beforeOpen) {
      beforeOpen()
    }
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  return (
    <div
      className={clsx(
        'flex flex-row items-center bg-s-bg py-2 px-2 sm:px-4 sm:rounded-[15px] gap-2 sm:border-[1px] sm:border-s-border',
        className
      )}
    >
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
            className="sm:w-[44px] sm:h-[44px] w-[30px] h-[30px] rounded-full"
          />
        )}
      </div>
      <div
        className="p-2 flex-1 bg-s-hover rounded-lg sm:rounded-[15px] h-[30px] sm:h-[44px] flex flex-row items-center text-[#898A8D] cursor-pointer"
        onClick={createPost}
      >
        <span>{title ? title : "What's up?"}</span>
      </div>
    </div>
  )
}

export default CreatePostBar
