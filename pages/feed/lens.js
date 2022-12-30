import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
// import { useLensUserContext } from '../../lib/LensUserContext'
import LensPostsExplorePublicationsColumn from '../../components/Post/LensPostsExplorePublicationsColumn'
// import LensPostsProfileFeedColumn from '../../components/Post/LensPostsProfileFeedColumn'

const lens = () => {
  // const { data: lensProfile, isSignedIn, hasProfile } = useLensUserContext()
  return (
    <>
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
    </>
  )
}

export default lens
