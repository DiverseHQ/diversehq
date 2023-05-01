// import { NextSeo } from 'next-seo'
import React from 'react'
import MetaTags from '../../Common/Seo/MetaTags'

const PostNotFoundSeo = () => {
  return (
    <MetaTags
      title={'Post was deleted or does not exist'}
      description={'Post was deleted or does not exist'}
    />
    // <NextSeo
    //   title={'Post was deleted or does not exist'}
    //   description={'Post was deleted or does not exist'}
    // />
  )
}

export default PostNotFoundSeo
