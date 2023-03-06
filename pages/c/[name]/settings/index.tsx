import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import AuthCommunity from '../../../../components/Community/AuthCommunity'
import CommunitySettingsIndexPage from '../../../../components/Community/Settings/CommunitySettingsIndexPage'
import getDefaultProfileInfo from '../../../../lib/profile/get-default-profile-info'
import { CommunityType } from '../../../../types/community'

const index = ({ community }: { community: CommunityType }) => {
  return (
    <AuthCommunity>
      <CommunitySettingsIndexPage community={community} />
    </AuthCommunity>
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

export default index
