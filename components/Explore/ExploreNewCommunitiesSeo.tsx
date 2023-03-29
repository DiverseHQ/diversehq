import { NextSeo } from 'next-seo'
import React from 'react'
import { appLink } from '../../utils/config'

const ExploreNewCommunitiesSeo = () => {
  return (
    <NextSeo
      title="Explore / DiverseHQ"
      description="Discover the latest communities on DiverseHQ."
      openGraph={{
        title: 'Explore / DiverseHQ',
        description: 'Discover the latest communities on DiverseHQ.',
        url: `${appLink}/explore/new`
      }}
    />
  )
}

export default ExploreNewCommunitiesSeo
