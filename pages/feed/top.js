import { NextSeo } from 'next-seo'
import React from 'react'
import CreatePostBar from '../../components/Home/CreatePostBar'
import useDevice from '../../components/Common/useDevice'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import PostsColumn from '../../components/Post/PostsColumn'

const top = () => {
  const { isDesktop } = useDevice()
  return (
    <>
      <NextSeo
        title="Lens Feed / DiverseHQ"
        description="Find the best and most popular content from diverse communities all in one place on DiverseHQ's top posts faeed."
        openGraph={{
          url: 'https://app.diversehq.xyz/feed/top'
        }}
      />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isDesktop && <CreatePostBar />}
          {isDesktop && <NavFilterAllPosts />}
          <PostsColumn source="all" sortBy="top" data={null} />
        </div>
      </div>
    </>
  )
}

export default top
