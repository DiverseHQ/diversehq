import React from 'react'
import LensPostsProfilePublicationsColumn from '../../Post/LensPostsProfilePublicationsColumn'
import useDevice from '../../Common/useDevice'
import LensCollectedPublicationsColumn from '../../Post/LensCollectedPublicationsColumn'
import { useRouter } from 'next/router'
import { BiArrowBack } from 'react-icons/bi'

import ProfileCard from '../ProfileCard'
import ProfileNavFilter from '../ProfileNavFilter'

const ProfilePage = ({ _profile, _lensProfile }) => {
  // const { notifyInfo } = useNotify()
  const { isMobile } = useDevice()
  const router = useRouter()
  return (
    <div>
      <>
        {isMobile && (
          <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] bg-s-bg">
            <div className="h-[32px] flex flex-row items-center gap-3 text-[18px]">
              <div className="flex items-center justify-center w-8 h-8 hover:bg-p-btn-hover rounded-full">
                <BiArrowBack
                  onClick={() => router.back()}
                  className="w-6 h-6 rounded-full cursor-pointer"
                />
              </div>
              <span className="font-bold text-[20px]">Profile</span>
            </div>
          </div>
        )}
      </>
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
