import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { getAllCommunities, getNotJoinedCommunities } from '../../api/community'
import { useNotify } from '../../components/Common/NotifyContext'
import useDevice from '../../components/Common/useDevice'
import { useProfile } from '../../components/Common/WalletContext'
import RightSideCommunityComponent from '../../components/Home/RightSideCommunityComponent'
import SearchModal from '../../components/Search/SearchModal'
import { appLink } from '../../utils/config'

const index = () => {
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
          url: `${appLink}/search`
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isMobile && (
            <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] bg-s-bg">
              <div className="h-[32px] flex flex-row items-center gap-3 text-[18px] w-full">
                <span className="font-bold text-[20px] w-full">
                  <SearchModal />
                </span>
              </div>
            </div>
          )}
          <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden my-4">
            {recentCommunities.length > 0 && (
              <div className="flex flex-col gap-2 md:gap-3 my-2">
                <h3 className="text-[18px] font-medium mx-4">
                  Recent Communities
                </h3>
                {recentCommunities.map((community, i) => {
                  return (
                    <RightSideCommunityComponent
                      key={i}
                      community={community}
                    />
                  )
                })}
              </div>
            )}

            {topCommunities.length > 0 && (
              <div className="flex flex-col gap-2 md:gap-3 my-2">
                <h3 className="text-[18px] font-medium mx-4">
                  Top Communities
                </h3>
                {topCommunities.map((community, i) => {
                  return (
                    <RightSideCommunityComponent
                      key={i}
                      community={community}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default index
