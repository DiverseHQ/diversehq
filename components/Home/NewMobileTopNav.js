import React, { useEffect, useState } from 'react'
import MobileNavSidebar from './MobileNavSidebar'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
import { useLensUserContext } from '../../lib/LensUserContext'
import { sortTypes } from '../../utils/config'

import LensLoginButton from '../Common/LensLoginButton'
import getAvatar from '../User/lib/getAvatar'
// import BottomDrawer from './BottomDrawer'

const NewMobileTopNav = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const router = useRouter()
  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const [sortType, setSortType] = useState(sortTypes.LATEST)
  // also can remove this.. ?

  useEffect(() => {
    if (router.query.sort && sortType !== router.query.sort) {
      setSortType(router.query.sort)
    }
    if (!router.query.sort) {
      setSortType(sortTypes.LATEST)
    }
  }, [router.query])

  const showTopNav = () => {
    if (
      router.pathname.startsWith('/p/') ||
      router.pathname.startsWith('/c/') ||
      router.pathname.startsWith('/l/') ||
      router.pathname.startsWith('/search') ||
      router.pathname.startsWith('/u/') ||
      router.pathname.startsWith('/settings')
    )
      return false
    return true
  }

  if (!showTopNav()) return null

  return (
    <>
      <div
        id="mobile-top-navbar"
        className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] bg-s-bg"
        style={{
          transition: 'top 0.5s ease-in-out'
        }}
      >
        <>
          <div className="flex flex-row items-center justify-center space-x-4">
            {(!isSignedIn || !hasProfile) && <LensLoginButton />}
            {isSignedIn && hasProfile && (
              <div className="relative">
                <ImageWithPulsingLoader
                  src={getAvatar(lensProfile?.defaultProfile)}
                  onClick={() => setIsOpenSidebar(true)}
                  className="w-[35px] h-[35px] rounded-full cursor-pointer"
                />
              </div>
            )}
            <span className={`font-semibold text-[18px] `}>
              {router.pathname.startsWith('/explore') && 'Explore'}
              {router.pathname.startsWith('/notification') && 'Notifications'}
              {(router.pathname.startsWith('/feed/all') ||
                router.pathname.startsWith('/feed/foryou') ||
                router.pathname === '/') &&
                'Home'}
            </span>
          </div>
        </>
      </div>
      <MobileNavSidebar
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
      />
    </>
  )
}

export default NewMobileTopNav
