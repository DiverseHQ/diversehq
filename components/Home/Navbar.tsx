import { Tooltip } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { memo, useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsChevronDown } from 'react-icons/bs'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { getJoinedCommunitiesApi } from '../../apiHelper/community'
import { getMostPostedLensCommunityIds } from '../../apiHelper/lensPublication'
import { useLensUserContext } from '../../lib/LensUserContext'
import { scrollToTop } from '../../lib/helpers'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import LensLoginButton from '../Common/LensLoginButton'
import { useNotify } from '../Common/NotifyContext'
import FilterButton from '../Common/UI/FilterButton'
import FilterListWithSearch from '../Common/UI/FilterListWithSearch'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useProfile } from '../Common/WalletContext'
import useNotificationsCount from '../Notification/useNotificationsCount'
import SearchModal from '../Search/SearchModal'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import ClickOption from './ClickOption'
import CreatePostPopup from './CreatePostPopup'

const Navbar = () => {
  const router = useRouter()
  const { pathname } = router
  const { user, joinedLensCommunities, LensCommunity } = useProfile()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const { showModal } = usePopUpModal()
  const { notifyInfo } = useNotify()

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
    await updateNotificationCount(false)
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

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    try {
      setFetchingJoinedCommunities(true)
      const response = await getJoinedCommunitiesApi()

      let mostPostedCommunities = []

      try {
        const res = await getMostPostedLensCommunityIds()

        if (res.status === 200) {
          mostPostedCommunities = await res.json()
        }
      } catch (err) {
        console.log(err)
      }

      // setting the joinedCommunitites with recentCommunitties from the localStorage at the top
      const myLensCommunity = []
      if (LensCommunity) {
        myLensCommunity.push({
          _id: LensCommunity?._id,
          name: formatHandle(LensCommunity?.Profile?.handle),
          logoImageUrl: getAvatar(LensCommunity?.Profile),
          isLensCommunity: true
        })
      }

      const joinedCommunitiesArray = [
        ...joinedLensCommunities.map((community) => ({
          _id: community._id,
          name: formatHandle(community?.handle),
          // @ts-ignore
          logoImageUrl: getAvatar(community),
          isLensCommunity: true
        })),
        // removing the communities in the recentCommunities from the joinedCommunities using communityId
        ...response
      ]

      let sortedCommunities = []

      for (const communityId of mostPostedCommunities) {
        if (joinedCommunitiesArray.some((c) => c._id === communityId)) {
          sortedCommunities.push(
            joinedCommunitiesArray.find((c) => c._id === communityId)
          )
        }
      }

      for (const community of joinedCommunitiesArray) {
        if (!sortedCommunities.some((c) => c._id === community._id)) {
          sortedCommunities.push(community)
        }
      }

      setJoinedCommunities(sortedCommunities)

      setShowJoinedCommunities(!showJoinedCommunities)
    } catch (error) {
      console.log('error', error)
      notifyError('Error getting joined communities')
    } finally {
      setFetchingJoinedCommunities(false)
    }
  }

  return (
    <div className="flex flex-row flex-1 z-40 justify-between px-4 md:px-6 lg:px-8 xl:px-12 py-1.5 items-center border-b border-s-border gap-2 sticky top-0 bg-s-bg min-h-[62px]">
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
          <div className="flex flex-col relative">
            <button
              className={`flex items-center hover:cursor-pointer space-x-1 py-1 px-2.5 sm:py-1 sm:px-2.5 rounded-full bg-select-btn-bg text-select-btn-text sm:hover:bg-select-btn-hover-bg`}
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
                className={'text-select-btn-text w-3 h-3 items-center'}
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

                      if (community?.isLensCommunity) {
                        router.push(`/l/${community?.name}`)
                      } else {
                        router.push(`/c/${community?.name}`)
                      }
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
              <div className="top-0 left-3 absolute leading-[4px] p-1 text-[10px] text-white bg-p-btn font-black rounded-full border-[3px] border-p-bg dark:border-s-bg">
                <span>{notificationsCount}</span>
              </div>
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

export default memo(Navbar)
