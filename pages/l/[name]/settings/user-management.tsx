import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import UserManagementSettingsPage from '../../../../components/LensCommunity/Settings/UserManagementSettingsPage'
// import { useLensUserContext } from '../../../../lib/LensUserContext'
// import { LensCommunity } from '../../../../types/community'

const UserManagementPage = () => {
  const { LensCommunity: l } = useProfile()
  // const { data: profile } = useLensUserContext()
  // const LensCommunity: LensCommunity = {
  //   ...l,
  //   // @ts-ignore
  //   Profile: profile?.defaultProfile
  // }
  return (
    <LensAuthCommunity>
      <UserManagementSettingsPage community={l} />
    </LensAuthCommunity>
  )
}

export default UserManagementPage
