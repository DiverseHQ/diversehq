import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import LensCommunitySettingsIndexPage from '../../../../components/LensCommunity/Settings/LensCommunitySettingsIndexPage'
// import { useLensUserContext } from '../../../../lib/LensUserContext'
// import { LensCommunity } from '../../../../types/community'

const index = () => {
  const { LensCommunity: l } = useProfile()
  // const { data: profile } = useLensUserContext()
  return (
    <LensAuthCommunity>
      <LensCommunitySettingsIndexPage community={l} />
    </LensAuthCommunity>
  )
}

export default index
