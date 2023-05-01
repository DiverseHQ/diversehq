// import { NextSeo } from 'next-seo'
import React from 'react'
import { appLink } from '../../utils/config'
import MetaTags from '../Common/Seo/MetaTags'

const ExploreTopCommunitiesSeo = () => {
  return (
    <MetaTags
      title="Explore / DiverseHQ"
      description="Discover the top communities on DiverseHQ."
      url={`${appLink}/explore/top`}
    />
    // <NextSeo
    //   title="Explore / DiverseHQ"
    //   description="Discover the top communities on DiverseHQ."
    //   openGraph={{
    //     title: 'Explore / DiverseHQ',
    //     description: 'Discover the top communities on DiverseHQ.',
    //     url: `${appLink}/explore/top`
    //   }}
    // />
  )
}

export default ExploreTopCommunitiesSeo
