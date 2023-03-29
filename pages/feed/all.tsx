import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
// import { useLensUserContext } from '../../lib/LensUserContext'
import LensPostsExplorePublicationsColumn from '../../components/Post/LensPostsExplorePublicationsColumn'
import { NextSeo } from 'next-seo'
import useDevice from '../../components/Common/useDevice'
import CreatePostBar from '../../components/Home/CreatePostBar'
import { appLink } from '../../utils/config'
// import LensPostsProfileFeedColumn from '../../components/Post/LensPostsProfileFeedColumn'

const lens = () => {
  const { isDesktop } = useDevice()
  // const { data: lensProfile, isSignedIn, hasProfile } = useLensUserContext()
  return (
    <>
      <NextSeo
        title="Lens Feed / DiverseHQ"
        description="Lens Feed from diverse communities on DiverseHQ."
        openGraph={{
          url: `${appLink}/feed/lens`
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isDesktop && <CreatePostBar />}
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
    </>
  )
}

export default lens
