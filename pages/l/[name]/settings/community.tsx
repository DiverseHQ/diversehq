import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import LensCommunitySettingsPage from '../../../../components/LensCommunity/Settings/LensCommunitySettingsPage'
import { useLensUserContext } from '../../../../lib/LensUserContext'
import { LensCommunity } from '../../../../types/community'

const community = () => {
  const { LensCommunity: l } = useProfile()
  const { data: profile } = useLensUserContext()
  const LensCommunity: LensCommunity = {
    ...l,
    // @ts-ignore
    Profile: profile?.defaultProfile
  }
  return (
    <LensAuthCommunity>
      <LensCommunitySettingsPage community={LensCommunity} />
    </LensAuthCommunity>
  )
}
export default community
