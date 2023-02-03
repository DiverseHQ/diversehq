import React, { useEffect, useState } from 'react'
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
import Image from 'next/image'
import { useTheme } from '../Common/ThemeProvider'

const Navbar = () => {
  const router = useRouter()
  const { pathname } = router
  const { user, address } = useProfile()
  const { showModal } = usePopUpModal()
  const { theme, toggleTheme } = useTheme()

  const [active, setActive] = useState('home')
  const { notificationsCount, setNotificationsCount } = useNotificationsCount()
  const [showDot, setShowDot] = React.useState(true)

  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/feed')) {
      setActive('home')
    } else if (pathname.endsWith('/explore')) {
      setActive('explore')
    } else {
      setActive('none')
    }
  }, [pathname])

  const routeToNotifications = () => {
    setNotificationsCount(0)
    setShowDot(false)
    router.push('/notification')
  }

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal({
      component: <ClickOption />,
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        bottom:
          window.innerHeight -
          e.currentTarget.getBoundingClientRect().bottom -
          120 +
          'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }

  return (
    <div className="flex flex-row flex-1 z-40 justify-between px-4 md:px-6 lg:px-8 xl:px-12 py-2.5 items-center shadow-md gap-2 sticky top-0 bg-p-bg dark:bg-s-bg">
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
                active === 'home' && 'bg-[#D1D9FF] dark:bg-[#272729]'
              } ${
                theme === 'dark' ? 'hover:bg-[#272729]' : 'hover:bg-[#D1D9FF]'
              } cursor-pointer rounded-[8px] px-2 lg:px-3 py-1 text-p-text`}
            >
              Home
            </button>
          </Link>
          <Link href={'/explore'}>
            <button
              className={`font-medium ${
                active === 'explore' && 'bg-[#D1D9FF] dark:bg-[#272729]'
              } ${
                theme === 'dark' ? 'hover:bg-[#272729]' : 'hover:bg-[#D1D9FF]'
              } cursor-pointer rounded-[8px] px-2 lg:px-3 py-1 text-p-text`}
            >
              Explore
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          className="flex flex-row items-center bg-transparent rounded-full relative text-p-text hover:bg-p-hover hover:text-p-hover-text p-1"
          onClick={routeToNotifications}
        >
          <IoMdNotificationsOutline className="w-[25px] h-[25px] object-contain" />
          {/* a green count dot */}
          {notificationsCount > 0 && (
            <div className="top-0 left-4 absolute leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full">
              <span>{notificationsCount}</span>
            </div>
          )}
          {(notificationsCount === 0 || !notificationsCount) && showDot && (
            // a green circle
            <div className="absolute top-1 left-4 w-[8px] h-[8px] bg-red-500 rounded-full" />
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
        {user && address && (
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
                src="/gradient.jpg"
                width="40"
                height="40"
                className="rounded-full"
              />
            )}
          </div>
        )}
        {/* <CgProfile className="w-[25px] h-[25px] text-[#50555C] cursor-pointer" /> */}
        <LensLoginButton />
      </div>
    </div>
  )
}

export default Navbar
