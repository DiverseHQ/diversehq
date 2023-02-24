import { memo } from 'react'
import useSort from '../Common/Hook/useSort'
import LensAllLatestPublicationsColumn from './LensAllLatestPublicationsColumn'
import LensAllTopPublicationsColumn from './LensAllTopPublicationsColumn'

const LensPostsExplorePublicationsColumn = () => {
  const { isTop } = useSort()
  console.log('lensPostExplorePublicationColumn')
  return (
    <>
      <div className={`${isTop ? 'block' : 'hidden'}`}>
        <LensAllTopPublicationsColumn />
      </div>
      <div className={`${isTop ? 'hidden' : 'block'}`}>
        <LensAllLatestPublicationsColumn />
      </div>
    </>
  )
}

export default memo(LensPostsExplorePublicationsColumn)
