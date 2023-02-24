import React from 'react'

interface Props {
  classname?: string
  children: React.ReactNode
  EndButton?: React.ReactElement
}

const FilterRow = ({ classname, children, EndButton }: Props) => {
  return (
    <>
      {!EndButton && (
        <div
          className={`font-bold text-sm sm:text-base flex flex-row mt-3 py-1 w-full sm:rounded-xl justify-between sm:justify-start sm:space-x-8 items-center text-p-text ${classname}`}
        >
          {children}
        </div>
      )}
      {EndButton && (
        <div
          className={`font-bold text-sm sm:text-base flex flex-row mt-3 py-1 w-full sm:rounded-xl justify-between items-center text-p-text ${classname}`}
        >
          <div className="flex flex-row sm:space-x-8 justify-center items-center">
            {children}
          </div>
          {EndButton}
        </div>
      )}
    </>
  )
}

export default FilterRow
