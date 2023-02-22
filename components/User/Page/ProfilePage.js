import React, { useEffect, useState } from 'react'
import LensPostsProfilePublicationsColumn from '../../Post/LensPostsProfilePublicationsColumn'
import useDevice from '../../Common/useDevice'
import { HiCollection } from 'react-icons/hi'
import LensCollectedPublicationsColumn from '../../Post/LensCollectedPublicationsColumn'
import { useRouter } from 'next/router'
import { BiArrowBack } from 'react-icons/bi'

import ProfileCard from '../ProfileCard'

const ProfilePage = ({ _profile, _lensProfile }) => {
  // const { notifyInfo } = useNotify()

  const { isMobile } = useDevice()
  const [active, setActive] = useState('lens')
  const router = useRouter()
  const { pathname } = router

  useEffect(() => {
    if (pathname.endsWith('/lens')) {
      setActive('lens')
    } else if (pathname.endsWith('/offchain')) {
      setActive('offchain')
    } else if (pathname.endsWith('/collected')) {
      setActive('collected')
    } else {
      setActive('lens')
    }
  }, [pathname])

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
            {
              <div
                className={`font-bold text-sm sm:text-base flex flex-row  px-3 sm:px-6 bg-white dark:bg-s-bg sm:rounded-xl mt-2 sm:mt-6 py-1 sm:py-3 w-full justify-start space-x-9 items-center ${
                  !isMobile
                    ? 'border-[1px] border-p-border'
                    : 'mb-4 rounded-[10px]'
                }`}
              >
                <button
                  className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                    active === 'lens' && 'bg-p-bg'
                  } hover:bg-p-hover hover:text-p-hover-text`}
                  onClick={() => {
                    router.push(
                      `/u/${_lensProfile?.handle.split('.')[0]}/feed/lens`
                    )
                  }}
                >
                  <img
                    src="/lensLogo.svg"
                    alt="lens logo"
                    className="w-5 h-5"
                  />
                  <div>Lens</div>
                </button>
                {/* <button
                  className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                    active === 'offchain' && 'bg-p-bg'
                  }  hover:bg-p-btn-hover`}
                  onClick={() => {
                    router.push(`/u/${profile?.walletAddress}/feed/offchain`)
                  }}
                >
                  <GiBreakingChain className="h-5 w-5" />
                  <div>Off-chain</div>
                </button> */}
                <button
                  className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                    active === 'collected' && 'bg-p-bg'
                  }  hover:bg-p-btn-hover`}
                  onClick={() => {
                    router.push(
                      `/u/${_lensProfile?.handle.split('.')[0]}/feed/collected`
                    )
                  }}
                >
                  <HiCollection className="h-5 w-5" />
                  <div>Collected</div>
                </button>
              </div>
            }
            {active === 'lens' && (
              <LensPostsProfilePublicationsColumn
                profileId={_lensProfile?.id}
              />
            )}
            {active === 'collected' && (
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
