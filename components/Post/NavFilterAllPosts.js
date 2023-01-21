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
import FilterListWithSearch from '../Common/UI/FilterListWithSearch'

const NavFilterAllPosts = () => {
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('lens')
  const { user } = useProfile()
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [showJoinedCommunities, setShowJoinedCommunities] = useState(false)
  const [fetchingJoinedCommunities, setFetchingJoinedCommunities] =
    useState(false)
  const { notifyError } = useNotify()

  useEffect(() => {
    if (pathname.endsWith('/new')) {
      setActive('new')
    } else if (pathname.endsWith('/top')) {
      setActive('top')
    } else if (pathname.endsWith('/hot')) {
      setActive('hot')
    } else if (pathname.endsWith('/lens')) {
      setActive('lens')
    } else {
      setActive('lens')
    }
  }, [pathname])

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
    <div className="font-bold text-sm sm:text-base flex flex-row  border px-3 sm:px-6 bg-white mt-4 sm:mt-10 py-1 sm:py-3 w-full sm:rounded-xl justify-between sm:justify-start sm:space-x-9 items-center">
      <button
        className={`text-lens-text flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
          active === 'lens' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push('/feed/lens')
        }}
      >
        <img
          src="/lensLogoWithoutText.svg"
          className="h-5 w-5 "
          alt="lens logo icon"
        />
        <div>Lens</div>
      </button>
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'new' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push('/feed/new')
        }}
      >
        <HiSparkles />
        <div>New</div>
      </button>
      <div className="flex flex-col">
        <button
          className={`flex p-1 sm:py-1 sm:px-2  flex-row items-center hover:cursor-pointer rounded-md sm:rounded-xl  hover:bg-p-btn-hover`}
          onClick={getJoinedCommunities}
        >
          <p>Communities</p>
          <RiArrowDropDownLine className="w-6 h-6 text-p-btn items-center" />
        </button>
        <div
          className="bg-white/70  backdrop-blur-lg rounded-md sm:rounded-xl absolute mt-7 z-30 max-h-[500px] overflow-y-auto overflow-x-hidden"
          ref={dropdownRef}
        >
          {showJoinedCommunities && (
            <>
              <FilterListWithSearch
                list={joinedCommunities}
                type="community"
                filterParam="name"
                handleSelect={(community) => {
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
      <button
        className={`flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
          active === 'top' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push('/feed/top')
        }}
      >
        <MdLeaderboard />
        <div>Top</div>
      </button>
    </div>
  )
}

export default NavFilterAllPosts
