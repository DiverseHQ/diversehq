import { create } from 'zustand'
import { sortTypes } from '../utils/config'

/* eslint-disable */

interface SortState {
  sortObject: {
    isTop: boolean
    sortType: string
    timestamp: number
  }
  setSortObject: (sortType: string | null) => void
}

export const useSortStore = create<SortState>((set) => ({
  sortObject: {
    isTop: false,
    sortType: sortTypes.LATEST,
    timestamp: Date.now() - 86400000
  },
  setSortObject: (sortType) => {
    set((state) => {
      if (sortType && sortType === state.sortObject.sortType) {
        // do nothing
        return { sortObject: state.sortObject }
      }
      if (sortType === sortTypes.LATEST || !sortType) {
        const sortObject = {
          timestamp: state.sortObject.timestamp,
          sortType: sortTypes.LATEST,
          isTop: false
        }
        return { sortObject }
      } else {
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
        } else if (sortType === sortTypes.TOP_YEAR) {
          // set timestamp to 365 days ago
          timestamp = Date.now() - 31536000000
        }
        if (
          state.sortObject.timestamp &&
          Math.abs(state.sortObject.timestamp - timestamp) < 300
        ) {
          timestamp = state.sortObject.timestamp
        }
        const sortObject = {
          sortType: sortType,
          timestamp: timestamp,
          isTop: true
        }
        return { sortObject }
      }
    })
  }
}))
