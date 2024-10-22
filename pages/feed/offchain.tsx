// import { NextSeo } from 'next-seo'
import React from 'react'
import CreatePostBar from '../../components/Home/CreatePostBar'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import PostsColumn from '../../components/Post/PostsColumn'
import { appLink } from '../../utils/config'
import { useDevice } from '../../components/Common/DeviceWrapper'
import MetaTags from '../../components/Common/Seo/MetaTags'

const newPage = () => {
  const { isDesktop } = useDevice()
  return (
    <>
      <MetaTags
        title="OffChain Feed / DiverseHQ"
        description="Stay up to date with the freshest perspectives and stories from diverse communities on DiverseHQ."
        url={`${appLink}/feed/new`}
      />
      {/* <NextSeo
        title="OffChain Feed / DiverseHQ"
        description="Stay up to date with the freshest perspectives and stories from diverse communities on DiverseHQ."
        openGraph={{
          url: `${appLink}/feed/new`
        }}
      /> */}
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {isDesktop && <CreatePostBar className="mt-4" />}
          <NavFilterAllPosts />
          <PostsColumn source="all" sortBy="new" data={null} />
        </div>
      </div>
    </>
  )
}

export default newPage
