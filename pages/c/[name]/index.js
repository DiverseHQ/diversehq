import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PostsColumn from '../../../components/Post/PostsColumn'
import NavFilterCommunity from '../../../components/Post/NavFilterCommunity'
import CommunityInfoCardFromName from '../../../components/Community/CommunityInfoCardFromName'

const CommunityPage = () => {
  const [notFound, setNotFound] = useState(false)
  const { name } = useRouter().query
  return (
    <div className="relative pt-6">
      {name && !notFound && (
        <>
          <CommunityInfoCardFromName name={name} setNotFound={setNotFound} />
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <NavFilterCommunity name={name} />
              <PostsColumn source="community" sortBy="new" data={name} />
            </div>
          </div>
        </>
      )}
      {notFound && (
        // not found page
        <div className="w-full flex justify-center my-20">
          <div className="text-s-text w-full md:w-[650px] flex flex-row items-center text-center justify-center">
            Community not found
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityPage
