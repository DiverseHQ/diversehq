import LensJoinedTopPublicationsColumn from './LensJoinedTopPublicationsColumn'
import LensJoinedLatestPublicationsColumn from './LensJoinedLatestPublicationsColumn'
import { memo } from 'react'
import useSort from '../Common/Hook/useSort'
const LensPostJoinedCommunitiesPublications = ({ communityIds }) => {
  const { isTop } = useSort()

  console.log('communityIds', communityIds)

  if (isTop) {
    return <LensJoinedTopPublicationsColumn communityIds={communityIds} />
  }

  return <LensJoinedLatestPublicationsColumn communityIds={communityIds} />
}

export default memo(LensPostJoinedCommunitiesPublications)
