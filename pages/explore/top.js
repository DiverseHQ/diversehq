// import { NextSeo } from 'next-seo'
import React from 'react'
import ExploreTopCommunitiesPage from '../../components/Explore/ExploreTopCommunitiesPage'
import ExploreTopCommunitiesSeo from '../../components/Explore/ExploreTopCommunitiesSeo'

const top = () => {
  return (
    <>
      <ExploreTopCommunitiesSeo />
      <ExploreTopCommunitiesPage />
    </>
  )
}

export default top
