import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import CommunityInfoCard from '../../../../components/Community/CommunityInfoCard'
import CommunityPageSeo from '../../../../components/Community/CommunityPageSeo'
import CommunityNotFound from '../../../../components/Community/Page/CommunityNotFound'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'
import PostsColumn from '../../../../components/Post/PostsColumn'

const top = ({ community }) => {
  return (
    <div className="relative">
      {community && <CommunityPageSeo community={community} />}
      {community && (
        <>
          <CommunityInfoCard _community={community} />
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <NavFilterCommunity name={community.name} />
              <PostsColumn
                source="community"
                sortBy="top"
                data={community.name}
              />
            </div>
          </div>
        </>
      )}
      {!community && <CommunityNotFound />}
    </div>
  )
}

export async function getServerSideProps({ params = {} }) {
  const { name } = params
  const fetchCommunityInfo = async (name) => {
    try {
      const res = await getCommunityInfo(name)
      if (res.status !== 200) {
        return null
      }
      const result = await res.json()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
  const community = await fetchCommunityInfo(name)
  return {
    props: {
      community
    }
  }
}

export default top
