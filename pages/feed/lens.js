import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
// import { useLensUserContext } from '../../lib/LensUserContext'
import LensPostsExplorePublicationsColumn from '../../components/Post/LensPostsExplorePublicationsColumn'
// import LensPostsProfileFeedColumn from '../../components/Post/LensPostsProfileFeedColumn'

const lens = () => {
  // const { data: lensProfile, isSignedIn, hasProfile } = useLensUserContext()
  return (
    <div className="w-full flex justify-center shrink-0">
      <div className="max-w-[650px] shrink-0">
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

export default lens
