import React from 'react'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useNotify } from '../Common/NotifyContext'
import { getJoinedCommunitiesApi } from '../../api/community'
import { useProfile } from '../Common/WalletContext'
import { useEffect } from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { stringToLength } from '../../utils/utils'

const MobileFilterDrawerButton = () => {
  const { user } = useProfile()
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const { notifyError } = useNotify()
  const [active, setActive] = useState('lens')
  const router = useRouter()
  const { pathname } = router
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
    if (!user?.walletAddress) return
    getJoinedCommunities()
  }, [user])

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      return
    }
    try {
      const response = await getJoinedCommunitiesApi()
      setJoinedCommunities(response)
    } catch (error) {
      console.log('error', error)
      notifyError('Error getting joined communities')
    }
  }
  return (
    <div>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex flex-row items-center justify-center bg-p-btn-hover p-1 rounded-md"
      >
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
        <span className="pl-2">{active}</span>
      </button>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        showClose={true}
      >
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-lg mt-5">Choose your Feed</h1>
          <div className="font-medium  text-base border-b p-0.5 w-full flex flex-row mt-2  justify-center items-center space-x-20 ">
            <button
              className={`text-lens-text flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
                active === 'lens' && 'bg-p-bg'
              }  hover:bg-p-btn-hover`}
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
            <button
              className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                active === 'new' && 'bg-p-bg'
              }  hover:bg-p-btn-hover`}
              onClick={() => {
                router.push('/feed/new')
                setIsDrawerOpen(false)
              }}
            >
              <HiSparkles />
              <div>New</div>
            </button>

            <button
              className={`flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
                active === 'top' && 'bg-p-bg'
              }  hover:bg-p-btn-hover`}
              onClick={() => {
                router.push('/feed/top')
                setIsDrawerOpen(false)
              }}
            >
              <MdLeaderboard />
              <div>Top</div>
            </button>
          </div>

          <div className="py-2">
            <div className="flex flex-row items-center overflow-x-auto w-screen no-scrollbar">
              {joinedCommunities.length > 0 &&
                joinedCommunities.map((community) => {
                  return (
                    <div
                      key={community?._id}
                      className="flex flex-col items-center justify-center min-w-[80px] cursor-pointer p-2 rounded-2xl hover:bg-p-btn mx-1"
                      id={community?._id}
                      onClick={() => {
                        router.push(`/c/${community.name}`)
                      }}
                    >
                      <ImageWithPulsingLoader
                        src={
                          community.logoImageUrl
                            ? community.logoImageUrl
                            : '/gradient.jpg'
                        }
                        alt="community logo"
                        className="rounded-full object-cover w-16 h-16"
                      />

                      <div
                        className="text-p-text text-xs font-bold break-keep pt-1"
                        id={community._id}
                      >
                        {stringToLength(community.name, 10)}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* <div className="flex flex-row overflow-x-auto w-screen no-scrollbar">
            {showJoinedCommunities &&
              joinedCommunities.map((community) => {
                return (
                  <div
                    key={community?._id}
                    className="flex flex-col items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn"
                    id={community?._id}
                    onClick={() => {
                      router.push(`/c/${community.name}`)
                    }}
                  >
                    <ImageWithPulsingLoader
                      src={
                        community.logoImageUrl
                          ? community.logoImageUrl
                          : '/gradient.jpg'
                      }
                      alt="community logo"
                      className="rounded-full object-cover w-10 h-10"
                    />

                    <div className="text-p-text font-medium" id={community._id}>
                      {community.name}
                    </div>
                  </div>
                )
              })}
          </div> */}
        </div>
      </BottomDrawerWrapper>
    </div>
  )
}

export default MobileFilterDrawerButton
