import React, { useEffect, useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import MobileNavSidebar from './MobileNavSidebar'
import ConnectWalletAndSignInButton from '../Common/ConnectWalletAndSignInButton'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
import MobileFilterDrawerButton from './MobileFilterDrawerButton'
import ExploreFilterDrawerButton from '../Explore/ExploreFilterDrawerButton'
import NotificationFilterDrawerButton from '../Notification/NotificationFilterDrawerButton'
import { useLensUserContext } from '../../lib/LensUserContext'
import { sortTypes } from '../../utils/config'
import OptionsWrapper from '../Common/OptionsWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import { HiOutlineSparkles } from 'react-icons/hi'
import { AiOutlineDown, AiOutlineFire } from 'react-icons/ai'
// import BottomDrawer from './BottomDrawer'

const NewMobileTopNav = () => {
  const { user } = useProfile()
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const router = useRouter()
  const { hasProfile, isSignedIn } = useLensUserContext()
  const [sortType, setSortType] = useState(sortTypes.LATEST)
  // also can remove this.. ?
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (router.query.sort && sortType !== router.query.sort) {
      setSortType(router.query.sort)
    }
    if (!router.query.sort) {
      setSortType(sortTypes.LATEST)
    }
  }, [router.query])

  const addQueryParam = (key, value) => {
    const query = new URLSearchParams(router.query)
    query.set(key, value)
    router.push({ query: query.toString() })
  }

  const showTopNav = () => {
    if (
      router.pathname.startsWith('/p/') ||
      router.pathname.startsWith('/c/') ||
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
            {!user && (
              <ConnectWalletAndSignInButton
                connectWalletLabel="Connect"
                SignInLabel="Sign In"
              />
            )}
            {user && (
              <div className="relative">
                <ImageWithPulsingLoader
                  src={user?.profileImageUrl}
                  onClick={() => setIsOpenSidebar(true)}
                  className="w-[35px] h-[35px] rounded-full cursor-pointer"
                />
                {(!isSignedIn || !hasProfile) && (
                  <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                )}
              </div>
            )}
            <span className={`font-semibold text-[18px] `}>
              {router.pathname.startsWith('/explore') && 'Explore'}
              {router.pathname.startsWith('/notification') && 'Notifications'}
              {(router.pathname.startsWith('/feed/all') ||
                router.pathname.startsWith('/feed/foryou') ||
                router.pathname === '/') && (
                <OptionsWrapper
                  OptionPopUpModal={() => (
                    <MoreOptionsModal
                      className="z-50"
                      list={[
                        {
                          label: sortTypes.LATEST,
                          onClick: () => {
                            addQueryParam('sort', sortTypes.LATEST)
                            setSortType(sortTypes.LATEST)
                            setIsDrawerOpen(false)
                            setShowOptionsModal(false)
                          },
                          icon: () => <HiOutlineSparkles className="h-5 w-5" />
                        },
                        {
                          label: sortTypes.TOP_TODAY,
                          onClick: () => {
                            addQueryParam('sort', sortTypes.TOP_TODAY)
                            setSortType(sortTypes.TOP_TODAY)
                            setIsDrawerOpen(false)
                            setShowOptionsModal(false)
                          },
                          icon: () => <AiOutlineFire className="h-5 w-5" />
                        },
                        {
                          label: sortTypes.TOP_WEEK,
                          onClick: () => {
                            addQueryParam('sort', sortTypes.TOP_WEEK)
                            setSortType(sortTypes.TOP_WEEK)
                            setIsDrawerOpen(false)
                            setShowOptionsModal(false)
                          },
                          icon: () => <AiOutlineFire className="h-5 w-5" />
                        },
                        {
                          label: sortTypes.TOP_MONTH,
                          onClick: () => {
                            addQueryParam('sort', sortTypes.TOP_MONTH)
                            setSortType(sortTypes.TOP_MONTH)
                            setIsDrawerOpen(false)
                            setShowOptionsModal(false)
                          },
                          icon: () => <AiOutlineFire className="h-5 w-5" />
                        }
                      ]}
                    />
                  )}
                  position="right"
                  showOptionsModal={showOptionsModal}
                  setShowOptionsModal={setShowOptionsModal}
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                >
                  <button
                    className={` flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full bg-s-bg  hover:bg-p-hover hover:text-p-hover-text`}
                  >
                    <div className="flex flex-row items-center justify-center space-x-1">
                      {sortType === sortTypes.LATEST ? (
                        <HiOutlineSparkles className="h-4 w-4" />
                      ) : (
                        <AiOutlineFire className="h-4 w-4" />
                      )}
                      <div>{sortType}</div>
                    </div>
                    <AiOutlineDown className="w-3 h-3" />
                  </button>
                </OptionsWrapper>
              )}
            </span>
          </div>

          {(router.pathname === '/' || router.pathname.startsWith('/feed')) && (
            <MobileFilterDrawerButton />
          )}
          {router.pathname.startsWith('/explore') && (
            <ExploreFilterDrawerButton />
          )}
          {router.pathname.startsWith('/notification') && (
            <NotificationFilterDrawerButton />
          )}
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
