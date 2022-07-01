import React from 'react'
import CommunityCard from './CommunityCard'

const CommunitiesColumn = ({ communities, loading }) => {
    console.log("communities", communities);
  return (
    <div className='flex flex-col'>{communities && communities.map((community, index) => {
      return <CommunityCard key={index} community={community} />
    }) }</div>
  )
}

export default CommunitiesColumn
