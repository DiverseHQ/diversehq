import { useRouter } from 'next/router'
import { memo, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../apiHelper/community'
import { useProfileFeedQuery } from '../../graphql/generated'
import { useProfileStore } from '../../store/profile'
import { usePublicationStore } from '../../store/publication'
import { LENS_POST_LIMIT } from '../../utils/config'
import { useDevice } from '../Common/DeviceWrapper'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import MobileLoader from '../Common/UI/MobileLoader'
import { usePostIndexing } from './IndexingContext/PostIndexingWrapper'
import IndexingPostCard from './IndexingPostCard'
import LensPostCard from './LensPostCard'

const LensPostsProfileFeedColumn = ({ profileId }: { profileId: string }) => {
  const router = useRouter()
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    cursor: null,
    nextCursor: null,
    posts: []
  })
  const { isMobile } = useDevice()
  const { loading: routeLoading } = useRouterLoading()
  const addPublications = usePublicationStore((state) => state.addPublications)
  const addProfiles = useProfileStore((state) => state.addProfiles)
  const { posts: indexingPost } = usePostIndexing()

  const { data: profileFeed } = useProfileFeedQuery(
    {
      request: {
        cursor: exploreQueryRequestParams.cursor,
        profileId: profileId,
        limit: LENS_POST_LIMIT
      },
      reactionRequest: {
        profileId: profileId
      },
      profileId: profileId
    },
    {
      enabled: router.pathname === '/' && !routeLoading && !!profileId
    }
  )

  // useEffect(() => {
  //   console.log('profileFeed', profileFeed)
  // }, [profileFeed])

  // useEffect(() => {
  //   console.log('exploreQueryRequestParams', exploreQueryRequestParams)
  // }, [exploreQueryRequestParams])

  const hanldeProfileFeed = async () => {
    let nextCursor = null
    if (profileFeed?.feed?.pageInfo?.next) {
      nextCursor = profileFeed?.feed.pageInfo.next
    }
    const newPosts = profileFeed?.feed.items.map((item) => {
      if (item.root.__typename === 'Comment') {
        return {
          post: item.root,
          feedItem: item
        }
      }
      return { post: item.root, feedItem: item }
    })
    // if (newPosts.length < LENS_POST_LIMIT) {
    //   hasMore = false
    // }
    const communityIds = newPosts.map((post) => {
      // @ts-ignore
      if (post?.post?.metadata?.tags?.[0]) {
        // @ts-ignore
        return post?.post.metadata.tags[0]
      }
      // if (post?.__typename === '') {
      //   console.log(
      //     'postMirrorOf',
      //     post.mirrorOf?.__typename === 'Post'
      //       ? post.mirrorOf?.metadata?.tags[0]
      //       : null
      //   )

      //   if (post.mirrorOf.__typename === 'Comment') {
      //     console.log('postMirrorOf Comment', post.mirrorOf)
      //   }
      //   // @ts-ignore
      //   return post.mirrorOf?.metadata?.tags[0] || 'null'
      // }
      return 'null'
    })
    let communityInfoForPosts = []
    try {
      communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
        communityIds
      )
    } catch (error) {
      console.log('error lenspostsprofilefeedcolumn', error)
    }
    for (let i = 0; i < newPosts.length; i++) {
      if (communityInfoForPosts[i]?._id) {
        // @ts-ignore
        newPosts[i].post.communityInfo = communityInfoForPosts[i]
        if (communityInfoForPosts[i]?.handle) {
          // @ts-ignore
          newPosts[i].post.isLensCommunityPost = true
        }
      }
    }
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      nextCursor: nextCursor,
      posts: [...exploreQueryRequestParams.posts, ...newPosts]
    })

    // addProfiles & addPublications to store
    // profile to be added is a set of handle as key and profile as value
    // publication to be added is a set of id as key and publication as value

    let newProfiles = new Map()
    let newPublications = new Map()

    for (const newPost of newPosts) {
      newProfiles.set(newPost.post.profile.handle, newPost.post.profile)
      newPublications.set(newPost.post.id, newPost.post)
    }

    addProfiles(newProfiles)
    addPublications(newPublications)
  }

  useEffect(() => {
    if (!profileFeed?.feed?.items) return
    hanldeProfileFeed()
  }, [profileFeed?.feed?.pageInfo?.next])

  const getMorePosts = async () => {
    if (exploreQueryRequestParams.posts.length === 0) return
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      cursor: exploreQueryRequestParams.nextCursor
    })
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        dataLength={exploreQueryRequestParams?.posts?.length || 0}
        next={getMorePosts}
        hasMore={!routeLoading && router.pathname === '/'}
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
        {exploreQueryRequestParams.posts.length === 0 && (
          <>
            {isMobile ? (
              <MobileLoader />
            ) : (
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
            )}
          </>
        )}
        {indexingPost &&
          indexingPost.map((post, index) => {
            return <IndexingPostCard key={index} postInfo={post} />
          })}
        {exploreQueryRequestParams.posts.map((post, index) => {
          return (
            <LensPostCard
              key={index}
              post={post.post}
              feedItem={post.feedItem}
            />
          )
        })}
      </InfiniteScroll>
    </div>
  )
}

export default memo(LensPostsProfileFeedColumn)
