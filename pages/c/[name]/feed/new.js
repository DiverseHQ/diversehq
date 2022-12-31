import { useRouter } from 'next/router'
import React from 'react'
import CommunityInfoCardFromName from '../../../../components/Community/CommunityInfoCardFromName'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'
import PostsColumn from '../../../../components/Post/PostsColumn'

const newPage = () => {
  const { name } = useRouter().query

  return (
    <div className="pt-6">
      <div className="relative">
        {name && (
          <>
            <CommunityInfoCardFromName name={name} />
            <div className="w-full flex justify-center">
              <div className="max-w-[650px] shrink-0">
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

export default newPage
