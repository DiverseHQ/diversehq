import React, { FC } from 'react'
import NavFilterCommunity from '../../../components/Post/NavFilterCommunity'
import { getCommunityInfo } from '../../../api/community'
import CommunityInfoCard from '../../../components/Community/CommunityInfoCard'
import CommunityNotFound from '../../../components/Community/Page/CommunityNotFound'
import CommunityPageSeo from '../../../components/Community/CommunityPageSeo'
import LensPostsCommunityPublicationsColumn from '../../../components/Post/LensPostsCommunityPublicationsColumn'
import CommunityPageMobileTopNav from '../../../components/Community/CommunityPageMobileTopNav'
import getDefaultProfileInfo from '../../../lib/profile/get-default-profile-info'
import { CommunityWithCreatorProfile } from '../../../types/community'
import CommunityPageRightSidebar from '../../../components/Community/CommunityPageRightSidebar'
import { useDevice } from '../../../components/Common/DeviceWrapper'

interface Props {
  community: CommunityWithCreatorProfile
}

const CommunityPage: FC<Props> = ({ community }) => {
  const { isMobile } = useDevice()
  return (
    <div className="relative">
      {isMobile && <CommunityPageMobileTopNav community={community} />}
      {community && <CommunityPageSeo community={community} />}
      {community && (
        <>
          <CommunityInfoCard _community={community} />
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <NavFilterCommunity />
              <LensPostsCommunityPublicationsColumn communityInfo={community} />
            </div>
            <CommunityPageRightSidebar communityInfo={community} />
          </div>
        </>
      )}
      {!community && <CommunityNotFound />}
    </div>
  )
}

export async function getServerSideProps({
  params = {}
}: {
  params: { name?: string }
}) {
  const { name } = params
  const fetchCommunityInfo = async (name: string) => {
    try {
      const res = await getCommunityInfo(name)
      if (res.status !== 200) {
        return null
      }
      const result = await res.json()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
  const community = await fetchCommunityInfo(name)
  if (!community) return { props: { community: null } }
  const profile = await getDefaultProfileInfo({
    ethereumAddress: community?.creator
  })
  community.creatorProfile = profile?.defaultProfile
  return {
    props: {
      community
    }
  }
}

export default CommunityPage
