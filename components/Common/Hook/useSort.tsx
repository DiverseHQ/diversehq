import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { sortTypes } from '../../../utils/config'

let timestamp = Date.now() - 86400000

function getTopSortAndTimestamp(sortType: string | string[]) {
  if (!sortType) {
    return {
      isTop: false,
      sortType: sortTypes.LATEST,
      timestamp: timestamp
    }
  }
  if (sortType) {
    // @ts-ignore
    if (sortType !== sortTypes.LATEST) {
      let newTimestamp = Date.now() - 86400000
      if (sortType === sortTypes.TOP_TODAY) {
        // set timestamp to 24 hours ago
        newTimestamp = Date.now() - 86400000
      } else if (sortType === sortTypes.TOP_WEEK) {
        // set newTimestamp to 7 days ago
        newTimestamp = Date.now() - 604800000
      } else if (sortType === sortTypes.TOP_MONTH) {
        // set newTimestamp to 30 days ago
        newTimestamp = Date.now() - 2592000000
      } else if (sortType === sortTypes.TOP_YEAR) {
        // set newTimestamp to 365 days ago
        newTimestamp = Date.now() - 31536000000
      }
      if (Math.abs(newTimestamp - timestamp) > 1000) {
        timestamp = newTimestamp
      }
      return { isTop: true, sortType: sortType, timestamp }
    } else {
      return {
        isTop: false,
        sortType: sortTypes.LATEST,
        timestamp: timestamp
      }
    }
  }
}
const useSort = () => {
  const { query } = useRouter()
  const initialState = getTopSortAndTimestamp(query?.sort)
  const [state, setState] = useState(initialState)
  useEffect(() => {
    if (query?.sort === state.sortType) return
    const { isTop, sortType, timestamp } = getTopSortAndTimestamp(query?.sort)
    setState({ isTop, sortType, timestamp })
    // @ts-ignore
  }, [query?.sort])

  return state
}

export default useSort
