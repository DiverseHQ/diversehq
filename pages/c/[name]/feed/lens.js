import React from 'react'
import { getCommunityInfo } from '../../../../api/community'
import useDevice from '../../../../components/Common/useDevice'
import CommunityInfoCard from '../../../../components/Community/CommunityInfoCard'
import CommunityPageMobileTopNav from '../../../../components/Community/CommunityPageMobileTopNav'
import CommunityPageSeo from '../../../../components/Community/CommunityPageSeo'
import CommunityNotFound from '../../../../components/Community/Page/CommunityNotFound'
import LensPostsCommunityPublicationsColumn from '../../../../components/Post/LensPostsCommunityPublicationsColumn'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'

const lens = ({ community }) => {
  const { isMobile } = useDevice()

  return (
    <div className="relative">
      {isMobile && <CommunityPageMobileTopNav />}
      {community && <CommunityPageSeo community={community} />}
      {community && (
        <>
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <CommunityInfoCard _community={community} />
              <NavFilterCommunity name={community.name} />
              {community && (
                <LensPostsCommunityPublicationsColumn
                  communityInfo={community}
                />
              )}
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

export default lens
