import React, { useEffect, useState } from 'react'
import SearchModal from '../Search/SearchModal'
import Link from 'next/link'
import { FiMoon, FiSun } from 'react-icons/fi'
// import { CgProfile } from 'react-icons/cg'

// import Link from 'next/link'
import LensLoginButton from '../Common/LensLoginButton'
import { useRouter } from 'next/router'
import useNotificationsCount from '../Notification/useNotificationsCount'
import { IoMdNotificationsOutline } from 'react-icons/io'
import ClickOption from './ClickOption'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import { useProfile } from '../Common/WalletContext'
import Image from 'next/image'
// import LogoComponent from '../Common/UI/LogoComponent'

// const NavbarButton = ({ btnText, link, isActive, props }) => {
//   return (
//     <Link href={link}>
//       <button
//         className={`font-medium ${
//           isActive && 'bg-[#D1D9FF]'
//         } hover:bg-[#D1D9FF] cursor-pointer rounded-[8px] px-2 lg:px-3 py-1`}
//       >
//         {btnText}
//       </button>
//     </Link>
//   )
// }

const Navbar = () => {
  const [theme, setTheme] = useState('light')
  const router = useRouter()
  const { pathname } = router
  const { user, address } = useProfile()
  const { showModal } = usePopUpModal()

  const [active, setActive] = useState('home')
  const { notificationsCount, setNotificationsCount } = useNotificationsCount()
  const [showDot, setShowDot] = React.useState(true)

  useEffect(() => {
    if (pathname.endsWith('/')) {
      setActive('home')
    } else if (pathname.endsWith('/explore')) {
      setActive('explore')
    } else {
      setActive('none')
    }
  }, [pathname])

  useEffect(() => {
    const theme = window.localStorage.getItem('data-theme')
    if (theme) {
      document.body.classList.add(theme)
      document.documentElement.setAttribute('data-theme', theme)
      setTheme(theme)
    }
  }, [])

  const toggleDarkMode = () => {
    if (theme === 'light') {
      document.body.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      window.localStorage.setItem('data-theme', 'dark')
      setTheme('dark')
    } else {
      document.body.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      window.localStorage.setItem('data-theme', 'light')
      setTheme('light')
    }
  }

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
      {/* <div className="w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px]">
        <LogoComponent />
      </div>
      <SearchModal />
      <div className="w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px] flex flex-row justify-end">
        <LensLoginButton />
      </div> */}
      <div className="flex flex-row items-center gap-4 lg:gap-5">
        <div>
          <Link
            className="flex flex-row justify-center items-center  h-fit w-fit"
            href={'/'}
            passHref
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
          className="flex flex-row items-center bg-transparent rounded-[20px] relative text-p-text"
          onClick={routeToNotifications}
        >
          <IoMdNotificationsOutline className="w-[25px] h-[25px] object-contain text-[#50555C] dark:text-p-text" />
          {/* a green count dot */}
          {notificationsCount > 0 && (
            <div className="top-0 left-4 absolute leading-[4px] p-1 text-[8px] text-p-btn-text bg-red-500 font-bold rounded-full">
              <span>{notificationsCount}</span>
            </div>
          )}
          {(notificationsCount === 0 || !notificationsCount) && showDot && (
            // a green circle
            <div className="absolute top-0 left-4 w-[8px] h-[8px] bg-red-500 rounded-full" />
          )}
        </button>
        {theme === 'light' ? (
          <FiMoon
            className="w-[25px] h-[25px] text-[#50555C] cursor-pointer"
            onClick={toggleDarkMode}
          />
        ) : (
          <FiSun
            className="w-[25px] h-[25px] text-p-text cursor-pointer"
            onClick={toggleDarkMode}
          />
        )}
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
