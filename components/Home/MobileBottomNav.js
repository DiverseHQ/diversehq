import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import useNotificationsCount from '../Notification/useNotificationsCount'
const MobileBottomNav = () => {
  const {
    notificationsCount,
    lensNotificationsCount,
    updateLensNotificationCount
  } = useNotificationsCount()
  const [active, setActive] = useState('home')
  const router = useRouter()
  const { pathname } = router

  const routeToHome = () => {
    router.push('/')
  }
  const routeToExplore = () => {
    router.push('/explore')
  }
  const routeToNotifications = async () => {
    await updateLensNotificationCount()
    router.push('/notification')
  }

  useEffect(() => {
    if (pathname.startsWith('/explore')) {
      setActive('explore')
    } else if (pathname.startsWith('/search')) {
      setActive('search')
    } else if (pathname.startsWith('/notification')) {
      setActive('notification')
    } else if (router.pathname === '/') {
      setActive('home')
    } else {
      setActive('none')
    }
  }, [pathname])

  const routeToSearch = () => {
    router.push('/search')
  }

  return (
    <div className="fixed bottom-0 w-full py-2 flex flex-row justify-evenly items-center bg-p-bg shadow-top min-h-[56px]">
      <img
        src={`${
          active === 'home' ? '/mobileNavHomeActive.svg' : '/mobileNavHome.svg'
        }`}
        alt="Home"
        onClick={routeToHome}
        className="cursor-pointer"
      />
      <img
        src={`${
          active === 'explore'
            ? '/mobileNavExploreActive.svg'
            : '/mobileNavExplore.svg'
        }`}
        alt="Explore"
        onClick={routeToExplore}
        className="cursor-pointer"
      />
      <img
        src={`${
          active === 'search'
            ? '/mobileNavSearchActive.svg'
            : '/mobileNavSearch.svg'
        }`}
        alt="Search"
        onClick={routeToSearch}
        className="cursor-pointer"
      />
      <div className="relative">
        <img
          src={`${
            active === 'notification'
              ? '/mobileNavNotificationActive.svg'
              : '/mobileNavNotification.svg'
          }`}
          alt="Notification"
          onClick={routeToNotifications}
          className="cursor-pointer"
        />
        {notificationsCount + lensNotificationsCount > 0 && (
          <div className="absolute top-0 left-0.5 leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full border-[2.5px] border-p-bg">
            <span>{notificationsCount + lensNotificationsCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileBottomNav
