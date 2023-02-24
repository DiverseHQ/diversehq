import { useRouter } from 'next/router'
import { useEffect, useReducer } from 'react'
import { sortTypes } from '../../../utils/config'
import useRouterLoading from './useRouterLoading'

function reducer(state, action) {
  // update state based on action values
  return { ...state, ...action }
}

let timestamp = Date.now() - 86400000

function getTopSortAndTimestamp(sortType) {
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
      }
      if (Math.abs(newTimestamp - timestamp) < 1000) {
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
  const { loading } = useRouterLoading()
  const initialState = getTopSortAndTimestamp(query?.sort)
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    if (loading) return
    if (query?.sort === state.sortType) return
    dispatch(getTopSortAndTimestamp(query?.sort))
    // @ts-ignore
  }, [query?.sort])
  return { ...state }
}

export default useSort
