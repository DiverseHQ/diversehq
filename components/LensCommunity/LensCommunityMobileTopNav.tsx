import React from 'react'
import { LensCommunity } from '../../types/community'
import MobileTopNavbarWithTitle from '../Common/MobileTopNavbarWithTitle'
import formatHandle from '../User/lib/formatHandle'

const LensCommunityMobileTopNav = ({
  community
}: {
  community: LensCommunity
}) => {
  return (
    <MobileTopNavbarWithTitle
      title={`l/${formatHandle(community?.Profile?.handle)}`}
    />
  )
}

export default LensCommunityMobileTopNav
