import React from 'react'
import AuthCommunity from '../../../../components/Community/AuthCommunity'
import UserManagementSettingPage from '../../../../components/Community/Settings/UserManagementSettingPage'

const UserManagement = () => {
  return (
    <AuthCommunity>
      <UserManagementSettingPage />
    </AuthCommunity>
  )
}

export default UserManagement
