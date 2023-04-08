import React from 'react'
import { getLensCommunity } from '../../../api/lensCommunity'
import CommunityNotFound from '../../../components/Community/Page/CommunityNotFound'
import LensCommunityMobileTopNav from '../../../components/LensCommunity/LensCommunityMobileTopNav'
import LensCommunityPageRightSidebar from '../../../components/LensCommunity/LensCommunityPageRightSidebar'
import LensCommunitySeo from '../../../components/LensCommunity/LensCommunitySeo'
import LensPostsCommunityPublicationsColumn from '../../../components/Post/LensPostsCommunityPublicationsColumn'
// import LensPostsProfilePublicationsColumn from '../../../components/Post/LensPostsProfilePublicationsColumn'
import NavFilterCommunity from '../../../components/Post/NavFilterCommunity'
import ProfileCard from '../../../components/User/ProfileCard'
import getLensProfileInfo from '../../../lib/profile/get-profile-info'
import { LensCommunity } from '../../../types/community'
import { HANDLE_SUFFIX } from '../../../utils/config'
import { useDevice } from '../../../components/Common/DeviceWrapper'
import { GetServerSidePropsContext } from 'next'
import { useLensCommunityStore } from '../../../store/community'
import MobileLoader from '../../../components/Common/UI/MobileLoader'

interface Props {
  _community: LensCommunity
  name: string
}

const index = ({ _community, name }: Props) => {
  const { isMobile } = useDevice()
  const communities = useLensCommunityStore((state) => state.communities)
  const addCommunity = useLensCommunityStore((state) => state.addCommunity)
  const [community, setCommunity] = React.useState<LensCommunity | null>(
    _community
  )
  const [loading, setLoading] = React.useState(true)

  const fetchAndSetLensCommunity = async (name: string) => {
    try {
      setLoading(true)
      const res = await getLensCommunity(`${name}${HANDLE_SUFFIX}`)
      if (res.status === 200) {
        const lensCommunity = await res.json()
        const communityLensProfile = await getLensProfileInfo({
          handle: `${name}${HANDLE_SUFFIX}`
        })

        if (communityLensProfile?.profile) {
          setCommunity({
            ...lensCommunity,
            Profile: communityLensProfile?.profile
          })
          addCommunity(name, {
            ...lensCommunity,
            Profile: communityLensProfile?.profile
          })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!name || community || _community) {
      setLoading(false)
      return
    }

    if (communities.get(name) && communities) {
      setCommunity(communities.get(name))
      setLoading(false)
    } else {
      fetchAndSetLensCommunity(name)
    }
  }, [name])

  return (
    <>
      <LensCommunitySeo community={community} />
      {community && !loading && (
        <div>
          {isMobile && <LensCommunityMobileTopNav community={community} />}
          <ProfileCard _lensProfile={community?.Profile} isLensCommunity />
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              {/* <LensPostsProfilePublicationsColumn
                profileId={community?.Profile?.id}
              /> */}
              <NavFilterCommunity />
              <LensPostsCommunityPublicationsColumn communityInfo={community} />
            </div>
            <LensCommunityPageRightSidebar community={community} />
          </div>
        </div>
      )}
      {!community && loading && <MobileLoader />}
      {!community && !loading && <CommunityNotFound />}
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, params } = context
  const { name } = params

  const isClient = Boolean(req.cookies.isClient)

  if (isClient) {
    return {
      props: {
        _community: null,
        name: name
      }
    }
  }

  const res = await getLensCommunity(`${name}${HANDLE_SUFFIX}`)
  if (res.status === 200) {
    const lensCommunity = await res.json()
    const communityLensProfile = await getLensProfileInfo({
      handle: `${name}${HANDLE_SUFFIX}`
    })
    if (!communityLensProfile?.profile) {
      return {
        props: {
          _community: null,
          name: name
        }
      }
    }
    return {
      props: {
        _community: {
          ...lensCommunity,
          Profile: communityLensProfile.profile
        },
        name: name
      }
    }
  } else {
    return {
      props: {
        _community: null,
        name: name
      }
    }
  }
}

export default index
