import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useProfile } from '../Common/WalletContext'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ClickOption from './ClickOption'
import { Drawer } from '@mui/material'
import { useState } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import { useEffect } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { getJoinedCommunitiesApi } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'

const MobileTopNav = () => {
  // const [showOptions, setShowOptions] = useState(false)
  const router = useRouter()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  let prevScrollpos = window.pageYOffset
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [active, setActive] = useState('new')
  const { pathname } = router
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [showJoinedCommunities, setShowJoinedCommunities] = useState(false)
  const { notifyError } = useNotify()
  const dropdownRef = useRef(null)

  if (window) {
    window.onscroll = function () {
      const mobileTopNavEl = document.getElementById('mobile-top-navbar')
      if (!mobileTopNavEl) return
      const currentScrollPos = window.pageYOffset
      if (prevScrollpos > currentScrollPos) {
        mobileTopNavEl.style.top = '0'
      } else {
        mobileTopNavEl.style.top = '-100px'
      }
      prevScrollpos = currentScrollPos
    }
  }
  const routeToHome = () => {
    router.push('/')
  }

  useEffect(() => {
    console.log('pathname', pathname)
    if (pathname.endsWith('/new')) {
      setActive('new')
    } else if (pathname.endsWith('/top')) {
      setActive('top')
    } else if (pathname.endsWith('/hot')) {
      setActive('hot')
    } else if (pathname.endsWith('/lens')) {
      setActive('lens')
    }
  }, [pathname])

  // const sxStyle = {
  //   borderTopLeftRadius: '20px'
  // }

  const handleOptionsClick = (e) => {
    showModal({
      component: <ClickOption />,
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        top: e.currentTarget.getBoundingClientRect().bottom + 20 + 'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }
  useEffect(() => {
    const handleClick = (event) => {
      // Check if the target element of the click is the dropdown element
      // or a descendant of the dropdown element
      if (!dropdownRef.current.contains(event.target)) {
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
    const response = await getJoinedCommunitiesApi(user.walletAddress)
    setJoinedCommunities(response)
    setShowJoinedCommunities(!showJoinedCommunities)
  }
  return (
    <>
      <div
        id="mobile-top-navbar"
        className="mobile-top-nav bg-p-bg border-b border-p-border flex flex-row items-center space-x-24 py-2.5 px-4 z-10"
      >
        <div className="flex flex-row items-center">
          {user && user.profileImageUrl && (
            <img
              src={user.profileImageUrl}
              className="w-8 h-8 rounded-full"
              onClick={handleOptionsClick}
            />
          )}
          {(!user || !user.profileImageUrl) && (
            <Image
              src="/gradient.jpg"
              width={30}
              height={30}
              className="rounded-full"
            />
          )}
          <div
            className="pl-5 text-base font-bold tracking-wider"
            onClick={routeToHome}
          >
            Home
          </div>
        </div>
        <ConnectButton accountStatus="avatar" />
        <button onClick={() => setIsDrawerOpen(true)}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.381 6.28567H7.85724M5.762 6.28567H2.61914M19.381 16.7619H7.85724M5.762 16.7619H2.61914M14.143 11.5238H2.61914M19.381 11.5238H16.2382M6.80962 4.19043C7.08746 4.19043 7.35393 4.3008 7.5504 4.49727C7.74686 4.69374 7.85724 4.9602 7.85724 5.23805V7.33329C7.85724 7.61113 7.74686 7.8776 7.5504 8.07407C7.35393 8.27053 7.08746 8.38091 6.80962 8.38091C6.53177 8.38091 6.26531 8.27053 6.06884 8.07407C5.87237 7.8776 5.762 7.61113 5.762 7.33329V5.23805C5.762 4.9602 5.87237 4.69374 6.06884 4.49727C6.26531 4.3008 6.53177 4.19043 6.80962 4.19043V4.19043ZM6.80962 14.6666C7.08746 14.6666 7.35393 14.777 7.5504 14.9735C7.74686 15.1699 7.85724 15.4364 7.85724 15.7142V17.8095C7.85724 18.0873 7.74686 18.3538 7.5504 18.5503C7.35393 18.7467 7.08746 18.8571 6.80962 18.8571C6.53177 18.8571 6.26531 18.7467 6.06884 18.5503C5.87237 18.3538 5.762 18.0873 5.762 17.8095V15.7142C5.762 15.4364 5.87237 15.1699 6.06884 14.9735C6.26531 14.777 6.53177 14.6666 6.80962 14.6666ZM15.1906 9.42853C15.4684 9.42853 15.7349 9.5389 15.9313 9.73537C16.1278 9.93183 16.2382 10.1983 16.2382 10.4761V12.5714C16.2382 12.8492 16.1278 13.1157 15.9313 13.3122C15.7349 13.5086 15.4684 13.619 15.1906 13.619C14.9127 13.619 14.6463 13.5086 14.4498 13.3122C14.2533 13.1157 14.143 12.8492 14.143 12.5714V10.4761C14.143 10.1983 14.2533 9.93183 14.4498 9.73537C14.6463 9.5389 14.9127 9.42853 15.1906 9.42853V9.42853Z"
              stroke="#E600EB"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <Drawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              borderRadius: '50px 50px 0px 0px'
            }
          }}
        >
          <div className="flex flex-col items-center border rounded-t-lg">
            <p className="justify-center items-center mt-3 text-lg font-bold">
              {' '}
              Choose Your Feed
            </p>
            <div className="font-bold flex flex-row  space-x-[76px] mt-7  items-center">
              <button
                className={`flex py-1 px-2 items-center hover:cursor-pointer gap-2  rounded-xl ${
                  active === 'new' && 'bg-p-bg'
                }  hover:bg-[#eee]`}
                onClick={() => {
                  router.push('/feed/new')
                  setIsDrawerOpen(false)
                }}
              >
                <HiSparkles />
                <div>New</div>
              </button>
              <button
                className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-xl ${
                  active === 'top' && 'bg-p-bg'
                }  hover:bg-[#eee]`}
                onClick={() => {
                  router.push('/feed/top')
                  setIsDrawerOpen(false)
                }}
              >
                <MdLeaderboard />
                <div>Top</div>
              </button>
              <button
                className={`text-lens-text flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-xl ${
                  active === 'lens' && 'bg-p-bg'
                }  hover:bg-[#eee]`}
                onClick={() => {
                  router.push('/feed/lens')
                  setIsDrawerOpen(false)
                }}
              >
                <img
                  src="/lensLogoWithoutText.svg"
                  className="h-5 w-5 "
                  alt="lens logo icon"
                />
                <div>Lens</div>
              </button>
            </div>
            <div className="flex flex-row items-center place-self-start ">
              <button
                className="flex items-center pt-[18px] pl-2.5"
                onClick={getJoinedCommunities}
              >
                <p className="text-lg font-bold">Community</p>
                <FiChevronRight />
              </button>
              <div
                className="bg-s-bg rounded-xl p-2 mt-[18px] z-50 max-h-24"
                ref={dropdownRef}
              >
                {showJoinedCommunities &&
                  joinedCommunities.map((community) => {
                    console.log(community)
                    return (
                      <div
                        key={community._id}
                        className="flex flex-row items-center bg-s-h-bg cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn"
                        id={community._id}
                        logoImageUrl={community.logoImageUrl}
                        onClick={() => {
                          router.push(`/c/${community.name}`)
                        }}
                      >
                        <img
                          src={
                            community.logoImageUrl
                              ? community.logoImageUrl
                              : '/gradient.jpg'
                          }
                          alt="community logo"
                          className="rounded-xl w-9 h-9"
                        />

                        <div
                          className="text-p-text ml-4 text-base"
                          id={community._id}
                          logoImageUrl={community.logoImageUrl}
                        >
                          {community.name}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
            <button
              className=" border rounded-full m-3.5 w-[370px] p-3.5 text-lg font-bold bg-s-h-bg"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Drawer>
      </div>
    </>
  )
}

export default MobileTopNav
