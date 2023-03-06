import React from 'react'
import AuthCommunity from '../../../../components/Community/AuthCommunity'
import RulesSettingsPage from '../../../../components/Community/Settings/RulesSettingsPage'

const rules = () => {
  return (
    <AuthCommunity>
      <RulesSettingsPage />
    </AuthCommunity>
  )
}

export default rules
