import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import AuthCommunity from '../../../../components/Community/AuthCommunity'
import ReportsSettingsPage from '../../../../components/Community/Settings/ReportsSettingsPage'
import { CommunityType } from '../../../../types/community'

const reports = ({ community }: { community: CommunityType }) => {
  return (
    <AuthCommunity>
      <ReportsSettingsPage community={community} />
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
  return {
    props: {
      community
    }
  }
}
export default reports