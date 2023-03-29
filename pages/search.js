import React, { useEffect, useState } from 'react'
// import { postGetCommunityInfoUsingListOfIds } from '../api/community'
// import SearchModal from '../components/Search/SearchModal'
// import { recommendedCommunitiesIds } from '../utils/config'
import RightSideCommunityComponent from '../components/Home/RightSideCommunityComponent'
import { NextSeo } from 'next-seo'
import { getAllCommunities, getNotJoinedCommunities } from '../api/community'
import { useNotify } from '../components/Common/NotifyContext'
import useDevice from '../components/Common/useDevice'
import SearchModal from '../components/Search/SearchModal'
import { useProfile } from '../components/Common/WalletContext'
const search = () => {
  const { notifyError } = useNotify()
  const { isMobile } = useDevice()
  const { user } = useProfile()
  const [recentCommunities, setRecentCommunities] = useState([])

  const [topCommunities, setTopCommunities] = useState([])
  const fetchTopCommunities = async () => {
    try {
      const communities = await getAllCommunities(6, 0, 'top')
      if (communities.communities.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
      notifyError("Couldn't fetch top communities")
    }
  }

  const fetchTopNotJoinedCommunities = async () => {
    try {
      const communities = await getNotJoinedCommunities(6, 0, 'top')
      if (communities.communities.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
      notifyError("Couldn't fetch top communities")
    }
  }

  useEffect(() => {
    if (!user) {
      setRecentCommunities([])
      fetchTopCommunities()
      return
    } else {
      fetchTopNotJoinedCommunities()
      const recentCommunities = JSON.parse(
        window.localStorage.getItem('recentCommunities')
      )
      setRecentCommunities(recentCommunities)
    }
  }, [user])

  return (
    <>
      <NextSeo
        title="DiverseHQ / Search"
        description="Search and connect with communities that reflect your interests and values on DiverseHQ!"
        openGraph={{
          url: 'https://diversehq.xyz/search'
        }}
      />
      {isMobile && (
        <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] bg-s-bg">
          <div className="h-[32px] flex flex-row items-center gap-3 text-[18px] w-full">
            <span className="font-bold text-[20px] w-full">
              <SearchModal />
            </span>
          </div>
        </div>
      )}
      <div className="w-screen flex flex-col px-4 mt-6 gap-4">
        {/* <SearchModal /> */}
        {recentCommunities.length > 0 && (
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-[18px] font-medium mb-3">Recent Communities</h3>
            {recentCommunities.map((community, i) => {
              return (
                <RightSideCommunityComponent key={i} community={community} />
              )
            })}
          </div>
        )}

        {topCommunities.length > 0 && (
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-[18px] font-medium">Top Communities</h3>
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
