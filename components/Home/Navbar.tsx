import React, { useEffect, useRef, useState } from 'react'
import SearchModal from '../Search/SearchModal'
import Link from 'next/link'
import LensLoginButton from '../Common/LensLoginButton'
import { useRouter } from 'next/router'
import useNotificationsCount from '../Notification/useNotificationsCount'
import { IoIosMoon, IoMdNotificationsOutline } from 'react-icons/io'
import ClickOption from './ClickOption'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { getJoinedCommunitiesApi } from '../../api/community'
import { RiArrowDropDownLine } from 'react-icons/ri'
import FilterListWithSearch from '../Common/UI/FilterListWithSearch'
import { useLensUserContext } from '../../lib/LensUserContext'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getAvatar from '../User/lib/getAvatar'
import { scrollToTop } from '../../lib/helpers'
import FilterButton from '../Common/UI/FilterButton'
import { AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup'
import { Tooltip } from '@mui/material'
import formatHandle from '../User/lib/formatHandle'
import { BsChevronDown } from 'react-icons/bs'
import { useTheme } from '../Common/ThemeProvider'
import { HiSun } from 'react-icons/hi'
const Navbar = () => {
  const router = useRouter()
  const { pathname } = router
  const { user } = useProfile()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const { showModal } = usePopUpModal()
  const { notifyInfo } = useNotify()
  const { theme, toggleTheme } = useTheme()

  const dropdownRef = useRef(null)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [showJoinedCommunities, setShowJoinedCommunities] = useState(false)
  const [fetchingJoinedCommunities, setFetchingJoinedCommunities] =
    useState(false)
  const { notifyError } = useNotify()

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

  const { notificationsCount, updateNotificationCount } =
    useNotificationsCount()

  const routeToNotifications = async () => {
    updateNotificationCount()
    updateNotificationCount()
    router.push('/notification')
  }

  const isOnHomeFeed = pathname === '/' || pathname.startsWith('/feed')

  const routeToHome = () => {
    if (isOnHomeFeed) {
      scrollToTop()
    } else {
      router.push('/')
    }
  }

  const routeToExplore = () => {
    if (pathname.endsWith('/explore')) {
      scrollToTop()
    } else {
      router.push('/explore')
    }
  }

  const createPost = () => {
    if (!user || !isSignedIn || !hasProfile) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
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

  // const [selectedCommunity, setSelectedCommunity] = useState(null)

  const storeRecentCommunities = (community) => {
    const recentCommunities =
      JSON.parse(window?.localStorage?.getItem('recentCommunities')) || []
    window.localStorage.setItem(
      'recentCommunities',
      JSON.stringify([
        community,
        ...recentCommunities.filter(
          (community) => community?._id !== community?._id
        )
      ])
    )
  }

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    try {
      setFetchingJoinedCommunities(true)
      const response = await getJoinedCommunitiesApi()
      const recentCommunities =
        JSON.parse(window?.localStorage?.getItem('recentCommunities')) || []
      // setting the joinedCommunitites with recentCommunitties from the localStorage at the top
      setJoinedCommunities([
        ...recentCommunities,
        // removing the communities in the recentCommunities from the joinedCommunities using communityId
        ...response.filter(
          (community) =>
            !recentCommunities.some((c) => c?._id === community?._id)
        )
      ])
      setShowJoinedCommunities(!showJoinedCommunities)
    } catch (error) {
      console.log('error', error)
      notifyError('Error getting joined communities')
    } finally {
      setFetchingJoinedCommunities(false)
    }
  }

  return (
    <div className="flex flex-row flex-1 z-40 justify-between px-4 md:px-6 lg:px-8 xl:px-12 py-1.5 items-center shadow-sm gap-2 sticky top-0 bg-s-bg min-h-[62px]">
      <div className="flex flex-row items-center gap-4 lg:gap-5">
        <div>
          <div className="flex flex-row justify-center items-center space-x-2 h-fit w-fit cursor-pointer">
            <img
              src="/LogoV3TrimmedWithBG.png"
              className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] cursor-pointer"
              alt="DivrseHQ Logo"
              onClick={routeToHome}
            />
          </div>
        </div>
        <SearchModal />
        <div className="flex flex-row space-x-3">
          {/* <FilterButton
            title="Home"
            active={isOnHomeFeed}
            onClick={routeToHome}
          /> */}
          <div className="flex flex-col relative">
            <button
              className={`flex items-center hover:cursor-pointer space-x-1 py-1 px-2.5 sm:py-1 sm:px-2.5 rounded-full ${
                isOnHomeFeed
                  ? 'bg-select-active-btn-bg text-select-active-btn-text'
                  : 'bg-select-btn-bg text-select-btn-text sm:hover:bg-select-btn-hover-bg'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                getJoinedCommunities()
              }}
            >
              <span>
                {router.pathname.startsWith('/c')
                  ? `c/${router.asPath.split('/')[2].split('?')[0]}`
                  : 'Home'}
              </span>
              <BsChevronDown
                className={`${
                  isOnHomeFeed
                    ? `text-select-active-btn-text`
                    : `text-select-btn-text`
                } w-3 h-3 items-center `}
              />
            </button>

            <div
              className="bg-white/70 font-medium dark:bg-black/70 backdrop-blur-lg rounded-md absolute mt-7 z-30 max-h-[500px] overflow-y-auto overflow-x-hidden w-[250px]"
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
                      storeRecentCommunities(community)
                      router.push(`/c/${community?.name}`)
                    }}
                    firstItem={
                      !isOnHomeFeed ? (
                        <div
                          className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl text-p-text hover:bg-p-btn hover:text-p-btn-text gap-4"
                          onClick={() => {
                            routeToHome()
                            setShowJoinedCommunities(false)
                          }}
                        >
                          <AiFillHome className="w-9 h-9 text-p-text items-center" />
                          <div>Home</div>
                        </div>
                      ) : null
                    }
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

          <FilterButton
            title="Explore"
            active={router.pathname.startsWith('/explore')}
            onClick={() => {
              if (router.pathname.startsWith('/explore')) {
                scrollToTop()
              } else {
                routeToExplore()
                return
              }
            }}
          />
          {/* <div className="flex flex-col">
            <FilterButton
              title="Joined Communities"
              IconAtEnd={
                <RiArrowDropDownLine className="w-6 h-6 text-p-btn items-center" />
              }
              onClick={getJoinedCommunities}
            />
            <div
              className="bg-white/70 font-medium dark:bg-black/70 backdrop-blur-lg rounded-md absolute mt-7 z-30 max-h-[500px] overflow-y-auto overflow-x-hidden"
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
                      storeRecentCommunities(community)
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
          </div> */}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {!pathname.includes('/settings') && (
          <Tooltip title="Create Post" arrow>
            <button
              className="flex flex-row items-center rounded-full relative text-p-text hover:bg-s-hover p-1"
              onClick={createPost}
            >
              <AiOutlinePlus className="w-[25px] h-[25px] object-contain" />
            </button>
          </Tooltip>
        )}
        <Tooltip title="Notifications" arrow>
          <button
            className="flex flex-row items-center rounded-full relative text-p-text hover:bg-s-hover p-1"
            onClick={routeToNotifications}
          >
            <IoMdNotificationsOutline className="w-[25px] h-[25px] object-contain" />
            {/* a green count dot */}
            {Number(notificationsCount) > 0 && (
              <div className="top-0 left-3 absolute leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full border-[3px] border-p-bg dark:border-s-bg">
                <span>{notificationsCount}</span>
              </div>
            )}
          </button>
        </Tooltip>
        <Tooltip title={theme === 'light' ? 'Dark mode' : 'Light mode'} arrow>
          <button
            className="text-p-text hover:bg-s-hover p-1 rounded-full"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <IoIosMoon className="w-[25px] h-[25px] cursor-pointer" />
            ) : (
              <HiSun className="w-[25px] h-[25px] cursor-pointer" />
            )}
          </button>
        </Tooltip>
        {!isSignedIn ||
        !hasProfile ||
        !user ||
        !lensProfile?.defaultProfile?.dispatcher?.canUseRelay ? (
          <LensLoginButton />
        ) : (
          <div
            className="flex flex-row items-center space-x-2 text-p-text border-s-border border-[1px] py-1 px-2 rounded-full hover:bg-s-hover cursor-pointer"
            onClick={showMoreOptions}
          >
            <ImageWithPulsingLoader
              // @ts-ignore
              src={getAvatar(lensProfile?.defaultProfile)}
              className="w-[40px] h-[40px] rounded-full cursor-pointer"
            />
            <div className="flex flex-col">
              {lensProfile?.defaultProfile?.name && (
                <div className="leading-4">
                  {' '}
                  {lensProfile?.defaultProfile?.name}{' '}
                </div>
              )}
              <span onClick={(e) => e.stopPropagation()}>
                <Link
                  href={`/u/${formatHandle(lensProfile.defaultProfile.handle)}`}
                >
                  <div
                    className={`hover:cursor-pointer className='leading-4' hover:underline text-s-text text-sm p-2 md:p-0`}
                  >
                    u/{formatHandle(lensProfile.defaultProfile.handle)}
                  </div>
                </Link>
              </span>
            </div>
            <RiArrowDropDownLine className="w-7 h-7" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
