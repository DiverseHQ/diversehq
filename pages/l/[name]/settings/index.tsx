import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import LensCommunitySettingsIndexPage from '../../../../components/LensCommunity/Settings/LensCommunitySettingsIndexPage'
import { useLensUserContext } from '../../../../lib/LensUserContext'
import { LensCommunity } from '../../../../types/community'

const index = () => {
  const { LensCommunity: l } = useProfile()
  const { data: profile } = useLensUserContext()
  const LensCommunity: LensCommunity = {
    ...l,
    //@ts-ignore
    Profile: profile?.defaultProfile
  }
  return (
    <LensAuthCommunity>
      <LensCommunitySettingsIndexPage community={LensCommunity} />
    </LensAuthCommunity>
  )
}

export default index
