import React from 'react'
import { useContext } from 'react'
import { createContext } from 'react'
import useSort from './Hook/useSort'
export const SortContext = createContext({})

const SortWrapper = ({ children }) => {
  const sortValues = useSort()
  return (
    <SortContext.Provider value={sortValues}>{children}</SortContext.Provider>
  )
}

export const useSortHook = () => useContext(SortContext)

export default SortWrapper
