import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import FilterButton from '../Common/UI/FilterButton'
import FilterRow from '../Common/UI/FilterRow'
import { useProfile } from '../Common/WalletContext'
// import { SiHotjar } from 'react-icons/si'
import ExploreSwitch from './ExploreSwitch'

interface Props {
  showUnjoined?: boolean
  setShowUnjoined?: any
}

const ExploreFeedNav: FC<Props> = ({ showUnjoined, setShowUnjoined }) => {
  //get current page path
  const router = useRouter()
  const { user } = useProfile()
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
    <FilterRow
      EndButton={
        user && (
          <ExploreSwitch
            showUnjoined={showUnjoined}
            setShowUnjoined={setShowUnjoined}
          />
        )
      }
    >
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
