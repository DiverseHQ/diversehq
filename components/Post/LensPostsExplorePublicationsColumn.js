import { memo } from 'react'
import useSort from '../Common/Hook/useSort'
import LensAllLatestPublicationsColumn from './LensAllLatestPublicationsColumn'
import LensAllTopPublicationsColumn from './LensAllTopPublicationsColumn'

const LensPostsExplorePublicationsColumn = () => {
  const { isTop } = useSort()
  if (isTop) return <LensAllTopPublicationsColumn />
  return <LensAllLatestPublicationsColumn />
}

export default memo(LensPostsExplorePublicationsColumn)
