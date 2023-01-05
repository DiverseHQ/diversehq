import { useRouter } from 'next/router'
import React, { useState } from 'react'
import CommunityInfoCardFromName from '../../../../components/Community/CommunityInfoCardFromName'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'
import PostsColumn from '../../../../components/Post/PostsColumn'

const newPage = () => {
  const { name } = useRouter().query
  const [notFound, setNotFound] = useState(false)
  return (
    <div className="relative">
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
          <div className="w-full md:w-[650px] flex flex-row items-center text-center justify-center">
            Community not found
          </div>
        </div>
      )}
    </div>
  )
}

export default newPage
