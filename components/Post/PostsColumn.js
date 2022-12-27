import React from 'react'
import PostCard from './PostCard'
import InfiniteScroll from 'react-infinite-scroll-component'

const PostsColumn = ({ posts, getMorePost, hasMore, setPosts }) => {
  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePost}
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
