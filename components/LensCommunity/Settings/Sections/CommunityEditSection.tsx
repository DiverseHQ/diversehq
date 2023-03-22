import React from 'react'
import { LensCommunity } from '../../../../types/community'
import ProfileForm from '../../../Settings/ProfileForm'

const CommunityEditSection = ({ community }: { community: LensCommunity }) => {
  console.log(community)
  return <ProfileForm />
}

export default CommunityEditSection
