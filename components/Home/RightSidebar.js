import React, { useEffect, useState } from 'react'
import {
  getAllCommunities,
  getCreatedCommunitiesApi
  // postGetCommunityInfoUsingListOfIds
} from '../../api/community'
// import { recommendedCommunitiesIds } from '../../utils/config'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import RightSideCommunityComponent from './RightSideCommunityComponent'

const RightSidebar = () => {
  const { user } = useProfile()
  const { notifyError } = useNotify()

  const [createdCommunities, setCreatedCommunities] = useState([])
  const [topCommunities, setTopCommunities] = useState([])
  // const [recommendedCommunities, setRecommendedCommunities] = useState([])

  // const fetchCommunitiesAndSetState = async (ids, setState) => {
  //   try {
  //     const communities = await postGetCommunityInfoUsingListOfIds(ids)
  //     setState(communities)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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
      const communities = await getAllCommunities(6, 0, 'top')
      console.log('top communities', communities)
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
    fetchTopCommunities()
  }, [user])

  // useEffect(() => {
  //   fetchCommunitiesAndSetState(
  //     recommendedCommunitiesIds,
  //     setRecommendedCommunities
  //   )
  // }, [])

  return (
    <div className="relative hidden lg:flex flex-col border-l-[1px] border-p-btn sticky top-[64px] h-[calc(100vh-62px)] w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-8 px-4 md:px-6 lg:px-10 xl:px-12 overflow-scroll no-scrollbar">
      {createdCommunities.length > 0 && (
        <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
          <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
            Created Communities
          </h3>
          {createdCommunities.map((community, i) => {
            return <RightSideCommunityComponent key={i} community={community} />
          })}
        </div>
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
      {topCommunities.length > 0 && (
        <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
          <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
            Top Communities
          </h3>
          {topCommunities.map((community, i) => {
            return <RightSideCommunityComponent key={i} community={community} />
          })}
        </div>
      )}
    </div>
  )
}

export default RightSidebar
