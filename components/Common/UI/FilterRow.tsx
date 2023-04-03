import React from 'react'

interface Props {
  classname?: string
  children: React.ReactNode
  EndButton?: React.ReactElement
}

const FilterRow = ({ classname, children, EndButton }: Props) => {
  return (
    <div
      className={`font-bold text-sm sm:text-base flex flex-row px-2 py-3 w-full  items-center space-x-3 sm:space-x-8  sm:rounded ${
        EndButton ? 'justify-between' : 'justify-start'
      } ${classname}`}
    >
      {EndButton ? (
        <>
          <div className="flex flex-row space-x-3 sm:space-x-8 justify-center items-center">
            {children}
          </div>
          {EndButton}
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export default FilterRow
