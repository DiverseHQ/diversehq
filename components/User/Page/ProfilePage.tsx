import React from 'react'
import LensPostsProfilePublicationsColumn from '../../Post/LensPostsProfilePublicationsColumn'
import useDevice from '../../Common/useDevice'
import LensCollectedPublicationsColumn from '../../Post/LensCollectedPublicationsColumn'
import { useRouter } from 'next/router'

import ProfileCard from '../ProfileCard'
import ProfileNavFilter from '../ProfileNavFilter'
import { UserType } from '../../../types/user'
import { Profile } from '../../../graphql/generated'
import ProfilePageMobileTopNav from '../ProfilePageMobileTopNav'

interface Props {
  _profile: UserType
  _lensProfile: Profile
}

const ProfilePage = ({ _profile, _lensProfile }: Props) => {
  // const { notifyInfo } = useNotify()
  const { isMobile } = useDevice()
  const router = useRouter()
  return (
    <div>
      {isMobile && <ProfilePageMobileTopNav _lensProfile={_lensProfile} />}
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          <div className={`relative ${!isMobile ? 'mt-10' : ''}`}>
            <ProfileCard _profile={_profile} _lensProfile={_lensProfile} />
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
      </div>
    </div>
  )
}

export default ProfilePage
