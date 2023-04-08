import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import RulesSettingsPage from '../../../../components/LensCommunity/Settings/RulesSettingsPage'
// import { useLensUserContext } from '../../../../lib/LensUserContext'
// import { LensCommunity } from '../../../../types/community'

const rules = () => {
  const { LensCommunity: l } = useProfile()
  // const { data: profile } = useLensUserContext()
  // const LensCommunity: LensCommunity = {
  //   ...l,
  //   // @ts-ignore
  //   Profile: profile?.defaultProfile
  // }
  return (
    <LensAuthCommunity>
      <RulesSettingsPage community={l} />
    </LensAuthCommunity>
  )
}

export default rules
