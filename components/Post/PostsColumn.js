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
    if (posts.length === 0) {
      getMorePosts()
    }
  }, [])
  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {posts.map((post) => {
          return (
            <div key={post._id}>
              <PostCard key={post._id} post={post} setPosts={setPosts} />
            </div>
          )
        })}
      </InfiniteScroll>
    </>
  )
}

export default PostsColumn
