import Head from 'next/head'
import React from 'react'
import { DEFAULT_OG_IMAGE } from '../../../utils/config'

interface Props {
  title?: string
  description?: string
  image?: string
  url?: string
}

const MetaTags = ({ title, description, image, url }: Props) => {
  if (!image) {
    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />

        <meta property="og:url" content={url ?? 'https://diversehq.xyz'} />
        <meta property="og:site_name" content={'DiverseHQ'} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="250" />
        <meta property="og:image:height" content="250" />

        <meta property="twitter:site" content={'DiverseHQ'} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:creator" content="useDiverseHQ" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* <img src={DEFAULT_OG_IMAGE} alt="Company Logo" /> */}
      </Head>
    )
  }
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      />

      <meta property="og:url" content={url ?? 'https://diversehq.xyz'} />
      <meta property="og:site_name" content={'DiverseHQ'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta property="og:image" content={image ?? DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={'DiverseHQ'} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image:src" content={image ?? DEFAULT_OG_IMAGE} />
      <meta property="twitter:image" content={image ?? DEFAULT_OG_IMAGE} />
      <meta property="twitter:image:width" content="1200" />
      <meta property="twitter:image:height" content="630" />
      <meta property="twitter:creator" content="useDiverseHQ" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      <img src={DEFAULT_OG_IMAGE} alt="Company Logo" />
      {/* 
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="/opensearch.xml"
        title={APP_NAME}
      /> */}
    </Head>
  )
}

export default MetaTags
