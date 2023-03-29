import { NextSeo } from 'next-seo'
import React from 'react'

const NotificationSeo = () => {
  return (
    <NextSeo
      title="Notifications / DiverseHQ"
      description='"Stay up-to-date with the latest updates and notifications!'
      openGraph={{
        title: 'Notifications',
        description:
          'Stay up-to-date with the latest updates and notifications!',
        url: 'https://diversehq.xyz/notifications'
      }}
    />
  )
}

export default NotificationSeo
