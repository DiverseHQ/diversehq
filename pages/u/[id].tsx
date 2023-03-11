import ProfileNotFound from '../../components/User/Page/ProfileNotFound'
import ProfilePage from '../../components/User/Page/ProfilePage'
import ProfilePageNextSeo from '../../components/User/ProfilePageNextSeo'
import { getProfileAndLensProfileFromHandle } from '../../components/User/lib/getProfileAndLensProfileFromHandle'
import { ProfileAndLensProfileType } from '../../components/User/lib/getProfileAndLensProfileFromHandle'

const Profile = ({ profile, lensProfile }: ProfileAndLensProfileType) => {
  return (
    <>
      <ProfilePageNextSeo profile={profile} lensProfile={lensProfile} />
      {!lensProfile && <ProfileNotFound />}
      {lensProfile && (
        <ProfilePage _profile={profile} _lensProfile={lensProfile} />
      )}
    </>
  )
}

interface paramsType {
  params: {
    id?: string
  }
}

interface returnPropsType {
  props: ProfileAndLensProfileType
}

export async function getServerSideProps({
  params
}: paramsType): Promise<returnPropsType> {
  const { id } = params
  const { profile, lensProfile } = await getProfileAndLensProfileFromHandle(id)
  return {
    props: {
      profile,
      lensProfile
    }
  }
}

export default Profile
