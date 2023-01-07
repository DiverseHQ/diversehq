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
        description="Join Communities, Share your Creativity and get Rewarded."
        openGraph={{
          url: 'https://app.diversehq.xyz'
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
