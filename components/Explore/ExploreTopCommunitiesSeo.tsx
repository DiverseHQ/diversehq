import { NextSeo } from 'next-seo'
import React from 'react'

const ExploreTopCommunitiesSeo = () => {
  return (
    <NextSeo
      title="Explore / DiverseHQ"
      description="Discover the top communities on DiverseHQ."
      openGraph={{
        title: 'Explore / DiverseHQ',
        description: 'Discover the top communities on DiverseHQ.',
        url: 'https://app.diversehq.xyz/explore/top'
      }}
    />
  )
}

export default ExploreTopCommunitiesSeo
