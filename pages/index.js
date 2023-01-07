import { NextSeo } from 'next-seo'
import React from 'react'
import LensPostsExplorePublicationsColumn from '../components/Post/LensPostsExplorePublicationsColumn'
import NavFilterAllPosts from '../components/Post/NavFilterAllPosts'

const Home = () => {
  return (
    <>
      {/* <SinglePageSeoHead
        title={'Home / DiverseHQ'}
        description={
          'Join Communities, Share your Creativity and get Rewarded.'
        }
        url={'https://app.diversehq.xyz'}
        image={'https://app.diversehq.xyz/apple-touch-icon.png'}
      /> */}
      <NextSeo
        title="DiverseHQ"
        description="We believe access and content reach is not just for famous few. Join us in our mission to democratize and give this power back to you."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://diversehq.xyz',
          site_name: 'DiverseHQ',
          images: [
            {
              url: 'https://diversehq.xyz/vector-bg.png',
              width: 1200,
              height: 630,
              alt: 'DiverseHQ'
            }
          ]
        }}
        twitter={{
          handle: '@useDiverseHQ',
          cardType: 'summary_large_image'
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          <NavFilterAllPosts />
          {/* latter make this a feed of posts from the user's default profile */}
          {/* {lensProfile &&
      isSignedIn &&
      hasProfile &&
      lensProfile?.defaultProfile?.id ? (
        <LensPostsProfileFeedColumn
          profileId={lensProfile?.defaultProfile?.id}
        />
      ) : ( */}
          <LensPostsExplorePublicationsColumn />
          {/* )} */}
        </div>
      </div>
    </>
  )
}

export default Home
