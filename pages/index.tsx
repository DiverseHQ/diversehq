import { NextSeo } from 'next-seo'
import React from 'react'
import LensPostsExplorePublicationsColumn from '../components/Post/LensPostsExplorePublicationsColumn'
import NavFilterAllPosts from '../components/Post/NavFilterAllPosts'
import CreatePostBar from '../components/Home/CreatePostBar'
import { appLink } from '../utils/config'
import { useDevice } from '../components/Common/DeviceWrapper'

const Home = () => {
  const { isDesktop } = useDevice()
  return (
    <>
      <NextSeo
        title="Home / DiverseHQ"
        description="Building next Reddit, where anyone can easily grow their audience."
        openGraph={{
          url: appLink
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isDesktop && <CreatePostBar className="mt-4" />}
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
