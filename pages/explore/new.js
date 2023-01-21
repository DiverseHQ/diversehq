// import { NextSeo } from 'next-seo'
import React from 'react'
import ExploreNewCommunitesPage from '../../components/Explore/ExploreNewCommunitesPage'
import ExploreNewCommunitiesSeo from '../../components/Explore/ExploreNewCommunitiesSeo'

const newPage = () => {
  return (
    <>
      <ExploreNewCommunitiesSeo />
      <ExploreNewCommunitesPage />
    </>
  )
}

export default newPage
