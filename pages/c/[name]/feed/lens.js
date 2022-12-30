import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import CommunityInfoCardFromName from '../../../../components/Community/CommunityInfoCardFromName'
import LensPostsCommunityPublicationsColumn from '../../../../components/Post/LensPostsCommunityPublicationsColumn'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'

const lens = () => {
  const { name } = useRouter().query
  const [communityId, setCommunityId] = useState(null)
  return (
    <div className="pt-6">
      <div className="relative">
        {name && (
          <>
            <CommunityInfoCardFromName
              name={name}
              setCommunityId={setCommunityId}
            />
            <NavFilterCommunity name={name} />
            {communityId && (
              <LensPostsCommunityPublicationsColumn communityId={communityId} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default lens
