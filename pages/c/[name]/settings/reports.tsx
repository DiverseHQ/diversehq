import React from 'react'
import { getCommunityInfo } from '../../../../apiHelper/community'
import AuthCommunity from '../../../../components/Community/AuthCommunity'
import ReportsSettingsPage from '../../../../components/Community/Settings/ReportsSettingsPage'
import { CommunityWithCreatorProfile } from '../../../../types/community'
import getDefaultProfileInfo from '../../../../lib/profile/get-default-profile-info'
import { useRouter } from 'next/router'
import { useCommunityStore } from '../../../../store/community'

const reports = () => {
  const communities = useCommunityStore((state) => state.communities)
  const addCommunity = useCommunityStore((state) => state.addCommunity)
  const [community, setCommunity] =
    React.useState<CommunityWithCreatorProfile | null>(null)
  const router = useRouter()
  const { name } = router.query

  const fetchAndSetCommunity = async () => {
    try {
      const res = await getCommunityInfo(String(name))
      if (res.status !== 200) {
        return null
      }
      const result = await res.json()

      const profile = await getDefaultProfileInfo({
        ethereumAddress: result?.creator
      })
      let community: CommunityWithCreatorProfile = result
      // @ts-ignore
      community.creatorProfile = profile?.defaultProfile

      setCommunity(community)
      addCommunity(String(name), community)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (communities.get(String(name)) && communities) {
      setCommunity(communities.get(String(name)))
    } else {
      fetchAndSetCommunity()
    }
  }, [name, communities])

  return (
    <>
      <AuthCommunity>
        <ReportsSettingsPage community={community} />
      </AuthCommunity>
    </>
  )
}

export default reports
