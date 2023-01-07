import Head from 'next/head'
import React from 'react'

const SinglePageSeoHead = ({ title, description, url, image, video }) => {
  return (
    <Head>
      {title && (
        <>
          {' '}
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          {' '}
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:card" content={description} />
        </>
      )}
      {url && (
        <>
          <meta property="og:url" content={url} />
          <meta name="twitter:url" content={url} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta name="twitter:image" content={image} />
        </>
      )}
      {video && (
        <>
          <meta property="og:video" content={video} />

          <meta name="twitter:video" content={video} />
        </>
      )}
    </Head>
  )
}

export default SinglePageSeoHead
