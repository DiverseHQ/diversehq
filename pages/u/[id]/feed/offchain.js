import React from 'react'
import { getUserFromAddressOrName, getUserInfo } from '../../../../api/user'
import ProfileNotFound from '../../../../components/User/Page/ProfileNotFound'
import ProfilePage from '../../../../components/User/Page/ProfilePage'
import ProfilePageNextSeo from '../../../../components/User/ProfilePageNextSeo'
import getDefaultProfileInfo from '../../../../lib/profile/get-default-profile-info'
import getLensProfileInfo from '../../../../lib/profile/get-profile-info'

const offchain = ({ profile, lensProfile }) => {
  return (
    <>
      <ProfilePageNextSeo profile={profile} lensProfile={lensProfile} />
      {!profile && <ProfileNotFound />}
      {profile && <ProfilePage _profile={profile} _lensProfile={lensProfile} />}
    </>
  )
}

export async function getServerSideProps({ params = {} }) {
  const { id } = params

  const getUserProfileAndLensProfile = async (id) => {
    let profile = null
    let lensProfile = null
    if (id?.endsWith('.test')) {
      try {
        const lensProfileRes = await getLensProfileInfo({
          handle: id
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
    } else {
      try {
        const res = await getUserFromAddressOrName(id)
        if (res.status === 200) {
          const userInfo = await res.json()
          profile = userInfo
          const lensProfileRes = await getDefaultProfileInfo({
            ethereumAddress: userInfo.walletAddress
          })

          if (lensProfileRes.defaultProfile) {
            lensProfile = lensProfileRes.defaultProfile
          }
          return { profile, lensProfile }
        } else {
          return { profile: null, lensProfile: null }
        }
      } catch (error) {
        return { profile: null, lensProfile: null }
      }
    }
  }

  const { profile, lensProfile } = await getUserProfileAndLensProfile(id)
  return {
    props: {
      profile,
      lensProfile,
      id
    }
  }
}

export default offchain
