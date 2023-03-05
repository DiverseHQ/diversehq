import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import AuthCreatorOfCommunity from '../../../../components/Community/AuthCreatorOfCommunity'
import ModeratorsSettingsPage from '../../../../components/Community/Settings/ModeratorsSettingsPage'
import { CommunityType } from '../../../../types/community'

const moderators = ({ community }: { community: CommunityType }) => {
  return (
    <AuthCreatorOfCommunity>
      <ModeratorsSettingsPage community={community} />
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
  return {
    props: {
      community
    }
  }
}

export default moderators
