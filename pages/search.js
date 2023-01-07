import React, { useEffect, useState } from 'react'
import { postGetCommunityInfoUsingListOfIds } from '../api/community'
import SearchModal from '../components/Search/SearchModal'
import { recommendedCommunitiesIds } from '../utils/config'
import RightSideCommunityComponent from '../components/Home/RightSideCommunityComponent'
import { NextSeo } from 'next-seo'
const search = () => {
  const [recommendedCommunities, setRecommendedCommunities] = useState([])
  const fetchCommunitiesAndSetState = async (ids, setState) => {
    try {
      const communities = await postGetCommunityInfoUsingListOfIds(ids)
      setState(communities)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchCommunitiesAndSetState(
      recommendedCommunitiesIds,
      setRecommendedCommunities
    )
  }, [])
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
      <div className="mt-10 w-screen flex flex-col items-center">
        <SearchModal />
        {recommendedCommunities.length > 0 && (
          <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6 mt-20">
            <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
              Recommended Communities
            </h3>
            {recommendedCommunities.map((community, i) => {
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
