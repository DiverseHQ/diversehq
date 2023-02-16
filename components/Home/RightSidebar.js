import React, { useEffect, useState } from 'react'
import {
  getAllCommunities,
  getCreatedCommunitiesApi
} from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import RightSideCommunityComponent from './RightSideCommunityComponent'
import { HiOutlineSparkles } from 'react-icons/hi'
import { useRouter } from 'next/router'

const CommunitiesDiv = ({ text, communitiesList }) => {
  /*
    text is the heading text
    communitiesList is the list of communities to map over
  */
  return (
    <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6 bg-[#EDE7FF] dark:bg-s-bg w-full rounded-[15px] border-[1px] border-p-border py-1">
      <div className="flex flex-row gap-1 xl:gap-2 items-center text-p-text px-3">
        <HiOutlineSparkles className="w-[20px] h-[20px]" />
        <h3 className="text-[18px] font-medium">{text}</h3>
      </div>
      {communitiesList?.map((community, i) => {
        return <RightSideCommunityComponent key={i} community={community} />
      })}
    </div>
  )
}

const RightSidebar = () => {
  const { user } = useProfile()
  const { notifyError } = useNotify()

  const [createdCommunities, setCreatedCommunities] = useState([])
  const [topCommunities, setTopCommunities] = useState([])

  const fetchAndSetCreatedCommunities = async () => {
    try {
      const communities = await getCreatedCommunitiesApi()
      if (communities.length > 0) {
        setCreatedCommunities(communities)
      }
    } catch (error) {
      console.log(error)
      notifyError("Couldn't fetch created communities")
    }
  }

  const fetchTopCommunities = async () => {
    try {
      const communities = await getAllCommunities(10, 0, 'top')
      if (communities.communities.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
      notifyError("Couldn't fetch top communities")
    }
  }

  useEffect(() => {
    if (!user) return
    fetchAndSetCreatedCommunities()
  }, [user])

  useEffect(() => {
    if (topCommunities.length > 0) return
    fetchTopCommunities()
  }, [])

  // useEffect(() => {
  //   fetchCommunitiesAndSetState(
  //     recommendedCommunitiesIds,
  //     setRecommendedCommunities
  //   )
  // }, [])

  const router = useRouter()

  return (
    <div
      className={`relative hidden ${
        router.pathname.startsWith('/p/') ? '' : 'lg:flex flex-col'
      } sticky top-[64px] h-[calc(100vh-62px)] w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-8 pr-4 md:pr-6 lg:pr-10 xl:pr-12 pl-2 md:pl-2 lg:pl-4 xl:pl-6 overflow-scroll no-scrollbar`}
    >
      {user && createdCommunities?.length > 0 && (
        <CommunitiesDiv
          text="Created Communities"
          communitiesList={createdCommunities}
        />
      )}
      {/* <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
        <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
          Most Visited Communities
        </h3>
        {mostVisitedCommunities.map((community, i) => {
          return <RightSideCommunityComponent key={i} community={community} />
        })}
      </div> */}
      {/* {recommendedCommunities.length > 0 && (
        <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
          <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
            Recommended Communities
          </h3>
          {recommendedCommunities.map((community, i) => {
            return <RightSideCommunityComponent key={i} community={community} />
          })}
        </div>
      )} */}
      {topCommunities?.length > 0 && (
        <CommunitiesDiv
          text="Top Communities"
          communitiesList={topCommunities}
        />
      )}
    </div>
  )
}

export default RightSidebar
