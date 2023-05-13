import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useLensUserContext } from '../../lib/LensUserContext'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  LENS_INFINITE_SCROLL_THRESHOLD,
  LENS_POST_LIMIT
} from '../../utils/config'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import MobileLoader from '../Common/UI/MobileLoader'
import LensPostCard from './LensPostCard'
import { getJoinedLensPublication } from '../../apiHelper/lensPublication'
import { useProfile } from '../Common/WalletContext'
import usePublicationWithCommunityInfo from '../Community/hook/usePublicationWithCommunityInfo'
import { usePublicationStore } from '../../store/publication'
import { useProfileStore } from '../../store/profile'
import { useDevice } from '../Common/DeviceWrapper'

const LensPostJoinedCommunitiesPublicationsFromDB = () => {
  const router = useRouter()
  const { data: myLensProfile } = useLensUserContext()
  const [hasMore, setHasMore] = useState(true)
  const [publications, setPublications] = useState([])
  const { isMobile } = useDevice()
  const { loading: routeLoading } = useRouterLoading()
  const [publicationIds, setPublicationIds] = useState<string[]>([])
  const { joinedLensCommunities } = useProfile()
  const addPublications = usePublicationStore((state) => state.addPublications)
  const addProfiles = useProfileStore((state) => state.addProfiles)

  const { publications: rawPublications } = usePublicationWithCommunityInfo({
    request: {
      publicationIds: publicationIds
    },
    profileId: myLensProfile?.defaultProfile?.id,
    reactionRequest: {
      profileId: myLensProfile?.defaultProfile?.id
    },
    enabled:
      !!publicationIds.length && !!myLensProfile?.defaultProfile?.id && hasMore
  })

  React.useEffect(() => {
    if (!rawPublications) return
    setPublications((prev) => [...prev, ...rawPublications])

    let newProfiles = new Map()
    let newPublications = new Map()

    for (const newPost of rawPublications) {
      newProfiles.set(newPost.profile.handle, newPost.profile)
      newPublications.set(newPost.id, newPost)
    }

    addProfiles(newProfiles)
    addPublications(newPublications)
  }, [rawPublications])

  const fetchMoreLensPosts = async () => {
    try {
      if (!hasMore) return
      const newPublicationIds = await getJoinedLensPublication(
        LENS_POST_LIMIT,
        publications.length,
        joinedLensCommunities.map((c) => c._id)
      ).then((res) => res.json())
      setPublicationIds(newPublicationIds.map((p) => p.publicationId))

      if (newPublicationIds.length < LENS_POST_LIMIT) {
        setHasMore(false)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(() => {
    if (router.pathname === '/feed/foryou') {
      fetchMoreLensPosts()
    }
  }, [])

  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        scrollThreshold={LENS_INFINITE_SCROLL_THRESHOLD}
        dataLength={publications.length}
        next={fetchMoreLensPosts}
        hasMore={hasMore && !routeLoading && router.pathname === '/feed/foryou'}
        loader={
          isMobile ? (
            <MobileLoader />
          ) : (
            <>
              <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-s-bg dark:bg-s-bg my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4 animate-pulse">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full " />
                  <div className="h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:py-2 py-1 pr-4 my-1 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-xl bg-gray-300 dark:bg-p-bg h-[20px] sm:h-[20px]" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:pb-2 pr-4 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
                </div>
              </div>
            </>
          )
        }
        endMessage={<></>}
      >
        {publications.map((post, index) => {
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostJoinedCommunitiesPublicationsFromDB
