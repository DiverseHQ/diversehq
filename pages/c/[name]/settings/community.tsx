import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import AuthCreatorOfCommunity from '../../../../components/Community/AuthCreatorOfCommunity'
import CommunitySettingsPage from '../../../../components/Community/Settings/CommunitySettingsPage'
import getDefaultProfileInfo from '../../../../lib/profile/get-default-profile-info'
import { CommunityType } from '../../../../types/community'

const community = ({ community }: { community: CommunityType }) => {
  return (
    <AuthCreatorOfCommunity>
      <CommunitySettingsPage community={community} />
    </AuthCreatorOfCommunity>
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

export default community
