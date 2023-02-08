import React from 'react'
import { useSigner } from 'wagmi'
// import { useXmtp, XmtpContext } from '../Common/XmtpProvider'
import LensLoginButton from '../Common/LensLoginButton'
import { useProfile } from '../Common/WalletContext'
import { useLensUserContext } from '../../lib/LensUserContext'
import AllConversations from './AllConversations'
// import { UserType } from '../../types/user'

const MainMsgModal = () => {
  const { user }: any = useProfile()
  const { isSignedIn, hasProfile } = useLensUserContext()
  const { data: signer } = useSigner()
  return (
    <div className="p-4 bg-gray-300 fixed bottom-0 right-20">
      {(!signer || !isSignedIn || !hasProfile || !user) && <LensLoginButton />}
      {signer && isSignedIn && hasProfile && user && <AllConversations />}
    </div>
  )
}

export default MainMsgModal
