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

const drawerBleeding = 56

const MainMsgModal = () => {
  const { user }: any = useProfile()
  const { isSignedIn, hasProfile } = useLensUserContext()
  const { data: signer } = useSigner()
  const [open, setOpen] = useState(false)
  const conversationKey = useMessageStore((state) => state.conversationKey)
  const profile = useMessageStore((state) =>
    state.messageProfiles.get(conversationKey)
  )
  const { client } = useXmtpClient()
  return (
    <div
      className={`fixed ${
        open ? 'bottom-0' : 'bottom-[-500px]'
      } right-4 h-[550px] w-[450px] rounded-t-2xl border-[1px] border-p-btn duration-500 transition-all z-30`}
    >
      {/* header */}
      <div className="bg-s-bg rounded-t-2xl flex flex-col h-full">
        <MessageHeader profile={profile} open={open} setOpen={setOpen} />
        {(!signer || !isSignedIn || !hasProfile || !user) && (
          <div className="flex justify-center items-center h-full w-full">
            <LensLoginButton />
          </div>
        )}

        {signer &&
          isSignedIn &&
          hasProfile &&
          user &&
          ((!open && client) || open) && <AllConversations />}
      </div>
    </div>
  )
}

export default MainMsgModal
