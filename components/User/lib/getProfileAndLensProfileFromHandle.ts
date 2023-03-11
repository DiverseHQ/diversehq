import { getUserInfo } from '../../../api/user'
import { Profile } from '../../../graphql/generated'
import getLensProfileInfo from '../../../lib/profile/get-profile-info'
import { UserType } from '../../../types/user'
import { apiMode } from '../../../utils/config'

export interface ProfileAndLensProfileType {
  profile: UserType
  lensProfile: Profile
}

export const getProfileAndLensProfileFromHandle = async (
  handle: string
): Promise<ProfileAndLensProfileType> => {
  let profile = null
  let lensProfile = null
  try {
    const lensProfileRes = await getLensProfileInfo({
      handle: `${handle}${apiMode === 'dev' ? '.test' : '.lens'}`
    })
    if (lensProfileRes.profile) {
      lensProfile = lensProfileRes.profile
    }
    if (lensProfileRes.profile.ownedBy) {
      const userInfo = await getUserInfo(lensProfileRes.profile.ownedBy)
      if (userInfo) {
        profile = userInfo
      }
    }
    return { profile, lensProfile }
  } catch (error) {
    console.log(error)
    return { profile: null, lensProfile: null }
  }
}
