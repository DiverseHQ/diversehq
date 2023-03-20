import React from 'react'
import { getLensCommunity } from '../../../api/community'
import useDevice from '../../../components/Common/useDevice'
import CommunityNotFound from '../../../components/Community/Page/CommunityNotFound'
import LensCommunityMobileTopNav from '../../../components/LensCommunity/LensCommunityMobileTopNav'
import LensCommunityPageRightSidebar from '../../../components/LensCommunity/LensCommunityPageRightSidebar'
import LensCommunitySeo from '../../../components/LensCommunity/LensCommunitySeo'
import LensPostsProfilePublicationsColumn from '../../../components/Post/LensPostsProfilePublicationsColumn'
import ProfileCard from '../../../components/User/ProfileCard'
import getLensProfileInfo from '../../../lib/profile/get-profile-info'
import { LensCommunity } from '../../../types/community'
import { HANDLE_SUFFIX } from '../../../utils/config'

interface Props {
  community: LensCommunity
}

const index = ({ community }: Props) => {
  const { isMobile } = useDevice()
  return (
    <>
      {community && (
        <div>
          <LensCommunitySeo community={community} />
          {isMobile && <LensCommunityMobileTopNav community={community} />}
          <ProfileCard _lensProfile={community?.Profile} isLensCommunity />
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <LensPostsProfilePublicationsColumn
                profileId={community?.Profile?.id}
              />
            </div>
            <LensCommunityPageRightSidebar community={community} />
          </div>
        </div>
      )}
      {!community && <CommunityNotFound />}
    </>
  )
}

export async function getServerSideProps({
  params = {}
}: {
  params: { name?: string }
}) {
  const { name } = params
  const res = await getLensCommunity(`${name}${HANDLE_SUFFIX}`)
  if (res.status === 200) {
    const lensCommunity = await res.json()
    const communityLensProfile = await getLensProfileInfo({
      handle: `${name}${HANDLE_SUFFIX}`
    })
    if (!communityLensProfile?.profile) {
      return {
        props: {
          community: null
        }
      }
    }
    return {
      props: {
        community: {
          ...lensCommunity,
          Profile: communityLensProfile.profile
        }
      }
    }
  } else {
    return {
      props: {
        community: null
      }
    }
  }
}

export default index
