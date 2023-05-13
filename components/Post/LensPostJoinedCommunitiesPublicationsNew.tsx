import { useRouter } from 'next/router'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../apiHelper/community'
import {
  ExplorePublicationsQuery,
  PublicationSortCriteria,
  PublicationTypes
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import getExplorePublications from '../../lib/post/explore-publications'
import { LENS_INFINITE_SCROLL_THRESHOLD } from '../../utils/config'
// import { getCommunityInfoFromAppId } from '../../utils/helper'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import MobileLoader from '../Common/UI/MobileLoader'
import LensPostCard from './LensPostCard'
import { useDevice } from '../Common/DeviceWrapper'

const LensPostJoinedCommunitiesPublicationsNew = ({
  communityIds
}: {
  communityIds: string[]
}) => {
  const router = useRouter()
  const { data: myLensProfile } = useLensUserContext()
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    cursors: [],
    hasMore: true,
    posts: []
  })
  const { loading: routeLoading } = useRouterLoading()
  const { isMobile } = useDevice()
  const [loading, setLoading] = useState(false)
  const [fetchMore, setFetchMore] = useState(false)

  React.useEffect(() => {
    if (!loading && fetchMore) {
      getMorePosts()
    }
  }, [loading, fetchMore])

  const getMorePosts = async () => {
    setLoading(true)
    setFetchMore(false)
    // make list of list of community ids of lenght 4
    const grounpOfBunchOfCommunityIds = []
    let bunchOfCommunityIds = []
    for (const communityId of communityIds.slice(0, 15)) {
      bunchOfCommunityIds.push(communityId)
      if (bunchOfCommunityIds.length === 3) {
        grounpOfBunchOfCommunityIds.push(bunchOfCommunityIds)
        bunchOfCommunityIds = []
      }
    }
    if (bunchOfCommunityIds.length > 0) {
      grounpOfBunchOfCommunityIds.push(bunchOfCommunityIds)
    }

    console.log('grounpOfBunchOfCommunityIds', grounpOfBunchOfCommunityIds)

    // if next  cursors in not empty fetch more posts from that lists
    let nextCursors = exploreQueryRequestParams.cursors
    let startedWithPosts = exploreQueryRequestParams.posts

    const promiseList = []

    for (let i = 0; i < grounpOfBunchOfCommunityIds.length; i++) {
      promiseList.push(
        getExplorePublications({
          request: {
            metadata: {
              tags: {
                oneOf: grounpOfBunchOfCommunityIds[i]
              }
            },
            cursor: exploreQueryRequestParams?.cursors[i] ?? null,
            publicationTypes: [PublicationTypes.Post],
            limit: 5,
            sortCriteria: PublicationSortCriteria.Latest,
            noRandomize: false
          },
          profileId: myLensProfile?.defaultProfile?.id,
          reactionRequest: {
            profileId: myLensProfile?.defaultProfile?.id
          }
        })
      )
    }

    console.log('promiseList', promiseList)

    const data: ExplorePublicationsQuery[] = await Promise.all(promiseList)

    console.log('data', data)

    for (let i = 0; i < data.length; i++) {
      if (!data[i]) {
        continue
      }

      const _newPosts = data[i].explorePublications.items
      // @ts-ignore
      const communityIds = _newPosts.map((post) => post.metadata.tags[0])
      const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
        communityIds
      )

      for (let j = 0; j < _newPosts.length; j++) {
        if (communityInfoForPosts[j]?._id) {
          // if (!communityInfoForPosts[j]?._id) {
          //   // @ts-ignore
          //   _newPosts[j].communityInfo = getCommunityInfoFromAppId(
          //     _newPosts[j].appId
          //   )
          // } else {
          // @ts-ignore
          _newPosts[j].communityInfo = communityInfoForPosts[j]
          if (communityInfoForPosts[j]?.handle) {
            // @ts-ignore
            _newPosts[j].isLensCommunityPost = true
          }
        }
      }

      startedWithPosts = [...startedWithPosts, ..._newPosts]
      nextCursors[i] = data[i]?.explorePublications?.pageInfo?.next
    }

    // console.log('startedWithPosts', startedWithPosts)

    // for (let i = 0; i < grounpOfBunchOfCommunityIds.length; i++) {
    //   console.log('i', i)
    //   const data = await getExplorePublications({
    //     request: {
    //       metadata: {
    //         locale: 'en-US',
    //         tags: {
    //           oneOf: grounpOfBunchOfCommunityIds[i]
    //         }
    //       },
    //       cursor: exploreQueryRequestParams?.cursors[i] ?? null,
    //       publicationTypes: [PublicationTypes.Post],
    //       limit: 5,
    //       sortCriteria: PublicationSortCriteria.Latest,
    //       noRandomize: false
    //     },
    //     profileId: myLensProfile?.defaultProfile?.id,
    //     reactionRequest: {
    //       profileId: myLensProfile?.defaultProfile?.id
    //     }
    //   })

    //   console.log('data', data)

    //   if (!data) {
    //     continue
    //   }

    //   const _newPosts = data.explorePublications.items
    //   // @ts-ignore
    //   const communityIds = _newPosts.map((post) => post.metadata.tags[0])
    //   const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
    //     communityIds
    //   )

    //   for (let i = 0; i < _newPosts.length; i++) {
    //     if (!communityInfoForPosts[i]?._id) {
    //       // @ts-ignore
    //       _newPosts[i].communityInfo = getCommunityInfoFromAppId(
    //         _newPosts[i].appId
    //       )
    //     } else {
    //       // @ts-ignore
    //       _newPosts[i].communityInfo = communityInfoForPosts[i]
    //       if (communityInfoForPosts[i]?.handle) {
    //         // @ts-ignore
    //         _newPosts[i].isLensCommunityPost = true
    //       }
    //     }
    //   }

    //   console.log('_newPosts', _newPosts)
    //   console.log('exploreQueryRequestParams', exploreQueryRequestParams.posts)

    //   startedWithPosts = [...startedWithPosts, ..._newPosts]
    //   // setExploreQueryRequestParams({
    //   //   ...exploreQueryRequestParams,
    //   //   posts: startedWithPosts
    //   // })

    //   if (nextCursors.length === 0) {
    //     nextCursors.push(data?.explorePublications?.pageInfo?.next)
    //   } else {
    //     nextCursors[i] = data?.explorePublications?.pageInfo?.next
    //   }
    // }

    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      posts: startedWithPosts,
      cursors: nextCursors,
      hasMore: nextCursors.filter((c) => c).length > 0
    })
    setLoading(false)
  }

  React.useEffect(() => {
    if (exploreQueryRequestParams?.posts.length === 0) {
      getMorePosts()
    }
  }, [communityIds])

  const fetchMoreLensPosts = () => {
    setFetchMore(true)
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        scrollThreshold={LENS_INFINITE_SCROLL_THRESHOLD}
        dataLength={exploreQueryRequestParams.posts.length}
        next={fetchMoreLensPosts}
        hasMore={
          exploreQueryRequestParams.hasMore &&
          !routeLoading &&
          router.pathname === '/feed/foryou'
        }
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
        {exploreQueryRequestParams.posts.map((post, index) => {
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostJoinedCommunitiesPublicationsNew
