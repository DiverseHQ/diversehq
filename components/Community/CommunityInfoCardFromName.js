import React from 'react'
import { useEffect } from 'react'
import { memo } from 'react'
import { useState } from 'react'
import { getCommunityInfo } from '../../api/community'
import CommunityInfoCard from './CommunityInfoCard'

const CommunityInfoCardFromName = ({ name, setCommunityInfo }) => {
  const [community, setCommunity] = useState(null)

  useEffect(() => {
    if (!community && name) {
      fetchCommunityInformation()
    }
  }, [name])

  const fetchCommunityInformation = async () => {
    try {
      const community = await getCommunityInfo(name)
      console.log('fetchCommunityInformation', community)
      if (community) {
        setCommunityInfo(community)
      }
      setCommunity(community)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      {community && (
        <CommunityInfoCard
          community={community}
          setCommunity={setCommunity}
          fetchCommunityInformation={fetchCommunityInformation}
        />
      )}
    </>
  )
}

export default memo(CommunityInfoCardFromName)
