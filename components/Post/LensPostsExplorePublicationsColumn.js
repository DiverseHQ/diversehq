import { memo } from 'react'
import useSort from '../Common/Hook/useSort'
import LensAllLatestPublicationsColumn from './LensAllLatestPublicationsColumn'
import LensAllTopPublicationsColumn from './LensAllTopPublicationsColumn'

const LensPostsExplorePublicationsColumn = () => {
  const { isTop } = useSort()

  return (
    <>
      <div className={`${isTop ? 'block' : 'hidden'}`}>
        <LensAllTopPublicationsColumn />
      </div>
      <div>
        <LensAllLatestPublicationsColumn
          className={`${isTop ? 'block' : 'hidden'}`}
        />
      </div>
    </>
  )
}

export default memo(LensPostsExplorePublicationsColumn)
