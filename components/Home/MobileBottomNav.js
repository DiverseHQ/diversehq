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

  const routeToSearch = () => {
    router.push('/search')
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="fixed bottom-0 w-full py-2 flex flex-row justify-evenly items-center bg-p-bg shadow-top min-h-[56px]">
      <div
        className="p-1.5 hover:bg-[#6668FF] rounded-full hover:bg-opacity-20 cursor-pointer"
        onClick={() => {
          if (router.pathname !== '/') {
            routeToHome()
            return
          }
          scrollToTop()
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
        className="p-1.5 hover:bg-[#6668FF] rounded-full hover:bg-opacity-20 cursor-pointer"
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
        className="p-1.5 hover:bg-[#6668FF] rounded-full hover:bg-opacity-20 cursor-pointer"
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
        <div className="p-1.5 hover:bg-[#6668FF] rounded-full hover:bg-opacity-20 cursor-pointer">
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
        {notificationsCount + lensNotificationsCount > 0 && (
          <div className="absolute -top-0.5 left-3 leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full border-[2.5px] border-p-bg">
            <span>{notificationsCount + lensNotificationsCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileBottomNav
