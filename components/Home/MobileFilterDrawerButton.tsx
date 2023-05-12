import React from 'react'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { MdOutlineExplore } from 'react-icons/md'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useNotify } from '../Common/NotifyContext'
import { getJoinedCommunitiesApi } from '../../api/community'
import { useProfile } from '../Common/WalletContext'
import { useEffect } from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { stringToLength } from '../../utils/utils'
import { CgCommunity } from 'react-icons/cg'
import { GiBreakingChain } from 'react-icons/gi'
import getIPFSLink from '../User/lib/getIPFSLink'

const MobileFilterDrawerButton = () => {
  const { user } = useProfile()
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const { notifyError } = useNotify()
  const [active, setActive] = useState('all')
  const router = useRouter()
  const { pathname } = router
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (pathname.endsWith('/offchain')) {
      setActive('Off chain')
    } else if (pathname.endsWith('/all')) {
      setActive('All')
    } else if (pathname.endsWith('/foryou')) {
      setActive('For You')
    } else {
      setActive('All')
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
        className="flex flex-row items-center justify-center bg-s-bg  p-1 px-2 rounded-full"
      >
        {active === 'All' && <MdOutlineExplore className="text-2xl" />}
        {active === 'Off chain' && <GiBreakingChain className="text-2xl" />}
        {active === 'For You' && <CgCommunity className="text-2xl" />}
        <span className="pl-1">{active}</span>
      </button>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        showClose={true}
        position="bottom"
        // @ts-ignore
        className="dark:bg-s-bg"
      >
        <div className="flex flex-col justify-center items-center text-p-text">
          <h1 className="font-bold text-lg mt-5">Choose your Feed</h1>
          <div className="font-medium  text-base border-b p-0.5 w-full flex flex-row mt-2  justify-between px-4 items-center ">
            <button
              className={`flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
                active === 'all' && 'bg-p-bg'
              } hover:bg-p-hover hover:text-p-hover-text`}
              onClick={() => {
                router.push('/feed/all')
                setIsDrawerOpen(false)
              }}
            >
              <MdOutlineExplore className="h-5 w-5" />
              <div>All</div>
            </button>
            <button
              className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                active === 'foryou' && 'bg-p-bg'
              }  hover:bg-p-hover hover:text-p-hover-text`}
              onClick={() => {
                router.push('/feed/foryou')
                setIsDrawerOpen(false)
              }}
            >
              <CgCommunity className="h-6 w-6" />
              <div>For You</div>
            </button>

            <button
              className={`flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
                active === 'offchain' && 'bg-p-bg'
              } hover:bg-p-hover hover:text-p-hover-text`}
              onClick={() => {
                router.push('/feed/offchain')
                setIsDrawerOpen(false)
              }}
            >
              <GiBreakingChain className="h-5 w-5" />
              <div>Off-chain</div>
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
                        src={getIPFSLink(community.logoImageUrl)}
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
        </div>
      </BottomDrawerWrapper>
    </div>
  )
}

export default MobileFilterDrawerButton
