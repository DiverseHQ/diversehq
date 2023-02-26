import React from 'react'
import useSort from '../Common/Hook/useSort'
import LensAllLatestCommunityPublicationsColumn from './LensAllLatestCommunityPublicationsColumn'
import LensAllTopCommunityPublicationsColumn from './LensAllTopCommunityPublicationsColumn'

const LensPostsCommunityPublicationsColumn = ({ communityInfo }) => {
  const { isTop } = useSort()
  if (isTop) {
    return (
      <LensAllTopCommunityPublicationsColumn communityInfo={communityInfo} />
    )
  }
  return (
    <LensAllLatestCommunityPublicationsColumn communityInfo={communityInfo} />
  )
}

export default LensPostsCommunityPublicationsColumn
