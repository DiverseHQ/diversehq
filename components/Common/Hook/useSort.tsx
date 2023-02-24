import { useRouter } from 'next/router'
import { useEffect, useReducer } from 'react'
import { sortTypes } from '../../../utils/config'
import useRouterLoading from './useRouterLoading'

function reducer(state, action) {
  // update state based on action values
  return { ...state, ...action }
}

function getTopSortAndTimestamp(sortType) {
  if (!sortType) {
    return {
      isTop: false,
      sortType: sortTypes.LATEST,
      timestamp: Date.now() - 86400000
    }
  }
  if (sortType) {
    // @ts-ignore
    if (sortType !== sortTypes.LATEST) {
      let timestamp = Date.now() - 86400000
      if (sortType === sortTypes.TOP_TODAY) {
        // set timestamp to 24 hours ago
        timestamp = Date.now() - 86400000
      } else if (sortType === sortTypes.TOP_WEEK) {
        // set timestamp to 7 days ago
        timestamp = Date.now() - 604800000
      } else if (sortType === sortTypes.TOP_MONTH) {
        // set timestamp to 30 days ago
        timestamp = Date.now() - 2592000000
      }
      return { isTop: true, sortType: sortType, timestamp }
    } else {
      return {
        isTop: false,
        sortType: sortTypes.LATEST,
        timestamp: Date.now() - 86400000
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
