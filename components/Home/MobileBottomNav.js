import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useMessageStore } from '../../store/message'
import useNotificationsCount from '../Notification/useNotificationsCount'
import { scrollToTop } from '../../lib/helpers'

const MobileBottomNav = () => {
  const { notificationsCount, updateNotificationCount } =
    useNotificationsCount()
  const [active, setActive] = useState('home')
  const router = useRouter()
  const setIsOpen = useMessageStore((state) => state.setIsOpen)
  const { pathname } = router

  const routeToHome = () => {
    router.push('/')
  }

  const routeToExplore = () => {
    router.push('/explore')
  }

  const routeToSearch = () => {
    router.push('/search')
  }

  const routeToNotifications = async () => {
    await updateNotificationCount()
    router.push('/notification')
  }

  const isOnHomeFeed = pathname === '/' || pathname.startsWith('/feed')

  useEffect(() => {
    if (pathname.startsWith('/explore')) {
      setActive('explore')
    } else if (pathname.startsWith('/search')) {
      setActive('search')
    } else if (pathname.startsWith('/notification')) {
      setActive('notification')
    } else if (isOnHomeFeed) {
      setActive('home')
    } else {
      setActive('none')
    }
  }, [pathname])

  return (
    <div className="fixed bottom-0 w-full flex flex-row justify-evenly items-center bg-s-bg border-t-[0.5px] border-s-border">
      <div
        className="p-4 active:bg-[#6668FF] rounded-full active:bg-opacity-20 cursor-pointer"
        onClick={() => {
          if (isOnHomeFeed) {
            scrollToTop()
          } else {
            routeToHome()
            return
          }
        }}
      >
        <img
          src={`${
            active === 'home'
              ? '/mobileNavHomeFilled.svg'
              : '/mobileNavHome.svg'
          }`}
          alt="Home"
          className="w-5.5 h-5.5"
        />
      </div>
      <div
        className="p-4 active:bg-[#6668FF] rounded-full active:bg-opacity-20 cursor-pointer"
        onClick={() => {
          if (!router.pathname.startsWith('/explore')) {
            routeToExplore()
            return
          }
          scrollToTop()
        }}
      >
        <img
          src={`${
            active === 'explore'
              ? '/mobileNavExploreFilled.svg'
              : '/mobileNavExplore.svg'
          }`}
          alt="Explore"
          className="w-5.5 h-5.5"
        />
      </div>
      <div
        className="p-4 active:bg-[#6668FF] rounded-full active:bg-opacity-20 cursor-pointer"
        onClick={routeToSearch}
      >
        <img
          src={`${
            active === 'search'
              ? '/mobileNavSearchActive.svg'
              : '/mobileNavSearch.svg'
          }`}
          alt="Search"
          className="w-5.5 h-5.5"
        />
      </div>
      <div
        className="relative"
        onClick={() => {
          if (!router.pathname.startsWith('/notification')) {
            routeToNotifications()
            return
          }
          scrollToTop()
        }}
      >
        <div className="p-4 active:bg-[#6668FF] rounded-full active:bg-opacity-20 cursor-pointer">
          <img
            src={`${
              active === 'notification'
                ? '/mobileNavNotificationFilled.svg'
                : '/mobileNavNotification.svg'
            }`}
            alt="Notification"
            className="w-[23px] h-[23px]"
          />
        </div>
        {Number(notificationsCount) > 0 && (
          <div className="absolute top-2 right-3 leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full border-[2.5px] border-p-bg dark:border-s-bg">
            <span>{notificationsCount}</span>
            {/* <span>10</span> */}
          </div>
        )}
      </div>
      <div
        className="p-4 active:bg-[#6668FF] rounded-full active:bg-opacity-20 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={`/msg.svg`}
          alt="Notification"
          className="w-[23px] h-[23px]"
        />
      </div>
    </div>
  )
}

export default MobileBottomNav
