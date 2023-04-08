import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import LensCommunityReportsSettingsPage from '../../../../components/LensCommunity/Settings/LensCommunityReportsSettingsPage'
// import { useLensUserContext } from '../../../../lib/LensUserContext'
// import { LensCommunity } from '../../../../types/community'

const reports = () => {
  const { LensCommunity: l } = useProfile()
  // const { data: profile } = useLensUserContext()
  // const LensCommunity: LensCommunity = {
  //   ...l,
  //   //@ts-ignore
  //   Profile: profile?.defaultProfile
  // }
  return (
    <LensAuthCommunity>
      <LensCommunityReportsSettingsPage community={l} />
    </LensAuthCommunity>
  )
}

export default reports
