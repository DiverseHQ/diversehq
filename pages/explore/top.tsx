// import { NextSeo } from 'next-seo'
import React, { useState } from 'react'
import { useProfile } from '../../components/Common/WalletContext'
import ExploreTopCommunitiesPage from '../../components/Explore/ExploreTopCommunitiesPage'
import ExploreTopCommunitiesSeo from '../../components/Explore/ExploreTopCommunitiesSeo'
import ExploreTopUnjoinedCommunitiesPage from '../../components/Explore/ExploreTopUnjoinedCommunitiesPage'

const top = () => {
  const { user } = useProfile()
  const [showUnjoined, setShowUnjoined] = useState(true)
  return (
    <>
      <ExploreTopCommunitiesSeo />
      {user && showUnjoined ? (
        <ExploreTopUnjoinedCommunitiesPage
          showUnjoined={showUnjoined}
          setShowUnjoined={setShowUnjoined}
        />
      ) : (
        <ExploreTopCommunitiesPage
          showUnjoined={showUnjoined}
          setShowUnjoined={setShowUnjoined}
        />
      )}
    </>
  )
}

export default top
