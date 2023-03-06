import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import AuthCommunity from '../../../../components/Community/AuthCommunity'
import RulesSettingsPage from '../../../../components/Community/Settings/RulesSettingsPage'
import { CommunityType } from '../../../../types/community'

const rules = ({ community }: { community: CommunityType }) => {
  return (
    <AuthCommunity>
      <RulesSettingsPage community={community} />
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

export default rules
