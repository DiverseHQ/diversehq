// import { NextSeo } from 'next-seo'
import React from 'react'
import { appLink } from '../../utils/config'
import MetaTags from '../Common/Seo/MetaTags'

const NotificationSeo = () => {
  return (
    <MetaTags
      title="Notifications / DiverseHQ"
      description='"Stay up-to-date with the latest updates and notifications!'
      url={`${appLink}/notifications`}
    />
    // <NextSeo
    //   title="Notifications / DiverseHQ"
    //   description='"Stay up-to-date with the latest updates and notifications!'
    //   openGraph={{
    //     title: 'Notifications',
    //     description:
    //       'Stay up-to-date with the latest updates and notifications!',
    //     url: `${appLink}/notifications`
    //   }}
    // />
  )
}

export default NotificationSeo
