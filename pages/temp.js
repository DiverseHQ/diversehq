import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
export default function index (props) {
  const [posts, setPosts] = useState(props.data)
  const [hasMore, setHasMore] = useState(true)

  const getMorePost = async () => {
    const res = await fetch(
          `https://jsonplaceholder.typicode.com/todos?_start=${posts.length}&_limit=10`
    )
    const newPosts = await res.json()
    setPosts([...posts, ...newPosts])
  }
  return (
    <>
     <InfiniteScroll
        dataLength={posts.length}
        next={getMorePost}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {posts.map((data) => (
          <div key={data.id}>
              <strong> {data.id}</strong> {data.title}
            {data.completed}
          </div>
        ))}
      </InfiniteScroll>
      </>
  )
}

// export default temp

export const getStaticProps = async () => {
  const data = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=10'
  ).then((response) => response.json())
  return {
    props: { data }
  }
}
