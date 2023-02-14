import React, { useState } from 'react'
import { useSigner } from 'wagmi'
import LensLoginButton from '../Common/LensLoginButton'
import { useProfile } from '../Common/WalletContext'
import { useLensUserContext } from '../../lib/LensUserContext'
import AllConversations from './AllConversations'
import MessageHeader from './MessageHeader'
import { useMessageStore } from '../../store/message'
import useXmtpClient from './hooks/useXmtpClient'
// import { UserType } from '../../types/user'

const MainMsgModal = () => {
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
  return (
    <div
      className={`fixed ${
        isOpen ? 'bottom-0' : 'bottom-[-500px]'
      } right-4 h-[550px] w-[450px] rounded-t-2xl border-[1px] border-p-btn duration-500 transition-all z-30`}
    >
      {/* header */}
      <div className="bg-s-bg rounded-t-2xl flex flex-col h-full text-p-text shadow-2xl">
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
