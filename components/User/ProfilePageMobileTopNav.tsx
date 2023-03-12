import React, { FC } from 'react'
import { Profile } from '../../graphql/generated'
import MobileTopNavbarWithTitle from '../Common/MobileTopNavbarWithTitle'
import formatHandle from './lib/formatHandle'

interface Props {
  _lensProfile: Profile
}

const ProfilePageMobileTopNav: FC<Props> = ({ _lensProfile }) => {
  return (
    <MobileTopNavbarWithTitle
      title={`u/${formatHandle(_lensProfile?.handle)}` || 'Profile'}
    />
  )
}

export default ProfilePageMobileTopNav
