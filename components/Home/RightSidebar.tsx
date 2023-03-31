import React, { useEffect, useState } from 'react'
import {
  getAllCommunities,
  getCreatedCommunitiesApi,
  getNotJoinedCommunities
} from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import { HiOutlineSparkles } from 'react-icons/hi'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import useHideSidebar from './hook/useHideSidebar'
import CopyrightAndLinks from '../Common/UI/CopyrightAndLinks'
import CommunitiesDiv from '../Common/UI/CommunitiesDiv'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'
import formatHandle from '../User/lib/formatHandle'

const RightSidebar = () => {
  const hide = useHideSidebar()
  const { user, LensCommunity } = useProfile()
  const { data: lensProfile } = useLensUserContext()
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
      console.log('fetching top communities')
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
      if (communities?.communities?.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
      notifyError("Couldn't fetch top communities")
    }
  }

  useEffect(() => {
    if (!user) {
      fetchTopCommunities()
      return
    }
    fetchAndSetCreatedCommunities()
    fetchTopNotJoinedCommunities()
  }, [user])

  useEffect(() => {
    if (topCommunities.length > 0) return
    if (!user) {
      fetchTopCommunities()
    }
  }, [])

  return (
    <div
      className={`relative ${
        hide ? 'hidden' : 'lg:flex flex-col'
      } w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-4 pr-4 md:pr-6 lg:pr-10 xl:pr-12 pl-2 md:pl-2 lg:pl-4 xl:pl-6 overflow-scroll no-scrollbar`}
    >
      {user && createdCommunities?.length > 0 && (
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
      {topCommunities?.length > 0 && (
        <CommunitiesDiv
          text="Recommended Communities"
          communitiesList={topCommunities}
          Icon={() => <HiOutlineSparkles className="w-[20px] h-[20px]" />}
        />
      )}
      <CopyrightAndLinks />
    </div>
  )
}

export default RightSidebar
