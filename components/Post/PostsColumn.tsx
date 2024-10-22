import React, { useState, useEffect } from 'react'
import PostCard from './PostCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getUserPosts } from '../../apiHelper/user'
import { POST_LIMIT } from '../../utils/config'
import { isValidEthereumAddress } from '../../utils/helper'
import { getPostOfCommunity } from '../../apiHelper/community'
import { getAllPosts } from '../../apiHelper/post'
import { useRouter } from 'next/router'
import MobileLoader from '../Common/UI/MobileLoader'
import { useDevice } from '../Common/DeviceWrapper'

/**
 * sources are user, community, all
 *
 * for user, data is useraddress
 * for community, data is communityName
 * for all, data is null
 */

const PostsColumn = ({
  source,
  sortBy,
  data
}: {
  source: 'user' | 'community' | 'all'
  sortBy: 'new' | 'top'
  data: string
}) => {
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState([])
  const { isMobile } = useDevice()

  const handleGetMorePostsForUser = async () => {
    try {
      if (!hasMore) return
      if (!isValidEthereumAddress(data)) return
      const fetchedPosts = await getUserPosts(
        data.toLowerCase(),
        POST_LIMIT,
        posts.length,
        sortBy
      )
      if (fetchedPosts.posts.length < POST_LIMIT) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetMorePostsForCommunity = async () => {
    try {
      if (!hasMore) return
      const fetchedPosts = await getPostOfCommunity(
        data,
        POST_LIMIT,
        posts.length,
        sortBy
      )
      if (fetchedPosts.posts.length < POST_LIMIT) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetMorePostsForAll = async () => {
    try {
      if (!hasMore) return
      if (!router.pathname.startsWith('/feed/offchain')) return
      const fetchedPosts = await getAllPosts(POST_LIMIT, posts.length, sortBy)
      if (fetchedPosts.posts.length < POST_LIMIT) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }

  const getMorePosts = async () => {
    if (source === 'user') {
      await handleGetMorePostsForUser()
    } else if (source === 'community') {
      await handleGetMorePostsForCommunity()
    } else if (source === 'all') {
      await handleGetMorePostsForAll()
    }
  }

  useEffect(() => {
    setPosts([])
    setHasMore(true)
  }, [data])

  useEffect(() => {
    if (hasMore && posts.length === 0) {
      getMorePosts()
    }
  }, [data, source, sortBy, hasMore, posts])

  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
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
        {posts.map((post) => {
          return (
            <div key={post._id}>
              <PostCard key={post._id} _post={post} setPosts={setPosts} />
            </div>
          )
        })}
      </InfiniteScroll>
    </div>
  )
}

export default PostsColumn
