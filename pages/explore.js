import React, { useEffect, useState } from 'react'
import CommunitiesColumn from '../components/Explore/CommunitiesColumn'
import apiEndpoint from '../components/Home/ApiEndpoint'

const explore = () => {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedSortBy, setSelectedSortBy] = useState('new')

  const resetVariables = () => {
    setCommunities([])
    setLoading(true)
    setPage(0)
    setTotalPages(0)
  }

  const fetchCommunities = async (sortBy) => {
    if(sortBy !== selectedSortBy) {
        resetVariables();
        setSelectedSortBy(sortBy);
    }
    try {
      if (page > totalPages) return
      const params = {
        page: page,
        sortBy: sortBy,
        PerPage: 10
      }
      const res = await fetch(`${apiEndpoint}/community/getAllCommunities?` + new URLSearchParams(params))
      console.log(res);
      if (res.status === 200) {
        const jsonResp = await res.json()
        console.log(jsonResp);
        setCommunities([...communities, ...jsonResp.communities])
        setTotalPages(jsonResp.pages)
        setPage(page + 1)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // resetVariables()
    fetchCommunities(selectedSortBy)
  }, [selectedSortBy])
  return (
    <div>
        <button onClick={() => { fetchCommunities('new') }}>New</button> <button onClick={() => { fetchCommunities('top') }}>Top</button>
        <CommunitiesColumn communities={communities} loading={loading} />
    </div>
  )
}

export default explore
