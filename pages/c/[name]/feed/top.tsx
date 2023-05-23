import React, { FC } from 'react'
import { getCommunityInfo } from '../../../../apiHelper/community'
import CommunityInfoCard from '../../../../components/Community/CommunityInfoCard'
import CommunityPageMobileTopNav from '../../../../components/Community/CommunityPageMobileTopNav'
import CommunityPageSeo from '../../../../components/Community/CommunityPageSeo'
import CommunityNotFound from '../../../../components/Community/Page/CommunityNotFound'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'
import PostsColumn from '../../../../components/Post/PostsColumn'
import getDefaultProfileInfo from '../../../../lib/profile/get-default-profile-info'
import { CommunityWithCreatorProfile } from '../../../../types/community'
import { useDevice } from '../../../../components/Common/DeviceWrapper'

interface Props {
  community: CommunityWithCreatorProfile
}

const top: FC<Props> = ({ community }) => {
  const { isMobile } = useDevice()

  return (
    <div className="relative">
      {isMobile && <CommunityPageMobileTopNav community={community} />}

      {community && <CommunityPageSeo community={community} />}
      {community && (
        <>
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <CommunityInfoCard _community={community} />
              <NavFilterCommunity />
              <PostsColumn
                source="community"
                sortBy="top"
                data={community.name}
              />
            </div>
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
  try {
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
  } catch (error) {
    console.log(error)
    return { props: { community: null } }
  }
}

export default top
