import { GetServerSidePropsContext } from 'next'
import ProfileNotFound from '../../components/User/Page/ProfileNotFound'
import ProfilePage from '../../components/User/Page/ProfilePage'
import ProfilePageNextSeo from '../../components/User/ProfilePageNextSeo'
import { Profile } from '../../graphql/generated'
import getLensProfileInfo from '../../lib/profile/get-profile-info'
import { HANDLE_SUFFIX } from '../../utils/config'
import { useState } from 'react'
import { useProfileStore } from '../../store/profile'
import React from 'react'
import MobileLoader from '../../components/Common/UI/MobileLoader'

const profile = ({
  _lensProfile,
  handle
}: {
  _lensProfile: Profile
  handle: string
}) => {
  const [lensProfile, setLensProfile] = useState<Profile | null>(_lensProfile)
  const profiles = useProfileStore((state) => state.profiles)
  const addProfile = useProfileStore((state) => state.addProfile)
  const [loading, setLoading] = useState(true)

  const fetchAndSetLensProfile = async () => {
    try {
      const lensProfileRes = await getLensProfileInfo({
        handle: handle
      })
      // @ts-ignore
      setLensProfile(lensProfileRes.profile)
      // @ts-ignore
      addProfile(lensProfileRes.profile.handle, lensProfileRes.profile)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!handle || _lensProfile) return
    if (profiles.get(handle) && profiles) {
      setLensProfile(profiles.get(handle))
      setLoading(false)
    } else {
      fetchAndSetLensProfile()
    }
  }, [profiles, handle])

  return (
    <>
      <ProfilePageNextSeo lensProfile={_lensProfile || lensProfile} />
      {!lensProfile && !loading && <ProfileNotFound />}
      {lensProfile && !loading && <ProfilePage _lensProfile={lensProfile} />}
      {loading && <MobileLoader />}
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, params } = context
  const { id } = params

  const isClient = Boolean(req?.cookies?.isClient)
  // const isClient = false

  if (isClient) {
    return {
      props: {
        _lensProfile: null,
        handle: `${id}${HANDLE_SUFFIX}`
      }
    }
  }

  const lensProfileRes = await getLensProfileInfo({
    handle: `${id}${HANDLE_SUFFIX}`
  })

  return {
    props: {
      _lensProfile: lensProfileRes.profile,
      handle: `${id}${HANDLE_SUFFIX}`
    }
  }
}

export default profile
