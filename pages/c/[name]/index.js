import React from 'react'
import { useRouter } from 'next/router'
import PostsColumn from '../../../components/Post/PostsColumn'
import NavFilterCommunity from '../../../components/Post/NavFilterCommunity'
import CommunityInfoCardFromName from '../../../components/Community/CommunityInfoCardFromName'

const CommunityPage = () => {
  const { name } = useRouter().query
  return (
    <div className="">
      <div className="relative">
        {name && (
          <>
            <CommunityInfoCardFromName name={name} />
            <div className="w-full flex justify-center shrink-0">
              <div className="min-w-[650px] shrink-0">
                <NavFilterCommunity name={name} />
                <PostsColumn source="community" sortBy="new" data={name} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CommunityPage
