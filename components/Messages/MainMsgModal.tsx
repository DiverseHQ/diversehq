import React, { useState } from 'react'
import { useSigner } from 'wagmi'
import LensLoginButton from '../Common/LensLoginButton'
import { useProfile } from '../Common/WalletContext'
import { useLensUserContext } from '../../lib/LensUserContext'
import AllConversations from './AllConversations'
import { Drawer } from '@mui/material'
// import { UserType } from '../../types/user'

const MainMsgModal = () => {
  const { user }: any = useProfile()
  const { isSignedIn, hasProfile } = useLensUserContext()
  const { data: signer } = useSigner()
  const [open, setOpen] = useState(false)
  return (
    <div className="p-4 bg-gray-300 fixed bottom-0 right-20">
      <div onClick={() => setOpen(true)}>OPen</div>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
      >
        <div className="top-[-200px] absolute">
          <div>Hello i m under water</div>
          {(!signer || !isSignedIn || !hasProfile || !user) && (
            <LensLoginButton />
          )}
          {signer && isSignedIn && hasProfile && user && <AllConversations />}
        </div>
      </Drawer>
    </div>
  )
}

export default MainMsgModal
