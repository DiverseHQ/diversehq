import React from 'react'
import LensPostsProfilePublicationsColumn from '../../Post/LensPostsProfilePublicationsColumn'
import LensCollectedPublicationsColumn from '../../Post/LensCollectedPublicationsColumn'
import { useRouter } from 'next/router'

import ProfileCard from '../ProfileCard'
import ProfileNavFilter from '../ProfileNavFilter'
import { UserType } from '../../../types/user'
import { Profile } from '../../../graphql/generated'
import ProfilePageMobileTopNav from '../ProfilePageMobileTopNav'
import ProfilePageRightSidebar from '../ProfilePageRightSidebar'
import { getUserInfo } from '../../../api/user'
import { useDevice } from '../../Common/DeviceWrapper'

interface Props {
  _lensProfile: Profile
}

const ProfilePage = ({ _lensProfile }: Props) => {
  const { isMobile } = useDevice()
  const router = useRouter()
  const [_profile, _setProfile] = React.useState<UserType>(null)

  const fetchAndSetOffChainProfileInfo = async () => {
    try {
      const userInfo = await getUserInfo(_lensProfile?.ownedBy)
      if (userInfo) {
        _setProfile(userInfo)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(() => {
    fetchAndSetOffChainProfileInfo()
  }, [_lensProfile?.ownedBy])

  return (
    <div>
      {isMobile && <ProfilePageMobileTopNav _lensProfile={_lensProfile} />}
      <ProfileCard _profile={_profile} _lensProfile={_lensProfile} />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          <div className="relative">
            {/* lens filter */}
            <ProfileNavFilter _lensProfile={_lensProfile} />
            {!router.pathname.endsWith('/collected') ? (
              <LensPostsProfilePublicationsColumn
                profileId={_lensProfile?.id}
              />
            ) : (
              <LensCollectedPublicationsColumn
                walletAddress={_lensProfile?.ownedBy}
              />
            )}
          </div>
        </div>
        <div className="mt-6">
          <ProfilePageRightSidebar
            profile={_profile}
            lensProfile={_lensProfile}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
