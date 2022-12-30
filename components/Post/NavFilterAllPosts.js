import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { getJoinedCommunitiesApi } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'

const NavFilterAllPosts = () => {
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('new')
  const { user } = useProfile()
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [showJoinedCommunities, setShowJoinedCommunities] = useState(false)
  const { notifyError } = useNotify()

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
    <div className="flex flex-row  border pl-6 bg-white mt-10 pt-5 pb-5  rounded-xl space-x-9 items-center">
      <button
        className={`flex py-1 px-2 items-center hover:cursor-pointer gap-2 rounded-full ${
          active === 'new' && 'bg-white'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push('/feed/new')
        }}
      >
        <HiSparkles />
        <div>New</div>
      </button>
      <div className="flex flex-col">
        <button
          className={`flex py-1 px-2  flex-row items-center hover:cursor-pointer rounded-full ${
            active === 'new' && 'bg-white'
          }  hover:bg-[#eee]`}
          onClick={getJoinedCommunities}
        >
          <p>Communities</p>
          <RiArrowDropDownLine className="w-6 h-6 text-p-btn items-center" />
        </button>
        <div className="bg-s-bg rounded-xl absolute mt-7" ref={dropdownRef}>
          {showJoinedCommunities &&
            joinedCommunities.map((community) => {
              console.log(community)
              return (
                <div
                  key={community._id}
                  className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn"
                  id={community._id}
                  logoImageUrl={community.logoImageUrl}
                  onClick={() => {router.push(`/c/${community.name}`)}}
                >
                  <Image
                    src={
                      community.logoImageUrl
                        ? community.logoImageUrl
                        : '/gradient.jpg'
                    }
                    alt="community logo"
                    className="rounded-full"
                    width={30}
                    height={30}
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
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
          active === 'top' && 'bg-white'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push('/feed/top')
        }}
      >
        <MdLeaderboard />
        <div>Top</div>
      </button>
      <button
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
          active === 'lens' && 'bg-white'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push('/feed/lens')
        }}
      >
        <img src="/lensLogo.svg" className="h-5 w-5" alt="lens logo icon" />
        <div>Lens</div>
      </button>
    </div>
  )
}

export default NavFilterAllPosts
