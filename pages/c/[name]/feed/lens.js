import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import CommunityInfoCardFromName from '../../../../components/Community/CommunityInfoCardFromName'
import LensPostsCommunityPublicationsColumn from '../../../../components/Post/LensPostsCommunityPublicationsColumn'
import NavFilterCommunity from '../../../../components/Post/NavFilterCommunity'

const lens = () => {
  const { name } = useRouter().query
  const [communityInfo, setCommunityInfo] = useState(null)
  const [notFound, setNotFound] = useState(false)
  return (
    <div className="relative">
      {name && !notFound && (
        <>
          <CommunityInfoCardFromName
            name={name}
            setCommunityInfo={setCommunityInfo}
            setNotFound={setNotFound}
          />
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <NavFilterCommunity name={name} />
              {communityInfo && (
                <LensPostsCommunityPublicationsColumn
                  communityInfo={communityInfo}
                />
              )}
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

export default lens
