// import { NextSeo } from 'next-seo'
import React, { useState } from 'react'
import { useProfile } from '../../components/Common/WalletContext'
import ExploreNewCommunitesPage from '../../components/Explore/ExploreNewCommunitesPage'
import ExploreNewCommunitiesSeo from '../../components/Explore/ExploreNewCommunitiesSeo'
import ExploreNewUnjoinedCommunitiesPage from '../../components/Explore/ExploreNewUnjoinedCommunitiesPage'

const newPage = () => {
  const { user } = useProfile()
  const [showUnjoined, setShowUnjoined] = useState(true)
  return (
    <>
      <ExploreNewCommunitiesSeo />
      {user && showUnjoined ? (
        <ExploreNewUnjoinedCommunitiesPage
          showUnjoined={showUnjoined}
          setShowUnjoined={setShowUnjoined}
        />
      ) : (
        <ExploreNewCommunitesPage
          showUnjoined={showUnjoined}
          setShowUnjoined={setShowUnjoined}
        />
      )}
    </>
  )
}

export default newPage
