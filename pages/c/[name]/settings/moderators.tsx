import React from 'react'
import AuthCreatorOfCommunity from '../../../../components/Community/AuthCreatorOfCommunity'
import ModeratorsSettingsPage from '../../../../components/Community/Settings/ModeratorsSettingsPage'

const moderators = () => {
  return (
    <AuthCreatorOfCommunity>
      <ModeratorsSettingsPage />
    </AuthCreatorOfCommunity>
  )
}

export default moderators
