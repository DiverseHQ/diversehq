import React, { useEffect } from 'react'
import { useSigner } from 'wagmi'
import LensLoginButton from '../Common/LensLoginButton'
import { useProfile } from '../Common/WalletContext'
import { useLensUserContext } from '../../lib/LensUserContext'
import AllConversations from './AllConversations'
import MessageHeader from './MessageHeader'
import { useMessageStore } from '../../store/message'
import useXmtpClient from './hooks/useXmtpClient'
import clsx from 'clsx'
// import { UserType } from '../../types/user'

interface Props {
  isMobile?: boolean
}

const MainMsgModal = ({ isMobile = false }: Props) => {
  const { user }: any = useProfile()
  const { isSignedIn, hasProfile } = useLensUserContext()
  const { data: signer } = useSigner()
  const isOpen = useMessageStore((state) => state.isOpen)
  const setIsOpen = useMessageStore((state) => state.setIsOpen)
  const conversationKey = useMessageStore((state) => state.conversationKey)
  const profile = useMessageStore((state) =>
    state.messageProfiles.get(conversationKey)
  )
  const { client } = useXmtpClient()

  // //Check if the cursor is on the modal or not if it is on the modal Stop other scrolling and if not on the modal then scroll the other page
  // function handleMouseEnter() {
  //   // disable scrolling on body when mouse enters the component
  //   document.body.style.overflow = 'hidden'
  // }

  // function handleMouseLeave() {
  //   // enable scrolling on body when mouse leaves the component
  //   document.body.style.overflow = 'auto'
  // }

  useEffect(() => {
    if (!isMobile) return
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  return (
    <div
      style={{ zIndex: 60 }}
      className={clsx(
        'fixed  duration-500 transition-all',
        isOpen
          ? 'bottom-0'
          : `${isMobile ? 'bottom-[-120vh]' : 'bottom-[-500px]'}`,
        isMobile
          ? 'w-full h-full left-0 right-0'
          : 'w-[450px] h-[550px] rounded-t-2xl shadow-2xl border-[1px] border-s-border  right-4'
      )}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      {/* header */}
      <div className="bg-s-bg sm:rounded-t-2xl flex flex-col h-full text-p-text shadow-2xl">
        <MessageHeader profile={profile} open={isOpen} setOpen={setIsOpen} />
        {(!signer || !isSignedIn || !hasProfile || !user) && (
          <div className="flex justify-center items-center h-full w-full">
            <LensLoginButton />
          </div>
        )}

        {signer &&
          isSignedIn &&
          hasProfile &&
          user &&
          ((!isOpen && client) || isOpen) && <AllConversations />}
      </div>
    </div>
  )
}

export default MainMsgModal
