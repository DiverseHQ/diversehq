import React, { useEffect, useState } from 'react'
import {
  getAllCommunities,
  getCreatedCommunitiesApi,
  getNotJoinedCommunities
} from '../../../apiHelper/community'
// import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../../Common/WalletContext'
// import { HiOutlineSparkles } from 'react-icons/hi'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import useHideSidebar from '../hook/useHideSidebar'
import CopyrightAndLinks from '../../Common/UI/CopyrightAndLinks'
import CommunitiesDiv from '../../Common/UI/CommunitiesDiv'
import { useLensUserContext } from '../../../lib/LensUserContext'
import getAvatar from '../../User/lib/getAvatar'
import formatHandle from '../../User/lib/formatHandle'
import { useAccount } from 'wagmi'
import CommunityScroll from '../../Common/UI/CommunityScroll'
import getCoverBanner from '../../User/lib/getCoverBanner'
import TrendingTagsRightSidebarColumn from './TrendingTodayTagsRightSidebarColumn'
import TrendingThisWeekTagsRightSidebarColumn from './TrendingThisWeekTagsRightSidebarColumn'
import { BsChevronDown } from 'react-icons/bs'
import OptionsWrapper from '../../Common/OptionsWrapper'
import MoreOptionsModal from '../../Common/UI/MoreOptionsModal'
import GetItOnGooglePlay from './GetItOnGooglePlay'

const RightSidebar = () => {
  const hide = useHideSidebar()
  const { user, LensCommunity, allLensCommunities, loading } = useProfile()
  const { data: lensProfile, isLoading } = useLensUserContext()
  const { address } = useAccount()

  const [isTodayTrending, setIsTodayTrending] = useState<boolean>(true)
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  // const { notifyError } = useNotify()

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
    }
  }

  const fetchTopCommunities = async () => {
    try {
      const communities = await getAllCommunities(12, 0, 'top', true)

      if (communities?.communities?.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTopNotJoinedCommunities = async () => {
    try {
      const communities = await getNotJoinedCommunities(12, 0, 'top', true)
      if (communities?.communities?.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (loading || (isLoading && address)) return
    if (!user) {
      fetchTopCommunities()
      return
    }
    fetchAndSetCreatedCommunities()
    fetchTopNotJoinedCommunities()
  }, [user, loading, isLoading, address])

  useEffect(() => {
    if (topCommunities.length > 0) return
    if (!user) {
      fetchTopCommunities()
    }
  }, [])

  // sort alllenscommunities by followers
  const sortedLensCommunities = allLensCommunities
    ?.sort((a, b) => b.stats.totalFollowers - a.stats.totalFollowers)
    ?.filter((c) => !c.isFollowedByMe && c.verified)
    .slice(0, 6)

  return (
    <div
      className={`relative ${
        hide ? 'hidden' : 'lg:flex flex-col'
      } w-[150px] sm:w-[300px] py-4 pr-4 overflow-scroll no-scrollbar`}
    >
      <GetItOnGooglePlay />
      {user && (createdCommunities?.length > 0 || LensCommunity) && (
        <CommunitiesDiv
          showFirstCommunities={
            LensCommunity
              ? [
                  {
                    name: formatHandle(lensProfile?.defaultProfile?.handle),
                    // @ts-ignore
                    logoImageUrl: getAvatar(lensProfile?.defaultProfile),
                    isLensCommunity: true
                  }
                ]
              : []
          }
          text={`Created ${
            createdCommunities.length > 1 ? 'Communities' : 'Community'
          }`}
          communitiesList={createdCommunities}
          Icon={() => <AiOutlineUsergroupAdd className="w-[20px] h-[20px]" />}
        />
      )}
      {/* show in card form */}
      {/* {topCommunities?.length > 0 && (
        <CommunitiesDiv
          showFirstCommunities={
            sortedLensCommunities.length > 0
              ? sortedLensCommunities.map((c) => ({
                  name: formatHandle(c.handle),
                  // @ts-ignore
                  logoImageUrl: getAvatar(c),
                  isLensCommunity: true
                }))
              : []
          }
          text="Recommended Communities"
          communitiesList={topCommunities}
          Icon={() => <HiOutlineSparkles className="w-[20px] h-[20px]" />}
        />
      )} */}
      <CommunityScroll
        communities={
          sortedLensCommunities.length > 0
            ? [
                ...sortedLensCommunities.map((c) => ({
                  name: formatHandle(c.handle),
                  // @ts-ignore
                  logoImageUrl: getAvatar(c),
                  // @ts-ignore
                  bannerImageUrl: getCoverBanner(c),
                  isLensCommunity: true
                })),
                ...topCommunities
              ]
            : topCommunities
        }
      />
      <div className="text-p-text bg-s-bg rounded-xl mb-4 py-2">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl px-4">
            {isTodayTrending ? 'Trending Today' : 'Trending This Week'}
          </div>
          <OptionsWrapper
            OptionPopUpModal={() => (
              <MoreOptionsModal
                className="z-50"
                list={[
                  {
                    label: 'Trending Today',
                    onClick: () => {
                      setIsTodayTrending(true)
                      setShowOptionsModal(false)
                      setIsDrawerOpen(false)
                    }
                  },
                  {
                    label: 'Trending This Week',
                    onClick: () => {
                      setIsTodayTrending(false)
                      setShowOptionsModal(false)
                      setIsDrawerOpen(false)
                    }
                  }
                ]}
              />
            )}
            position="bottom"
            setShowOptionsModal={setShowOptionsModal}
            showOptionsModal={showOptionsModal}
            setIsDrawerOpen={setIsDrawerOpen}
            isDrawerOpen={isDrawerOpen}
          >
            <div className="p-2 rounded-full hover:bg-s-hover mr-2">
              <BsChevronDown className="w-5 h-5 " />
            </div>
          </OptionsWrapper>
        </div>
        {isTodayTrending ? (
          <TrendingTagsRightSidebarColumn />
        ) : (
          <TrendingThisWeekTagsRightSidebarColumn />
        )}
      </div>
      <CopyrightAndLinks />
    </div>
  )
}

export default RightSidebar
