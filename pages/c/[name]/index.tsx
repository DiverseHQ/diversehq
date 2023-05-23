import React, { FC } from 'react'
import NavFilterCommunity from '../../../components/Post/NavFilterCommunity'
import { getCommunityInfo } from '../../../apiHelper/community'
import CommunityInfoCard from '../../../components/Community/CommunityInfoCard'
import CommunityNotFound from '../../../components/Community/Page/CommunityNotFound'
import CommunityPageSeo from '../../../components/Community/CommunityPageSeo'
import LensPostsCommunityPublicationsColumn from '../../../components/Post/LensPostsCommunityPublicationsColumn'
import CommunityPageMobileTopNav from '../../../components/Community/CommunityPageMobileTopNav'
import getDefaultProfileInfo from '../../../lib/profile/get-default-profile-info'
import { CommunityWithCreatorProfile } from '../../../types/community'
import CommunityPageRightSidebar from '../../../components/Community/CommunityPageRightSidebar'
import { useDevice } from '../../../components/Common/DeviceWrapper'
import { GetServerSidePropsContext } from 'next'
import { useCommunityStore } from '../../../store/community'
import MobileLoader from '../../../components/Common/UI/MobileLoader'

interface Props {
  _community: CommunityWithCreatorProfile
  name?: string
}

const CommunityPage: FC<Props> = ({ _community, name }) => {
  const { isMobile } = useDevice()
  const communities = useCommunityStore((state) => state.communities)
  const addCommunity = useCommunityStore((state) => state.addCommunity)
  const [community, setCommunity] =
    React.useState<CommunityWithCreatorProfile | null>(_community)

  const [loading, setLoading] = React.useState(true)

  const fetchAndSetCommunity = async () => {
    try {
      setLoading(true)
      const res = await getCommunityInfo(name)
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
      addCommunity(name, community)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!name || _community) {
      setLoading(false)
      return
    }
    if (communities.get(name) && communities) {
      setCommunity(communities.get(name))
      setLoading(false)
    } else {
      fetchAndSetCommunity()
    }
  }, [name])

  return (
    <>
      <CommunityPageSeo community={_community || community} />
      <div className="relative">
        {isMobile && <CommunityPageMobileTopNav community={community} />}
        {community && !loading && (
          <>
            <CommunityInfoCard _community={community} />
            <div className="w-full flex justify-center">
              <div className="w-full md:w-[650px]">
                <NavFilterCommunity />
                <LensPostsCommunityPublicationsColumn
                  communityInfo={community}
                />
              </div>
              <CommunityPageRightSidebar communityInfo={community} />
            </div>
          </>
        )}
        {!community && !loading && <CommunityNotFound />}
        {loading && !community && <MobileLoader />}
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { req, params } = context
    const { name } = params

    const isClient = Boolean(req?.cookies?.isClient)
    // const isClient = false
    if (isClient) {
      return {
        props: {
          _community: null,
          name: name
        }
      }
    }

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
    const community = await fetchCommunityInfo(String(name))
    if (!community) return { props: { _community: null, name: name } }
    const profile = await getDefaultProfileInfo({
      ethereumAddress: community?.creator
    })
    community.creatorProfile = profile?.defaultProfile
    return {
      props: {
        _community: community,
        name: name
      }
    }
  } catch (error) {
    console.log(error)
    return { props: { _community: null, name: null } }
  }
}

export default CommunityPage
