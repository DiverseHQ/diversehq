import React, { useEffect, useState } from 'react'
// import { postGetCommunityInfoUsingListOfIds } from '../api/community'
// import SearchModal from '../components/Search/SearchModal'
// import { recommendedCommunitiesIds } from '../utils/config'
import RightSideCommunityComponent from '../components/Home/RightSideCommunityComponent'
import { NextSeo } from 'next-seo'
import { getAllCommunities } from '../api/community'
import { useNotify } from '../components/Common/NotifyContext'
const search = () => {
  const { notifyError } = useNotify()

  const [topCommunities, setTopCommunities] = useState([])
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
    if (topCommunities.length > 0) return
    fetchTopCommunities()
  }, [])
  // const [recommendedCommunities, setRecommendedCommunities] = useState([])
  // const fetchCommunitiesAndSetState = async (ids, setState) => {
  //   try {
  //     const communities = await postGetCommunityInfoUsingListOfIds(ids)
  //     setState(communities)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   fetchCommunitiesAndSetState(
  //     recommendedCommunitiesIds,
  //     setRecommendedCommunities
  //   )
  // }, [])
  console.log('search')
  return (
    <>
      <NextSeo
        title="DiverseHQ / Search"
        description="Search and connect with communities that reflect your interests and values on DiverseHQ!"
        openGraph={{
          url: 'https://app.diversehq.xyz/search'
        }}
      />
      <div className="w-screen flex flex-col px-4 mt-10">
        {/* <SearchModal /> */}
        {topCommunities.length > 0 && (
          <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
            <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
              Top Communities
            </h3>
            {topCommunities.map((community, i) => {
              return (
                <RightSideCommunityComponent key={i} community={community} />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default search
