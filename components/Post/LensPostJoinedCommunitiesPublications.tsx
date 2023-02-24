import useSort from '../Common/Hook/useSort'
import LensJoinedTopPublicationsColumn from './LensJoinedTopPublicationsColumn'
import LensJoinedLatestPublicationsColumn from './LensJoinedLatestPublicationsColumn'
import { memo } from 'react'
const LensPostJoinedCommunitiesPublications = ({ communityIds }) => {
  const { isTop } = useSort()

  if (isTop) {
    return <LensJoinedTopPublicationsColumn communityIds={communityIds} />
  }

  return <LensJoinedLatestPublicationsColumn communityIds={communityIds} />
}

export default memo(LensPostJoinedCommunitiesPublications)
