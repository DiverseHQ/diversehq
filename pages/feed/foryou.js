import { NextSeo } from 'next-seo'
import React from 'react'
import LensLoginButton from '../../components/Common/LensLoginButton'
import { useProfile } from '../../components/Common/WalletContext'
// import CreatePostBar from '../../components/Home/CreatePostBar'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import LensPostJoinedCommunitiesPublications from '../../components/Post/LensPostJoinedCommunitiesPublications'
import { useLensUserContext } from '../../lib/LensUserContext'
// import useDevice from '../../components/Common/useDevice'
const foryou = () => {
  const { isSignedIn, hasProfile } = useLensUserContext()
  const { user } = useProfile()
  // const { isDesktop } = useDevice()
  return (
    <>
      <NextSeo
        title="For Your Feed / DiverseHQ"
        description="Lens Feed from diverse communities on DiverseHQ."
        openGraph={{
          url: 'https://app.diversehq.xyz/feed/lens'
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* {isDesktop && <CreatePostBar />} */}
          <NavFilterAllPosts />
          {user && isSignedIn && hasProfile && (
            <LensPostJoinedCommunitiesPublications
              communityIds={user.communities}
            />
          )}
          {(!user || !isSignedIn || !hasProfile) && (
            <div className="w-full flex items-center flex-row justify-center">
              <LensLoginButton />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default foryou