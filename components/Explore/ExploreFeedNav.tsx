import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import FilterButton from '../Common/UI/FilterButton'
import FilterRow from '../Common/UI/FilterRow'
// import { SiHotjar } from 'react-icons/si'

const ExploreFeedNav = () => {
  //get current page path
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('top')

  useEffect(() => {
    if (pathname.endsWith('new')) {
      setActive('new')
    } else if (pathname.endsWith('top')) {
      setActive('top')
    } else if (pathname.endsWith('hot')) {
      setActive('hot')
    }
  }, [pathname])

  return (
    <FilterRow>
      <FilterButton
        active={active === 'top'}
        onClick={() => router.push('/explore/top')}
        title="Top"
        Icon={<MdLeaderboard />}
      />
      <FilterButton
        active={active === 'new'}
        onClick={() => router.push('/explore/new')}
        title="New"
        Icon={<HiSparkles />}
      />
    </FilterRow>
  )
}

export default ExploreFeedNav
