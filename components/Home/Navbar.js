import React, { useEffect, useRef, useState } from 'react'
import SearchModal from '../Search/SearchModal'
import Link from 'next/link'
import { FiMoon, FiSun } from 'react-icons/fi'
import LensLoginButton from '../Common/LensLoginButton'
import { useRouter } from 'next/router'
import useNotificationsCount from '../Notification/useNotificationsCount'
import { IoMdNotificationsOutline } from 'react-icons/io'
import ClickOption from './ClickOption'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from '../Common/ThemeProvider'
import { useNotify } from '../Common/NotifyContext'
import { getJoinedCommunitiesApi } from '../../api/community'
import { RiArrowDropDownLine } from 'react-icons/ri'
import FilterListWithSearch from '../Common/UI/FilterListWithSearch'
import { useLensUserContext } from '../../lib/LensUserContext'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getAvatar from '../User/lib/getAvatar'

const Navbar = () => {
  const router = useRouter()
  const { pathname } = router
  const { user } = useProfile()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const { showModal } = usePopUpModal()
  const { theme, toggleTheme } = useTheme()

  const dropdownRef = useRef(null)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [showJoinedCommunities, setShowJoinedCommunities] = useState(false)
  const [fetchingJoinedCommunities, setFetchingJoinedCommunities] =
    useState(false)
  const { notifyError } = useNotify()

  const [active, setActive] = useState('home')
  const {
    notificationsCount,
    lensNotificationsCount,
    updateLensNotificationCount,
    updateNotificationCount
  } = useNotificationsCount()

  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/feed')) {
      setActive('home')
    } else if (pathname.endsWith('/explore')) {
      setActive('explore')
    } else {
      setActive('none')
    }
  }, [pathname])

  const routeToNotifications = async () => {
    await updateLensNotificationCount()
    updateNotificationCount()
    router.push('/notification')
  }

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal({
      component: <ClickOption />,
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        top: e.currentTarget.getBoundingClientRect().bottom + 10 + 'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }

  useEffect(() => {
    const handleClick = (event) => {
      // Check if the target element of the click is the dropdown element
      // or a descendant of the dropdown element
      if (!dropdownRef.current?.contains(event.target)) {
        // Hide the dropdown
        setShowJoinedCommunities(false)
      }
    }

    // Add the event listener
    document.addEventListener('click', handleClick)

    // Remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [dropdownRef])

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    try {
      setFetchingJoinedCommunities(true)
      const response = await getJoinedCommunitiesApi()
      setJoinedCommunities(response)
      setShowJoinedCommunities(!showJoinedCommunities)
    } catch (error) {
      console.log('error', error)
      notifyError('Error getting joined communities')
    } finally {
      setFetchingJoinedCommunities(false)
    }
  }

  return (
    <div className="flex flex-row flex-1 z-40 justify-between px-4 md:px-6 lg:px-8 xl:px-12 py-2.5 items-center shadow-sm gap-2 sticky top-0 bg-p-bg dark:bg-s-bg">
      <div className="flex flex-row items-center gap-4 lg:gap-5">
        <div>
          <Link
            className="flex flex-row justify-center items-center  h-fit w-fit"
            href={'/'}
          >
            <img
              src="/LogoV3TrimmedWithBG.png"
              className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px]"
              alt="DivrseHQ Logo"
            />
          </Link>
        </div>
        <SearchModal />
        <div className="flex flex-row gap-0.5 lg:gap-1">
          <Link href={'/'}>
            <button
              className={`font-medium ${
                active === 'home' && 'bg-p-btn-hover'
              } hover:bg-p-btn-hover  cursor-pointer rounded-[8px] px-2 lg:px-3 py-1 text-p-text`}
            >
              Home
            </button>
          </Link>
          <Link href={'/explore'}>
            <button
              className={`font-medium ${
                active === 'explore' && 'bg-p-btn-hover'
              } hover:bg-p-btn-hover cursor-pointer rounded-[8px] px-2 lg:px-3 py-1 text-p-text`}
            >
              Explore
            </button>
          </Link>
          <div className="flex flex-col text-p-text font-medium">
            <button
              className={`flex p-1 sm:py-1 sm:px-2  flex-row items-center hover:cursor-pointer rounded-md sm:rounded-xl  hover:bg-p-btn-hover`}
              onClick={getJoinedCommunities}
            >
              <p>Joined</p>
              <RiArrowDropDownLine className="w-6 h-6 text-p-btn items-center" />
            </button>
            <div
              className="bg-white/70 dark:bg-black/70 backdrop-blur-lg rounded-md sm:rounded-xl absolute mt-7 z-30 max-h-[500px] overflow-y-auto overflow-x-hidden"
              ref={dropdownRef}
            >
              {showJoinedCommunities && (
                <>
                  <FilterListWithSearch
                    list={joinedCommunities}
                    type="community"
                    filterParam="name"
                    handleSelect={(community) => {
                      setShowJoinedCommunities(false)
                      router.push(`/c/${community?.name}`)
                    }}
                  />
                </>
              )}
              {fetchingJoinedCommunities && (
                <>
                  <div className="flex flex-row items-center justify-center p-2 m-2">
                    <div className="animate-pulse rounded-full bg-p-bg w-9 h-9" />
                    <div className="animate-pulse rounded-full bg-p-bg w-32 h-4 ml-4" />
                  </div>
                  <div className="flex flex-row items-center justify-center p-2 m-2">
                    <div className="animate-pulse rounded-full bg-p-bg w-9 h-9" />
                    <div className="animate-pulse rounded-full bg-p-bg w-32 h-4 ml-4" />
                  </div>
                  <div className="flex flex-row items-center justify-center p-2 m-2">
                    <div className="animate-pulse rounded-full bg-p-bg w-9 h-9" />
                    <div className="animate-pulse rounded-full bg-p-bg w-32 h-4 ml-4" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          className="flex flex-row items-center bg-transparent rounded-full relative text-p-text hover:bg-p-hover hover:text-p-hover-text p-1"
          onClick={routeToNotifications}
        >
          <IoMdNotificationsOutline className="w-[25px] h-[25px] object-contain" />
          {/* a green count dot */}
          {Number(notificationsCount + lensNotificationsCount) > 0 && (
            <div className="top-0 left-3 absolute leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full border-[3px] border-p-bg">
              <span>{notificationsCount + lensNotificationsCount}</span>
            </div>
          )}
        </button>
        <button
          className="text-p-text hover:bg-p-hover hover:text-p-hover-text p-1 rounded-full"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <FiMoon className="w-[25px] h-[25px] cursor-pointer" />
          ) : (
            <FiSun className="w-[25px] h-[25px] cursor-pointer" />
          )}
        </button>
        {/* {user && address && (
          <div
            className="flex flex-row rounded-full items-center justify-between hover:cursor-pointer h-[40px]"
            onClick={showMoreOptions}
          >
            {user?.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                className="w-[40px] h-[40px] rounded-full"
              />
            )}
            {user && !user.profileImageUrl && (
              <Image
                src={getStampFyiURL(user?.walletAddress)}
                width="40"
                height="40"
                className="rounded-full"
              />
            )}
          </div>
        )} */}
        {/* <CgProfile className="w-[25px] h-[25px] text-[#50555C] cursor-pointer" /> */}
        {(!isSignedIn ||
          !hasProfile ||
          !lensProfile?.defaultProfile?.dispatcher?.canUseRelay) && (
          <LensLoginButton />
        )}
        {isSignedIn && lensProfile?.defaultProfile?.dispatcher?.canUseRelay && (
          <div className="flex flex-row items-center space-x-2 text-p-text">
            <ImageWithPulsingLoader
              src={getAvatar(lensProfile?.defaultProfile)}
              className="w-[40px] h-[40px] rounded-full cursor-pointer"
              onClick={showMoreOptions}
            />
            <div className="flex flex-col">
              {lensProfile?.defaultProfile?.name && (
                <div> {lensProfile?.defaultProfile?.name} </div>
              )}
              <Link
                href={`/u/${lensProfile.defaultProfile.handle}`}
                className={`hover:cursor-pointer hover:underline text-s-text text-sm p-2 md:p-0`}
              >
                u/{lensProfile.defaultProfile.handle}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
