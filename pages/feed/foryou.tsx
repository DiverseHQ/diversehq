// import { NextSeo } from 'next-seo'
import React from 'react'
import LensLoginButton from '../../components/Common/LensLoginButton'
import { useProfile } from '../../components/Common/WalletContext'
import CreatePostBar from '../../components/Home/CreatePostBar'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
// import LensPostJoinedCommunitiesPublications from '../../components/Post/LensPostJoinedCommunitiesPublications'
import { useLensUserContext } from '../../lib/LensUserContext'
import { appLink } from '../../utils/config'
// import LensPostJoinedCommunitiesPublicationsNew from '../../components/Post/LensPostJoinedCommunitiesPublicationsNew'
import LensPostJoinedCommunitiesPublicationsFromDB from '../../components/Post/LensPostJoinedCommunitiesPublicationsFromDB'
import { useDevice } from '../../components/Common/DeviceWrapper'
import MetaTags from '../../components/Common/Seo/MetaTags'
const foryou = () => {
  const { isSignedIn, hasProfile } = useLensUserContext()
  const { user } = useProfile()
  const { isDesktop } = useDevice()
  return (
    <>
      <MetaTags
        title="For You Feed / DiverseHQ"
        description="Feed of communities you are a part of on DiverseHQ."
        url={`${appLink}/feed/foryou`}
      />

      {/* <NextSeo
        title="For Your Feed / DiverseHQ"
        description="Lens Feed from diverse communities on DiverseHQ."
        openGraph={{
          url: `${appLink}/feed/lens`
        }}
      /> */}
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isDesktop && <CreatePostBar className="mt-4" />}
          <NavFilterAllPosts />
          {user && isSignedIn && hasProfile && (
            // <LensPostJoinedCommunitiesPublicationsNew
            //   communityIds={[
            //     ...user.communities,
            //     LensCommunity?._id,
            //     // eslint-disable-next-line
            //     ...joinedLensCommunities?.map((c) => c._id)
            //   ].filter((c) => c)}
            // />

            <LensPostJoinedCommunitiesPublicationsFromDB />
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
