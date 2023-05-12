import React from 'react'
import { appLink } from '../../utils/config'
import imageProxy from '../User/lib/imageProxy'
import { stringToLength } from '../../utils/utils'
import MetaTags from '../Common/Seo/MetaTags'

const CommunityPageSeo = ({ community }) => {
  return (
    <MetaTags
      description={stringToLength(community?.description, 90)}
      title={community?.name}
      image={imageProxy(community?.logoImageUrl, 'tr:w-1200,h-630,q-50')}
      url={`${appLink}/c/${community?.name}`}
    />
  )
}

export default CommunityPageSeo
