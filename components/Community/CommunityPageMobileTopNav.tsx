import React, { FC } from 'react'
import MobileTopNavbarWithTitle from '../Common/MobileTopNavbarWithTitle'
import { CommunityType } from '../../types/community'

interface Props {
  community: CommunityType
}

const CommunityPageMobileTopNav: FC<Props> = ({ community }) => {
  return <MobileTopNavbarWithTitle title={community?.name || 'Community'} />
}

export default CommunityPageMobileTopNav
