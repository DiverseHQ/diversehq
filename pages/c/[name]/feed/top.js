import { useRouter } from 'next/router'
import React from 'react'
import CommunityInfoCardFromName from '../../../../components/Community/CommunityInfoCardFromName'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'
import PostsColumn from '../../../../components/Post/PostsColumn'

const top = () => {
  const { name } = useRouter().query

  return (
    <div className="pt-6">
      <div className="relative">
        {name && (
          <>
            <CommunityInfoCardFromName name={name} />
            <NavFilterCommunity name={name} />
            <PostsColumn source="community" sortBy="new" data={name} />
          </>
        )}
      </div>
    </div>
  )
}

export default top
