import React from 'react'
import LensPostsExplorePublicationsColumn from '../components/Post/LensPostsExplorePublicationsColumn'
import NavFilterAllPosts from '../components/Post/NavFilterAllPosts'

const Home = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[650px]">
        <NavFilterAllPosts />
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
  )
}

export default Home
