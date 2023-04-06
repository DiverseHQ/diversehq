import React from 'react'
import { appLink } from '../../utils/config'
import { NextSeo } from 'next-seo'
import CreatePostBar from '../../components/Home/CreatePostBar'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import { useLensUserContext } from '../../lib/LensUserContext'
import LensLoginButton from '../../components/Common/LensLoginButton'
import LensPostsProfileFeedColumn from '../../components/Post/LensPostsProfileFeedColumn'
import { useDevice } from '../../components/Common/DeviceWrapper'

const timeline = () => {
  const { isDesktop } = useDevice()
  const { data: lensProfile, isSignedIn, hasProfile } = useLensUserContext()
  return (
    <>
      <NextSeo
        title="Timeline Feed / DiverseHQ"
        description="Timeline Feed from entire Lens."
        openGraph={{
          url: `${appLink}/feed/timeline`
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isDesktop && <CreatePostBar />}
          <NavFilterAllPosts />
          {lensProfile &&
          isSignedIn &&
          hasProfile &&
          lensProfile?.defaultProfile?.id ? (
            <LensPostsProfileFeedColumn
              profileId={lensProfile?.defaultProfile?.id}
            />
          ) : (
            <LensLoginButton />
          )}
        </div>
      </div>
    </>
  )
}

export default timeline
