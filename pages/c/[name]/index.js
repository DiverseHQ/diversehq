import React from 'react'
import { useRouter } from 'next/router'
import PostsColumn from '../../../components/Post/PostsColumn'
import NavFilterCommunity from '../../../components/Post/NavFilterCommunity'
import CommunityInfoCardFromName from '../../../components/Community/CommunityInfoCardFromName'
import { useEffect } from 'react'
import { useState } from 'react'

const CommunityPage = () => {
  const { name } = useRouter().query
  const [communityName, setCommunityName] = useState(name)
  useEffect(() => {
    console.log('name', name)
    setCommunityName(name)
  }, [name])
  return (
    <div className="">
      <div className="relative">
        {communityName && (
          <>
            <CommunityInfoCardFromName name={communityName} />
            <div className="w-full flex justify-center">
              <div className="w-full md:w-[650px]">
                <NavFilterCommunity name={communityName} />
                <PostsColumn
                  source="community"
                  sortBy="new"
                  data={communityName}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CommunityPage
