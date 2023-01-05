import React from 'react'
import { useEffect } from 'react'
import { memo } from 'react'
import { useState } from 'react'
import { getCommunityInfo } from '../../api/community'
import CommunityInfoCard from './CommunityInfoCard'

const CommunityInfoCardFromName = ({ name, setCommunityInfo, setNotFound }) => {
  const [community, setCommunity] = useState(null)

  useEffect(() => {
    if (name) {
      fetchCommunityInformation()
    }
  }, [name])

  const fetchCommunityInformation = async () => {
    try {
      const res = await getCommunityInfo(name)
      console.log('fetchCommunityInformation', res)
      if (res.status !== 200) {
        if (setNotFound) {
          setNotFound(true)
        }
        return
      }
      const result = await res.json()
      console.log('fetchCommunityInformation', result)
      if (result && setCommunityInfo) {
        setCommunityInfo(result)
      }
      setCommunity(result)
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
      {!community && (
        <div className="w-full bg-gray-100 animate-pulse my-4 sm:my-6">
          <div className="w-full h-[100px] bg-gray-300" />
          <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
            <div className="w-32 h-4 bg-gray-300 rounded-full" />
            <div className="w-32 h-4 bg-gray-300 rounded-full" />
            <div className="w-20 h-4 bg-gray-300 rounded-full" />
          </div>
          <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
            <div className="w-20 h-4 bg-gray-300 rounded-full" />
            <div className="w-28 h-4 bg-gray-300 rounded-full" />
          </div>
        </div>
      )}
    </>
  )
}

export default memo(CommunityInfoCardFromName)
