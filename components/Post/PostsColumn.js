import React, { useState, useEffect } from 'react'
import PostCard from './PostCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getUserPosts } from '../../api/user'
import { POST_LIMIT } from '../../utils/config.ts'
import { isValidEthereumAddress } from '../../utils/helper.ts'
import { getPostOfCommunity } from '../../api/community'
import { getAllPosts } from '../../api/post'

/**
 * sources are user, community, all
 *
 * for user, data is useraddress
 * for community, data is communityName
 * for all, data is null
 */

const PostsColumn = ({ source, sortBy, data }) => {
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState([])

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
      console.log('fetchedPosts', fetchedPosts)
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
      console.log('fetchedPosts', fetchedPosts)
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
      const fetchedPosts = await getAllPosts(POST_LIMIT, posts.length, sortBy)
      console.log('fetchedPosts', fetchedPosts)
      if (fetchedPosts.posts.length < POST_LIMIT) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }

  const getMorePosts = async () => {
    console.log('source', source)
    if (source === 'user') {
      await handleGetMorePostsForUser()
    } else if (source === 'community') {
      await handleGetMorePostsForCommunity()
    } else if (source === 'all') {
      await handleGetMorePostsForAll()
    }
  }

  useEffect(() => {
    console.log('change data', data)
    setPosts([])
    setHasMore(true)
  }, [data])

  useEffect(() => {
    if (hasMore && posts.length === 0) {
      getMorePosts()
    }
  }, [data, hasMore, posts])

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={
          <>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4" />
                <div className="w-full rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
              </div>
            </div>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4 " />
                <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
              </div>
            </div>
          </>
        }
        endMessage={
          <div className="w-full flex flex-row items-center text-center justify-center py-4 text-s-text text-sm">
            --- You have reached the end ---
          </div>
        }
      >
        {posts.map((post) => {
          return (
            <div key={post._id}>
              <PostCard key={post._id} _post={post} setPosts={setPosts} />
            </div>
          )
        })}
      </InfiniteScroll>
    </>
  )
}

export default PostsColumn
